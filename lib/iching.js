export const LINE_KINDS = ["old-yin", "yang", "yin", "old-yang"];

export const HEXAGRAMS = [
  [1, "乾为天", "111111", "自强不息", "主动开创，势能上行，但成败取决于节制与方向。", "宜主动争取关键位置，把冲劲落到清晰步骤里。", "过刚易折，避免只凭热情硬冲。", "进", ["开创", "主动", "领导"]],
  [2, "坤为地", "000000", "厚德载物", "局势要求承载、配合与积累，先稳住底盘。", "宜整理资源，顺着大势承接责任。", "避免急着站到台前，也不要把退让误解成无力。", "守", ["承载", "顺势", "稳定"]],
  [3, "水雷屯", "100010", "初生多阻", "事情刚开始，有生机也有混乱，秩序尚未长成。", "宜先解决最卡住的一环，允许第一版粗糙但可运转。", "避免一开始追求完美。", "立", ["开始", "混沌", "立规"]],
  [4, "山水蒙", "010001", "未知先求明", "信息不足是当前主因，需要学习、请教和试探。", "宜提出更准确的问题，用小实验换答案。", "避免用情绪填补信息空白。", "问", ["学习", "请教", "试探"]],
  [5, "水天需", "111010", "待时而动", "条件尚未完全到位，等待不是停滞，而是蓄势。", "宜准备资源，等关键窗口出现再动。", "避免焦虑催熟。", "待", ["等待", "准备", "耐心"]],
  [6, "天水讼", "010111", "争中求理", "局面有分歧或对抗，关键是回到事实和规则。", "宜留下证据，先澄清边界再谈胜负。", "避免情绪化争执。", "辨", ["争议", "规则", "边界"]],
  [7, "地水师", "010000", "聚众成事", "需要组织、纪律和明确指挥，单打独斗不够。", "宜定目标、分角色、稳队伍。", "避免号令不清。", "统", ["组织", "纪律", "团队"]],
  [8, "水地比", "000010", "亲比相依", "局势需要靠近可信之人，建立连接和同盟。", "宜选择可靠关系，主动靠近同频者。", "避免为了合群失去判断。", "合", ["连接", "信任", "同盟"]],
  [9, "风天小畜", "111011", "小蓄待发", "力量正在积蓄，但还不足以大规模推进。", "宜先做小范围验证，积累可复用能力。", "避免小有所得就急于扩张。", "蓄", ["积累", "小成", "克制"]],
  [10, "天泽履", "110111", "履虎尾", "可行但有风险，需要礼、分寸和谨慎。", "宜按规则行事，注意姿态与边界。", "避免冒犯关键人物或制度。", "慎", ["礼节", "风险", "分寸"]],
  [11, "地天泰", "111000", "小往大来", "上下流通，资源与目标开始接上。", "宜推进合作与整合，趁顺势做关键事。", "避免顺利时松散。", "通", ["通达", "合作", "顺势"]],
  [12, "天地否", "000111", "上下不交", "有阻隔感，想法、资源或关系暂时不流动。", "宜暂停无效沟通，识别阻塞点。", "避免在对方没准备好时硬推。", "止", ["闭塞", "阻隔", "观察"]],
  [13, "天火同人", "101111", "同人于野", "适合公开连接、寻找共同目标。", "宜把个人想法放进更大的共同议题。", "避免小圈子思维。", "同", ["共同", "公开", "协作"]],
  [14, "火天大有", "111101", "大有其时", "资源、机会或能见度较高，但要懂得持盈。", "宜把优势转化为责任和成果。", "避免炫耀或过度占有。", "持", ["丰盛", "资源", "成果"]],
  [15, "地山谦", "001000", "谦受益", "降低姿态反而能获得空间和支持。", "宜虚心听取反馈，稳扎稳打。", "避免急于证明自己。", "谦", ["谦逊", "修正", "低位"]],
  [16, "雷地豫", "000100", "顺势而乐", "气氛被调动，适合鼓舞、启动和传播。", "宜用愿景带动行动，让人愿意参与。", "避免只有热闹没有执行。", "振", ["鼓舞", "启动", "传播"]],
  [17, "泽雷随", "100110", "随时而行", "需要顺着变化调整，不宜固执己见。", "宜观察新的主导力量，灵活跟进。", "避免盲从或失去原则。", "随", ["跟随", "适应", "转换"]],
  [18, "山风蛊", "011001", "治旧成新", "旧问题已经积累，需要清理根源。", "宜复盘、修补制度、处理遗留问题。", "避免只做表面粉饰。", "治", ["整顿", "修复", "根源"]],
  [19, "地泽临", "110000", "临近有为", "机会正在靠近，适合指导、管理和照看。", "宜主动靠近现场，给出清晰支持。", "避免居高临下。", "临", ["靠近", "管理", "照看"]],
  [20, "风地观", "000011", "观而后动", "现在最重要的是观察全局，看清结构。", "宜拉开距离，寻找模式与信号。", "避免凭局部信息下判断。", "观", ["观察", "全局", "洞察"]],
  [21, "火雷噬嗑", "100101", "咬合破阻", "有硬结需要处理，必须明确规则和决断。", "宜直面问题，拆除阻碍。", "避免含糊其辞。", "断", ["决断", "规则", "破阻"]],
  [22, "山火贲", "101001", "文质相成", "外在表达与内在实质都重要。", "宜优化呈现，让价值被看见。", "避免重包装轻内容。", "饰", ["表达", "美化", "呈现"]],
  [23, "山地剥", "000001", "剥落见底", "旧结构正在松动，需要保核心、减消耗。", "宜收缩战线，保护关键资源。", "避免恋战。", "退", ["剥落", "收缩", "保底"]],
  [24, "地雷复", "100000", "一阳来复", "低处已有转机，新力量还小，需保护。", "宜从一个可坚持的小行动恢复节奏。", "避免刚有转机就过度消耗。", "复", ["回归", "复苏", "转机"]],
  [25, "天雷无妄", "100111", "无妄守真", "不要强作设计，回到真实和正当。", "宜诚实面对事实，做该做之事。", "避免投机和妄念。", "正", ["真实", "正当", "自然"]],
  [26, "山天大畜", "111001", "大畜蓄德", "力量足但需约束，越能蓄，越能成大事。", "宜沉淀能力，建立长期资产。", "避免急于释放全部能量。", "蓄", ["大蓄", "能力", "长期"]],
  [27, "山雷颐", "100001", "养正则吉", "重点在滋养、输入和基本盘。", "宜调整饮食作息、信息输入和支持系统。", "避免只消耗不补给。", "养", ["滋养", "输入", "基本盘"]],
  [28, "泽风大过", "011110", "大过需梁", "压力超过常态，需要非常手段但要有支点。", "宜找承重结构，先稳住关键梁柱。", "避免独自硬扛。", "撑", ["过载", "支点", "非常"]],
  [29, "坎为水", "010010", "险中求信", "处在风险或不确定之中，需稳步过坎。", "宜确保底线安全，只处理最真实的问题。", "避免赌一把式解决。", "稳", ["风险", "底线", "穿越"]],
  [30, "离为火", "101101", "明而不执", "光明、表达和依附并存，需要看清也要有所依。", "宜让信息透明，找到可靠依托。", "避免被表象牵着走。", "明", ["清晰", "表达", "依附"]],
  [31, "泽山咸", "001110", "感而相应", "关系中有感应，适合真诚触达。", "宜柔和表达真实感受。", "避免操控对方反应。", "感", ["感应", "关系", "触达"]],
  [32, "雷风恒", "011100", "久处见恒", "重点在持续与稳定，不在一时强烈。", "宜建立可长期执行的节奏。", "避免三分钟热度。", "恒", ["持续", "稳定", "长期"]],
  [33, "天山遁", "001111", "知退为进", "退不是输，是保存主动权。", "宜退出无效战场，转入准备期。", "避免因面子恋战。", "遁", ["退避", "保存", "转身"]],
  [34, "雷天大壮", "111100", "壮而有制", "力量强盛，适合推进，但要守礼。", "宜用强势完成突破，同时约束边界。", "避免恃强凌弱。", "壮", ["强势", "突破", "约束"]],
  [35, "火地晋", "000101", "明出地上", "能见度上升，适合晋升、展示和推进。", "宜让成果被看见，争取正当机会。", "避免浮躁求快。", "晋", ["上升", "展示", "机会"]],
  [36, "地火明夷", "101000", "藏明待时", "光被遮蔽，才华或真实想法暂不宜外露。", "宜保护自己，低调完成必要动作。", "避免在不安全处暴露底牌。", "藏", ["受阻", "隐藏", "自保"]],
  [37, "风火家人", "101011", "各正其位", "关系和组织需要各归其位。", "宜明确职责，先把内部秩序理顺。", "避免边界混乱。", "齐", ["家人", "秩序", "分工"]],
  [38, "火泽睽", "110101", "异中求同", "分歧存在，但未必不能共处。", "宜承认差异，寻找最小共识。", "避免强求完全一致。", "合", ["分歧", "差异", "共识"]],
  [39, "水山蹇", "001010", "行难宜止", "前路有阻，直接推进成本高。", "宜绕路、求助、重新评估路线。", "避免硬闯。", "缓", ["艰难", "求助", "绕行"]],
  [40, "雷水解", "010100", "解结脱困", "紧绷局面开始松动，适合释放压力。", "宜处理误会，解除不必要负担。", "避免刚脱困就再造压力。", "解", ["松动", "释放", "脱困"]],
  [41, "山泽损", "110001", "有所损益", "减法能带来真正收益。", "宜删掉低价值消耗，集中核心。", "避免舍不得无效成本。", "减", ["减法", "取舍", "聚焦"]],
  [42, "风雷益", "100011", "风雷相益", "外部助力与内部行动相互增益。", "宜主动投入，把资源转化为增长。", "避免只等别人帮助。", "益", ["增益", "投入", "成长"]],
  [43, "泽天夬", "111110", "决而能和", "到了决断时刻，但决断要正当。", "宜公开说明立场，清理关键阻碍。", "避免怒气式摊牌。", "决", ["决断", "公开", "清理"]],
  [44, "天风姤", "011111", "不期而遇", "突然而来的相遇或机会，需要辨别。", "宜保持开放，同时设好边界。", "避免被新鲜感带走。", "遇", ["相遇", "诱因", "边界"]],
  [45, "泽地萃", "000110", "聚而成势", "人、资源、注意力正在聚集。", "宜建立共同场域，集中力量办一件事。", "避免人多而散。", "聚", ["聚集", "资源", "场域"]],
  [46, "地风升", "011000", "积小而升", "上升来自持续积累，不宜跳级。", "宜一步一步向上走，争取稳定增长。", "避免急功近利。", "升", ["成长", "积累", "上行"]],
  [47, "泽水困", "010110", "困中守心", "资源受限或情绪受困，重点是守住心气。", "宜减负、求援、保留核心行动。", "避免把困境当成永久结论。", "困", ["受限", "压力", "守心"]],
  [48, "水风井", "011010", "井养不穷", "价值在基础设施和长期供给。", "宜修复系统，让资源稳定流出。", "避免只追热点不修水源。", "修", ["系统", "供给", "基础"]],
  [49, "泽火革", "101110", "革故鼎新", "旧方式已不适配，需要变革。", "宜明确为什么变、怎么变、先变哪里。", "避免为了变化而变化。", "革", ["变革", "更新", "转型"]],
  [50, "火风鼎", "011101", "鼎新成器", "资源可被重新组合成新形态。", "宜建立新结构，让能力成为作品。", "避免只停留在想法层面。", "成", ["成器", "结构", "作品"]],
  [51, "震为雷", "100100", "震来有省", "突发震动带来警醒，先稳住再行动。", "宜快速响应，抓住提醒背后的信号。", "避免被惊吓驱动。", "醒", ["震动", "警醒", "响应"]],
  [52, "艮为山", "001001", "止于其所", "停止、定界、收心是当前要义。", "宜暂停新增承诺，明确边界。", "避免为了证明自己继续消耗。", "止", ["停止", "边界", "安定"]],
  [53, "风山渐", "001011", "渐进有序", "事情需要循序渐进，不能越级。", "宜建立阶段路线，慢慢取得信任。", "避免跳过必要过程。", "渐", ["渐进", "秩序", "信任"]],
  [54, "雷泽归妹", "110100", "位不当慎", "关系或合作中位置未正，需要谨慎。", "宜看清身份、承诺和交换是否对等。", "避免被暧昧结构绑定。", "慎", ["关系", "位置", "不对等"]],
  [55, "雷火丰", "101100", "盛大而明", "局面丰盛热烈，但盛极需警醒。", "宜趁高能量完成关键成果。", "避免被热闹分散。", "丰", ["丰盛", "高峰", "照明"]],
  [56, "火山旅", "001101", "旅中守正", "处在过渡和异地感中，不宜强求归属。", "宜轻装前行，尊重当地规则。", "避免把临时状态当永久归宿。", "旅", ["过渡", "移动", "适应"]],
  [57, "巽为风", "011011", "入而能化", "柔顺渗透，比正面冲撞更有效。", "宜慢慢进入系统，用持续影响改变局面。", "避免软弱无主。", "入", ["渗透", "柔顺", "影响"]],
  [58, "兑为泽", "110110", "悦而有节", "交流、愉悦、表达能带来连接。", "宜用轻松方式打开关系与合作。", "避免只图开心而失去原则。", "悦", ["交流", "愉悦", "表达"]],
  [59, "风水涣", "010011", "散而复聚", "原有凝结正在散开，先疏通再重组。", "宜释放压力、拆开纠缠、重新连接。", "避免越乱越抓紧。", "散", ["疏散", "释放", "重组"]],
  [60, "水泽节", "110010", "节以成度", "限制不是坏事，边界让行动可持续。", "宜设规则、定预算、控节奏。", "避免无节制消耗。", "节", ["节制", "规则", "边界"]],
  [61, "风泽中孚", "110011", "诚信感通", "真正的信任来自内外一致。", "宜坦诚表达，兑现小承诺。", "避免话术大于真实。", "信", ["诚信", "信任", "一致"]],
  [62, "雷山小过", "001100", "小过可补", "不宜大举推进，适合处理小处和细节。", "宜小步修正，关注容易被忽略的地方。", "避免小错滚成大错。", "小", ["细节", "小步", "修正"]],
  [63, "水火既济", "101010", "既成犹慎", "事情已成或接近完成，最怕松懈。", "宜复盘维护，守住完成后的秩序。", "避免完成后立刻失控。", "守", ["完成", "收束", "维护"]],
  [64, "火水未济", "010101", "未成慎终", "接近成形但尚未完成，细节决定成败。", "宜逐项收口，让最后一段更稳。", "避免提前庆祝或全盘否定。", "收", ["未完成", "转化", "收口"]],
].map(([number, name, pattern, phrase, state, action, avoid, posture, keywords]) => ({
  number,
  name,
  pattern,
  phrase,
  state,
  action,
  avoid,
  posture,
  keywords,
}));

