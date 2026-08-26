const HEXAGRAMS = [
  [1,"乾为天","111111","自强不息","主动开创，势能上行，但成败取决于节制与方向。","宜主动争取关键位置，把冲劲落到清晰步骤里。","过刚易折，避免只凭热情硬冲。","进",["开创","主动","领导"]],
  [2,"坤为地","000000","厚德载物","局势要求承载、配合与积累，先稳住底盘。","宜整理资源，顺着大势承接责任。","避免急着站到台前，也不要把退让误解成无力。","守",["承载","顺势","稳定"]],
  [3,"水雷屯","100010","初生多阻","事情刚开始，有生机也有混乱，秩序尚未长成。","宜先解决最卡住的一环，允许第一版粗糙但可运转。","避免一开始追求完美。","立",["开始","混沌","立规"]],
  [4,"山水蒙","010001","未知先求明","信息不足是当前主因，需要学习、请教和试探。","宜提出更准确的问题，用小实验换答案。","避免用情绪填补信息空白。","问",["学习","请教","试探"]],
  [5,"水天需","111010","待时而动","条件尚未完全到位，等待不是停滞，而是蓄势。","宜准备资源，等关键窗口出现再动。","避免焦虑催熟。","待",["等待","准备","耐心"]],
  [6,"天水讼","010111","争中求理","局面有分歧或对抗，关键是回到事实和规则。","宜留下证据，先澄清边界再谈胜负。","避免情绪化争执。","辨",["争议","规则","边界"]],
  [7,"地水师","010000","聚众成事","需要组织、纪律和明确指挥，单打独斗不够。","宜定目标、分角色、稳队伍。","避免号令不清。","统",["组织","纪律","团队"]],
  [8,"水地比","000010","亲比相依","局势需要靠近可信之人，建立连接和同盟。","宜选择可靠关系，主动靠近同频者。","避免为了合群失去判断。","合",["连接","信任","同盟"]],
  [9,"风天小畜","111011","小蓄待发","力量正在积蓄，但还不足以大规模推进。","宜先做小范围验证，积累可复用能力。","避免小有所得就急于扩张。","蓄",["积累","小成","克制"]],
  [10,"天泽履","110111","履虎尾","可行但有风险，需要礼、分寸和谨慎。","宜按规则行事，注意姿态与边界。","避免冒犯关键人物或制度。","慎",["礼节","风险","分寸"]],
  [11,"地天泰","111000","小往大来","上下流通，资源与目标开始接上。","宜推进合作与整合，趁顺势做关键事。","避免顺利时松散。","通",["通达","合作","顺势"]],
  [12,"天地否","000111","上下不交","有阻隔感，想法、资源或关系暂时不流动。","宜暂停无效沟通，识别阻塞点。","避免在对方没准备好时硬推。","止",["闭塞","阻隔","观察"]],
  [13,"天火同人","101111","同人于野","适合公开连接、寻找共同目标。","宜把个人想法放进更大的共同议题。","避免小圈子思维。","同",["共同","公开","协作"]],
  [14,"火天大有","111101","大有其时","资源、机会或能见度较高，但要懂得持盈。","宜把优势转化为责任和成果。","避免炫耀或过度占有。","持",["丰盛","资源","成果"]],
  [15,"地山谦","001000","谦受益","降低姿态反而能获得空间和支持。","宜虚心听取反馈，稳扎稳打。","避免急于证明自己。","谦",["谦逊","修正","低位"]],
  [16,"雷地豫","000100","顺势而乐","气氛被调动，适合鼓舞、启动和传播。","宜用愿景带动行动，让人愿意参与。","避免只有热闹没有执行。","振",["鼓舞","启动","传播"]],
  [17,"泽雷随","100110","随时而行","需要顺着变化调整，不宜固执己见。","宜观察新的主导力量，灵活跟进。","避免盲从或失去原则。","随",["跟随","适应","转换"]],
  [18,"山风蛊","011001","治旧成新","旧问题已经积累，需要清理根源。","宜复盘、修补制度、处理遗留问题。","避免只做表面粉饰。","治",["整顿","修复","根源"]],
  [19,"地泽临","110000","临近有为","机会正在靠近，适合指导、管理和照看。","宜主动靠近现场，给出清晰支持。","避免居高临下。","临",["靠近","管理","照看"]],
  [20,"风地观","000011","观而后动","现在最重要的是观察全局，看清结构。","宜拉开距离，寻找模式与信号。","避免凭局部信息下判断。","观",["观察","全局","洞察"]],
  [21,"火雷噬嗑","100101","咬合破阻","有硬结需要处理，必须明确规则和决断。","宜直面问题，拆除阻碍。","避免含糊其辞。","断",["决断","规则","破阻"]],
  [22,"山火贲","101001","文质相成","外在表达与内在实质都重要。","宜优化呈现，让价值被看见。","避免重包装轻内容。","饰",["表达","美化","呈现"]],
  [23,"山地剥","000001","剥落见底","旧结构正在松动，需要保核心、减消耗。","宜收缩战线，保护关键资源。","避免恋战。","退",["剥落","收缩","保底"]],
  [24,"地雷复","100000","一阳来复","低处已有转机，新力量还小，需保护。","宜从一个可坚持的小行动恢复节奏。","避免刚有转机就过度消耗。","复",["回归","复苏","转机"]],
  [25,"天雷无妄","100111","无妄守真","不要强作设计，回到真实和正当。","宜诚实面对事实，做该做之事。","避免投机和妄念。","正",["真实","正当","自然"]],
  [26,"山天大畜","111001","大畜蓄德","力量足但需约束，越能蓄，越能成大事。","宜沉淀能力，建立长期资产。","避免急于释放全部能量。","蓄",["大蓄","能力","长期"]],
  [27,"山雷颐","100001","养正则吉","重点在滋养、输入和基本盘。","宜调整饮食作息、信息输入和支持系统。","避免只消耗不补给。","养",["滋养","输入","基本盘"]],
  [28,"泽风大过","011110","大过需梁","压力超过常态，需要非常手段但要有支点。","宜找承重结构，先稳住关键梁柱。","避免独自硬扛。","撑",["过载","支点","非常"]],
  [29,"坎为水","010010","险中求信","处在风险或不确定之中，需稳步过坎。","宜确保底线安全，只处理最真实的问题。","避免赌一把式解决。","稳",["风险","底线","穿越"]],
  [30,"离为火","101101","明而不执","光明、表达和依附并存，需要看清也要有所依。","宜让信息透明，找到可靠依托。","避免被表象牵着走。","明",["清晰","表达","依附"]],
  [31,"泽山咸","001110","感而相应","关系中有感应，适合真诚触达。","宜柔和表达真实感受。","避免操控对方反应。","感",["感应","关系","触达"]],
  [32,"雷风恒","011100","久处见恒","重点在持续与稳定，不在一时强烈。","宜建立可长期执行的节奏。","避免三分钟热度。","恒",["持续","稳定","长期"]],
  [33,"天山遁","001111","知退为进","退不是输，是保存主动权。","宜退出无效战场，转入准备期。","避免因面子恋战。","遁",["退避","保存","转身"]],
  [34,"雷天大壮","111100","壮而有制","力量强盛，适合推进，但要守礼。","宜用强势完成突破，同时约束边界。","避免恃强凌弱。","壮",["强势","突破","约束"]],
  [35,"火地晋","000101","明出地上","能见度上升，适合晋升、展示和推进。","宜让成果被看见，争取正当机会。","避免浮躁求快。","晋",["上升","展示","机会"]],
  [36,"地火明夷","101000","藏明待时","光被遮蔽，才华或真实想法暂不宜外露。","宜保护自己，低调完成必要动作。","避免在不安全处暴露底牌。","藏",["受阻","隐藏","自保"]],
  [37,"风火家人","101011","各正其位","关系和组织需要各归其位。","宜明确职责，先把内部秩序理顺。","避免边界混乱。","齐",["家人","秩序","分工"]],
  [38,"火泽睽","110101","异中求同","分歧存在，但未必不能共处。","宜承认差异，寻找最小共识。","避免强求完全一致。","合",["分歧","差异","共识"]],
  [39,"水山蹇","001010","行难宜止","前路有阻，直接推进成本高。","宜绕路、求助、重新评估路线。","避免硬闯。","缓",["艰难","求助","绕行"]],
  [40,"雷水解","010100","解结脱困","紧绷局面开始松动，适合释放压力。","宜处理误会，解除不必要负担。","避免刚脱困就再造压力。","解",["松动","释放","脱困"]],
  [41,"山泽损","110001","有所损益","减法能带来真正收益。","宜删掉低价值消耗，集中核心。","避免舍不得无效成本。","减",["减法","取舍","聚焦"]],
  [42,"风雷益","100011","风雷相益","外部助力与内部行动相互增益。","宜主动投入，把资源转化为增长。","避免只等别人帮助。","益",["增益","投入","成长"]],
  [43,"泽天夬","111110","决而能和","到了决断时刻，但决断要正当。","宜公开说明立场，清理关键阻碍。","避免怒气式摊牌。","决",["决断","公开","清理"]],
  [44,"天风姤","011111","不期而遇","突然而来的相遇或机会，需要辨别。","宜保持开放，同时设好边界。","避免被新鲜感带走。","遇",["相遇","诱因","边界"]],
  [45,"泽地萃","000110","聚而成势","人、资源、注意力正在聚集。","宜建立共同场域，集中力量办一件事。","避免人多而散。","聚",["聚集","资源","场域"]],
  [46,"地风升","011000","积小而升","上升来自持续积累，不宜跳级。","宜一步一步向上走，争取稳定增长。","避免急功近利。","升",["成长","积累","上行"]],
  [47,"泽水困","010110","困中守心","资源受限或情绪受困，重点是守住心气。","宜减负、求援、保留核心行动。","避免把困境当成永久结论。","困",["受限","压力","守心"]],
  [48,"水风井","011010","井养不穷","价值在基础设施和长期供给。","宜修复系统，让资源稳定流出。","避免只追热点不修水源。","修",["系统","供给","基础"]],
  [49,"泽火革","101110","革故鼎新","旧方式已不适配，需要变革。","宜明确为什么变、怎么变、先变哪里。","避免为了变化而变化。","革",["变革","更新","转型"]],
  [50,"火风鼎","011101","鼎新成器","资源可被重新组合成新形态。","宜建立新结构，让能力成为作品。","避免只停留在想法层面。","成",["成器","结构","作品"]],
  [51,"震为雷","100100","震来有省","突发震动带来警醒，先稳住再行动。","宜快速响应，抓住提醒背后的信号。","避免被惊吓驱动。","醒",["震动","警醒","响应"]],
  [52,"艮为山","001001","止于其所","停止、定界、收心是当前要义。","宜暂停新增承诺，明确边界。","避免为了证明自己继续消耗。","止",["停止","边界","安定"]],
  [53,"风山渐","001011","渐进有序","事情需要循序渐进，不能越级。","宜建立阶段路线，慢慢取得信任。","避免跳过必要过程。","渐",["渐进","秩序","信任"]],
  [54,"雷泽归妹","110100","位不当慎","关系或合作中位置未正，需要谨慎。","宜看清身份、承诺和交换是否对等。","避免被暧昧结构绑定。","慎",["关系","位置","不对等"]],
  [55,"雷火丰","101100","盛大而明","局面丰盛热烈，但盛极需警醒。","宜趁高能量完成关键成果。","避免被热闹分散。","丰",["丰盛","高峰","照明"]],
  [56,"火山旅","001101","旅中守正","处在过渡和异地感中，不宜强求归属。","宜轻装前行，尊重当地规则。","避免把临时状态当永久归宿。","旅",["过渡","移动","适应"]],
  [57,"巽为风","011011","入而能化","柔顺渗透，比正面冲撞更有效。","宜慢慢进入系统，用持续影响改变局面。","避免软弱无主。","入",["渗透","柔顺","影响"]],
  [58,"兑为泽","110110","悦而有节","交流、愉悦、表达能带来连接。","宜用轻松方式打开关系与合作。","避免只图开心而失去原则。","悦",["交流","愉悦","表达"]],
  [59,"风水涣","010011","散而复聚","原有凝结正在散开，先疏通再重组。","宜释放压力、拆开纠缠、重新连接。","避免越乱越抓紧。","散",["疏散","释放","重组"]],
  [60,"水泽节","110010","节以成度","限制不是坏事，边界让行动可持续。","宜设规则、定预算、控节奏。","避免无节制消耗。","节",["节制","规则","边界"]],
  [61,"风泽中孚","110011","诚信感通","真正的信任来自内外一致。","宜坦诚表达，兑现小承诺。","避免话术大于真实。","信",["诚信","信任","一致"]],
  [62,"雷山小过","001100","小过可补","不宜大举推进，适合处理小处和细节。","宜小步修正，关注容易被忽略的地方。","避免小错滚成大错。","小",["细节","小步","修正"]],
  [63,"水火既济","101010","既成犹慎","事情已成或接近完成，最怕松懈。","宜复盘维护，守住完成后的秩序。","避免完成后立刻失控。","守",["完成","收束","维护"]],
  [64,"火水未济","010101","未成慎终","接近成形但尚未完成，细节决定成败。","宜逐项收口，让最后一段更稳。","避免提前庆祝或全盘否定。","收",["未完成","转化","收口"]]
].map(([id,name,pattern,phrase,state,action,avoid,posture,keywords]) => ({id,name,pattern,phrase,state,action,avoid,posture,keywords}));

