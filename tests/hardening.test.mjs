import test from "node:test";
import assert from "node:assert/strict";
import { HEXAGRAMS, buildLocalInterpretation, castReading, detectRisk, normalizeReadingFacts } from "../lib/iching.js";
import { validateInterpretationFacts } from "../lib/llm.js";
import { buildClientFallback, createRequestSequence, isLocalInterpretationMode } from "../lib/client-request.js";
import { consumeQuota, createQuotaState, getClientBucket, getSecurityConfig, readLimitedJson, validateRequestedProvider } from "../lib/security.js";

const FIXED_KING_WEN_TABLE = `
1:乾为天:111111|2:坤为地:000000|3:水雷屯:100010|4:山水蒙:010001|5:水天需:111010|6:天水讼:010111|7:地水师:010000|8:水地比:000010|
9:风天小畜:111011|10:天泽履:110111|11:地天泰:111000|12:天地否:000111|13:天火同人:101111|14:火天大有:111101|15:地山谦:001000|16:雷地豫:000100|
17:泽雷随:100110|18:山风蛊:011001|19:地泽临:110000|20:风地观:000011|21:火雷噬嗑:100101|22:山火贲:101001|23:山地剥:000001|24:地雷复:100000|
25:天雷无妄:100111|26:山天大畜:111001|27:山雷颐:100001|28:泽风大过:011110|29:坎为水:010010|30:离为火:101101|31:泽山咸:001110|32:雷风恒:011100|
33:天山遁:001111|34:雷天大壮:111100|35:火地晋:000101|36:地火明夷:101000|37:风火家人:101011|38:火泽睽:110101|39:水山蹇:001010|40:雷水解:010100|
41:山泽损:110001|42:风雷益:100011|43:泽天夬:111110|44:天风姤:011111|45:泽地萃:000110|46:地风升:011000|47:泽水困:010110|48:水风井:011010|
49:泽火革:101110|50:火风鼎:011101|51:震为雷:100100|52:艮为山:001001|53:风山渐:001011|54:雷泽归妹:110100|55:雷火丰:101100|56:火山旅:001101|
57:巽为风:011011|58:兑为泽:110110|59:风水涣:010011|60:水泽节:110010|61:风泽中孚:110011|62:雷山小过:001100|63:水火既济:101010|64:火水未济:010101
`.replace(/\s+/g, "").split("|");

function fixedReading(question = "这个项目下一步怎么办？") {
  const values = Array.from({ length: 18 }, () => 0.8);
  return castReading(question, [], () => values.shift());
}

function payload(reading, overrides = {}) {
  return {
    question: reading.question,
    clarifications: reading.clarifications,
    lines: reading.lines,
    movingLines: reading.movingLines,
    primaryHexagram: { number: reading.primaryHexagram.number, name: reading.primaryHexagram.name, pattern: reading.primaryHexagram.pattern, lines: reading.lines },
    changedHexagram: { number: reading.changedHexagram.number, name: reading.changedHexagram.name, pattern: reading.changedHexagram.pattern },
    provider: "glm",
    locale: "zh-CN",
    ...overrides,
  };
}

function validInterpretation() {
  return {
    summary: "保持观察",
    shi: "局势仍需确认",
    wei: "处在验证阶段",
    shiJi: "先试再定",
    yong: ["做小实验"],
    risks: ["避免重押"],
    reflectionQuestions: ["什么反馈最关键？"],
    sevenDayExperiment: "记录七天反馈",
    safetyNote: "仅供结构化反思",
  };
}

test("64 hexagrams match the fixed King Wen number, name, and bottom-to-top pattern table", () => {
  assert.deepEqual(HEXAGRAMS.map(({ number, name, pattern }) => `${number}:${name}:${pattern}`), FIXED_KING_WEN_TABLE);
});

test("quota enforces per-IP, global minute, and daily ceilings", () => {
  const base = { perIpPerMinute: 2, perIpPerDay: 3, globalPerMinute: 3, globalPerDay: 5 };
  const state = createQuotaState();
  assert.equal(consumeQuota("ip-a", base, { state, now: 1_000 }).ok, true);
  assert.equal(consumeQuota("ip-a", base, { state, now: 1_001 }).ok, true);
  assert.equal(consumeQuota("ip-a", base, { state, now: 1_002 }).error, "ip_rate_limit");
  assert.equal(consumeQuota("ip-b", base, { state, now: 1_003 }).ok, true);
  assert.equal(consumeQuota("ip-c", base, { state, now: 1_004 }).error, "global_minute_quota");
  assert.equal(consumeQuota("ip-a", base, { state, now: 61_000 }).ok, true);
  assert.equal(consumeQuota("ip-a", base, { state, now: 61_001 }).error, "ip_daily_quota");
  assert.equal(consumeQuota("ip-b", base, { state, now: 61_002 }).ok, true);
  assert.equal(consumeQuota("ip-c", base, { state, now: 61_003 }).error, "global_daily_quota");
});

