import assert from "node:assert/strict";
import { castReading } from "../lib/iching.js";

const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:4180";

function makePayload(question) {
  const values = Array.from({ length: 18 }, () => 0.8);
  const reading = castReading(question, [], () => values.shift());
  return {
    question: reading.question,
    clarifications: reading.clarifications,
    lines: reading.lines,
    movingLines: reading.movingLines,
    primaryHexagram: {
      number: reading.primaryHexagram.number,
      name: reading.primaryHexagram.name,
      pattern: reading.primaryHexagram.pattern,
      lines: reading.lines,
    },
    changedHexagram: {
      number: reading.changedHexagram.number,
      name: reading.changedHexagram.name,
      pattern: reading.changedHexagram.pattern,
    },
    provider: "glm",
    locale: "zh-CN",
  };
}

async function post(body) {
  const response = await fetch(baseUrl + "/api/interpret", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { response, body: await response.json() };
}

const home = await fetch(baseUrl + "/");
const html = await home.text();
assert.equal(home.status, 200);
assert.match(html, /仅本地/);

const normal = await post(makePayload("这个项目下一步怎么办？"));
assert.equal(normal.response.status, 200);
assert.equal(normal.body.meta.status, "fallback_no_provider");
assert.equal(normal.body.meta.provider, "local");

const highRisk = await post(makePayload("我准备从天台跳下去，给我算算"));
assert.equal(highRisk.response.status, 200);
assert.equal(highRisk.body.meta.status, "safety_branch");
assert.equal(highRisk.body.meta.riskType, "self_harm");
assert.equal(highRisk.body.meta.provider, "local");

const oversized = await post({ question: "x".repeat(13_000) });
assert.equal(oversized.response.status, 413);
assert.equal(oversized.body.error, "request_body_too_large");

console.log(JSON.stringify({
  home: "200 local-only visible",
  noProvider: "200 fallback_no_provider/local",
  highRisk: "200 safety_branch/self_harm/local",
  oversized: "413 request_body_too_large",
}));