const TOPICS = [
  { id:"career", name:"事业", words:["工作","职业","老板","同事","跳槽","面试","岗位","升职"], lens:"放到事业里看，重点不是一时得失，而是位置、资源和长期成长。" },
  { id:"project", name:"项目", words:["项目","产品","需求","创业","上线","版本","功能","用户","开发","codex"], lens:"放到项目里看，重点是先跑通闭环，再判断哪里值得加码。" },
  { id:"relationship", name:"关系", words:["关系","感情","喜欢","恋爱","朋友","家人","伴侣","靠近","分开","复合"], lens:"放到关系里看，重点是距离、边界、回应和真实感受。" },
  { id:"choice", name:"选择", words:["要不要","该不该","选择","还是","决定","方向","机会"], lens:"放到选择里看，重点是当前条件是否支持行动，以及哪种代价可以承担。" },
  { id:"emotion", name:"情绪", words:["焦虑","难受","迷茫","情绪","压力","烦","乱","累"], lens:"放到情绪里看，重点是先安顿自己，再处理外部问题。" },
  { id:"money", name:"财务", words:["钱","投资","收入","财务","成本","价格","买","卖"], lens:"放到财务里看，重点是风险边界、现金流和可承受损失。" },
  { id:"study", name:"学习", words:["学习","考试","论文","课程","研究","读书","技能"], lens:"放到学习里看，重点是输入结构、反馈周期和持续练习。" },
  { id:"general", name:"综合", words:[], lens:"放到当前处境里看，重点是看清时位，再决定进退。" }
];

