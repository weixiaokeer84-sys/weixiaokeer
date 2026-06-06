import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined. AI functions will run in simulation mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// 1. API: Analyze Wrong Question (错题智能分析)
app.post("/api/analyze-mistake", async (req, res) => {
  const { question, subject, wrongAnswer, correctAnswer, explanation } = req.body;

  if (!question) {
    res.status(400).json({ error: "Missing question content" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return simulated smart analysis if key is not configured
    setTimeout(() => {
      res.json({
        success: true,
        data: `### 🔴 一消消防考点智能诊断 [模拟模式]

**1. 核心考点定位**：
本题考察《建筑设计防火规范》(GB50016) 的重点考点：**厂房与仓库的火灾危险性分类**。

**2. 错因诊断**：
您选择了 **"${wrongAnswer || '无'}"**，正确答案为 **"${correctAnswer}"**。通常这里的混淆点是对“闪点小于28℃的液体”（甲类）和“闪点大于等于28℃但小于60℃的液体”（乙类）的临界点区分不清，或者没有注意到生产过程中产生的废弃物所带来的附加火灾危害。

**3. 一消名师独家口诀（助记法）**：
> 💡 *“甲闪廿八（28）乙六十，丙类闪点六十起；物质遇水能爆炸，甲类仓库牢牢记。”*

**4. 针对性备考建议**：
* 重点复习《消防安全技术实务》第二篇第二章。
* 每天花10分钟默写“甲、乙、丙、丁、戊”五类生产火灾危险性分类特征表。
* 将本错题加入错题本，3天后进行二次重做。`
      });
    }, 800);
    return;
  }

  try {
    const ai = getGeminiClient();
    const prompt = `您是一位专业的中国大陆注册一级消防工程师（一消）王牌讲师和备考规划总监。
请针对考生的以下这道错题进行深度的智能考点分析，使用极度亲切、专业、符合中国一消考试特色的语气讲解。
请结合中国消防法律法规或核心国家规范（如《建筑设计防火规范》GB 50016、《消防给水及消火栓系统技术规范》GB 50974等）进行剖析。

【科目】: ${subject || "消防安全技术实务"}
【题目】: ${question}
【考生错选】: ${wrongAnswer || "未选/空白"}
【正确答案】: ${correctAnswer}
【标准解析】: ${explanation || "暂无"}

请按以下格式生成结构化的纯 Markdown 诊断分析：
### 🔴 一消消防考点智能诊断

**1. 核心国标与考点定位**：
(指出本题出自哪部规范、具体条款、讲解考查的核心知识点)

**2. 错因精准剖析**：
(精简解释为什么考生会选错"${wrongAnswer}"，以及正确答案"${correctAnswer}"的法理/物理依据)

**3. 一消名师独家口诀助记**：
(针对本考点，自创或提供一段好记、押韵、顺口的记忆口诀，方便一消考生快速拿分)

**4. 接下来2小时专项攻坚建议**：
(具体可执行的复习指引，指出应该看哪本书、哪个章节或做哪类练习)

请不要胡说八道。语气要严谨、干练，减少冗长废话。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ success: true, data: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "AI analysis failed", details: error.message });
  }
});

// 2. API: Generate Periodical Test Report (阶段性测试报告)
app.post("/api/generate-report", async (req, res) => {
  const { 
    weeklyHours, 
    answeredCount, 
    accuracyRate, 
    practicalAccuracy, 
    comprehensiveAccuracy, 
    caseAccuracy, 
    weakSubjects, 
    punchedDays 
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return simulated report
    setTimeout(() => {
      res.json({
        success: true,
        data: `### 📊 一消智能阶段性评估诊断报告 [模拟模式]

本报告基于您本阶段累计打卡 **${punchedDays || 5}天**、共计学习约 **${weeklyHours || 10}小时**、练习 **${answeredCount || 42}道** 历年真题的精准数据生成：

#### 📈 1. 备考实力多维画像
* **各科目学习实力评估**：
  * **《消防安全技术实务》**：较好（正确率 **${practicalAccuracy || 70}%**）。概念理解扎实，防火分区和疏散距离掌握良好。
  * **《消防安全技术综合能力》**：中等（正确率 **${comprehensiveAccuracy || 60}%**）。消防设施检测及安装规范记忆略含糊，需要加强对检测年限、压强参数的硬记。
  * **《消防安全案例分析》**：较弱（正确率 **${caseAccuracy || 50}%**）。解答主观题时，标准规范用语不够精确，缺乏“结构性作答”思维。

#### 🔍 2. 备考薄弱环节洞察
* 您的主要丢分区集中在：**${weakSubjects?.join("、") || "建筑防火分类、自动喷水灭火系统动作原理"}**。
* 主要表现为“听名师课懂，自己做真题懵”，对中国建规与水规的交叉细节掌握不牢靠。

#### 📅 3. 下阶段（周级别）两小时学习对策
* **第1-3天（强化理论）**：每天抽出1小时对 ${weakSubjects?.[0] || "高频错题考点"} 的核心规范条文进行默写。
* **第4-5天（实战提速）**：每天做20道对应的章节真题，并重点阅读标准答案中的“法条引用”。
* **周末（案例演练）**：强迫自己进行一次无书面参考的《案例分析》真题模拟，并在系统纠错本里做好分类。

**🏆 寄语**：*一消考试不是比智商，而是比耐力和规范熟悉度。每天两小时，筑起您的一消通关防火墙！加油！*`
      });
    }, 1000);
    return;
  }

  try {
    const ai = getGeminiClient();
    const prompt = `您是一位中国大陆一级注册消防工程师（一消）王牌线上私教，请为该考生出具一份专业的、结构极其清晰、具有强烈引导力的阶段性学习测试报告。
考生目前的数据指标如下：
- 本阶段每日平均学习时间：约 2 小时
- 累计已打卡天数：${punchedDays || 0} 天
- 累计作答真题数：${answeredCount || 0} 题
- 综合正确率：${accuracyRate || 0}%
- 各科目正确率：技术实务 ${practicalAccuracy || 0}%，综合能力 ${comprehensiveAccuracy || 0}%，案例分析 ${caseAccuracy || 0}%
- 主要薄弱环节：${weakSubjects?.join("、") || "建筑防火分类、消火栓系统参数"}

请结合一级消防工程师备考“两实务一案例”三科并立的客观现实，按以下框架给出纯 Markdown 测试报告：

### 📊 一消智能阶段性诊断测试评估报告

#### 📌 一、 核心战力雷达诊断
(分析技术实务、综合能力和案例分析的配合度。指出案例分析考试是一消的“拦路虎”，它是实务与综合能力的集大成者。分析其正确率，并给出阶段评级如“稳步上升”、“查漏补缺期”、“拉响红色警报”等)

#### 🔍 二、 薄弱要害深度剖析
(精准评估学员提供的薄弱考点 [${weakSubjects?.join("、") || "无"}]，从一消实操和规范考试出题人角度分析为什么这里难学，并给出最少两句一消行内广为人知的背诵顺口溜或名师点拨)

#### 🚀 三、 每日2小时黄金学习周对策
(提供一个详细的后续每日2小时学习时间表，保证高效。比如前1.5小时输入什么核心规范GB条例，后0.5小时做真题、复习错题本等)

#### 📅 四、 模拟考倒计时与心理防线
(给出一个坚定、温暖的建议，激励考生在下周继续坚持打卡)"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ success: true, data: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "AI Report generation failed", details: error.message });
  }
});

// Serve frontend assets
const distPath = path.join(process.cwd(), "dist");

// Vite integration / Static file serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware mounted.");
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static production files serving from", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[一级消防工程师智能学习助手] Backend listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