test("IP headers are trusted only when explicitly configured", () => {
  const request = new Request("https://example.test", { headers: { "x-forwarded-for": "203.0.113.8, 10.0.0.1" } });
  assert.equal(getClientBucket(request, getSecurityConfig({})), "anonymous-shared");
  assert.equal(getClientBucket(request, getSecurityConfig({ TRUSTED_IP_HEADER: "x-forwarded-for" })), "203.0.113.8");
});

test("provider whitelist is enforced server-side", () => {
  assert.equal(validateRequestedProvider("glm", ["glm"]).ok, true);
  assert.equal(validateRequestedProvider("kimi", ["glm"]).error, "provider_not_allowed");
  assert.equal(validateRequestedProvider("other", ["glm"]).error, "provider_invalid");
});

test("request body size is enforced even without content-length", async () => {
  const request = new Request("https://example.test/api/interpret", { method: "POST", body: JSON.stringify({ question: "x".repeat(200) }) });
  const result = await readLimitedJson(request, 64);
  assert.equal(result.ok, false);
  assert.equal(result.error, "request_body_too_large");
});

test("overlong question is rejected before truncation and patterns are mandatory facts", () => {
  const reading = fixedReading();
  assert.equal(normalizeReadingFacts(payload(reading, { question: "问".repeat(601) })).error, "question_invalid");
  const missing = payload(reading);
  delete missing.primaryHexagram.pattern;
  assert.equal(normalizeReadingFacts(missing).error, "primary_pattern_mismatch");
  assert.equal(normalizeReadingFacts(payload(reading, { changedHexagram: { ...payload(reading).changedHexagram, pattern: "111111" } })).error, "changed_pattern_mismatch");
});

test("obvious model contradictions about hexagrams and moving lines are rejected", () => {
  const reading = fixedReading();
  const wrongHexagram = validInterpretation();
  wrongHexagram.summary = "本卦为坤卦，宜顺势";
  assert.equal(validateInterpretationFacts(wrongHexagram, reading).error, "primary_fact_conflict");
  const wrongLine = validInterpretation();
  wrongLine.summary = "本次没有变爻";
  assert.equal(validateInterpretationFacts(wrongLine, reading).error, "moving_line_fact_conflict");
});

test("network fallback detects risk again and never becomes an ordinary reading", () => {
  const reading = fixedReading("我不想活了，应该怎么办？");
  const result = buildClientFallback(reading, { detectRisk, buildLocalInterpretation });
  assert.equal(result.riskType, "self_harm");
  assert.equal(result.status, "safety_branch");
  assert.match(result.interpretation.safetyNote, /12356/);
  assert.doesNotMatch(result.interpretation.safetyNote, /确定|保证会/);
});

test("local-only mode is explicit and latest request wins", () => {
  assert.equal(isLocalInterpretationMode("local"), true);
  assert.equal(isLocalInterpretationMode("glm"), false);
  const sequence = createRequestSequence();
  const first = sequence.begin();
  const second = sequence.begin();
  assert.equal(sequence.isLatest(first), false);
  assert.equal(sequence.isLatest(second), true);
});
import { handleInterpretRequest } from "../lib/api.js";

