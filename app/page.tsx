"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  buildLocalInterpretation,
  castReading,
  changeReading,
  detectRisk,
  detectTopic,
  getClarifyQuestions,
  reflectionQuestions,
  sanitizeText,
  topicAdvice,
} from "@/lib/iching.js";
import { buildClientFallback, createRequestSequence, isLocalInterpretationMode } from "@/lib/client-request.js";

type Provider = "local" | "glm" | "deepseek" | "kimi";
type LineKind = "old-yin" | "yang" | "yin" | "old-yang";

type Hexagram = {
  number: number;
  name: string;
  pattern: string;
  phrase: string;
  state: string;
  action: string;
  avoid: string;
  posture: string;
  keywords: string[];
};

type Topic = { id: string; name: string; lens: string };

type Reading = {
  question: string;
  clarifications: string[];
  topic: Topic;
  lines: LineKind[];
  movingLines: number[];
  primaryHexagram: Hexagram;
  changedHexagram: Hexagram;
  posture: string;
  createdAt: string;
};

type Interpretation = {
  summary: string;
  shi: string;
  wei: string;
  shiJi: string;
  yong: string[];
  risks: string[];
  reflectionQuestions: string[];
  sevenDayExperiment: string;
  safetyNote: string;
};

type InterpretMeta = {
  provider: string;
  model: string;
  status: string;
  elapsedMs: number;
  riskType: string;
  upstreamProvider?: string;
  upstreamModel?: string;
};

type HistoryItem = {
  question: string;
  primary: string;
  changed: string;
  posture: string;
  topic: string;
  createdAt: string;
};

const HISTORY_KEY = "guanshi-history-v3";
const PROVIDERS: { id: Provider; name: string }[] = [
  { id: "local", name: "仅本地" },
  { id: "glm", name: "GLM" },
  { id: "deepseek", name: "DeepSeek" },
  { id: "kimi", name: "Kimi" },
];
const EXAMPLES = [
  "我现在要不要主动推进这个机会？",
  "这段关系下一步适合靠近还是退一点？",
  "这个项目现在最该先补哪一环？",
  "我最近情绪很乱，应该先处理什么？",
];

