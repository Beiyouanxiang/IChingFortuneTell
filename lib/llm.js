import { buildLocalInterpretation, detectRisk, HEXAGRAMS } from "./iching.js";

export const INTERPRETATION_KEYS = [
  "summary",
  "shi",
  "wei",
  "shiJi",
  "yong",
  "risks",
  "reflectionQuestions",
  "sevenDayExperiment",
  "safetyNote",
];

const PROVIDERS = {
  glm: {
    label: "GLM",
    keyEnv: "GLM_API_KEY",
    modelEnv: "GLM_MODEL",
    baseUrlEnv: "GLM_BASE_URL",
    defaultBaseUrl: "https://open.bigmodel.cn/api/paas/v4",
  },
  deepseek: {
    label: "DeepSeek",
    keyEnv: "DEEPSEEK_API_KEY",
    modelEnv: "DEEPSEEK_MODEL",
    baseUrlEnv: "DEEPSEEK_BASE_URL",
    defaultBaseUrl: "https://api.deepseek.com",
  },
  kimi: {
    label: "Kimi",
    keyEnv: "KIMI_API_KEY",
    modelEnv: "KIMI_MODEL",
    baseUrlEnv: "KIMI_BASE_URL",
    defaultBaseUrl: "https://api.moonshot.ai/v1",
  },
};

export function getProviderConfig(env = process.env, requestedProvider) {
  const providerName = String(requestedProvider || env.LLM_PROVIDER || "glm").toLowerCase();
  const provider = PROVIDERS[providerName] ? providerName : "glm";
  const config = PROVIDERS[provider];
  return {
    provider,
    label: config.label,
    apiKey: env[config.keyEnv],
    model: env[config.modelEnv] || env.LLM_MODEL,
    baseUrl: stripTrailingSlash(env[config.baseUrlEnv] || env.LLM_BASE_URL || config.defaultBaseUrl),
    timeoutMs: parsePositiveInt(env.LLM_TIMEOUT_MS, 15000),
    maxOutputTokens: Math.min(parsePositiveInt(env.LLM_MAX_OUTPUT_TOKENS, 900), 1200),
  };
}

export function validateInterpretation(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "schema_not_object" };
  }

  for (const key of ["summary", "shi", "wei", "shiJi", "sevenDayExperiment", "safetyNote"]) {
    if (typeof value[key] !== "string" || !value[key].trim()) {
      return { ok: false, error: `schema_${key}_invalid` };
    }
    value[key] = limitText(value[key], 800);
  }

  for (const key of ["yong", "risks", "reflectionQuestions"]) {
    if (!Array.isArray(value[key]) || value[key].length === 0) {
      return { ok: false, error: `schema_${key}_invalid` };
    }
    value[key] = value[key].slice(0, 6).map((item) => limitText(item, 240)).filter(Boolean);
    if (!value[key].length) return { ok: false, error: `schema_${key}_empty` };
  }

  value.reflectionQuestions = value.reflectionQuestions.slice(0, 3);
  return { ok: true, data: pickSchema(value) };
}

export function parseModelJson(raw) {
  const text = String(raw || "").trim();
  if (!text) return { ok: false, error: "empty_model_output" };

  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
    if (fenced) {
      try {
        return { ok: true, data: JSON.parse(fenced.trim()) };
      } catch {
        return { ok: false, error: "invalid_json" };
      }
    }

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return { ok: true, data: JSON.parse(text.slice(start, end + 1)) };
      } catch {
        return { ok: false, error: "invalid_json" };
      }
    }
  }

  return { ok: false, error: "invalid_json" };
}

