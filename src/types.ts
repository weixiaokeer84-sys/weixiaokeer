export interface ExamQuestion {
  id: string;
  subject: string; // 技术实务 | 综合能力 | 案例分析
  year: string;    // e.g., "2024年真题" | "2023年真题"
  type: string;    // "单选题" | "多选题" | "简答题"
  question: string;
  options: string[]; // Options for choice type
  answer: string;    // e.g., "A" or "A,B"
  explanation: string;
  majorCode?: string; // 建筑设计防火规范 GB50016 等
}

export interface VideoLesson {
  id: string;
  title: string;
  lecturer: string;
  duration: string;
  category: string;
  views: string;
  outline: string[];
}

export interface WeeklySchedule {
  week: number;
  title: string;
  focus: string;
  dailyTwoHoursPlan: string[];
  mockExamReminder: string;
}

export interface PunchCard {
  date: string; // YYYY-MM-DD
  minutesStudied: number;
  punched: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlockedAtStreak: number;
}

// 1. High-fidelity Past Exam Questions (中国大陆一级注册消防工程师真题)
export const SEED_QUESTIONS: ExamQuestion[] = [
  {
    id: "q1",
    subject: "消防安全技术实务",
    year: "2024年真题",
    type: "单选题",
    question: "某高层病房楼，设有自动喷水灭火系统和防排烟系统，建筑高度为 36m。关于该建筑消防电梯设置的说法，正确的是（ ）。",
    options: [
      "A. 消防电梯的前室使用面积不应小于 6.0㎡",
      "B. 消防电梯井与相邻电梯井之间相互连通的门应采用甲级防火门",
      "C. 消防电梯的排水泵排水量不应小于 10L/s",
      "D. 消防电梯从首层至顶层的运行时间不应大于 60s"
    ],
    answer: "D",
    explanation: "根据《建筑设计防火规范》GB 50016-2014（2018年版）第7.3.8条：消防电梯的井底应设置排水设施，排水井的容量不应小于2m³，排水泵的排水量不应小于10L/s（高层病房楼、老年人照料设施等不应小于10L/s，其他不应小于5L/s），C选项未指明具体位置或有些混淆；第7.3.5条：消防电梯前室的使用面积公共建筑不应小于6.0㎡，但病房楼属于合用前室时有更高要求，如果是住宅或者合用则应区分（合用前室不小于10.0㎡，养老/病房不小于12.0㎡）；第7.3.6条：消防电梯井、机房与相邻电梯井、机房之间应设置耐火极限不低于2.00h的防火隔墙，隔墙上的门应采用甲级防火门，不应存在相互直接连通的普通门（B错）；第7.3.8条消防电梯的行驶速度，应按从首层到顶层的运行时间不超过60s计算，故D正确。",
    majorCode: "GB 50016 第7.3条"
  },
  {
    id: "q2",
    subject: "消防安全技术实务",
    year: "2024年真题",
    type: "单选题",
    question: "某甲类液体厂房，地上 3 层，层高 5m。关于该厂房防爆设计的说法，错误的是（ ）。",
    options: [
      "A. 厂房的承重结构不应采用砖混结构，应采用钢筋混凝土或钢结构",
      "B. 厂房的防爆泄压设施应避开人员密集场所和主要交通道路",
      "C. 泄压窗可以采用普通双层中空玻璃以提高保温性能",
      "D. 厂房内不应设置办公室、休息室，确需贴邻本厂房时用耐火极限不低于3.00h的防爆隔墙"
    ],
    answer: "C",
    explanation: "根据《建筑设计防火规范》GB 50016 防爆要求：泄压设施应采用轻质屋面板、轻质墙体和易于泄压的门、窗等，不应采用普通双层中空硬质玻璃，因为其破碎后可能形成碎片伤人，且不易泄压，导致防爆失效，应当采用安全玻璃、易碎多孔材料等。故C错误，符合题意。",
    majorCode: "GB 50016 第3.6条"
  },
  {
    id: "q3",
    subject: "消防安全技术综合能力",
    year: "2023年真题",
    type: "单选题",
    question: "对某多层旅馆进行消防安全检查。下列关于该旅馆疏散通道和安全出口的检查结果中，符合现行国家标准的是（ ）。",
    options: [
      "A. 位于两个安全出口之间的疏散门至最近安全出口的距离为 45m，旅馆设置自动喷水灭火系统",
      "B. 疏散走道上设置了控制人员随意出入的机械锁锁闭大门",
      "C. 疏散走道的净宽度为 1.0m",
      "D. 安全出口采用向疏散方向开启的平开门，且出口处设置了 1 级台阶"
    ],
    answer: "A",
    explanation: "疏散走道的疏散门、疏散走道狭窄一般公共建筑不应小于1.1m（C错）；安全出口和疏散门在疏散走道1.4m内不应设置台阶，尤其是出口处不应有普通坎级台阶，极易造成踩踏（D错）；疏散走道上不应锁定，妨碍安全疏散（B错）；根据GB 50016 表5.5.17，多层旅馆（一二级耐火等级）双向疏散最大距离为40m，当建筑内全部设置自动喷水灭火系统时，疏散距离可按规定增加25%，即40 * 1.25 = 50m，45m小于50m，符合要求，故A正确。",
    majorCode: "GB 50016 表5.5.17"
  },
  {
    id: "q4",
    subject: "消防安全技术综合能力",
    year: "2023年真题",
    type: "多选题",
    question: "某高层写字楼，建筑高度为 54m，地上 15 层，地下 2 层。对其闭式自动喷水灭火系统进行检测，下列检查得出的参数中，符合现行国家规范要求的有（ ）。【多选题】",
    options: [
      "A. 喷头采用的是响应时间指数 RTI ≤ 50(m·s)^0.5 的快速响应喷头",
      "B. 湿式报警阀组距地面的高度安装为 1.2m，两侧与墙的距离不小于 0.5m",
      "C. 水力警铃与湿式报警阀相接的配管，管径为 20mm，其总长度为 25m",
      "D. 闭式系统最末端喷头的工作压力不应低于 0.05MPa",
      "E. 湿式系统在末端试水装置处放水后 5min 内自动启泵"
    ],
    answer: "A,B,D,E",
    explanation: "根据《自动喷水灭火系统设计规范》及施工检验标准：湿式报警阀组安装距地面高度宜为1.2m，两侧与墙的距离不应小于0.5m（B正确）；快速响应喷头RTI小于等于50（A正确）；最不利点洒水喷头的工作压力不应低于0.05MPa（D正确）；湿式报警阀系统开启放水后，压力开关应动作，在5min内消防泵自动重联动（E正确）。水力警铃配管长度：水力警铃与报警阀相接的管道，管径应为20mm，总长度不宜大于20m，而不是25m。因此C错误，应选 A,B,D,E。",
    majorCode: "GB 50974 / GB 50084"
  },
  {
    id: "q5",
    subject: "消防安全案例分析",
    year: "2022年真题",
    type: "简答题",
    question: "【案例大题节选】某大型综合商城地上4层，地下1层。地下一层为汽车库及设备用房，地上各层均为百货百货。某日进行维保测试，技术人员开启了消防水泵，但发现末端试水装置压力表持续波动却不自动启泵。请简析该消防水泵无法正常联动启泵的可能原因。",
    options: [
      "请按照步骤在作答框写出故障排查步骤。AI将为您评分并分析。"
    ],
    answer: "1",
    explanation: "一消案例分析标准得分点：\n1. 压力开关故障或未接线/接线松动。\n2. 联动控制器处于‘手动’状态而非‘自动’状态。\n3. 泵控制柜处于手动挡状态。\n4. 稳压泵压力设定点不正确或稳压系统长期漏水而泵未随动。\n5. 消防水泵吸水管阀门关闭，或水流指示器、信号阀未连锁控制。",
    majorCode: "案例大题主观题"
  }
];

