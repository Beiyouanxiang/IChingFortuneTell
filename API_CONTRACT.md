# API Contract: POST /api/interpret

The browser calls only the same-origin endpoint `/api/interpret`. No LLM API key is present in client code.

## Request

```json
{
  "question": "这个项目下一步怎么办？",
  "clarifications": ["这个项目现在处在哪一段？已经能用", "最大的不确定性是什么？需求真假", "你最想验证什么？用户愿不愿意用"],
  "lines": ["old-yang", "yin", "yang", "old-yin", "yang", "yin"],
  "primaryHexagram": {
    "number": 38,
    "name": "火泽睽",
    "pattern": "110101",
    "lines": ["old-yang", "yin", "yang", "old-yin", "yang", "yin"]
  },
  "changedHexagram": {
    "number": 64,
    "name": "火水未济",
    "pattern": "010101"
  },
  "movingLines": [1, 4],
  "provider": "glm",
  "locale": "zh-CN"
}
```

## Validation Rules

The server recalculates facts before any model call:

- `question` must be present and at most 600 characters after whitespace normalization; overlong input is rejected before any truncation.
- `clarifications` are trimmed, capped, and treated as plain text.
- `lines` must contain exactly six values from `old-yin`, `yang`, `yin`, `old-yang`.
- Primary hexagram number, name, and six-bit `pattern` must match the lines.
- Changed hexagram number, name, and six-bit `pattern` must match the pattern after moving lines change.
- `movingLines` must match the old-yin/old-yang positions exactly.
- If validation fails, the server returns `400` with an error code and does not call an LLM.

## Response

```json
{
  "interpretation": {
    "summary": "...",
    "shi": "整体趋势",
    "wei": "当前位置",
    "shiJi": "时机判断",
    "yong": ["具体行动"],
    "risks": ["需要避免的行为"],
    "reflectionQuestions": ["三个追问"],
    "sevenDayExperiment": "...",
    "safetyNote": "..."
  },
  "meta": {
    "provider": "glm",
    "model": "...",
    "status": "llm_success",
    "riskType": "normal",
    "elapsedMs": 1234,
    "usage": {
      "promptTokens": 0,
      "completionTokens": 0,
      "totalTokens": 0
    }
  }
}
```

## Status Values

- `llm_success`: provider returned valid JSON matching schema.
- `safety_branch`: high-risk content was handled locally before provider call.
- `fallback_no_provider`: provider key/model is not configured.
- `fallback_timeout`: provider call timed out.
- `fallback_provider_unavailable`: provider returned retryable 429/5xx after retry.
- `fallback_invalid_response`: provider output was not parseable JSON.
- `fallback_schema_invalid`: provider JSON did not match the required schema.
- `fallback_provider_error`: non-retryable provider error.

## Logging Policy

Server logs record operational metadata only:

- provider
- model
- status
- elapsed time
- risk type
- question length
- clarification count
- moving line count
- token totals when available

Full private questions and model raw text are not logged by default.

## Abuse And Cost Controls

Before an upstream model call, the server:

- checks declared `Content-Length` before reading and otherwise enforces the byte limit incrementally while streaming;

- rejects bodies above `API_MAX_BODY_BYTES`;
- accepts only `LLM_ALLOWED_PROVIDERS`;
- applies per-IP minute/day and global minute/day quotas;
- trusts an IP header only when `TRUSTED_IP_HEADER` names a header overwritten by the deployment proxy;
- clamps `LLM_MAX_OUTPUT_TOKENS` to an absolute maximum of 1200.

Rate-limit responses use HTTP `429` with `Retry-After`. Invalid providers use `400`; providers outside the allowlist use `403`; oversized bodies use `413`.

The bundled quota store is process-local, resets on restart, and is exact only for the documented single-process Aliyun gray deployment. Sites, PM2 cluster mode, and other multi-instance deployments require a shared atomic counter and provider-console spending limits.

## Model Fact Validation

Schema-valid model output is additionally rejected when it makes an obvious contradictory claim about the primary hexagram, changed hexagram, or moving-line positions. Rejected output is never rendered; the server returns the local interpretation with `fallback_fact_conflict`.

`phrase` is a modern product-written summary. It is not presented as received text, a hexagram statement, or a line statement.