export const TOPICS = [
  { id: "career", name: "事业", words: ["工作", "职业", "老板", "同事", "跳槽", "面试", "岗位", "升职"], lens: "放到事业里看，重点不是一时得失，而是位置、资源和长期成长。" },
  { id: "project", name: "项目", words: ["项目", "产品", "需求", "创业", "上线", "版本", "功能", "用户", "开发", "codex"], lens: "放到项目里看，重点是先跑通闭环，再判断哪里值得加码。" },
  { id: "relationship", name: "关系", words: ["关系", "感情", "喜欢", "恋爱", "朋友", "家人", "伴侣", "靠近", "分开", "复合"], lens: "放到关系里看，重点是距离、边界、回应和真实感受。" },
  { id: "choice", name: "选择", words: ["要不要", "该不该", "选择", "还是", "决定", "方向", "机会"], lens: "放到选择里看，重点是当前条件是否支持行动，以及哪种代价可以承担。" },
  { id: "emotion", name: "情绪", words: ["焦虑", "难受", "迷茫", "情绪", "压力", "烦", "乱", "累"], lens: "放到情绪里看，重点是先安顿自己，再处理外部问题。" },
  { id: "money", name: "财务", words: ["钱", "投资", "收入", "财务", "成本", "价格", "买", "卖"], lens: "放到财务里看，重点是风险边界、现金流和可承受损失。" },
  { id: "study", name: "学习", words: ["学习", "考试", "论文", "课程", "研究", "读书", "技能"], lens: "放到学习里看，重点是输入结构、反馈周期和持续练习。" },
  { id: "general", name: "综合", words: [], lens: "放到当前处境里看，重点是看清时位，再决定进退。" },
];