// 2. Expert Video Lessons (名师精讲课程)
export const GURU_VIDEOS: VideoLesson[] = [
  {
    id: "v1",
    title: "1.01 生产和储存物品的火灾危险性分类（实务一）",
    lecturer: "肖宏法（一消首席名师）",
    duration: "45分00秒",
    category: "技术实务",
    views: "18.2万",
    outline: [
      "生产火灾危险性分类原则",
      "甲、乙、丙、丁、戊类特征指标详解",
      "闪点 28℃ 与 60℃ 两大核心临界点背诵口诀",
      "交叉判定规则与一消常考陷阱"
    ]
  },
  {
    id: "v2",
    title: "1.02 建筑耐火等级的划分与隔墙耐火极限（实务二）",
    lecturer: "包建华（顶级安全规范专家）",
    duration: "48分30秒",
    category: "技术实务",
    views: "12.4万",
    outline: [
      "一级、二级、三级、四级耐火等级对应构件",
      "防火墙、承重墙耐火极限核心指标（3.00h、2.00h、2.50h）",
      "钢结构防火阻燃涂料现场检测要点"
    ]
  },
  {
    id: "v3",
    title: "2.01 湿式报警阀组结构组件功用与现场检测（综合一）",
    lecturer: "宋莉雯（消防自动施教名师）",
    duration: "52分15秒",
    category: "综合能力",
    views: "15.0万",
    outline: [
      "湿式系统的主要组件及其安装规范要求",
      "水力警铃、压力开关、延迟器的现场实物结构讲解",
      "末端试水装置放水测试步骤（五步法，一消高频考点）"
    ]
  },
  {
    id: "v4",
    title: "3.01 百货商场防火分区及安全疏散距离实战分析（案例一）",
    lecturer: "高天雄（案例大主攻手）",
    duration: "55分40秒",
    category: "案例分析",
    views: "9.8万",
    outline: [
      "商场大空间防火分区划分算术基础（不加喷淋 2500㎡，加喷淋 5000㎡，高层 1500㎡/3000㎡）",
      "案例大题精细剖析与标本式踩分点解析"
    ]
  }
];

