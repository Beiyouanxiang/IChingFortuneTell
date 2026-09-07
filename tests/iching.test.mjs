import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  HEXAGRAMS,
  castReading,
  castThreeCoins,
  changedBit,
  detectRisk,
  lineToBit,
  normalizeReadingFacts,
} from '../lib/iching.js';
import { interpretReading, parseModelJson, validateInterpretation } from '../lib/llm.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

test('hexagram table contains exactly 64 unique complete mappings', () => {
  assert.equal(HEXAGRAMS.length, 64);
  assert.equal(new Set(HEXAGRAMS.map((item) => item.number)).size, 64);
  assert.equal(new Set(HEXAGRAMS.map((item) => item.pattern)).size, 64);
  for (const hexagram of HEXAGRAMS) {
    assert.match(hexagram.pattern, /^[01]{6}$/);
    assert.equal(typeof hexagram.name, 'string');
  }
});

test('three-coin line distribution maps 6/7/8/9 as 1/8, 3/8, 3/8, 1/8', () => {
  const cases = [
    [[0.1, 0.2, 0.3], 6, 'old-yin'],
    [[0.6, 0.2, 0.3], 7, 'yang'],
    [[0.6, 0.7, 0.3], 8, 'yin'],
    [[0.6, 0.7, 0.8], 9, 'old-yang'],
  ];
  for (const [values, expectedValue, expectedKind] of cases) {
    const queue = [...values];
    const line = castThreeCoins(() => queue.shift());
    assert.equal(line.value, expectedValue);
    assert.equal(line.kind, expectedKind);
  }
});

test('primary hexagram, changed hexagram, and moving lines validate as one fact set', () => {
  const sequence = [
    0.6, 0.7, 0.8,
    0.1, 0.2, 0.3,
    0.6, 0.2, 0.3,
    0.6, 0.7, 0.3,
    0.1, 0.2, 0.3,
    0.6, 0.2, 0.3,
  ];
  const reading = castReading('这个项目下一步怎么办？', ['这个项目现在处在哪一段？已经能用'], () => sequence.shift());
  assert.equal(reading.primaryHexagram.pattern, reading.lines.map(lineToBit).join(''));
  assert.equal(reading.changedHexagram.pattern, reading.lines.map(changedBit).join(''));
  assert.deepEqual(reading.movingLines, [1, 2, 5]);

  const normalized = normalizeReadingFacts({
    question: reading.question,
    clarifications: reading.clarifications,
    lines: reading.lines,
    movingLines: reading.movingLines,
    primaryHexagram: { number: reading.primaryHexagram.number, name: reading.primaryHexagram.name, pattern: reading.primaryHexagram.pattern, lines: reading.lines },
    changedHexagram: { number: reading.changedHexagram.number, name: reading.changedHexagram.name, pattern: reading.changedHexagram.pattern },
  });
  assert.equal(normalized.ok, true);
});

test('tampered model-side facts are rejected before interpretation', () => {
  const sequence = Array.from({ length: 18 }, () => 0.8);
  const reading = castReading('我该不该换方向？', [], () => sequence.shift());
  const normalized = normalizeReadingFacts({
    question: reading.question,
    lines: reading.lines,
    movingLines: [1],
    primaryHexagram: { number: reading.primaryHexagram.number, name: reading.primaryHexagram.name, pattern: reading.primaryHexagram.pattern, lines: reading.lines },
    changedHexagram: { number: reading.changedHexagram.number, name: reading.changedHexagram.name, pattern: reading.changedHexagram.pattern },
  });
  assert.equal(normalized.ok, false);
  assert.equal(normalized.error, 'moving_lines_mismatch');
});

test('source renders no user data through innerHTML or dangerouslySetInnerHTML', () => {
  const files = ['script.js', 'app/page.tsx'];
  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.equal(source.includes('innerHTML'), false, `${file} still uses innerHTML`);
    assert.equal(source.includes('dangerouslySetInnerHTML'), false, `${file} still uses dangerouslySetInnerHTML`);
  }
});

test('invalid model JSON and invalid schema are rejected', () => {
  assert.equal(parseModelJson('not json').ok, false);
  assert.equal(validateInterpretation({ summary: 'x' }).ok, false);
});

test('provider timeout falls back to local template without exposing raw output', async () => {
  const sequence = Array.from({ length: 18 }, () => 0.8);
  const reading = castReading('这个项目要不要继续？', [], () => sequence.shift());
  const result = await interpretReading(reading, {
    provider: 'deepseek',
    env: { DEEPSEEK_API_KEY: 'test', LLM_MODEL: 'test-model', LLM_TIMEOUT_MS: '1' },
    fetchImpl: (_url, init) => new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })))),
  });
  assert.equal(result.meta.status, 'fallback_timeout');
  assert.equal(result.meta.provider, 'local');
  assert.ok(result.interpretation.summary);
});

test('unavailable provider falls back and model switch does not mutate hexagram facts', async () => {
  const sequence = Array.from({ length: 18 }, () => 0.8);
  const reading = castReading('这个机会要不要推进？', [], () => sequence.shift());
  const before = JSON.stringify({ lines: reading.lines, primary: reading.primaryHexagram, changed: reading.changedHexagram });
  const result = await interpretReading(reading, {
    provider: 'glm',
    env: { GLM_API_KEY: 'test', LLM_MODEL: 'test-model' },
    fetchImpl: async () => new Response(JSON.stringify({ error: 'down' }), { status: 503 }),
  });
  const after = JSON.stringify({ lines: reading.lines, primary: reading.primaryHexagram, changed: reading.changedHexagram });
  assert.equal(result.meta.status, 'fallback_provider_unavailable');
  assert.equal(before, after);
});

test('high-risk question enters safety branch before provider call', async () => {
  const sequence = Array.from({ length: 18 }, () => 0.8);
  const reading = castReading('我不想活了怎么办？', [], () => sequence.shift());
  assert.equal(detectRisk(reading.question), 'self_harm');
  const result = await interpretReading(reading, {
    provider: 'kimi',
    env: { KIMI_API_KEY: 'test', LLM_MODEL: 'test-model' },
    fetchImpl: async () => { throw new Error('should not call provider'); },
  });
  assert.equal(result.meta.status, 'safety_branch');
  assert.equal(result.meta.provider, 'local');
});
