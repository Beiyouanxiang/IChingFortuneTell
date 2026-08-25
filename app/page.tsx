"use client";

import { FormEvent, useMemo, useState } from "react";

type LineKind = "yin" | "yang" | "old-yin" | "old-yang";

type Hexagram = {
  id: number;
  name: string;
  pattern: string;
  phrase: string;
  state: string;
  trend: string;
  advice: string[];
  avoid: string;
  keywords: string[];
};

type Reading = {
  question: string;
  lines: LineKind[];
  changed: boolean[];
  base: Hexagram;
  changedHexagram: Hexagram;
  posture: string;
};

const hexagrams: Hexagram[] = [
  {
    id: 1,
    name: "乾为天",
    pattern: "111111",
    phrase: "势在上升，贵在守正。",
    state: "当下有强烈的主动性和开创力，局面正在向外展开。真正的关键不是敢不敢动，而是能不能让行动保持节制和方向。",
    trend: "如果继续推进，机会会被打开，但节奏过猛也容易让你忽略边界。",
    advice: ["主动争取关键位置", "把目标拆成可验证的一步", "用规则约束自己的冲劲"],
    avoid: "避免只凭热情硬冲，也避免把所有压力都扛在自己身上。",
    keywords: ["开创", "主动", "领导", "自强"],
  },
  {
    id: 2,
    name: "坤为地",
    pattern: "000000",
    phrase: "厚德载物，先承后成。",
    state: "当前更适合接住现实、整理资源、等待条件成熟。它不是软弱，而是用承载力换取稳定。",
    trend: "局势会通过积累而变化，越急着证明自己，越容易打乱已经形成的底盘。",
    advice: ["先把身边资源盘清", "配合更大的节奏", "用稳定兑现信任"],
    avoid: "避免过早站到台前，也避免把退让误解成没有选择。",
    keywords: ["承载", "顺势", "积累", "稳定"],
  },
  {
    id: 3,
    name: "水雷屯",
    pattern: "100010",
    phrase: "初生多阻，宜先立根。",
    state: "事情处在刚开始的混沌期，有生机，也有阻力。很多问题不是方向错了，而是秩序还没有长出来。",
    trend: "下一步会继续遇到摩擦，但每一次整理都会让结构更清楚。",
    advice: ["先解决最卡住的一环", "找一个可靠的人一起定规则", "允许第一版粗糙但要能运转"],
    avoid: "避免一开始就追求完美，也避免因为混乱就判断它没有价值。",
    keywords: ["开始", "混沌", "立规", "破土"],
  },
  {
    id: 4,
    name: "山水蒙",
    pattern: "010001",
    phrase: "未知不是错，先求明。",
    state: "现在最大的变量不是外界，而是信息不足。你可能已经感觉到方向，但还缺少判断它的依据。",
    trend: "只要愿意学习和请教，局势会逐渐清楚；若急着下结论，容易反复。",
    advice: ["先提出更准确的问题", "向懂行的人请教", "用一次小实验换答案"],
    avoid: "避免用情绪填补信息空白，也避免装作已经完全明白。",
    keywords: ["启蒙", "学习", "请教", "试探"],
  },
  {
    id: 11,
    name: "地天泰",
    pattern: "111000",
    phrase: "天地相交，小往大来。",
    state: "局面有流通感，上下、内外、资源与目标之间正在接上。此时适合推进合作和整合。",
    trend: "如果能保持开放，事情会从局部顺畅发展为整体顺畅。",
    advice: ["促成对话与连接", "把已有优势组合起来", "趁顺势推进一件重要事"],
    avoid: "避免因为顺利就松散，也避免忽略小问题的积累。",
    keywords: ["通达", "合作", "整合", "顺势"],
  },
  {
    id: 12,
    name: "天地否",
    pattern: "000111",
    phrase: "上下不交，宜止而观。",
    state: "当下有阻隔感，想法、资源或关系没有真正流动起来。越急着推动，越容易撞到看不见的墙。",
    trend: "短期内不宜硬进，先看清哪里不通，才有重新打开的可能。",
    advice: ["暂停无效沟通", "识别真正的阻塞点", "保存实力等待转机"],
    avoid: "避免把沉默当成同意，也避免在对方没准备好时强行推进。",
    keywords: ["闭塞", "阻隔", "停顿", "观察"],
  },
  {
    id: 24,
    name: "地雷复",
    pattern: "100000",
    phrase: "一阳来复，转机已动。",
    state: "看似低谷，但新的力量已经出现。它还很微弱，需要保护，而不是立刻放大。",
    trend: "接下来会有回升的迹象，关键是顺着小变化慢慢恢复。",
    advice: ["从一个可坚持的小行动开始", "修复作息和基本节奏", "不要急着宣布结果"],
    avoid: "避免刚有转机就过度消耗，也避免否定微小进展。",
    keywords: ["回归", "复苏", "转机", "小火苗"],
  },
  {
    id: 29,
    name: "坎为水",
    pattern: "010010",
    phrase: "险中求信，稳步过坎。",
    state: "你处在压力、风险或不确定之中。此卦不说马上脱险，而是提醒你在险境中保持清醒和可信。",
    trend: "困难可能还会反复，但只要不乱，路会在一段一段通过中出现。",
    advice: ["先确保底线安全", "只处理眼前最真实的问题", "用稳定行动建立信任"],
    avoid: "避免赌一把式解决，也避免被恐惧带着走。",
    keywords: ["风险", "坚持", "底线", "穿越"],
  },
  {
    id: 52,
    name: "艮为山",
    pattern: "001001",
    phrase: "止于其所，静中见界。",
    state: "当前更适合停下、定界、收心。停止不是失败，而是让力量回到该在的位置。",
    trend: "局面会因边界清晰而稳定，暂时不动反而能避免多余消耗。",
    advice: ["暂停新增承诺", "明确自己的边界", "把注意力收回到当下"],
    avoid: "避免把所有沉默都理解成错过，也避免为了证明自己而继续消耗。",
    keywords: ["停止", "边界", "安定", "自守"],
  },
  {
    id: 64,
    name: "火水未济",
    pattern: "010101",
    phrase: "未成之际，慎终如始。",
    state: "事情接近成形，但还没有真正完成。现在最容易因为快到终点而松手。",
    trend: "下一步有机会完成转化，但细节决定成败。",
    advice: ["检查最后几个关键环节", "让节奏慢半拍", "把未完成的事逐项收口"],
    avoid: "避免提前庆祝，也避免因为最后的不确定而全盘否定。",
    keywords: ["未完成", "收口", "谨慎", "转化"],
  },
];