// 3. Weekly study program (制定详细的周计划和月度模拟考提醒)
export const STUDY_ROADMAP: WeeklySchedule[] = [
  {
    week: 1,
    title: "第一周：厂房仓库防火基本功 & 建规突击",
    focus: "攻克《实务》第一、二篇：火灾危险类、厂房防火防爆标准。",
    dailyTwoHoursPlan: [
      "学习 60 分钟：肖宏法老师生产火灾危险性精讲视频。",
      "强化背诵 30 分钟：闪点 28℃、60℃ 厂房物质分类对照表与背书口诀。",
      "真题演练 30 分钟：做 15 道 2021-2024 年一级消防技术实务真题并精读解析。"
    ],
    mockExamReminder: "下一次月度全真模拟考试计划于 2026年6月28日 进行，届时系统会锁定模拟真题库，请按进度按时备考。"
  },
  {
    week: 2,
    title: "第二周：水灭火系统与给水栓组件（硬核重灾区）",
    focus: "攻克《实务》第三篇常用消防给水、消火栓与自喷系统部件原理。",
    dailyTwoHoursPlan: [
      "学习 60 分钟：水系统与自喷湿式报警阀组组件动作原理解剖视频。",
      "强化背诵 30 分钟：自喷放水参数、报警阀进出口径、水力警铃配管长度要求。",
      "真题演练 30 分钟：专项练习 综合能力 自喷检测题并同步记录进错题本。"
    ],
    mockExamReminder: "距离月度模拟考（6月28日）还有 21 天，保持状态，筑牢防线！"
  },
  {
    week: 3,
    title: "第三周：防排烟与火灾自动报警系统联控机制",
    focus: "防排烟风机、风量、报警系统控制器两路电源联动要求。",
    dailyTwoHoursPlan: [
      "学习 60 分钟：火灾自动报警系统联动公式核心考点讲解视频。",
      "强化背诵 30 分钟：防烟楼梯间压力值（40-50Pa）与前室压力值（25-30Pa）。",
      "真题演练 30 分钟：真题大冲刺 20 道选择题并开启 AI 智能错题诊断。"
    ],
    mockExamReminder: "距离月度模拟考（6月28日）还有 14 天，案例题型即将开启全真模拟！"
  },
  {
    week: 4,
    title: "第四周：高频案例诊断与主观大题标准话术",
    focus: "案例分析大题答题框架、找错纠错高分字眼训练。",
    dailyTwoHoursPlan: [
      "学习 60 分钟：高天雄老师大型商百、厂房、多层酒店高危案例分析主观题大通盘。",
      "强化背诵 30 分钟：背诵通用找错大词（如‘未采用防爆墙贴邻’、‘合用前室使用面积不合规’）。",
      "真题演练 30 分钟：默写完成一道完整的案例大真题，对照客观给分点打分。"
    ],
    mockExamReminder: "月度模拟考就在本周末（6月28日 09:00 - 11:30），届时请准备好专用模拟白纸。"
  }
];

// 4. Default badging milestones
export const ACHIEVEMENT_BADGES: Badge[] = [
  {
    id: "b1",
    name: "见习消防员",
    description: "首次注册并建立个人学习规划账户",
    iconName: "ShieldAlert",
    unlockedAtStreak: 0
  },
  {
    id: "b2",
    name: "防消结合卫士",
    description: "累计连续打卡打满 3 天",
    iconName: "Flame",
    unlockedAtStreak: 3
  },
  {
    id: "b3",
    name: "灭火救援指挥官",
    description: "累计连续打卡打满 5 天，作答正确率保持在 60% 以上",
    iconName: "Award",
    unlockedAtStreak: 5
  },
  {
    id: "b4",
    name: "筑牢防线总监",
    description: "连续打卡 7 天以上，成功生成一次 AI 阶段测试报告",
    iconName: "Compass",
    unlockedAtStreak: 7
  }
];