export const CLARIFY_QUESTIONS = {
  career: [
    { id: "intent", text: "你现在更接近哪种状态？", options: ["主动争取", "想离开", "先观望"] },
    { id: "block", text: "最大的阻力来自哪里？", options: ["能力资源", "人际关系", "外部机会"] },
    { id: "priority", text: "你最看重什么？", options: ["稳定", "成长", "收入"] },
  ],
  project: [
    { id: "stage", text: "这个项目现在处在哪一段？", options: ["刚有想法", "已经能用", "需要推广"] },
    { id: "risk", text: "最大的不确定性是什么？", options: ["需求真假", "体验好坏", "执行成本"] },
    { id: "next", text: "你最想验证什么？", options: ["用户愿不愿意用", "功能是否跑通", "是否值得继续投入"] },
  ],
  relationship: [
    { id: "relation", text: "你们现在是什么关系？", options: ["暧昧试探", "稳定关系", "疏远拉扯"] },
    { id: "block", text: "当前最大卡点是什么？", options: ["回应不清", "距离变化", "信任受损"] },
    { id: "wish", text: "你心里更想要什么？", options: ["靠近", "确认", "放下"] },
  ],
  choice: [
    { id: "choice", text: "这个选择更像什么？", options: ["进退选择", "左右比较", "是否开始"] },
    { id: "cost", text: "你最担心哪种代价？", options: ["时间", "关系", "机会"] },
    { id: "reversible", text: "这个决定可逆吗？", options: ["基本可逆", "很难回头", "不确定"] },
  ],
  emotion: [
    { id: "duration", text: "这种状态持续多久了？", options: ["刚出现", "一段时间", "反复很久"] },
    { id: "source", text: "主要来源是什么？", options: ["人际", "事情", "身体节奏"] },
    { id: "need", text: "你现在最需要什么？", options: ["安定", "行动", "倾诉"] },
  ],
  money: [
    { id: "move", text: "这更像哪类财务问题？", options: ["是否投入", "是否止损", "如何分配"] },
    { id: "risk", text: "你最担心什么？", options: ["亏损", "错过", "现金流"] },
    { id: "limit", text: "你有没有设上限？", options: ["有明确上限", "大概有", "还没有"] },
  ],
  study: [
    { id: "stage", text: "学习现在卡在哪里？", options: ["开始困难", "坚持困难", "方法不清"] },
    { id: "feedback", text: "你现在有反馈吗？", options: ["有清晰反馈", "反馈很慢", "几乎没有"] },
    { id: "goal", text: "目标更偏向什么？", options: ["考试结果", "能力提升", "长期研究"] },
  ],
  general: [
    { id: "state", text: "你现在更像处于什么状态？", options: ["想推进", "想等待", "想转向"] },
    { id: "block", text: "最卡住你的是什么？", options: ["信息不足", "资源不足", "心里没定"] },
    { id: "need", text: "你最需要卦帮你看什么？", options: ["当前处境", "下一步", "风险边界"] },
  ],
};