const fallbackHexagram: Hexagram = hexagrams[0];

function randomLine(): LineKind {
  const value = Math.floor(Math.random() * 4);
  return ["yin", "yang", "old-yin", "old-yang"][value] as LineKind;
}

function lineToBit(line: LineKind) {
  return line === "yang" || line === "old-yang" ? "1" : "0";
}

function changedBit(line: LineKind) {
  if (line === "old-yang") return "0";
  if (line === "old-yin") return "1";
  return lineToBit(line);
}

function findHexagram(pattern: string) {
  const exact = hexagrams.find((hexagram) => hexagram.pattern === pattern);
  if (exact) return exact;

  const seed = pattern.split("").reduce((sum, bit, index) => sum + Number(bit) * (index + 3), 0);
  return hexagrams[seed % hexagrams.length] ?? fallbackHexagram;
}

function choosePosture(base: Hexagram, changedHexagram: Hexagram, changedCount: number) {
  if (changedCount === 0) return "守";
  if (base.keywords.includes("阻隔") || base.keywords.includes("风险")) return "稳";
  if (changedHexagram.keywords.includes("转机") || changedHexagram.keywords.includes("通达")) return "进";
  if (base.keywords.includes("停止")) return "止";
  if (changedCount >= 3) return "变";
  return "观";
}