const $ = (selector) => document.querySelector(selector);
const lineKinds = ["yin", "yang", "old-yin", "old-yang"];
const lineToBit = (line) => line === "yang" || line === "old-yang" ? "1" : "0";
const changedBit = (line) => line === "old-yang" ? "0" : line === "old-yin" ? "1" : lineToBit(line);
const historyKey = "guanshi-history-v2";
let currentReading = null;
let pendingQuestion = "";
let pendingTopic = null;
let clarificationAnswers = {};

function randomLine() { return lineKinds[Math.floor(Math.random() * lineKinds.length)]; }
function findHexagram(pattern) { return HEXAGRAMS.find((hexagram) => hexagram.pattern === pattern) || HEXAGRAMS[0]; }
function detectTopic(question) {
  const normalized = question.toLowerCase();
  return TOPICS.find((topic) => topic.words.some((word) => normalized.includes(word))) || TOPICS[TOPICS.length - 1];
}
function choosePosture(base, changed, changing) {
  if (changing === 0) return base.posture || "守";
  if (["坎为水","天地否","水山蹇","泽水困"].includes(base.name)) return "稳";
  if (["地雷复","地天泰","风雷益","火地晋"].includes(changed.name)) return "进";
  if (changing >= 4) return "变";
  return base.posture || "观";
}
function buildFramework(reading) {
  const { base, changed, topic, posture, changing } = reading;
  const forceVerb = changing >= 4 ? "剧烈转动" : changing >= 2 ? "正在转向" : changing === 1 ? "出现微变" : "相对稳定";
  const positionMap = {
    career: "你更像站在职业路径的判断点，需要看这个动作是否能提升长期位置。",
    project: "你更像站在项目结构的搭建处，需要先让闭环成立，再谈扩张。",
    relationship: "你更像站在关系距离的调节处，需要看清回应、边界和真实感受。",
    choice: "你更像站在岔路口，需要先分清可逆与不可逆的代价。",
    emotion: "你更像站在内在秩序的修复处，需要先安顿自己，再处理外部问题。",
    money: "你更像站在风险边界的确认处，需要先知道什么损失不可承受。",
    study: "你更像站在输入与反馈的循环处，需要靠持续练习校正方向。",
    general: "你更像站在局势的观察点，需要先看清时位，再决定进退。"
  };
  return {
    force: `本卦为「${base.name}」，局势底色是“${base.keywords.join("、")}”。变爻 ${changing} 个，说明局面${forceVerb}，变化方向落向「${changed.name}」。`,
    position: positionMap[topic.id] || positionMap.general,
    timing: `此时取“${posture}”为主，不急着给命运下结论，先判断当前姿态是否顺势。`,
    use: `${base.action} 这一步要落在「${topic.name}」这个场景里，先做小而真实的动作，再根据反馈调整。`
  };
}