export function sanitizeText(value, maxLength = 600) {
  return normalizeText(value).slice(0, maxLength);
}

export function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function findHexagram(pattern) {
  return HEXAGRAMS.find((hexagram) => hexagram.pattern === pattern) || null;
}

export function findHexagramByNumber(number) {
  return HEXAGRAMS.find((hexagram) => hexagram.number === Number(number)) || null;
}

export function detectTopic(question) {
  const normalized = sanitizeText(question).toLowerCase();
  return TOPICS.find((topic) => topic.words.some((word) => normalized.includes(word))) || TOPICS[TOPICS.length - 1];
}

export function getClarifyQuestions(topicId) {
  return CLARIFY_QUESTIONS[topicId] || CLARIFY_QUESTIONS.general;
}

export function lineToBit(line) {
  return line === "yang" || line === "old-yang" ? "1" : "0";
}

export function changedBit(line) {
  if (line === "old-yang") return "0";
  if (line === "old-yin") return "1";
  return lineToBit(line);
}

export function castThreeCoins(random = Math.random) {
  const heads = [random(), random(), random()].filter((value) => value >= 0.5).length;
  if (heads === 0) return { value: 6, kind: "old-yin", moving: true };
  if (heads === 1) return { value: 7, kind: "yang", moving: false };
  if (heads === 2) return { value: 8, kind: "yin", moving: false };
  return { value: 9, kind: "old-yang", moving: true };
}

