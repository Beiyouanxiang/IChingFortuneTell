import {
  buildLocalInterpretation,
  castReading,
  detectTopic,
  getClarifyQuestions,
  sanitizeText,
} from "./lib/iching.js";

const $ = (selector) => document.querySelector(selector);
const historyKey = "guanshi-history-v3";
let currentQuestion = "";
let currentTopic = null;
let clarificationAnswers = {};
let currentReading = null;

function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(options)) {
    if (key === "className") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key === "dataset") Object.assign(node.dataset, value);
    else node.setAttribute(key, value);
  }
  for (const child of children) node.append(child);
  return node;
}

function renderClarification(question) {
  currentQuestion = sanitizeText(question) || "我当下最应该看见什么？";
  currentTopic = detectTopic(currentQuestion);
  clarificationAnswers = {};
  const questions = getClarifyQuestions(currentTopic.id);
  $("#clarifyTopic").textContent = `识别为：${currentTopic.name}`;
  $("#clarifyCard").hidden = false;
  $("#primaryActionText").textContent = "起卦";

  const nodes = questions.map((questionItem) => {
    const buttons = questionItem.options.map((option) => {
      const button = el("button", { type: "button", text: option, dataset: { option } });
      button.addEventListener("click", () => {
        clarificationAnswers[questionItem.id] = option;
        button.parentElement.querySelectorAll("button").forEach((item) => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
      });
      return button;
    });
    return el("div", { className: "clarify-question" }, [
      el("strong", { text: questionItem.text }),
      el("div", { className: "option-row" }, buttons),
    ]);
  });
  $("#clarifyList").replaceChildren(...nodes);
  $("#clarifyCard").scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetClarification() {
  currentQuestion = "";
  currentTopic = null;
  clarificationAnswers = {};
  $("#clarifyCard").hidden = true;
  $("#primaryActionText").textContent = "继续";
}

function buildClarifications(topic) {
  return getClarifyQuestions(topic.id).map((item) => `${item.text}${clarificationAnswers[item.id] || "未选择"}`);
}

function render(reading) {
  currentReading = reading;
  const interpretation = buildLocalInterpretation(reading);
  $("#baseName").textContent = reading.primaryHexagram.name;
  $("#posture").textContent = reading.posture;
  $("#phrase").textContent = reading.primaryHexagram.phrase;
  $("#topicName").textContent = `场景 ${reading.topic.name}`;
  $("#changedCount").textContent = `变爻 ${reading.movingLines.length}`;
  $("#changedName").textContent = `变卦 ${reading.changedHexagram.name}`;
  $("#asked").textContent = reading.clarifications.length ? `${reading.question}｜${reading.clarifications.join("；")}` : reading.question;
  $("#oneLine").textContent = interpretation.summary;
  $("#forceText").textContent = interpretation.shi;
  $("#positionText").textContent = interpretation.wei;
  $("#timingText").textContent = interpretation.shiJi;
  $("#useText").textContent = interpretation.yong[0] || reading.primaryHexagram.action;
  $("#changeTitle").textContent = `变爻 ${reading.movingLines.length}`;
  $("#changeText").textContent = interpretation.shiJi;
  $("#reflectionQuestion").textContent = interpretation.reflectionQuestions[0] || "七天后你希望看到什么证据？";
  $("#adviceTitle").textContent = reading.posture;
  $("#avoidText").textContent = interpretation.risks.join(" ");
  $("#stateTitle").textContent = reading.primaryHexagram.name;
  $("#stateText").textContent = reading.primaryHexagram.state + reading.topic.lens;
  $("#trendTitle").textContent = reading.changedHexagram.name;
  $("#trendText").textContent = `变化指向「${reading.changedHexagram.name}」：${reading.changedHexagram.state}`;

  $("#adviceList").replaceChildren(...interpretation.yong.map((item) => el("li", { text: item })));
  $("#hexagram").replaceChildren(...[...reading.lines].reverse().map((line) => {
    const isYang = line === "yang" || line === "old-yang";
    const isChanging = line === "old-yin" || line === "old-yang";
    return el("div", { className: "hex-line" }, [
      el("span", { className: isYang ? "solid" : "broken" }),
      isChanging ? el("b", { text: "变" }) : el("span"),
    ]);
  }));
}

function getHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(historyKey) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 8).flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const safe = {
        question: sanitizeText(item.question, 600),
        base: sanitizeText(item.base, 40),
        changed: sanitizeText(item.changed, 40),
        posture: sanitizeText(item.posture, 10),
        topic: sanitizeText(item.topic, 20),
        createdAt: sanitizeText(item.createdAt, 40),
      };
      return safe.question && safe.base && safe.changed ? [safe] : [];
    });
  } catch {
    localStorage.removeItem(historyKey);
    return [];
  }
}