function apiRequest(body, headers = {}) {
  return new Request("https://example.test/api/interpret", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

const quietLogger = { log() {} };
const fakeInterpret = async () => ({
  interpretation: validInterpretation(),
  meta: { provider: "glm", model: "test", status: "llm_success", elapsedMs: 1, riskType: "normal", usage: null },
});

test("API returns explicit errors for overlong questions and invalid patterns", async () => {
  const reading = fixedReading();
  const options = { env: { LLM_PROVIDER: "glm", LLM_ALLOWED_PROVIDERS: "glm" }, interpret: fakeInterpret, logger: quietLogger };
  const longResponse = await handleInterpretRequest(apiRequest(payload(reading, { question: "问".repeat(601) })), options);
  assert.equal(longResponse.status, 400);
  assert.equal((await longResponse.json()).error, "question_invalid");

  const wrongPattern = payload(reading);
  wrongPattern.primaryHexagram = { ...wrongPattern.primaryHexagram, pattern: "000000" };
  const patternResponse = await handleInterpretRequest(apiRequest(wrongPattern), options);
  assert.equal(patternResponse.status, 400);
  assert.equal((await patternResponse.json()).error, "primary_pattern_mismatch");
});

test("API rejects disallowed providers and returns 429 after server quota", async () => {
  const reading = fixedReading();
  const rejected = await handleInterpretRequest(apiRequest(payload(reading, { provider: "kimi" })), {
    env: { LLM_PROVIDER: "glm", LLM_ALLOWED_PROVIDERS: "glm" },
    interpret: fakeInterpret,
    logger: quietLogger,
  });
  assert.equal(rejected.status, 403);

  const state = createQuotaState();
  const options = {
    env: { LLM_PROVIDER: "glm", LLM_ALLOWED_PROVIDERS: "glm", API_IP_PER_MINUTE: "1", API_GLOBAL_PER_MINUTE: "10" },
    interpret: fakeInterpret,
    logger: quietLogger,
    quotaOptions: { state, now: 1_000 },
  };
  assert.equal((await handleInterpretRequest(apiRequest(payload(reading)), options)).status, 200);
  const limited = await handleInterpretRequest(apiRequest(payload(reading)), options);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after") !== null, true);
});

const SELF_HARM_CASES = [
  ["我准备从天台跳下去，给我算算", "self_harm"],
  ["活着已经没有意义了", "self_harm"],
  ["我想吞一瓶安眠药", "self_harm"],
  ["我计划跳楼结束这一切", "self_harm"],
  ["我服用了过量药物", "self_harm"],
  ["我不想自杀，也没有伤害自己的计划", "normal"],
  ["如何预防青少年自杀", "normal"],
  ["这部电影报道了从天台跳下去的情节", "normal"],
  ["我只是头疼，应该吃什么药", "medical"],
];

test("risk rules prioritize self-harm plans while respecting clear negation and reference contexts", () => {
  for (const [question, expected] of SELF_HARM_CASES) {
    assert.equal(detectRisk(question), expected, question);
  }
});

test("declared Content-Length is rejected before body consumption", async () => {
  let canceled = false;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("{}"));
    },
    cancel() {
      canceled = true;
    },
  });
  const request = new Request("https://example.test", {
    method: "POST",
    headers: { "content-length": "100" },
    body: stream,
    duplex: "half",
  });
  const result = await readLimitedJson(request, 16);
  assert.equal(result.status, 413);
  assert.equal(canceled, true);
});

test("chunked body is canceled as soon as cumulative bytes exceed the limit", async () => {
  let canceled = false;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('{"question":"'));
      controller.enqueue(encoder.encode("x".repeat(80)));
      controller.enqueue(encoder.encode('"}'));
    },
    cancel() {
      canceled = true;
    },
  });
  const request = new Request("https://example.test", { method: "POST", body: stream, duplex: "half" });
  const result = await readLimitedJson(request, 32);
  assert.equal(result.status, 413);
  assert.equal(result.error, "request_body_too_large");
  assert.equal(canceled, true);
});

test("bounded reader preserves multibyte Chinese split across chunks", async () => {
  const bytes = new TextEncoder().encode(JSON.stringify({ question: "天地人" }));
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes.slice(0, 15));
      controller.enqueue(bytes.slice(15, 17));
      controller.enqueue(bytes.slice(17));
      controller.close();
    },
  });
  const request = new Request("https://example.test", { method: "POST", body: stream, duplex: "half" });
  const result = await readLimitedJson(request, bytes.byteLength);
  assert.equal(result.ok, true);
  assert.deepEqual(result.data, { question: "天地人" });
});

test("bounded reader rejects malformed JSON without exposing parser details", async () => {
  const request = new Request("https://example.test", { method: "POST", body: '{"question":' });
  const result = await readLimitedJson(request, 64);
  assert.equal(result.ok, false);
  assert.equal(result.error, "invalid_json_body");
  assert.equal(result.status, 400);
});

test("self-harm emergency numbers are shown only for the verified zh-CN locale", () => {
  const reading = fixedReading("我准备跳楼");
  reading.locale = "en-US";
  const result = buildClientFallback(reading, { detectRisk, buildLocalInterpretation });
  assert.equal(result.riskType, "self_harm");
  assert.doesNotMatch(result.interpretation.safetyNote, /12356|\b110\b|\b120\b/);
  assert.match(result.interpretation.safetyNote, /所在地区/);
});