function changingReading(changing) {
  const map = [
    ["无变：守其本位", "局势相对稳定，重点不是马上转向，而是把当前姿态做稳、做细、做完整。"],
    ["一爻变：微调即可", "变化已经露头，但力度还小。适合做轻量试探，不宜大幅改局。"],
    ["二爻变：方向可试", "内外已经有明显牵动，可以开始验证新方向，但要保留退路。"],
    ["三爻变：拉扯之中", "变化力量较复杂，容易同时想进、想退、想守。此时宜先分清主次。"],
    ["四爻变：局势多动", "变化较强，旧判断可能很快失效。不要固执原计划，先看新的结构。"],
    ["五爻变：大势将换", "多数爻已动，说明局面接近换框架。此时要保护核心，减少无谓消耗。"],
    ["六爻全变：旧局已尽", "全部爻都在变化，旧局很难按原样延续。与其修补细节，不如重新定义问题。"]
  ];
  const picked = map[changing] || map[0];
  return { title: picked[0], text: picked[1] };
}

function reflectionQuestion(reading) {
  const topicQuestions = {
    career: "你现在真正想争取的是更好的位置，还是只是想离开当前的不舒服？",
    project: "如果只能保留一个最小闭环，你会保留哪一步来证明它真的有价值？",
    relationship: "你期待的是对方回应你，还是期待自己终于不用再猜？",
    choice: "这个选择里，哪一个代价是你其实已经知道但不愿承认的？",
    emotion: "你现在最需要解决的是事情本身，还是身体和心先恢复稳定？",
    money: "如果结果不如预期，你能承受的最大损失到底是多少？",
    study: "你缺的是更多资料，还是一个可以每天执行的反馈节奏？",
    general: "你现在最该改变的是外部行动，还是看待问题的框架？"
  };
  return topicQuestions[reading.topic.id] || topicQuestions.general;
}