function saveHistory(reading) {
  const item = {
    question: reading.clarifications.length ? `${reading.question}｜${reading.clarifications.join("；")}` : reading.question,
    base: reading.primaryHexagram.name,
    changed: reading.changedHexagram.name,
    posture: reading.posture,
    topic: reading.topic.name,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(historyKey, JSON.stringify([item, ...getHistory()].slice(0, 8)));
  renderHistory();
}

function renderHistory() {
  const list = getHistory();
  if (!list.length) {
    $("#historyList").replaceChildren(el("div", { className: "history-item" }, [el("p", { text: "还没有记录。完成一次起卦后会出现在这里。" })]));
    return;
  }
  $("#historyList").replaceChildren(...list.map((item) => el("div", { className: "history-item" }, [
    el("b", { text: `${item.base} → ${item.changed}｜${item.posture}｜${item.topic}` }),
    el("p", { text: item.question }),
  ])));
}

function castFromInput() {
  const question = sanitizeText($("#question").value) || "我当下最应该看见什么？";
  $("#question").value = question;
  if (!currentQuestion || currentQuestion !== question) {
    renderClarification(question);
    return;
  }
  const reading = castReading(question, buildClarifications(currentTopic));
  render(reading);
  saveHistory(reading);
  resetClarification();
  document.querySelector(".reading").scrollIntoView({ behavior: "smooth", block: "start" });
}

function copyCurrent() {
  if (!currentReading) return;
  const interpretation = buildLocalInterpretation(currentReading);
  const text = [
    "观势问卦",
    `问题：${currentReading.question}`,
    `补充：${currentReading.clarifications.join("；") || "未补充"}`,
    `场景：${currentReading.topic.name}`,
    `本卦：${currentReading.primaryHexagram.name}`,
    `变卦：${currentReading.changedHexagram.name}`,
    `变爻：${currentReading.movingLines.join("、") || "无"}`,
    `姿态：${currentReading.posture}`,
    `总结：${interpretation.summary}`,
    `行动：${interpretation.yong.join("；")}`,
  ].join("\n");
  navigator.clipboard?.writeText(text).then(() => {
    $("#copyResult").textContent = "已复制";
    setTimeout(() => { $("#copyResult").textContent = "复制结果"; }, 1200);
  });
}

document.querySelectorAll(".examples button").forEach((button) => button.addEventListener("click", () => { $("#question").value = button.textContent || ""; }));
$("#questionForm").addEventListener("submit", (event) => { event.preventDefault(); castFromInput(); });
$("#recast").addEventListener("click", () => {
  if (!currentQuestion) renderClarification($("#question").value.trim() || currentReading?.question || "我当下最应该看见什么？");
  else castFromInput();
});
$("#resetClarify").addEventListener("click", resetClarification);
$("#copyResult").addEventListener("click", copyCurrent);
$("#clearHistory").addEventListener("click", () => { localStorage.removeItem(historyKey); renderHistory(); });
renderHistory();