export function castReading(question, clarifications = [], random = Math.random) {
  const cleanQuestion = sanitizeText(question) || "我当下最应该看见什么？";
  const cleanClarifications = sanitizeClarifications(clarifications);
  const topic = detectTopic([cleanQuestion, ...cleanClarifications].join(" "));
  const coins = Array.from({ length: 6 }, () => castThreeCoins(random));
  const lines = coins.map((coin) => coin.kind);
  const primary = findHexagram(lines.map(lineToBit).join(""));
  const changed = findHexagram(lines.map(changedBit).join(""));
  const movingLines = lines.flatMap((line, index) => line === "old-yin" || line === "old-yang" ? [index + 1] : []);

  if (!primary || !changed) {
    throw new Error("Internal hexagram mapping failed.");
  }

  return {
    question: cleanQuestion,
    clarifications: cleanClarifications,
    topic,
    lines,
    movingLines,
    primaryHexagram: primary,
    changedHexagram: changed,
    posture: choosePosture(primary, changed, movingLines.length),
    createdAt: new Date().toISOString(),
  };
}

export function sanitizeClarifications(clarifications) {
  return Array.isArray(clarifications)
    ? clarifications.slice(0, 6).map((item) => sanitizeText(item, 180)).filter(Boolean)
    : [];
}