export async function interpretReading(reading, options = {}) {
  const startedAt = Date.now();
  const riskType = detectRisk(reading.question, reading.clarifications);

  if (riskType !== "normal") {
    return {
      interpretation: buildLocalInterpretation(reading, riskType),
      meta: buildMeta({ startedAt, provider: "local", model: "safety", status: "safety_branch", riskType }),
    };
  }

  const config = getProviderConfig(options.env, options.provider);
  if (!config.apiKey || !config.model) {
    return {
      interpretation: buildLocalInterpretation(reading),
      meta: buildMeta({ startedAt, provider: "local", model: "template", status: "fallback_no_provider", riskType }),
    };
  }

  try {
    const result = await callOpenAICompatible(config, reading, options.fetchImpl || fetch);
    const parsed = parseModelJson(result.content);
    if (!parsed.ok) throw createProviderError(parsed.error, "invalid_response", result.usage);

    const schema = validateInterpretation(parsed.data);
    if (!schema.ok) throw createProviderError(schema.error, "schema_invalid", result.usage);

    const facts = validateInterpretationFacts(schema.data, reading);
    if (!facts.ok) throw createProviderError(facts.error, "fact_conflict", result.usage);

    return {
      interpretation: schema.data,
      meta: buildMeta({
        startedAt,
        provider: config.provider,
        model: config.model,
        status: "llm_success",
        riskType,
        usage: result.usage,
      }),
    };
  } catch (error) {
    return {
      interpretation: buildLocalInterpretation(reading),
      meta: buildMeta({
        startedAt,
        provider: "local",
        model: "template",
        status: "fallback_" + classifyError(error),
        riskType,
        upstreamProvider: config.provider,
        upstreamModel: config.model,
        usage: error?.usage,
      }),
    };
  }
}