export default function Home() {
  const [question, setQuestion] = useState("我现在这个想法适不适合开始做？");
  const topic = useMemo(() => detectTopic(question), [question]);
  const clarifyQuestions = useMemo(() => getClarifyQuestions(topic.id), [topic.id]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [provider, setProvider] = useState<Provider>("local");
  const [reading, setReading] = useState<Reading | null>(null);
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null);
  const [meta, setMeta] = useState<InterpretMeta | null>(null);
  const [status, setStatus] = useState<"idle" | "cast" | "interpreting" | "success" | "fallback" | "error">("idle");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const requestSequenceRef = useRef(createRequestSequence());

  useEffect(() => {
    const timer = window.setTimeout(() => setHistory(loadHistory()), 0);
    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, []);

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanQuestion = sanitizeText(question) || "我当下最应该看见什么？";
    const clarifications = clarifyQuestions.map((item: { text: string; id: string }) => `${item.text}${answers[item.id] || "未选择"}`);
    const nextReading = castReading(cleanQuestion, clarifications) as Reading;
    setQuestion(cleanQuestion);
    setReading(nextReading);
    setInterpretation(null);
    setMeta(null);
    setStatus("cast");
    setError("");
    saveHistory(nextReading, setHistory);
    await requestInterpretation(nextReading, provider);
  }

  async function reinterpret(nextProvider = provider) {
    if (!reading) return;
    setProvider(nextProvider);
    await requestInterpretation(reading, nextProvider);
  }

  async function requestInterpretation(activeReading: Reading, activeProvider: Provider) {
    abortRef.current?.abort();
    const requestId = requestSequenceRef.current.begin();
    const riskType = detectRisk(activeReading.question, activeReading.clarifications);

    if (isLocalInterpretationMode(activeProvider)) {
      const local = buildLocalInterpretation(activeReading, riskType) as Interpretation;
      setInterpretation(local);
      setMeta({ provider: "local", model: riskType === "normal" ? "template" : "safety", status: riskType === "normal" ? "local_only" : "safety_branch", elapsedMs: 0, riskType });
      setStatus("success");
      setError("");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("interpreting");
    setError("");

    const timeout = window.setTimeout(() => controller.abort(), 22000);
    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          question: activeReading.question,
          clarifications: activeReading.clarifications,
          lines: activeReading.lines,
          movingLines: activeReading.movingLines,
          primaryHexagram: {
            number: activeReading.primaryHexagram.number,
            name: activeReading.primaryHexagram.name,
            pattern: activeReading.primaryHexagram.pattern,
            lines: activeReading.lines,
          },
          changedHexagram: {
            number: activeReading.changedHexagram.number,
            name: activeReading.changedHexagram.name,
            pattern: activeReading.changedHexagram.pattern,
          },
          provider: activeProvider,
          locale: "zh-CN",
        }),
      });
      const body = await response.json() as { interpretation?: Interpretation; meta?: InterpretMeta; error?: string };
      if (!response.ok || !body?.interpretation) throw new Error(body?.error || "interpret_failed");
      if (!requestSequenceRef.current.isLatest(requestId)) return;
      setInterpretation(body.interpretation);
      setMeta(body.meta ?? null);
      setStatus(String(body.meta?.status || "").startsWith("fallback") ? "fallback" : "success");
    } catch (caught) {
      if (!requestSequenceRef.current.isLatest(requestId)) return;
      const fallback = buildClientFallback(activeReading, { detectRisk, buildLocalInterpretation });
      setInterpretation(fallback.interpretation as Interpretation);
      setMeta({ provider: "local", model: fallback.model, status: fallback.status, elapsedMs: 0, riskType: fallback.riskType });
      setStatus("fallback");
      setError(caught instanceof Error ? caught.message : "interpret_failed");
    } finally {
      window.clearTimeout(timeout);
      if (requestSequenceRef.current.isLatest(requestId)) abortRef.current = null;
    }
  }

  function updateQuestion(value: string) {
    if (detectTopic(value).id !== topic.id) setAnswers({});
    setQuestion(value);
  }

  const selectedAnswers = clarifyQuestions.filter((item: { id: string }) => answers[item.id]).length;
  const statusText = statusLabel(status, meta);

  return (
    <main className="product-shell">
      <section className="hero-shell">
        <div className="brand-row" aria-label="观势">
          <span className="brand-mark">觀</span>
          <span>观势</span>
        </div>

        <div className="hero-grid">
          <section className="intro-panel">
            <p className="eyebrow">以易观时位</p>
            <h1>把当下的问题，化成一卦一策。</h1>
            <p className="lead">先理解处境，再起卦定事实；模型只做解读，不改卦、不重算卦。</p>

            <form className="question-form" onSubmit={submitQuestion}>
              <label htmlFor="question">所问之事</label>
              <textarea
                id="question"
                value={question}
                onChange={(event) => updateQuestion(event.target.value)}
                rows={4}
                maxLength={600}
                placeholder="比如：我现在该不该换工作？"
              />

              <div className="clarify-block" aria-label="处境澄清">
                <div className="clarify-title">
                  <span>识别为：{topic.name}</span>
                  <small>{selectedAnswers}/{clarifyQuestions.length}</small>
                </div>
                <div className="clarify-list">
                  {clarifyQuestions.map((item: { id: string; text: string; options: string[] }) => (
                    <div className="clarify-question" key={item.id}>
                      <strong>{item.text}</strong>
                      <div className="option-row">
                        {item.options.map((option) => (
                          <button
                            className={answers[item.id] === option ? "is-selected" : ""}
                            key={option}
                            type="button"
                            onClick={() => setAnswers((current) => ({ ...current, [item.id]: option }))}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="model-row">
                <span>解读模型</span>
                <div className="provider-tabs" role="group" aria-label="选择模型">
                  {PROVIDERS.map((item) => (
                    <button
                      className={provider === item.id ? "is-selected" : ""}
                      key={item.id}
                      type="button"
                      onClick={() => reading ? reinterpret(item.id) : setProvider(item.id)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <p className="privacy-note">{provider === "local"
                ? "仅本地模式：问题和澄清不会发送到本站服务器或第三方模型。"
                : `联网模式：完整问题与澄清会发送给 ${PROVIDERS.find((item) => item.id === provider)?.name}，数据将离开本站，并可能按该服务商的政策被保留或处理。`}
              </p>

              <div className="form-actions">
                <button type="submit" disabled={status === "interpreting"}>
                  <span>{reading ? "重新起卦" : "起卦解读"}</span>
                  <i aria-hidden="true">◎</i>
                </button>
                <span>用于结构化反思，不替代法律、医疗、财务等专业建议。</span>
              </div>
            </form>

            <div className="example-row" aria-label="示例问题">
              {EXAMPLES.map((example) => (
                <button key={example} type="button" onClick={() => updateQuestion(example)}>
                  {example}
                </button>
              ))}
            </div>
          </section>

          <aside className="oracle-panel" aria-label="卦象结果">
            <div className="oracle-heading">
              <div>
                <p>{reading ? "本卦" : "起卦前"}</p>
                <h2>{reading ? reading.primaryHexagram.name : "未起卦"}</h2>
              </div>
              <span>{reading ? reading.posture : "待"}</span>
            </div>
            {reading ? <HexagramLines lines={reading.lines} /> : <EmptyHexagram />}
            <p className="oracle-phrase">{reading ? `现代卦意提要：${reading.primaryHexagram.phrase}` : "补齐处境后再看时位。"}</p>
            <div className="meta-grid">
              <span>{reading ? `变爻 ${reading.movingLines.length}` : "变爻 -"}</span>
              <span>{reading ? `变卦 ${reading.changedHexagram.name}` : "变卦 -"}</span>
              <span>{statusText}</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="reading-shell" aria-label="解读结果">
        {!reading ? <StartState /> : (
          <>
            <div className="question-card">
              <p>你问</p>
              <h2>{reading.question}</h2>
              <div className="context-line">{reading.clarifications.join("；")}</div>
            </div>

            {status === "interpreting" && <StatusPanel title="正在生成解读" text="卦象事实已经固定，正在让模型结合你的问题做个性化解读。" />}
            {status === "fallback" && <StatusPanel title="已回退到本地解释" text="模型超时、不可用或输出未通过校验时，会使用本地模板继续给出结构化建议。" tone="warn" />}
            {status === "error" && <StatusPanel title="解读失败" text={error || "请稍后再试。"} tone="warn" />}

            {interpretation ? <InterpretationView interpretation={interpretation} meta={meta} /> : <LocalReading reading={reading} />}

            <section className="history" aria-label="最近问卦记录">
              <div className="section-title">
                <span>最近记录</span>
                <small>保存在当前浏览器</small>
              </div>
              <div className="history-list">
                {history.length ? history.map((item) => (
                  <article className="history-item" key={`${item.createdAt}-${item.question}`}>
                    <b>{item.primary} → {item.changed}｜{item.posture}｜{item.topic}</b>
                    <p>{item.question}</p>
                  </article>
                )) : <article className="history-item"><p>还没有记录。</p></article>}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function HexagramLines({ lines }: { lines: LineKind[] }) {
  return (
    <div className="hexagram" aria-label="六爻卦象">
      {[...lines].reverse().map((line, index) => {
        const isYang = line === "yang" || line === "old-yang";
        const isChanging = line === "old-yin" || line === "old-yang";
        return (
          <div className="hex-line" key={`${line}-${index}`}>
            <span className={isYang ? "solid-line" : "broken-line"}>{!isYang && <span />}</span>
            {isChanging ? <b>变</b> : <span />}
          </div>
        );
      })}
    </div>
  );
}

function EmptyHexagram() {
  return (
    <div className="hexagram is-empty" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => <div className="hex-line" key={index}><span className="solid-line" /><span /></div>)}
    </div>
  );
}

function StartState() {
  return (
    <div className="start-panel">
      <span>起卦前</span>
      <h2>先把问题放进具体处境。</h2>
      <p>观势会根据你的问题识别场景，并用三次澄清把答案落到现实位置。卦象由程序起出，模型只能解释已经固定的事实。</p>
    </div>
  );
}

function StatusPanel({ title, text, tone = "normal" }: { title: string; text: string; tone?: "normal" | "warn" }) {
  return <div className={`status-panel ${tone}`}><strong>{title}</strong><p>{text}</p></div>;
}

function LocalReading({ reading }: { reading: Reading }) {
  const change = changeReading(reading.movingLines.length);
  const questions = reflectionQuestions(reading.topic.id) as string[];
  const advices = [reading.primaryHexagram.action, ...topicAdvice(reading.topic.id, reading.posture)] as string[];

  return (
    <div className="reading-grid">
      <article><span>当前状态</span><h3>{reading.primaryHexagram.name}</h3><p>{reading.primaryHexagram.state}{reading.topic.lens}</p></article>
      <article><span>变化趋势</span><h3>{reading.changedHexagram.name}</h3><p>变化指向「{reading.changedHexagram.name}」：{reading.changedHexagram.state}</p></article>
      <article><span>时机判断</span><h3>{change.title}</h3><p>{change.text}</p></article>
      <article><span>行动姿态</span><h3>{reading.posture}</h3><ul>{advices.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>不宜</span><h3>留一分余地</h3><p>{reading.primaryHexagram.avoid}</p></article>
      <article><span>追问</span><h3>再看一层</h3><ul>{questions.map((item) => <li key={item}>{item}</li>)}</ul></article>
    </div>
  );
}

function InterpretationView({ interpretation, meta }: { interpretation: Interpretation; meta: InterpretMeta | null }) {
  return (
    <div className="interpretation-grid">
      <article className="wide"><span>总结</span><h3>{interpretation.summary}</h3></article>
      <article><span>势</span><p>{interpretation.shi}</p></article>
      <article><span>位</span><p>{interpretation.wei}</p></article>
      <article><span>时机</span><p>{interpretation.shiJi}</p></article>
      <article><span>用</span><ul>{interpretation.yong.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>风险</span><ul>{interpretation.risks.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>追问</span><ul>{interpretation.reflectionQuestions.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article className="wide"><span>七天实验</span><p>{interpretation.sevenDayExperiment}</p></article>
      <article className="wide quiet"><span>边界</span><p>{interpretation.safetyNote}</p><small>{meta ? `${meta.provider} / ${meta.model} / ${meta.status} / ${meta.elapsedMs}ms` : "local"}</small></article>
    </div>
  );
}

function loadHistory(): HistoryItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 8).flatMap((item): HistoryItem[] => {
      if (!item || typeof item !== "object") return [];
      return [{
        question: sanitizeText((item as HistoryItem).question, 600),
        primary: sanitizeText((item as HistoryItem).primary, 40),
        changed: sanitizeText((item as HistoryItem).changed, 40),
        posture: sanitizeText((item as HistoryItem).posture, 10),
        topic: sanitizeText((item as HistoryItem).topic, 20),
        createdAt: sanitizeText((item as HistoryItem).createdAt, 40),
      }].filter((entry) => entry.question && entry.primary && entry.changed);
    });
  } catch {
    localStorage.removeItem(HISTORY_KEY);
    return [];
  }
}

function saveHistory(reading: Reading, setHistory: (items: HistoryItem[]) => void) {
  const item = {
    question: reading.question,
    primary: reading.primaryHexagram.name,
    changed: reading.changedHexagram.name,
    posture: reading.posture,
    topic: reading.topic.name,
    createdAt: new Date().toISOString(),
  };
  const next = [item, ...loadHistory()].slice(0, 8);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  setHistory(next);
}

function statusLabel(status: string, meta: InterpretMeta | null) {
  if (status === "idle") return "等待起卦";
  if (status === "cast") return "起卦完成";
  if (status === "interpreting") return "生成中";
  if (status === "fallback") return "本地回退";
  if (status === "success") return meta?.provider ? `${meta.provider} 解读` : "解读完成";
  return "需要重试";
}