export function choosePosture(base, changed, changing) {
  if (changing === 0) return base.posture || "守";
  if (["坎为水", "天地否", "水山蹇", "泽水困"].includes(base.name)) return "稳";
  if (["地雷复", "地天泰", "风雷益", "火地晋"].includes(changed.name)) return "进";
  if (changing >= 4) return "变";
  return base.posture || "观";
}

export function changeReading(changing) {
  const map = [
    ["无变：守其本位", "局势相对稳定，重点不是马上转向，而是把当前姿态做稳、做细、做完整。"],
    ["一爻变：微调即可", "变化已经露头，但力度还小。适合做轻量试探，不宜大幅改局。"],
    ["二爻变：方向可试", "内外已经有明显牵动，可以开始验证新方向，但要保留退路。"],
    ["三爻变：拉扯之中", "变化力量较复杂，容易同时想进、想退、想守。此时宜先分清主次。"],
    ["四爻变：局势多动", "变化较强，旧判断可能很快失效。不要固执原计划，先看新的结构。"],
    ["五爻变：大势将换", "多数爻已动，说明局面接近换框架。此时要保护核心，减少无谓消耗。"],
    ["六爻全变：旧局已尽", "全部爻都在变化，旧局很难按原样延续。与其修补细节，不如重新定义问题。"],
  ];
  const picked = map[changing] || map[0];
  return { title: picked[0], text: picked[1] };
}

export function topicAdvice(topicId, posture) {
  const map = {
    career: [`先确认这个动作是否提升你的长期位置。`, `用一个可见成果证明自己，而不是只解释想法。`, `姿态上取“${posture}”，但要保留职业边界。`],
    project: [`先做最小闭环，让用户真实走完一次。`, `把不确定点拆成一个能验证的小实验。`, `姿态上取“${posture}”，优先修正最影响体验的一环。`],
    relationship: [`先看对方有没有真实回应，再决定靠近的尺度。`, `把边界说清楚，比猜测更有用。`, `姿态上取“${posture}”，不要用焦虑替对方做决定。`],
    choice: [`列出可逆与不可逆的代价。`, `先选一个低成本验证动作。`, `姿态上取“${posture}”，别急着把所有门一次关上。`],
    emotion: [`先把睡眠、饮食、节奏稳住。`, `把问题写下来，分清事实和想象。`, `姿态上取“${posture}”，先安身再谋事。`],
    money: [`先设好损失上限。`, `不要用情绪做财务决定。`, `姿态上取“${posture}”，现金流和风险边界优先。`],
    study: [`把目标拆成每天能完成的练习。`, `用反馈修正方法，不靠意志硬撑。`, `姿态上取“${posture}”，重在持续。`],
    general: [`先分清什么能控制，什么只能观察。`, `做一个最小、真实、可复盘的行动。`, `姿态上取“${posture}”，顺势而不失主心。`],
  };
  return map[topicId] || map.general;
}

export function reflectionQuestions(topicId) {
  const map = {
    career: ["这个动作会提升你的长期位置，还是只是在逃离眼前不舒服？", "谁能给你真实反馈，而不是情绪支持？", "本周哪一个成果最能证明你的价值？"],
    project: ["如果只能保留一个最小闭环，你会保留哪一步？", "当前最需要验证的是需求、体验还是成本？", "什么反馈能说明这件事值得继续加码？"],
    relationship: ["你期待的是对方回应，还是期待自己不用再猜？", "哪些边界需要先说清楚？", "你愿意接受的靠近速度是什么？"],
    choice: ["哪一个代价是你已经知道但不愿承认的？", "这个选择最小可逆试验是什么？", "如果推迟七天，信息会变多还是只是焦虑变多？"],
    emotion: ["你现在最需要解决的是事情本身，还是身体和心先恢复稳定？", "哪些想法是事实，哪些只是推演？", "今天能让你回到地面的一个动作是什么？"],
    money: ["如果结果不如预期，你能承受的最大损失是多少？", "你是在做计划，还是在用焦虑追涨杀跌？", "现金流底线在哪里？"],
    study: ["你缺的是更多资料，还是稳定反馈节奏？", "每天最小可完成练习是什么？", "谁能帮你校正方法？"],
    general: ["你现在最该改变的是行动，还是看待问题的框架？", "什么是你能控制的一小块？", "七天后你希望看到什么证据？"],
  };
  return map[topicId] || map.general;
}