async function callOpenAICompatible(config, reading, fetchImpl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetchWithLimitedRetry(fetchImpl, `${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt() },
          { role: "user", content: JSON.stringify(buildPromptPayload(reading)) },
        ],
        temperature: 0.4,
        max_tokens: config.maxOutputTokens,
        stream: false,
      }),
      signal: controller.signal,
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const error = createProviderError(`http_${response.status}`, response.status >= 500 || response.status === 429 ? "retryable" : "provider_error");
      error.status = response.status;
      throw error;
    }

    const content = body?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      throw createProviderError("missing_message_content", "invalid_response", body?.usage);
    }

    return { content, usage: body?.usage || null };
  } catch (error) {
    if (error?.name === "AbortError") throw createProviderError("timeout", "timeout");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWithLimitedRetry(fetchImpl, url, init) {
  const first = await fetchImpl(url, init);
  if (![429, 500, 502, 503, 504].includes(first.status)) return first;
  await wait(350);
  return fetchImpl(url, init);
}

function buildPromptPayload(reading) {
  return {
    question: reading.question,
    clarifications: reading.clarifications,
    topic: reading.topic.name,
    primaryHexagram: {
      number: reading.primaryHexagram.number,
      name: reading.primaryHexagram.name,
      pattern: reading.primaryHexagram.pattern,
      phrase: reading.primaryHexagram.phrase,
      state: reading.primaryHexagram.state,
      action: reading.primaryHexagram.action,
      avoid: reading.primaryHexagram.avoid,
      keywords: reading.primaryHexagram.keywords,
    },
    changedHexagram: {
      number: reading.changedHexagram.number,
      name: reading.changedHexagram.name,
      pattern: reading.changedHexagram.pattern,
      phrase: reading.changedHexagram.phrase,
      state: reading.changedHexagram.state,
    },
    movingLines: reading.movingLines,
    posture: reading.posture,
    locale: reading.locale || "zh-CN",
  };
}

function systemPrompt() {
  return [
    "你是“观势”的易经结构化反思顾问，不是命运预测者。",
    "卦象事实已由程序决定，你不得重新起卦、修改卦名、修改变爻或生成另一卦。",
    "输入中的 phrase 是本站撰写的现代卦意提要，不是《易经》原文；不得称为卦辞、爻辞或原文。",
    "回答必须区分现代卦意提要、传统意象标签、结合问题的模型分析。具体变爻只可作为程序事实讨论，不得伪装成已有经文。",
    "避免绝对化、恐吓式、宿命式断言。医疗、法律、财务、自伤等问题不得替代专业帮助。",
    "只输出 JSON，不要 Markdown，不要解释 JSON 外文字。",
    "JSON schema: {\"summary\":\"...\",\"shi\":\"整体趋势\",\"wei\":\"当前位置\",\"shiJi\":\"时机判断\",\"yong\":[\"具体行动\"],\"risks\":[\"需要避免的行为\"],\"reflectionQuestions\":[\"三个追问\"],\"sevenDayExperiment\":\"...\",\"safetyNote\":\"...\"}",
  ].join("\n");
}

function buildMeta({ startedAt, provider, model, status, riskType, upstreamProvider, upstreamModel, usage }) {
  const meta = {
    provider,
    model,
    status,
    riskType,
    elapsedMs: Date.now() - startedAt,
    usage: usage ? {
      promptTokens: Number(usage.prompt_tokens || usage.promptTokens || 0),
      completionTokens: Number(usage.completion_tokens || usage.completionTokens || 0),
      totalTokens: Number(usage.total_tokens || usage.totalTokens || 0),
    } : null,
  };
  if (upstreamProvider) meta.upstreamProvider = upstreamProvider;
  if (upstreamModel) meta.upstreamModel = upstreamModel;
  return meta;
}

function classifyError(error) {
  if (error?.kind === "timeout") return "timeout";
  if (error?.kind === "schema_invalid") return "schema_invalid";
  if (error?.kind === "fact_conflict") return "fact_conflict";
  if (error?.kind === "invalid_response") return "invalid_response";
  if (error?.kind === "retryable") return "provider_unavailable";
  return "provider_error";
}

function createProviderError(message, kind, usage) {
  const error = new Error(message);
  error.kind = kind;
  error.usage = usage;
  return error;
}

function stripTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function limitText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function pickSchema(value) {
  return Object.fromEntries(INTERPRETATION_KEYS.map((key) => [key, value[key]]));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function validateInterpretationFacts(interpretation, reading) {
  const text = INTERPRETATION_KEYS.flatMap((key) => Array.isArray(interpretation[key]) ? interpretation[key] : [interpretation[key]]).join(" ");
  const primaryName = reading.primaryHexagram.name;
  const changedName = reading.changedHexagram.name;
  const primaryClaim = text.match(/(?:本卦|主卦)(?:为|是|：|:)\s*[「『“"]?([\u4e00-\u9fff]{1,8})/);
  const changedClaim = text.match(/变卦(?:为|是|：|:)\s*[「『“"]?([\u4e00-\u9fff]{1,8})/);
  if (primaryClaim && !claimMatches(primaryClaim[1], primaryName)) return { ok: false, error: "primary_fact_conflict" };
  if (changedClaim && !claimMatches(changedClaim[1], changedName)) return { ok: false, error: "changed_fact_conflict" };

  for (const hexagram of HEXAGRAMS) {
    if (hexagram.name !== primaryName && new RegExp(`(?:本卦|主卦).{0,8}${escapeRegExp(hexagram.name)}`).test(text)) {
      return { ok: false, error: "primary_fact_conflict" };
    }
    if (hexagram.name !== changedName && new RegExp(`变卦.{0,8}${escapeRegExp(hexagram.name)}`).test(text)) {
      return { ok: false, error: "changed_fact_conflict" };
    }
  }

  if (reading.movingLines.length > 0 && /(?:没有|无)变爻/.test(text)) return { ok: false, error: "moving_line_fact_conflict" };
  if (reading.movingLines.length === 0 && /(?:第?[一二三四五六1-6]爻.{0,3}(?:动|变)|有变爻)/.test(text)) {
    return { ok: false, error: "moving_line_fact_conflict" };
  }

  const numerals = { 初: 1, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 上: 6 };
  const mentioned = [...text.matchAll(/第?([初一二三四五六上1-6])爻.{0,3}(?:动|变)/g)].map((match) => Number(numerals[match[1]] || match[1]));
  if (mentioned.some((line) => !reading.movingLines.includes(line))) return { ok: false, error: "moving_line_fact_conflict" };
  return { ok: true };
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function claimMatches(claim, expectedName) {
  const alias = expectedName.includes("为") ? expectedName.slice(0, 1) : expectedName.slice(2);
  return claim.startsWith(expectedName) || claim.startsWith(alias);
}