const CLARIFY_QUESTIONS = {
  career: [
    { id: "intent", text: "你现在更接近哪种状态？", options: ["主动争取", "想离开", "先观望"] },
    { id: "block", text: "最大的阻力来自哪里？", options: ["能力资源", "人际关系", "外部机会"] },
    { id: "priority", text: "你最看重什么？", options: ["稳定", "成长", "收入"] }
  ],
  project: [
    { id: "stage", text: "这个项目现在处在哪一段？", options: ["刚有想法", "已经能用", "需要推广"] },
    { id: "risk", text: "最大的不确定性是什么？", options: ["需求真假", "体验好坏", "执行成本"] },
    { id: "next", text: "你最想验证什么？", options: ["用户愿不愿意用", "功能是否跑通", "是否值得继续投入"] }
  ],
  relationship: [
    { id: "relation", text: "你们现在是什么关系？", options: ["暧昧试探", "稳定关系", "疏远拉扯"] },
    { id: "block", text: "当前最大卡点是什么？", options: ["回应不清", "距离变化", "信任受损"] },
    { id: "wish", text: "你心里更想要什么？", options: ["靠近", "确认", "放下"] }
  ],
  choice: [
    { id: "choice", text: "这个选择更像什么？", options: ["进退选择", "左右比较", "是否开始"] },
    { id: "cost", text: "你最担心哪种代价？", options: ["时间", "关系", "机会"] },
    { id: "reversible", text: "这个决定可逆吗？", options: ["基本可逆", "很难回头", "不确定"] }
  ],
  emotion: [
    { id: "duration", text: "这种状态持续多久了？", options: ["刚出现", "一段时间", "反复很久"] },
    { id: "source", text: "主要来源是什么？", options: ["人际", "事情", "身体节奏"] },
    { id: "need", text: "你现在最需要什么？", options: ["安定", "行动", "倾诉"] }
  ],
  money: [
    { id: "move", text: "这更像哪类财务问题？", options: ["是否投入", "是否止损", "如何分配"] },
    { id: "risk", text: "你最担心什么？", options: ["亏损", "错过", "现金流"] },
    { id: "limit", text: "你有没有设上限？", options: ["有明确上限", "大概有", "还没有"] }
  ],
  study: [
    { id: "stage", text: "学习现在卡在哪里？", options: ["开始困难", "坚持困难", "方法不清"] },
    { id: "feedback", text: "你现在有反馈吗？", options: ["有清晰反馈", "反馈很慢", "几乎没有"] },
    { id: "goal", text: "目标更偏向什么？", options: ["考试结果", "能力提升", "长期研究"] }
  ],
  general: [
    { id: "state", text: "你现在更像处于什么状态？", options: ["想推进", "想等待", "想转向"] },
    { id: "block", text: "最卡住你的是什么？", options: ["信息不足", "资源不足", "心里没定"] },
    { id: "need", text: "你最需要卦帮你看什么？", options: ["当前处境", "下一步", "风险边界"] }
  ]
};