function createReading(question: string): Reading {
  const lines = Array.from({ length: 6 }, randomLine);
  const basePattern = lines.map(lineToBit).join("");
  const changedPattern = lines.map(changedBit).join("");
  const changed = lines.map((line) => line === "old-yin" || line === "old-yang");
  const base = findHexagram(basePattern);
  const changedHexagram = findHexagram(changedPattern);

  return {
    question,
    lines,
    changed,
    base,
    changedHexagram,
    posture: choosePosture(base, changedHexagram, changed.filter(Boolean).length),
  };
}

function HexagramLines({ lines }: { lines: LineKind[] }) {
  return (
    <div className="hexagram" aria-label="六爻卦象">
      {[...lines].reverse().map((line, index) => {
        const isYang = line === "yang" || line === "old-yang";
        const isChanging = line === "old-yin" || line === "old-yang";
        return (
          <div className="hex-line" key={`${line}-${index}`}>
            <span className={isYang ? "solid-line" : "broken-line"}>
              {!isYang && <span />}
            </span>
            {isChanging && <b>变</b>}
          </div>
        );
      })}
    </div>
  );
}

const examples = ["我现在要不要主动推进这个机会？", "这段关系下一步适合靠近还是退一点？", "这个项目现在最该先补哪一环？"];

export default function Home() {
  const [question, setQuestion] = useState("我现在这个想法适不适合开始做？");
  const [reading, setReading] = useState<Reading>(() => createReading("我现在这个想法适不适合开始做？"));

  const changedCount = useMemo(() => reading.changed.filter(Boolean).length, [reading]);

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanQuestion = question.trim() || "我当下最应该看见什么？";
    setQuestion(cleanQuestion);
    setReading(createReading(cleanQuestion));
  }

  return (
    <main className="min-h-screen bg-[#f7f3eb] text-[#211d18]">
      <section className="hero-shell">
        <div className="brand-row" aria-label="观势">
          <span className="brand-mark">觀</span>
          <span>观势</span>
        </div>

        <div className="hero-grid">
          <div className="intro-panel">
            <p className="eyebrow">以易观时位</p>
            <h1>把当下的问题，化成一卦一策。</h1>
            <p className="lead">
              输入一个真实困惑，观势会生成本卦与变卦，帮你看见当前局面、变化趋势，以及下一步更合适的行动姿态。
            </p>

            <form className="question-form" onSubmit={submitQuestion}>
              <label htmlFor="question">所问之事</label>
              <textarea
                id="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={4}
                placeholder="比如：我现在该不该换工作？"
              />
              <div className="form-actions">
                <button type="submit" aria-label="起卦">
                  <span>起卦</span>
                  <i aria-hidden="true">◎</i>
                </button>
                <span>用于反思与灵感启发，不替代专业建议。</span>
              </div>
            </form>

            <div className="example-row" aria-label="示例问题">
              {examples.map((example) => (
                <button key={example} type="button" onClick={() => setQuestion(example)}>
                  {example}
                </button>
              ))}
            </div>
          </div>

          <aside className="oracle-panel" aria-label="卦象结果">
            <div className="oracle-heading">
              <div>
                <p>本卦</p>
                <h2>{reading.base.name}</h2>
              </div>
              <span>{reading.posture}</span>
            </div>
            <HexagramLines lines={reading.lines} />
            <p className="oracle-phrase">{reading.base.phrase}</p>
            <div className="meta-grid">
              <span>变爻 {changedCount}</span>
              <span>变卦 {reading.changedHexagram.name}</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="reading-shell" aria-label="解读结果">
        <div className="question-card">
          <p>你问</p>
          <h2>{reading.question}</h2>
        </div>

        <div className="reading-grid">
          <article>
            <span>当前状态</span>
            <h3>{reading.base.name}</h3>
            <p>{reading.base.state}</p>
          </article>
          <article>
            <span>变化趋势</span>
            <h3>{reading.changedHexagram.name}</h3>
            <p>{reading.changedHexagram.trend}</p>
          </article>
          <article>
            <span>行动姿态</span>
            <h3>{reading.posture}</h3>
            <ul>
              {reading.base.advice.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <span>不宜</span>
            <h3>留一分余地</h3>
            <p>{reading.base.avoid}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