export const RISK_RULES = [
  {
    type: "self_harm",
    priority: 100,
    patterns: [
      /(?:自杀|轻生|结束(?:自己|我的)?生命|伤害自己|自残|割腕|上吊|卧轨|烧炭|喝农药)/i,
      /(?:不想(?:再)?活(?:了|下去)?|活不下去|一死了之|不如死了|活着(?:已经|真的|根本|完全)?(?:没有|没)(?:任何)?意义)/i,
      /(?:准备|打算|计划|决定|想|要).{0,16}(?:跳楼|跳下去|往下跳|吞.{0,6}(?:安眠药|药片)|过量服药|服药过量|吃.{0,6}(?:一瓶|大量|过量).{0,4}药)/i,
      /(?:天台|楼顶|高楼|桥上|高处).{0,10}(?:跳下去|往下跳|跳楼)/i,
      /(?:吞|吃|服用?).{0,6}(?:一瓶|大量|过量).{0,4}(?:安眠药|药片|药物?)/i,
    ],
  },
  { type: "medical", priority: 30, patterns: [/(?:病|药|诊断|手术|癌|抑郁|焦虑症|怀孕)/i] },
  { type: "legal", priority: 20, patterns: [/(?:起诉|判刑|违法|合同纠纷|离婚诉讼|报警)/i] },
  { type: "financial", priority: 10, patterns: [/(?:梭哈|借钱投资|贷款炒|all\s*in|杠杆|爆仓)/i] },
];

const SELF_HARM_TERMS = "(?:自杀|轻生|伤害自己|自残|割腕|上吊|卧轨|烧炭|喝农药|跳楼|从.{0,6}(?:天台|楼顶|高楼|桥上|高处).{0,6}(?:跳下去|往下跳)|吞.{0,6}(?:安眠药|药片)|过量服药|服药过量)";

export function detectRisk(question, clarifications = []) {
  const text = normalizeText([question, ...sanitizeClarifications(clarifications)].join(" ")).toLowerCase();
  const selfHarmText = maskNonRiskSelfHarmContexts(text);
  const orderedRules = [...RISK_RULES].sort((a, b) => b.priority - a.priority);

  for (const rule of orderedRules) {
    const candidate = rule.type === "self_harm" ? selfHarmText : text;
    if (rule.patterns.some((pattern) => pattern.test(candidate))) return rule.type;
  }
  return "normal";
}

function maskNonRiskSelfHarmContexts(text) {
  const contextual = [
    new RegExp(`(?:并不|不|没有|从没|从未)(?:想|打算|准备|计划|会|要)?(?:去|再)?${SELF_HARM_TERMS}(?:的)?(?:想法|念头|计划|打算)?`, "gi"),
    new RegExp(`(?:预防|防止|阻止|劝阻|科普|研究|报道|新闻|小说|电影|剧本|课程|论文).{0,18}${SELF_HARM_TERMS}`, "gi"),
    new RegExp(`${SELF_HARM_TERMS}.{0,10}(?:预防|科普|研究|报道|新闻|小说|电影|剧本|课程|论文)`, "gi"),
  ];
  return contextual.reduce((result, pattern) => result.replace(pattern, " [非本人风险语境] "), text);
}

export function buildLocalInterpretation(reading, riskType = "normal") {
  const topic = reading.topic || detectTopic(reading.question);
  const change = changeReading(reading.movingLines.length);
  const advices = [reading.primaryHexagram.action, ...topicAdvice(topic.id, reading.posture)].slice(0, 4);

  if (riskType !== "normal") {
    return {
      summary: `本卦为「${reading.primaryHexagram.name}」，但这个问题含有高风险因素，卦象只能用于整理思路，不能替代专业帮助。`,
      shi: `现代卦意提要为「${reading.primaryHexagram.phrase}」。本产品的传统意象标签偏向“${reading.primaryHexagram.keywords.join("、")}”，当前更重要的是先把现实风险降下来。`,
      wei: topic.lens,
      shiJi: "此刻不适合把卦象当成决定依据。先找可信的人、专业机构或现实资源一起判断。",
      yong: ["暂停重大不可逆决定", "把问题写成事实清单", "联系能提供现实帮助的人或专业服务"],
      risks: ["不要用卦象替代医疗、法律、财务等专业判断", "不要在情绪高峰做不可逆决定", "不要独自承担高风险处境"],
      reflectionQuestions: reflectionQuestions(topic.id),
      sevenDayExperiment: "未来七天只做低风险、可撤回的小动作，并记录真实反馈。",
      safetyNote: safetyGuidance(riskType, reading.locale || "zh-CN"),
    };
  }

  return {
    summary: `本卦「${reading.primaryHexagram.name}」指向${reading.primaryHexagram.phrase}，变卦「${reading.changedHexagram.name}」提示下一步要留意局势转向。`,
    shi: `现代卦意提要为「${reading.primaryHexagram.phrase}」。本产品的传统意象标签偏向“${reading.primaryHexagram.keywords.join("、")}”；结合问题，它更像是在提醒你先看清局势底色。`,
    wei: topic.lens,
    shiJi: `${change.title}。${change.text}`,
    yong: advices,
    risks: [reading.primaryHexagram.avoid, "避免把卦象当成确定命运的答案。"],
    reflectionQuestions: reflectionQuestions(topic.id),
    sevenDayExperiment: `用七天做一个最小实验：选一件可复盘的小行动，按“${reading.posture}”的姿态执行，并记录反馈。`,
    safetyNote: "本解读用于结构化反思与行动启发，不替代法律、医疗、财务等专业建议。",
  };
}