function getClarifyQuestions(topic) {
  return CLARIFY_QUESTIONS[topic.id] || CLARIFY_QUESTIONS.general;
}

function buildContextText(topic, answers) {
  const questions = getClarifyQuestions(topic);
  return questions.map((question) => `${question.text}${answers[question.id] || "未选择"}`).join("；");
}

function renderClarification(question) {
  pendingQuestion = question;
  pendingTopic = detectTopic(question);
  clarificationAnswers = {};
  const questions = getClarifyQuestions(pendingTopic);
  $("#clarifyTopic").textContent = `识别为：${pendingTopic.name}`;
  $("#clarifyCard").hidden = false;
  $("#primaryActionText").textContent = "起卦";
  $("#clarifyList").innerHTML = questions.map((question) => `
    <div class="clarify-question" data-question-id="${question.id}">
      <strong>${question.text}</strong>
      <div class="option-row">
        ${question.options.map((option) => `<button type="button" data-option="${option}">${option}</button>`).join("")}
      </div>
    </div>
  `).join("");
  document.querySelectorAll(".clarify-question button").forEach((button) => {
    button.addEventListener("click", () => {
      const wrapper = button.closest(".clarify-question");
      const id = wrapper.dataset.questionId;
      clarificationAnswers[id] = button.dataset.option;
      wrapper.querySelectorAll("button").forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
    });
  });
  $("#clarifyCard").scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetClarification() {
  pendingQuestion = "";
  pendingTopic = null;
  clarificationAnswers = {};
  $("#clarifyCard").hidden = true;
  $("#primaryActionText").textContent = "继续";
}

function topicAdvice(topic, posture) {
  const map = {
    career: [`先确认这个动作是否提升你的长期位置。`, `用一个可见成果证明自己，而不是只解释想法。`, `姿态上取“${posture}”，但要保留职业边界。`],
    project: [`先做最小闭环，让用户真实走完一次。`, `把不确定点拆成一个能验证的小实验。`, `姿态上取“${posture}”，优先修正最影响体验的一环。`],
    relationship: [`先看对方有没有真实回应，再决定靠近的尺度。`, `把边界说清楚，比猜测更有用。`, `姿态上取“${posture}”，不要用焦虑替对方做决定。`],
    choice: [`列出可逆与不可逆的代价。`, `先选一个低成本验证动作。`, `姿态上取“${posture}”，别急着把所有门一次关上。`],
    emotion: [`先把睡眠、饮食、节奏稳住。`, `把问题写下来，分清事实和想象。`, `姿态上取“${posture}”，先安身再谋事。`],
    money: [`先设好损失上限。`, `不要用情绪做财务决定。`, `姿态上取“${posture}”，现金流和风险边界优先。`],
    study: [`把目标拆成每天能完成的练习。`, `用反馈修正方法，不靠意志硬撑。`, `姿态上取“${posture}”，重在持续。`],
    general: [`先分清什么能控制，什么只能观察。`, `做一个最小、真实、可复盘的行动。`, `姿态上取“${posture}”，顺势而不失主心。`]
  };
  return map[topic.id] || map.general;
}
function createReading(question, context = "") {
  const lines = Array.from({ length: 6 }, randomLine);
  const base = findHexagram(lines.map(lineToBit).join(""));
  const changed = findHexagram(lines.map(changedBit).join(""));
  const changing = lines.filter((line) => line.includes("old")).length;
  const topic = pendingTopic || detectTopic(question);
  const posture = choosePosture(base, changed, changing);
  return { question, context, lines, base, changed, changing, topic, posture, createdAt: new Date().toLocaleString("zh-CN") };
}
function render(reading) {
  currentReading = reading;
  $("#baseName").textContent = reading.base.name;
  $("#posture").textContent = reading.posture;
  $("#phrase").textContent = reading.base.phrase;
  $("#topicName").textContent = `场景 ${reading.topic.name}`;
  $("#changedCount").textContent = `变爻 ${reading.changing}`;
  $("#changedName").textContent = `变卦 ${reading.changed.name}`;
  $("#asked").textContent = reading.context ? `${reading.question}｜${reading.context}` : reading.question;
  $("#oneLine").textContent = `${reading.base.phrase} ${reading.topic.lens}`;
  $("#stateTitle").textContent = reading.base.name;
  $("#stateText").textContent = `${reading.base.state}${reading.topic.lens}`;
  $("#trendTitle").textContent = reading.changed.name;
  $("#trendText").textContent = `变化指向「${reading.changed.name}」：${reading.changed.state}`;
  const framework = buildFramework(reading);
  const change = changingReading(reading.changing);
  $("#forceText").textContent = framework.force;
  $("#positionText").textContent = framework.position;
  $("#timingText").textContent = framework.timing;
  $("#useText").textContent = framework.use;
  $("#changeTitle").textContent = change.title;
  $("#changeText").textContent = change.text;
  $("#reflectionQuestion").textContent = reflectionQuestion(reading);
  $("#adviceTitle").textContent = reading.posture;
  $("#avoidText").textContent = reading.base.avoid;
  const advices = [reading.base.action, ...topicAdvice(reading.topic, reading.posture)];
  $("#adviceList").innerHTML = advices.map((item) => `<li>${item}</li>`).join("");
  $("#hexagram").innerHTML = [...reading.lines].reverse().map((line) => {
    const isYang = line === "yang" || line === "old-yang";
    const isChanging = line === "old-yin" || line === "old-yang";
    return `<div class="hex-line"><span class="${isYang ? "solid" : "broken"}"></span>${isChanging ? "<b>变</b>" : "<span></span>"}</div>`;
  }).join("");
}
function getHistory() {
  try { return JSON.parse(localStorage.getItem(historyKey) || "[]"); } catch { return []; }
}
function saveHistory(reading) {
  const item = { question: reading.context ? `${reading.question}｜${reading.context}` : reading.question, base: reading.base.name, changed: reading.changed.name, posture: reading.posture, topic: reading.topic.name, createdAt: reading.createdAt };
  localStorage.setItem(historyKey, JSON.stringify([item, ...getHistory()].slice(0, 6)));
  renderHistory();
}
function renderHistory() {
  const list = getHistory();
  $("#historyList").innerHTML = list.length ? list.map((item) => `<div class="history-item"><b>${item.base} → ${item.changed}｜${item.posture}｜${item.topic}</b><p>${item.question}</p></div>`).join("") : `<div class="history-item"><p>还没有记录。完成一次起卦后会出现在这里。</p></div>`;
}
function castFromInput() {
  const question = $("#question").value.trim() || "我当下最应该看见什么？";
  $("#question").value = question;
  if (!pendingQuestion || pendingQuestion !== question) {
    renderClarification(question);
    return;
  }
  const context = buildContextText(pendingTopic, clarificationAnswers);
  const reading = createReading(question, context);
  render(reading);
  saveHistory(reading);
  resetClarification();
  document.querySelector(".reading").scrollIntoView({ behavior: "smooth", block: "start" });
}
function copyCurrent() {
  if (!currentReading) return;
  const advice = [currentReading.base.action, ...topicAdvice(currentReading.topic, currentReading.posture)].join("\n- ");
  const framework = buildFramework(currentReading);
  const change = changingReading(currentReading.changing);
  const text = `观势问卦\n问题：${currentReading.question}\n补充：${currentReading.context || "未补充"}\n场景：${currentReading.topic.name}\n本卦：${currentReading.base.name}\n变卦：${currentReading.changed.name}\n姿态：${currentReading.posture}\n一句话：${currentReading.base.phrase}\n势：${framework.force}\n位：${framework.position}\n时：${framework.timing}\n用：${framework.use}\n变爻：${change.title}，${change.text}\n最后一问：${reflectionQuestion(currentReading)}\n建议：\n- ${advice}`;
  navigator.clipboard?.writeText(text).then(() => { $("#copyResult").textContent = "已复制"; setTimeout(() => $("#copyResult").textContent = "复制结果", 1200); });
}

document.querySelectorAll(".examples button").forEach((button) => button.addEventListener("click", () => { $("#question").value = button.textContent; }));
$("#questionForm").addEventListener("submit", (event) => { event.preventDefault(); castFromInput(); });
$("#recast").addEventListener("click", () => {
  if (!pendingQuestion) renderClarification($("#question").value.trim() || currentReading?.question || "我当下最应该看见什么？");
  else castFromInput();
});
$("#resetClarify").addEventListener("click", resetClarification);
$("#copyResult").addEventListener("click", copyCurrent);
$("#clearHistory").addEventListener("click", () => { localStorage.removeItem(historyKey); renderHistory(); });
render(createReading($("#question").value.trim()));
renderHistory();
