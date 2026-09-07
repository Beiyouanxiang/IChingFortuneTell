const STATE_KEY = Symbol.for("guanshi.interpretQuota.v1");

export const PROVIDER_IDS = ["glm", "deepseek", "kimi"];

export function getSecurityConfig(env = process.env) {
  const defaultProvider = normalizeProvider(env.LLM_PROVIDER) || "glm";
  const configured = String(env.LLM_ALLOWED_PROVIDERS || defaultProvider).split(",").map(normalizeProvider).filter(Boolean);
  return {
    allowedProviders: [...new Set(configured)],
    ipHeader: normalizeIpHeader(env.TRUSTED_IP_HEADER),
    maxBodyBytes: boundedInt(env.API_MAX_BODY_BYTES, 12_000, 1_024, 64_000),
    perIpPerMinute: boundedInt(env.API_IP_PER_MINUTE, 5, 1, 120),
    perIpPerDay: boundedInt(env.API_IP_PER_DAY, 30, 1, 10_000),
    globalPerMinute: boundedInt(env.API_GLOBAL_PER_MINUTE, 60, 1, 10_000),
    globalPerDay: boundedInt(env.API_GLOBAL_PER_DAY, 1_000, 1, 1_000_000),
  };
}

export function validateRequestedProvider(value, allowedProviders) {
  const provider = normalizeProvider(value);
  if (!provider) return { ok: false, error: "provider_invalid" };
  if (!allowedProviders.includes(provider)) return { ok: false, error: "provider_not_allowed" };
  return { ok: true, provider };
}

export function getClientBucket(request, config) {
  if (!config.ipHeader) return "anonymous-shared";
  const raw = request.headers.get(config.ipHeader) || "";
  const candidate = config.ipHeader === "x-forwarded-for" ? raw.split(",")[0].trim() : raw.trim();
  return isIp(candidate) ? candidate : "anonymous-shared";
}

export function consumeQuota(clientBucket, config, options = {}) {
  const now = options.now ?? Date.now();
  const state = options.state || getGlobalState();
  const minute = Math.floor(now / 60_000);
  const day = Math.floor(now / 86_400_000);
  if (state.minute !== minute) {
    state.minute = minute;
    state.globalMinute = 0;
    state.ipMinute.clear();
  }
  if (state.day !== day) {
    state.day = day;
    state.globalDay = 0;
    state.ipDay.clear();
  }
  const checks = [
    [state.globalMinute, config.globalPerMinute, "global_minute_quota", secondsUntil(now, 60_000)],
    [state.globalDay, config.globalPerDay, "global_daily_quota", secondsUntil(now, 86_400_000)],
    [state.ipMinute.get(clientBucket) || 0, config.perIpPerMinute, "ip_rate_limit", secondsUntil(now, 60_000)],
    [state.ipDay.get(clientBucket) || 0, config.perIpPerDay, "ip_daily_quota", secondsUntil(now, 86_400_000)],
  ];
  const exceeded = checks.find(([used, limit]) => used >= limit);
  if (exceeded) return { ok: false, error: exceeded[2], retryAfter: exceeded[3] };
  state.globalMinute += 1;
  state.globalDay += 1;
  state.ipMinute.set(clientBucket, (state.ipMinute.get(clientBucket) || 0) + 1);
  state.ipDay.set(clientBucket, (state.ipDay.get(clientBucket) || 0) + 1);
  return { ok: true };
}

export async function readLimitedJson(request, maxBodyBytes) {
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const declared = Number(contentLength);
    if (!Number.isInteger(declared) || declared < 0) return { ok: false, error: "content_length_invalid", status: 400 };
    if (declared > maxBodyBytes) {
      await cancelBody(request.body);
      return { ok: false, error: "request_body_too_large", status: 413 };
    }
  }

  if (!request.body) return { ok: false, error: "invalid_json_body", status: 400 };

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let receivedBytes = 0;
  let bodyText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedBytes += value.byteLength;
      if (receivedBytes > maxBodyBytes) {
        await reader.cancel("request_body_too_large");
        return { ok: false, error: "request_body_too_large", status: 413 };
      }
      bodyText += decoder.decode(value, { stream: true });
    }
    bodyText += decoder.decode();
  } catch {
    return { ok: false, error: "request_body_unreadable", status: 400 };
  } finally {
    reader.releaseLock();
  }

  try {
    return { ok: true, data: JSON.parse(bodyText) };
  } catch {
    return { ok: false, error: "invalid_json_body", status: 400 };
  }
}

async function cancelBody(body) {
  if (!body) return;
  try {
    await body.cancel("request_body_too_large");
  } catch {
    // The runtime may already have locked or closed the stream.
  }
}

export function createQuotaState() {
  return { minute: -1, day: -1, globalMinute: 0, globalDay: 0, ipMinute: new Map(), ipDay: new Map() };
}

function getGlobalState() {
  globalThis[STATE_KEY] ||= createQuotaState();
  return globalThis[STATE_KEY];
}

function normalizeProvider(value) {
  const provider = String(value || "").trim().toLowerCase();
  return PROVIDER_IDS.includes(provider) ? provider : "";
}

function normalizeIpHeader(value) {
  const header = String(value || "").trim().toLowerCase();
  return ["cf-connecting-ip", "x-real-ip", "x-forwarded-for"].includes(header) ? header : "";
}

function isIp(value) {
  return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(value) || /^[0-9a-f:]+$/i.test(value);
}

function boundedInt(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
}

function secondsUntil(now, interval) {
  return Math.max(1, Math.ceil((interval - (now % interval)) / 1_000));
}
