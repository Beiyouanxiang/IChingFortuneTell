import { interpretReading } from "./llm.js";
import { normalizeReadingFacts } from "./iching.js";
import {
  consumeQuota,
  getClientBucket,
  getSecurityConfig,
  readLimitedJson,
  validateRequestedProvider,
} from "./security.js";

export async function handleInterpretRequest(request, dependencies = {}) {
  const startedAt = Date.now();
  const env = dependencies.env || process.env;
  const security = getSecurityConfig(env);
  const parsed = await readLimitedJson(request, security.maxBodyBytes);
  if (!parsed.ok) return json({ error: parsed.error }, parsed.status || 400);

  const body = parsed.data;
  const providerResult = validateRequestedProvider(body.provider, security.allowedProviders);
  if (!providerResult.ok) return json({ error: providerResult.error }, providerResult.error === "provider_not_allowed" ? 403 : 400);

  const normalized = normalizeReadingFacts(body);
  if (!normalized.ok) return json({ error: normalized.error }, 400);

  const quota = consumeQuota(getClientBucket(request, security), security, dependencies.quotaOptions);
  if (!quota.ok) return json({ error: quota.error }, 429, { "Retry-After": String(quota.retryAfter) });

  const reading = normalized.reading;
  const result = await (dependencies.interpret || interpretReading)(reading, {
    provider: providerResult.provider,
    env,
  });

  (dependencies.logger || console).log(JSON.stringify({
    event: "interpret",
    provider: result.meta.provider,
    model: result.meta.model,
    status: result.meta.status,
    elapsedMs: result.meta.elapsedMs,
    riskType: result.meta.riskType,
    questionLength: reading.question.length,
    clarificationCount: reading.clarifications.length,
    movingLineCount: reading.movingLines.length,
    totalTokens: result.meta.usage?.totalTokens || 0,
    routeElapsedMs: Date.now() - startedAt,
  }));

  return json(result, 200);
}

function json(data, status, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}