export function normalizeReadingFacts(input) {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "request_body_invalid" };
  }

  const question = normalizeText(input.question);
  const clarifications = sanitizeClarifications(input.clarifications);
  const lines = Array.isArray(input.lines)
    ? input.lines.map((line) => sanitizeText(line, 20))
    : Array.isArray(input.primaryHexagram?.lines)
      ? input.primaryHexagram.lines.map((line) => sanitizeText(line, 20))
      : [];
  const movingLines = Array.isArray(input.movingLines) ? input.movingLines.map(Number) : [];
  const primary = input.primaryHexagram || {};
  const changed = input.changedHexagram || {};
  const topic = detectTopic([question, ...clarifications].join(" "));

  if (!question || question.length > 600) return { ok: false, error: "question_invalid" };
  if (lines.length !== 6 || !lines.every((line) => LINE_KINDS.includes(line))) return { ok: false, error: "lines_invalid" };

  const actualPrimary = findHexagram(lines.map(lineToBit).join(""));
  const actualChanged = findHexagram(lines.map(changedBit).join(""));
  const actualMovingLines = lines.flatMap((line, index) => line === "old-yin" || line === "old-yang" ? [index + 1] : []);

  if (!actualPrimary || !actualChanged) return { ok: false, error: "hexagram_mapping_invalid" };
  if (!/^[01]{6}$/.test(String(primary.pattern || "")) || primary.pattern !== actualPrimary.pattern) return { ok: false, error: "primary_pattern_mismatch" };
  if (!/^[01]{6}$/.test(String(changed.pattern || "")) || changed.pattern !== actualChanged.pattern) return { ok: false, error: "changed_pattern_mismatch" };
  if (Number(primary.number) !== actualPrimary.number || sanitizeText(primary.name, 40) !== actualPrimary.name) return { ok: false, error: "primary_mismatch" };
  if (Number(changed.number) !== actualChanged.number || sanitizeText(changed.name, 40) !== actualChanged.name) return { ok: false, error: "changed_mismatch" };
  if (movingLines.length !== actualMovingLines.length || movingLines.some((line, index) => line !== actualMovingLines[index])) return { ok: false, error: "moving_lines_mismatch" };

  return {
    ok: true,
    reading: {
      question,
      clarifications,
      topic,
      lines,
      movingLines: actualMovingLines,
      primaryHexagram: actualPrimary,
      changedHexagram: actualChanged,
      posture: choosePosture(actualPrimary, actualChanged, actualMovingLines.length),
      locale: sanitizeText(input.locale || "zh-CN", 20),
    },
  };
}

function safetyGuidance(riskType, locale) {
  if (riskType === "self_harm" && locale === "zh-CN") {
    return "如果你可能立即伤害自己，请现在联系身边可信的人陪伴你，并联系当地急救或报警服务；在中国大陆可拨 120 或 110，也可拨全国心理援助热线 12356。此工具不能提供危机干预。";
  }
  if (riskType === "self_harm") {
    return "如果你可能立即伤害自己，请现在联系身边可信的人陪伴你，并联系你所在地区的紧急服务或危机支持。此工具不能提供危机干预。";
  }
  const labels = { medical: "医疗专业人员", legal: "具备资质的法律专业人员", financial: "具备资质且了解你实际情况的财务专业人员" };
  return `这是高风险问题的安全分支。请暂停不可逆决定，并向${labels[riskType] || "相关专业人员"}核实；本工具不能诊断、裁决或保证结果。`;
}
