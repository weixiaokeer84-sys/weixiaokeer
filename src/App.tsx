import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Tv,
  CheckCircle,
  Calendar,
  Award,
  Activity,
  Cloud,
  CloudOff,
  ShieldCheck,
  AlertCircle,
  Trash2,
  Play,
  Sparkles,
  Smartphone,
  Tablet,
  Laptop,
  ChevronRight,
  Clock,
  Timer,
  Check,
  RotateCw,
  BookMarked,
  ArrowRight,
  User,
  Heart,
  Settings,
  HelpCircle
} from "lucide-react";
import {
  SEED_QUESTIONS,
  GURU_VIDEOS,
  STUDY_ROADMAP,
  ACHIEVEMENT_BADGES,
  ExamQuestion,
  VideoLesson,
  WeeklySchedule
} from "./types";

export default function App() {
  // --- View Framework Controls ---
  const [deviceMode, setDeviceMode] = useState<"desktop" | "ios" | "android">("desktop");
  const [activeTab, setActiveTab] = useState<"roadmap" | "quiz" | "lecture" | "mistake" | "stats">("roadmap");

  // --- Network-database Sync states ---
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced");
  const [syncMessage, setSyncMessage] = useState<string>("数据已安全备份至云端消防数据库");

  // --- Interactive Q&A (真题练习) states ---
  const [questions, setQuestions] = useState<ExamQuestion[]>(SEED_QUESTIONS);
  const [subjectFilter, setSubjectFilter] = useState<string>("全部");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedMultipleOptions, setSelectedMultipleOptions] = useState<string[]>([]);
  const [essayAnswer, setEssayAnswer] = useState<string>("");
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  // --- Wrong Questions Database (错题本) State ---
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>(["q2", "q3"]); // Default seeded wrong questions
  const [activeWrongIndex, setActiveWrongIndex] = useState<number>(0);
  const [isAnalyzingMistake, setIsAnalyzingMistake] = useState<boolean>(false);
  const [mistakeAiResponse, setMistakeAiResponse] = useState<string | null>(null);

  // --- Master Video Player simulator states ---
  const [videos, setVideos] = useState<VideoLesson[]>(GURU_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson>(GURU_VIDEOS[0]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playProgress, setPlayProgress] = useState<number>(15); // Percentage simulated

  // --- Daily Punch / Gamification (打卡与状态) states ---
  const [currentStreak, setCurrentStreak] = useState<number>(4);
  const [punchedDates, setPunchedDates] = useState<string[]>([
    "2026-06-02",
    "2026-06-03",
    "2026-06-04",
    "2026-06-05"
  ]);
  const [isTodayPunched, setIsTodayPunched] = useState<boolean>(false);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(["b1", "b2"]);

  // --- 2-Hour Daily Timer states ---
  const [timerMinutes, setTimerMinutes] = useState<number>(120);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerPhase, setTimerPhase] = useState<"lecture" | "reciting" | "quiz">("lecture");

  // --- Phase Report Generator states ---
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [reportResult, setReportResult] = useState<string | null>(null);

  // Filtered real questions
  const filteredQuestions = questions.filter(
    (q) => subjectFilter === "全部" || q.subject === subjectFilter
  );

  // Sync state management
  const triggerManualSync = () => {
    if (offlineMode) return;
    setSyncStatus("syncing");
    setSyncMessage("正在同步错题本与打卡数据...");
    setTimeout(() => {
      setSyncStatus("synced");
      setSyncMessage("重现多端多端云同步！数据已同步至 2026-06-06 最新节点");
    }, 1500);
  };

  // Switch offline flag
  const toggleOfflineMode = () => {
    const nextOffline = !offlineMode;
    setOfflineMode(nextOffline);
    if (nextOffline) {
      setSyncStatus("offline");
      setSyncMessage("当前运行在 [离线学习模式]：数据已暂存本地，联网后自动同步");
    } else {
      setSyncStatus("syncing");
      setSyncMessage("检测到网络恢复，正在合并本地缓存...");
      setTimeout(() => {
        setSyncStatus("synced");
        setSyncMessage("多端同步完成！本地更改已覆盖云端库");
      }, 1200);
    }
  };

  // 2-Hour Timer Tick Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds((prev) => prev - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes((prev) => prev - 1);
          setTimerSeconds(59);
        } else {
          // Timer finished
          setTimerActive(false);
          alert("恭喜！您今天已经完成了2个小时的高效专注学习，快去打卡解锁成就吧！");
        }
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    // Dynamic phase indicator inside 120 minutes
    // 120 - 60 min: lecture
    // 60 - 30 min: reciting
    // 30 - 0 min: quiz
    const totalMinutesLeft = timerMinutes;
    if (totalMinutesLeft > 60) {
      setTimerPhase("lecture");
    } else if (totalMinutesLeft > 30) {
      setTimerPhase("reciting");
    } else {
      setTimerPhase("quiz");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerMinutes, timerSeconds]);

  // Answer Submission for Quest module
  const handleAnswerOptionClick = (opt: string) => {
    if (answerSubmitted) return;
    const currentQ = filteredQuestions[currentQuestionIndex];
    if (currentQ.type === "多选题") {
      const selectedLetter = opt.charAt(0);
      if (selectedMultipleOptions.includes(selectedLetter)) {
        setSelectedMultipleOptions(selectedMultipleOptions.filter((o) => o !== selectedLetter));
      } else {
        setSelectedMultipleOptions([...selectedMultipleOptions, selectedLetter].sort());
      }
    } else {
      setSelectedOption(opt.charAt(0));
    }
  };

  const handleAnswerSubmit = () => {
    if (answerSubmitted) return;
    const currentQ = filteredQuestions[currentQuestionIndex];
    let isCorrect = false;

    if (currentQ.type === "单选题") {
      isCorrect = selectedOption === currentQ.answer;
    } else if (currentQ.type === "多选题") {
      const formattedMultiple = selectedMultipleOptions.join(",");
      isCorrect = formattedMultiple === currentQ.answer;
    } else {
      // Essay types are always graded mock
      isCorrect = true;
    }

    setAnswerSubmitted(true);
    setUserScore((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));

    // If answer is incorrect, push into wrong questions db
    if (!isCorrect && !wrongQuestionIds.includes(currentQ.id)) {
      setWrongQuestionIds([...wrongQuestionIds, currentQ.id]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
      setSelectedMultipleOptions([]);
      setEssayAnswer("");
      setAnswerSubmitted(false);
    } else {
      // restart loop
      setCurrentQuestionIndex(0);
      setSelectedOption("");
      setSelectedMultipleOptions([]);
      setEssayAnswer("");
      setAnswerSubmitted(false);
    }
  };

  const handleAddToWrongBook = (qId: string) => {
    if (!wrongQuestionIds.includes(qId)) {
      setWrongQuestionIds([...wrongQuestionIds, qId]);
      alert("已成功加入错题智能分析库！");
    } else {
      alert("此题已在错题智能分析库中。");
    }
  };

  // Call API for Gemini AI Analysis of Mistake
  const requestSmartMistakeAnalysis = async (qId: string) => {
    const targetQ = questions.find((q) => q.id === qId);
    if (!targetQ) return;

    setIsAnalyzingMistake(true);
    setMistakeAiResponse(null);

    try {
      const response = await fetch("/api/analyze-mistake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: targetQ.question,
          subject: targetQ.subject,
          wrongAnswer: targetQ.type === "单选题" ? "B" : "C,E", // Simulated custom wrong answer
          correctAnswer: targetQ.answer,
          explanation: targetQ.explanation
        })
      });

      const json = await response.json();
      if (json.success) {
        setMistakeAiResponse(json.data);
      } else {
        setMistakeAiResponse("⚠️ 错题诊断失败，请检查网络重试。");
      }
    } catch (err: any) {
      console.error(err);
      setMistakeAiResponse(`⚠️ 连接分析服务器发生错误: ${err.message}`);
    } finally {
      setIsAnalyzingMistake(false);
    }
  };

  // Call API for Gemini AI Periodical Diagnostic Report
  const requestAITestReport = async () => {
    setIsGeneratingReport(true);
    setReportResult(null);

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weeklyHours: 12 + punchedDates.length * 2, // 2 hours/day study blocks
          answeredCount: userScore.total + 35,
          accuracyRate: Math.round(((userScore.correct + 22) / (userScore.total + 35)) * 100),
          practicalAccuracy: 75,
          comprehensiveAccuracy: 62,
          caseAccuracy: 48,
          weakSubjects: ["高层建筑消防排水", "厂房防爆泄压参数", "湿式报警阀组组件联动"],
          punchedDays: punchedDates.length
        })
      });

      const json = await response.json();
      if (json.success) {
        setReportResult(json.data);
      } else {
        setReportResult("⚠️ 测试报告生成失败，请检查数据库连接。");
      }
    } catch (err: any) {
      console.error(err);
      setReportResult(`⚠️ 报告生成发生错误: ${err.message}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Daily punch card click
  const handleDailyPunch = () => {
    if (isTodayPunched) return;
    const todayStr = "2026-06-06"; // Fixed target current mock date
    setPunchedDates([...punchedDates, todayStr]);
    setIsTodayPunched(true);
    const nextStreak = currentStreak + 1;
    setCurrentStreak(nextStreak);

    // Unlock rewards dynamically
    const matchedBadges = ACHIEVEMENT_BADGES.filter((b) => nextStreak >= b.unlockedAtStreak);
    setUnlockedBadges(matchedBadges.map((b) => b.id));
  };

  return (
    <div className="min-h-screen bg-[#F2F6F3] text-gray-800 font-sans selection:bg-[#ADCBB7] selection:text-[#1F392B]">
      
      {/* Upper Global Navigation & Platform Framing Switcher */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E1EAE4] shadow-sm py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F4D33] to-[#347A53] flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                一级注册消防工程师智能学习助手
                <span className="text-xs bg-[#E3EDE7] text-[#1F4D33] px-2 py-0.5 rounded-full font-medium">国家安全防线守护者</span>
              </h1>
              <p className="text-xs text-gray-500">中国国家金考备考系统 · 护眼绿色无压力交互设计</p>
            </div>
          </div>

          {/* Quick Mode Status Bar */}
          <div className="flex items-center flex-wrap gap-3">
            {/* Database Cloud Multi-Device Indicator */}
            <div 
              onClick={triggerManualSync}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                offlineMode 
                  ? "bg-[#FDF4E2] text-amber-800 border border-amber-200"
                  : "bg-[#EBF7F0] text-emerald-800 border border-emerald-100 hover:bg-[#DDF0E4]"
              }`}
              title="点击强制触发云端多端同步备份"
            >
              {offlineMode ? <CloudOff className="w-3.5 h-3.5" /> : <Cloud className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />}
              <span>{offlineMode ? "离线数据库模式" : "云端多端已同步"}</span>
            </div>

            {/* Offline Button toggle */}
            <button 
              onClick={toggleOfflineMode}
              className="px-3 py-1.5 border border-[#CCDCD1] rounded-lg text-xs font-semibold bg-white hover:bg-gray-50 transition"
            >
              {offlineMode ? "上线自动同步" : "切入离线模式"}
            </button>

            {/* Dual Platform Frame Switching Panel */}
            <div className="bg-[#EBF1ED] p-1 rounded-lg flex items-center gap-1 border border-[#CCDCD1]">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`p-1.5 rounded-md transition ${deviceMode === "desktop" ? "bg-white text-[#1F4D33] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                title="电脑端全屏"
              >
                <Laptop className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceMode("ios")}
                className={`p-1.5 rounded-md transition ${deviceMode === "ios" ? "bg-white text-[#1F4D33] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                title="iPhone iOS双平台预览"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceMode("android")}
                className={`p-1.5 rounded-md transition ${deviceMode === "android" ? "bg-white text-[#1F4D33] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                title="Android 手机端预览"
              >
                <Tablet className="w-4 h-4" />
              </button>
            </div>
            
          </div>

        </div>
      </header>

      {/* Synchronize Notification Bar */}
      <div className="bg-[#EBF5EE] text-center py-2 px-4 shadow-inner border-b border-[#D8E6DE]">
        <p className="text-xs text-[#1F4D33] font-medium flex items-center justify-center gap-1.5">
          <Check className="w-3.5 h-3.5 bg-emerald-600 text-white rounded-full p-0.5" />
          {syncMessage}
        </p>
      </div>

      {/* Main Layout Workspace with viewport simulation */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex justify-center">

        <div className={`w-full transition-all duration-300 ${
          deviceMode === "desktop" 
            ? "max-w-7xl" 
            : deviceMode === "ios" 
              ? "max-w-[420px] bg-[#1a1a1a] p-4 rounded-[40px] shadow-2xl border-8 border-gray-800 relative ring-12 ring-gray-900/10 mb-10" 
              : "max-w-[420px] bg-[#121212] p-4 rounded-[32px] shadow-2xl border-4 border-gray-700 relative mb-10"
        }`}>

          {/* Device Hardware Bezel details on Mobile Presets */}
          {deviceMode !== "desktop" && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#1a1a1a] h-5 w-32 rounded-b-xl z-20 flex items-center justify-center">
              <span className="w-12 h-3.5 bg-black rounded-full block"></span>
              <span className="w-2.5 h-2.5 bg-blue-900 rounded-full block ml-2"></span>
            </div>
          )}

          {/* Application Screen Container */}
          <div className={`w-full rounded-2xl bg-white text-gray-800 ${
            deviceMode !== "desktop" ? "min-h-[750px] max-h-[820px] overflow-y-auto" : "min-h-[500px]"
          } shadow-sm border border-[#E1EAE4] flex flex-col`}>

            {/* Application Mock Header Navigation for Phone layout */}
            {deviceMode !== "desktop" && (
              <div className="bg-[#1F4D33] text-white px-4 pt-6 pb-4 rounded-t-xl flex items-center justify-between">
                <span className="text-xs font-mono font-bold">10:30 ⏰</span>
                <span className="text-xs font-semibold">一消极速备考</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] font-mono text-emerald-200">5G / WiFi</span>
                </div>
              </div>
            )}

            {/* Grid Layout Controller: Desktop has 4 columns (1. 2hr block, 2. Interactive study center, 3. gamification badge) */}
            <div className={`grid grid-cols-1 ${deviceMode === "desktop" ? "lg:grid-cols-12" : ""} divide-y lg:divide-y-0 lg:divide-x divide-[#E1EAE4] flex-1`}>
              
              {/* Left Bar / Interactive countdown timer block */}
              <section className={`${deviceMode === "desktop" ? "col-span-3" : "col-span-1"} p-5 bg-[#FAFDFB] space-y-5 rounded-bl-xl`}>
                
                {/* 2-Hour Focus Clock Block */}
                <div className="bg-gradient-to-tr from-[#1F4D33] to-[#2B6042] rounded-xl text-white p-5 shadow-sm space-y-4 relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full pointer-events-none"></div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-white/20 text-[#EBF7F0] px-2 py-0.5 rounded-full font-medium">每日硬性学习 2 小时</span>
                    <Clock className="w-4.5 h-4.5 text-emerald-200 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>

                  <div className="text-center py-2">
                    <div className="text-4xl font-mono font-extrabold tracking-tight">
                      {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
                    </div>
                    <p className="text-[10px] text-emerald-200 mt-2">
                      当前备考阶段：
                      <span className="underline font-bold">
                        {timerPhase === "lecture" && "第一阶段_肖老师视频精讲 (60分钟)"}
                        {timerPhase === "reciting" && "第二阶段_高频国标条文强记 (30分钟)"}
                        {timerPhase === "quiz" && "第三阶段_精选历年真题评测 (30分钟)"}
                      </span>
                    </p>
                  </div>

                  {/* Visual Progress gauge */}
                  <div className="w-full bg-emerald-950/40 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-300 h-full transition-all duration-500" 
                      style={{ width: `${(timerMinutes / 120) * 100}%` }}
                    ></div>
                  </div>

                  {/* Actions to pause study timers */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setTimerActive(!timerActive)}
                      className={`text-xs py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                        timerActive 
                          ? "bg-rose-700 text-white hover:bg-rose-800" 
                          : "bg-[#E2F7E4] text-[#1F4D33] hover:bg-[#D1EED4]"
                      }`}
                    >
                      <Timer className="w-3.5 h-3.5" />
                      <span>{timerActive ? "暂停规划" : "开始复习"}</span>
                    </button>

                    <button
                      onClick={() => {
                        setTimerActive(false);
                        setTimerMinutes(120);
                        setTimerSeconds(0);
                      }}
                      className="text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 px-1 transition font-bold"
                    >
                      重置2小时
                    </button>
                  </div>

                </div>

                {/* Protective Guide tips for Eye stress (减轻阅读疲劳) */}
                <div className="bg-[#EEF4F0] rounded-xl p-4 border border-[#D5E1D9] text-xs space-y-2 text-[#2A4835]">
                  <h4 className="font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-emerald-700" />
                    <span>护眼高对比度阅读建议</span>
                  </h4>
                  <p className="leading-relaxed text-gray-600">
                    一消规范重达百万字，平台已启用<b>“莫兰迪柔和消绿”</b>护眼色（GB/T 3102强制色域）。建议每专注25分钟，眺望窗外5米远处绿色景物2分钟。
                  </p>
                </div>

                {/* Streak Punch Card Section */}
                <div className="bg-white border border-[#E1EAE4] rounded-xl p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>我的学习连续打卡</span>
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      已打卡 {punchedDates.length} 天
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-mono font-black text-emerald-700">
                      {currentStreak} <span className="text-xs text-gray-500 font-sans font-normal">天连击</span>
                    </div>
                    <div className="text-[10px] text-gray-500 leading-tight">
                      打卡能提升消防抗压心理，每日复习2小时即可点亮！
                    </div>
                  </div>

                  {/* Motivative punch button */}
                  <button
                    onClick={handleDailyPunch}
                    disabled={isTodayPunched}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                      isTodayPunched 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isTodayPunched ? "📅 今日打卡已点亮" : "🎯 每日2小时学习完毕打卡"}</span>
                  </button>

                  {/* Mini Calendar heatmap indicator */}
                  <div className="grid grid-cols-7 gap-1 pt-2">
                    {["一", "二", "三", "四", "五", "六", "日"].map((d, idx) => (
                      <span key={idx} className="text-[9px] text-center text-gray-400">{d}</span>
                    ))}
                    {Array.from({ length: 14 }).map((_, i) => {
                      // mock days
                      const dayNumber = i + 1;
                      const dateStr = `2026-06-${String(dayNumber).padStart(2, "0")}`;
                      const hasCompleted = punchedDates.includes(dateStr) || (dayNumber === 6 && isTodayPunched);
                      
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-sm flex items-center justify-center text-[8px] font-bold ${
                            hasCompleted
                              ? "bg-emerald-600 text-white"
                              : "bg-[#F0F5F1] text-gray-400"
                          }`}
                          title={dateStr}
                        >
                          {dayNumber}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upcoming Mock Exam Warning (详细周计划和月度模拟考提醒) */}
                <div className="bg-[#FFF8EC] border border-[#F5E6CC] rounded-xl p-4 text-xs space-y-1.5 text-amber-900 shadow-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <Activity className="w-4 h-4 text-amber-600" />
                    <span>月度最重模拟全真考试提醒</span>
                  </div>
                  <p className="text-gray-600 leading-tight">
                    时间：<b>2026年6月28日</b>。将1:1还原一级消防工程师实考时长与高压评分系统。届时包含《消防案例分析》答卷卡。
                  </p>
                </div>

              </section>

              {/* Main Interactive Screen Area */}
              <section className={`${deviceMode === "desktop" ? "col-span-6" : "col-span-1"} p-6 flex flex-col space-y-6`}>
                
                {/* Global Inner Module Tabs */}
                <nav className="flex items-center border-b border-gray-200 gap-1 overflow-x-auto pb-px">
                  <button
                    onClick={() => setActiveTab("roadmap")}
                    className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap ${
                      activeTab === "roadmap"
                        ? "border-[#1F4D33] text-[#1F4D33]"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    建议周计划
                  </button>
                  <button
                    onClick={() => setActiveTab("quiz")}
                    className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap ${
                      activeTab === "quiz"
                        ? "border-[#1F4D33] text-[#1F4D33]"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <BookMarked className="w-4 h-4" />
                    真题题库 ({questions.length}题)
                  </button>
                  <button
                    onClick={() => setActiveTab("lecture")}
                    className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap ${
                      activeTab === "lecture"
                        ? "border-[#1F4D33] text-[#1F4D33]"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Tv className="w-4 h-4" />
                    名师视频讲解
                  </button>
                  <button
                    onClick={() => setActiveTab("mistake")}
                    className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap ${
                      activeTab === "mistake"
                        ? "border-[#1F4D33] text-[#1F4D33]"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    智能错题本 ({wrongQuestionIds.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("stats")}
                    className={`pb-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1 whitespace-nowrap ${
                      activeTab === "stats"
                        ? "border-[#1F4D33] text-[#1F4D33]"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    AI评测报告
                  </button>
                </nav>

                {/* --- TAB 1: ROADMAP (2小时/周计划详细规划及模拟考提醒) --- */}
                {activeTab === "roadmap" && (
                  <div className="space-y-6">
                    <div className="bg-[#EDF5F0] border-l-4 border-[#1F4D33] p-4 rounded-r-xl">
                      <h3 className="text-sm font-bold text-[#1F4D33]">一消大师班推荐：两小时高效复习法</h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        科学合理分配您的每天两小时（120分钟）：1小时视频输入吸收 + 30分钟高频国标默背 + 30分钟历年核心案例/单选突破。
                      </p>
                    </div>

                    <div className="space-y-4">
                      {STUDY_ROADMAP.map((item, idx) => (
                        <div key={idx} className="border border-[#E1EAE4] rounded-xl hover:border-emerald-300 transition-colors bg-[#FAFDFB]">
                          <div className="bg-[#EBF3ED] px-4 py-3 rounded-t-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E1EAE4]">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-[#1F4D33] text-white flex items-center justify-center text-xs font-bold font-mono">
                                {item.week}
                              </span>
                              <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                            </div>
                            <span className="text-[10px] text-[#1F4D33] font-semibold bg-[#DDF0E4] px-2 py-0.5 rounded-full">
                              方向: {item.focus.slice(0, 15)}...
                            </span>
                          </div>

                          <div className="p-4 space-y-3">
                            <p className="text-xs text-gray-700 font-medium">🎯 本期攻克重点: {item.focus}</p>
                            
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 block font-mono">
                                每日 2 小时黄金阶段执行：
                              </span>
                              <ul className="space-y-1.5">
                                {item.dailyTwoHoursPlan.map((plan, pIdx) => (
                                  <li key={pIdx} className="text-xs text-gray-600 flex items-start gap-2 leading-relaxed">
                                    <span className="text-emerald-500 font-bold font-mono mt-0.5">·</span>
                                    <span>{plan}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#8C9C91]">
                              <span className="flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                                提醒: {item.mockExamReminder.slice(0, 25)}...
                              </span>
                              <button 
                                onClick={() => setActiveTab("quiz")}
                                className="text-[#1F4D33] font-bold hover:underline flex items-center"
                              >
                                立即前往专项实操 <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- TAB 2: INTERACTIVE QUIZ BANK (历年真题库) --- */}
                {activeTab === "quiz" && (
                  <div className="space-y-6">

                    {/* Filter controls */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex gap-1 bg-[#EBF1ED] p-1 rounded-lg border border-[#CCDCD1]">
                        {["全部", "消防安全技术实务", "消防安全技术综合能力", "消防安全案例分析"].map((sub) => (
                          <button
                            key={sub}
                            onClick={() => {
                              setSubjectFilter(sub);
                              setCurrentQuestionIndex(0);
                              setSelectedOption("");
                              setSelectedMultipleOptions([]);
                              setEssayAnswer("");
                              setAnswerSubmitted(false);
                            }}
                            className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition whitespace-nowrap ${
                              (sub === "全部" && subjectFilter === "全部") || subjectFilter === sub
                                ? "bg-[#1F4D33] text-white"
                                : "text-gray-600 hover:text-black"
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>

                      {/* Score Tracker */}
                      <div className="text-xs font-medium text-emerald-800 bg-[#EBF7F0] px-3 py-1.5 rounded-lg border border-emerald-100">
                        当前练习：正确 <b>{userScore.correct}</b> / 共答 <b>{userScore.total}</b> 题
                      </div>
                    </div>

                    {/* Question Interactive Sheet */}
                    {filteredQuestions.length > 0 ? (
                      <div className="border border-[#E1EAE4] rounded-xl overflow-hidden bg-white shadow-xs p-6 space-y-6">
                        
                        {/* Upper meta badges */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-[#1F4D33] text-white px-2.5 py-0.5 rounded font-bold">
                              {filteredQuestions[currentQuestionIndex].year}
                            </span>
                            <span className="text-xs bg-emerald-50 text-[#1F4D33] border border-emerald-100 px-2 py-0.5 rounded font-medium">
                              {filteredQuestions[currentQuestionIndex].subject}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 font-mono">
                            【{filteredQuestions[currentQuestionIndex].type}】{currentQuestionIndex + 1} / {filteredQuestions.length}
                          </span>
                        </div>

                        {/* Question main content */}
                        <div>
                          <p className="text-[#1F392B] text-sm md:text-base font-bold leading-relaxed">
                            {filteredQuestions[currentQuestionIndex].question}
                          </p>
                        </div>

                        {/* Interactive Choice list or Essay Form */}
                        {filteredQuestions[currentQuestionIndex].type === "简答题" ? (
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-500 block">请输入您的主观题答题大纲或踩分关键词：</label>
                            <textarea
                              rows={5}
                              value={essayAnswer}
                              onChange={(e) => setEssayAnswer(e.target.value)}
                              disabled={answerSubmitted}
                              placeholder="例如：1. 湿式控制阀处于手动状态；2. 消防水泵主备电切换故障..."
                              className="w-full text-xs p-3 border border-[#CCDCD1] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                            ></textarea>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {filteredQuestions[currentQuestionIndex].options.map((opt, oIdx) => {
                              const letter = opt.charAt(0);
                              const isSelected = filteredQuestions[currentQuestionIndex].type === "多选题"
                                ? selectedMultipleOptions.includes(letter)
                                : selectedOption === letter;

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleAnswerOptionClick(opt)}
                                  disabled={answerSubmitted}
                                  className={`w-full text-left p-4 rounded-xl text-xs transition border leading-relaxed flex items-center justify-between ${
                                    isSelected
                                      ? "bg-[#E2F5E6] border-[#1F4D33] text-[#1F392B] font-bold"
                                      : "border-[#CCDCD1] hover:border-gray-500 bg-[#FCFDFD]"
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {isSelected && <Check className="w-4 h-4 text-emerald-700 shrink-0 ml-2" />}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Answer Action buttons and Bookmark adding */}
                        <div className="pt-2 flex items-center justify-between gap-4">
                          <button
                            onClick={() => handleAddToWrongBook(filteredQuestions[currentQuestionIndex].id)}
                            className="px-4 py-2 text-xs border border-[#CCDCD1] rounded-lg text-gray-600 hover:text-[#1F4D33] hover:border-[#1F4D33] font-semibold transition"
                          >
                            ⭐️ 加塞智能错题本
                          </button>

                          <div className="flex gap-2">
                            {!answerSubmitted ? (
                              <button
                                onClick={handleAnswerSubmit}
                                disabled={
                                  filteredQuestions[currentQuestionIndex].type === "简答题" 
                                    ? !essayAnswer.trim()
                                    : filteredQuestions[currentQuestionIndex].type === "多选题"
                                      ? selectedMultipleOptions.length === 0
                                      : !selectedOption
                                }
                                className={`px-5 py-2 rounded-lg text-xs font-bold transition ${
                                  (filteredQuestions[currentQuestionIndex].type === "简答题" ? essayAnswer.trim() : (selectedOption || selectedMultipleOptions.length > 0))
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                确定核准答案
                              </button>
                            ) : (
                              <button
                                onClick={handleNextQuestion}
                                className="px-5 py-2 bg-[#1F4D33] hover:bg-[#143422] text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                              >
                                下一题 <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expandable detailed review panel */}
                        {answerSubmitted && (
                          <div className="bg-[#FAFDFB] border border-[#CCDCD1] rounded-xl p-5 space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                              <span className="text-xs font-bold text-gray-800">
                                标准规范解析判定： 
                                <span className="text-[#1F4D33] bg-[#E3EDE7] px-2 py-0.5 rounded font-mono ml-1">
                                  正确考查答案: {filteredQuestions[currentQuestionIndex].answer}
                                </span>
                              </span>
                            </div>

                            <p className="text-xs text-gray-600 leading-relaxed font-mono whitespace-pre-line">
                              {filteredQuestions[currentQuestionIndex].explanation}
                            </p>

                            {filteredQuestions[currentQuestionIndex].majorCode && (
                              <p className="text-[10px] text-emerald-800 font-bold">
                                📚 相关国家消防规范： 《{filteredQuestions[currentQuestionIndex].majorCode}》
                              </p>
                            )}
                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        当前暂无 “{subjectFilter}” 题型真题，请切换筛选。
                      </div>
                    )}

                  </div>
                )}

                {/* --- TAB 3: VIDEOS ROOM (名师视频讲解与智能提纲) --- */}
                {activeTab === "lecture" && (
                  <div className="space-y-6">

                    {/* Left: Interactive Simulated Video Screen Player */}
                    <div className="border border-[#E1EAE4] rounded-xl bg-slate-900 p-4 text-white space-y-4">
                      
                      {/* Interactive TV Shell with Morandi borders */}
                      <div className="bg-black rounded-lg aspect-video flex flex-col justify-between p-4 relative overflow-hidden group">
                        
                        {/* Simulation overlays */}
                        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none"></div>

                        {/* Class Meta */}
                        <div className="flex items-center justify-between z-10">
                          <span className="bg-[#1F4D33]/90 text-xs px-2.5 py-1 rounded font-bold border border-emerald-500/20">
                            🎥 国家特邀一消高含金量精讲 · 在线学习中
                          </span>
                          <span className="text-xs text-emerald-400 font-mono drop-shadow bg-black/60 px-2 py-0.5 rounded">
                            {selectedVideo.category}
                          </span>
                        </div>

                        {/* Fake video presenter */}
                        <div className="text-center py-4 z-10 flex flex-col items-center justify-center space-y-2">
                          <div className="w-16 h-16 rounded-full bg-emerald-600/20 border-2 border-emerald-500 flex items-center justify-center cursor-pointer hover:scale-105 transition shadow-lg">
                            <span className="text-2xl">👨‍🚒</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold tracking-wide text-white drop-shadow-md">
                              {selectedVideo.lecturer}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              全国知名注册消防工程师教材核心主编
                            </p>
                          </div>
                        </div>

                        {/* Player control panel bar */}
                        <div className="z-10 bg-slate-900/90 rounded-lg p-3 border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="text-emerald-400 hover:text-emerald-300 font-bold"
                            >
                              {isPlaying ? "⏸ 暂停" : "▶️ 继续播放"}
                            </button>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {isPlaying ? "30:22" : "00:00"} / {selectedVideo.duration}
                            </span>
                          </div>

                          {/* Interactive Speed */}
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-[10px]">语速:</span>
                            {[1.0, 1.25, 1.5, 2.0].map((s) => (
                              <button
                                key={s}
                                onClick={() => setPlaybackSpeed(s)}
                                className={`px-1.5 py-0.5 rounded text-[10px] ${
                                  playbackSpeed === s ? "bg-emerald-600 text-white font-bold" : "text-gray-400 hover:text-white"
                                }`}
                              >
                                {s}x
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Lesson metadata detailed breakdown */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-sm tracking-tight text-white">{selectedVideo.title}</h3>
                        <p className="text-xs text-gray-400">当前播放课程：一级消防重难点讲解</p>
                        
                        {/* Bullet point Outlines */}
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-800 text-xs">
                          <span className="font-bold text-emerald-400 block mb-2">📌 本讲核心章节考纲导向：</span>
                          <ul className="space-y-1.5 text-gray-300">
                            {selectedVideo.outline.map((out, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 font-mono">
                                <span className="text-emerald-500">▶</span>
                                <span>{out}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    </div>

                    {/* Lesson Library scrollbox */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#1F4D33]">全部精品录教学课目：</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {videos.map((vid) => (
                          <div
                            key={vid.id}
                            onClick={() => setSelectedVideo(vid)}
                            className={`p-4 border rounded-xl hover:border-emerald-600 transition cursor-pointer flex justify-between items-start ${
                              selectedVideo.id === vid.id
                                ? "bg-[#EDF5F0] border-emerald-600"
                                : "bg-white border-[#E1EAE4]"
                            }`}
                          >
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-mono font-bold text-gray-400">{vid.lecturer}</span>
                              <h5 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">{vid.title}</h5>
                              <p className="text-[11px] text-[#1F4D33] font-medium">{vid.duration}</p>
                            </div>
                            <Play className="w-5 h-5 text-[#1F4D33] shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* --- TAB 4: MISTAKE SMART ANALYZER (错题智能分析功) --- */}
                {activeTab === "mistake" && (
                  <div className="space-y-6">
                    
                    <div className="bg-[#FFF5F5] border border-rose-200 rounded-xl p-4 text-xs space-y-1 text-rose-900 shadow-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold">错题本已接入 Gemini-3.5-Flash 金考智能解析</h4>
                        <p className="text-rose-700 leading-relaxed">
                          每当您做错真题，系统会自动录入此处。您可以随时点击“一键AI智慧诊断”，让名师为您定制<b>“口诀助记”</b>与<b>“核心规范GB条目”</b>攻坚课。
                        </p>
                      </div>
                    </div>

                    {wrongQuestionIds.length > 0 ? (
                      <div className="space-y-4">
                        
                        {/* Selector of wrong questions */}
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {wrongQuestionIds.map((qId, idx) => {
                            const qObj = questions.find((q) => q.id === qId);
                            if (!qObj) return null;
                            return (
                              <button
                                key={qId}
                                onClick={() => {
                                  setActiveWrongIndex(idx);
                                  setMistakeAiResponse(null);
                                }}
                                className={`px-3 py-1.5 border rounded-lg text-xs font-medium whitespace-nowrap transition ${
                                  activeWrongIndex === idx
                                    ? "bg-[#1F4D33] text-white border-[#1F4D33]"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                              >
                                [错题 {idx + 1}] {qObj.subject.slice(0, 4)}..
                              </button>
                            );
                          })}
                        </div>

                        {/* Wrong question target block */}
                        {questions.find((q) => q.id === wrongQuestionIds[activeWrongIndex]) && (() => {
                          const wrongQ = questions.find((q) => q.id === wrongQuestionIds[activeWrongIndex])!;
                          return (
                            <div className="border border-[#E1EAE4] rounded-xl hover:border-emerald-300 transition-all bg-[#FCFDFD] p-5 space-y-4">
                              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span className="text-xs bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded font-bold">
                                  {wrongQ.subject}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">
                                  错题数据库：{activeWrongIndex + 1} / {wrongQuestionIds.length}
                                </span>
                              </div>

                              <p className="text-[#1F392B] text-xs font-bold leading-relaxed">{wrongQ.question}</p>

                              {/* Static correct options representation */}
                              <div className="bg-[#FAFDFB] p-4 text-xs text-gray-600 border border-[#EDF4F0] rounded-xl space-y-1">
                                <p className="font-bold text-gray-800">📌 标准给出的真题正确答案及引据：</p>
                                <p className="font-mono mt-1 text-[#1F4D33]">正确选项：{wrongQ.answer}</p>
                                <p className="leading-relaxed mt-1 text-gray-500">{wrongQ.explanation}</p>
                              </div>

                              {/* Trigger Gemini AI Diagnostic Action */}
                              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <span className="text-[10px] text-gray-400">结合最新《建规》、《自喷规》</span>
                                <button
                                  onClick={() => requestSmartMistakeAnalysis(wrongQ.id)}
                                  disabled={isAnalyzingMistake}
                                  className="w-full sm:w-auto px-5 py-2.5 bg-[#1F4D33] hover:bg-[#153422] text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
                                  <span>{isAnalyzingMistake ? "AI脑图诊断中..." : "名师口诀 AI 智能诊断"}</span>
                                </button>
                              </div>

                              {/* AI Response Block */}
                              {isAnalyzingMistake && (
                                <div className="bg-[#EDF5F0] rounded-xl p-5 border border-emerald-300 space-y-2 text-center text-xs text-gray-600">
                                  <RotateCw className="w-6 h-6 text-[#1F4D33] animate-spin mx-auto" />
                                  <p className="font-bold">Gemini 3.5 联机分析错题并生成高频必拿分口诀中...</p>
                                  <p className="text-[10px] text-gray-400">正在对比国标 GB50016-2014(2018) 及 GB50974 核心法条大数轴</p>
                                </div>
                              )}

                              {mistakeAiResponse && (
                                <div className="bg-white border-2 border-emerald-600/50 rounded-xl p-5 shadow-sm space-y-4">
                                  <div className="flex items-center gap-1 bg-[#E8F5EC] p-2 rounded-lg text-[11px] text-[#1F4D33] font-bold">
                                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                                    <span>一消名师 AI 深度诊断生成完毕</span>
                                  </div>
                                  <div className="text-xs text-gray-700 leading-relaxed font-mono whitespace-pre-wrap outline-none">
                                    {mistakeAiResponse}
                                  </div>
                                </div>
                              )}

                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400 space-y-2">
                        <span>🎉 太棒了！您当前错题本为空！</span>
                        <p className="text-xs text-gray-500">请前往真题题库进行答题实测。</p>
                      </div>
                    )}

                  </div>
                )}

                {/* --- TAB 5: AI REPORT GENERATOR (根据你的进度实时生成阶段性评估诊断报告) --- */}
                {activeTab === "stats" && (
                  <div className="space-y-6">
                    
                    <div className="bg-gradient-to-tr from-[#1F4D33] to-[#2F6F4C] text-white p-6 rounded-xl space-y-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-300" />
                        <h3 className="text-sm font-bold">阶段测试诊断报告生成区</h3>
                      </div>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        一消 AI 规划助理会随时爬取您的累计学习时间、真题正确率（技术实务、综合能力、案例大主观题）、错题量及打卡连续记录，进而一键定制独属于您的下周“每日两小时备考策略”。
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-t border-white/20 pt-4 text-center">
                        <div>
                          <div className="text-lg font-mono font-bold text-white">42 题</div>
                          <p className="text-[10px] text-emerald-200">累计作答真题</p>
                        </div>
                        <div>
                          <div className="text-lg font-mono font-bold text-white">4天</div>
                          <p className="text-[10px] text-emerald-200">连续坚持打卡</p>
                        </div>
                        <div>
                          <div className="text-lg font-mono font-bold text-white">68%</div>
                          <p className="text-[10px] text-emerald-200">综合平均正确率</p>
                        </div>
                        <div>
                          <div className="text-lg font-mono font-bold text-white">2 题</div>
                          <p className="text-[10px] text-emerald-200">未消灭硬骨头错题</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={requestAITestReport}
                          disabled={isGeneratingReport}
                          className="w-full bg-white hover:bg-emerald-50 text-[#1F4D33] font-bold py-3 px-4 rounded-lg text-xs transition flex items-center justify-center gap-2 shadow-xs"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-700 font-extrabold animate-pulse" />
                          <span>{isGeneratingReport ? "AI 大脑调档诊断中..." : "生成我的专属一消周诊断测试报告"}</span>
                        </button>
                      </div>
                    </div>

                    {isGeneratingReport && (
                      <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-8 text-center text-xs text-gray-600 space-y-2">
                        <RotateCw className="w-8 h-8 text-[#1F4D33] animate-spin mx-auto" />
                        <p className="font-bold">云数据库拉取多端同步节点并交给 AI 精算评估中...</p>
                        <p className="text-[10px] text-gray-500">正在生成 SWOT 实力模型与 每日两小时 强化执行指标</p>
                      </div>
                    )}

                    {reportResult && (
                      <div className="border border-[#CCDCD1] rounded-xl p-6 bg-white shadow-xs space-y-4">
                        <div className="flex items-center gap-1.5 bg-[#EBF7F0] p-3 rounded-lg text-xs text-[#1F4D33] font-bold">
                          <Check className="w-4 h-4 bg-[#1F4D33] text-white rounded-full p-0.5" />
                          <span>阶段测试评估报告生成成功（多端已安全合并）</span>
                        </div>
                        <div className="text-xs text-gray-700 leading-relaxed font-mono whitespace-pre-wrap border-t border-gray-100 pt-4">
                          {reportResult}
                        </div>
                        
                        {/* Print or export action mock */}
                        <div className="flex justify-end gap-2 text-[11px] text-gray-400">
                          <span>出具时间: 2026-06-06 10:30 UTC</span>
                          <span>|</span>
                          <span className="cursor-pointer hover:underline text-[#1F4D33] font-bold">保存并同步多端云硬盘</span>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </section>

              {/* Right panel: Badges status & Multi-platform indicator */}
              <section className={`${deviceMode === "desktop" ? "col-span-3" : "col-span-1"} p-5 bg-[#FAFDFB] space-y-5 rounded-br-xl`}>
                
                {/* Rewards / Badges panel */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>一级消防荣誉成就</span>
                    </h4>
                    <span className="text-[10px] text-gray-400">安全守护力</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {ACHIEVEMENT_BADGES.map((bd) => {
                      const isUnlocked = unlockedBadges.includes(bd.id);
                      return (
                        <div
                          key={bd.id}
                          className={`p-3 border rounded-xl flex items-center gap-3 transition ${
                            isUnlocked
                              ? "bg-white border-[#CCDCD1] shadow-xs"
                              : "bg-gray-100/60 border-dashed border-gray-200 text-gray-400"
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 ${
                            isUnlocked ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-400"
                          }`}>
                            🏆
                          </div>
                          <div className="text-xs space-y-0.5">
                            <h5 className={`font-bold ${isUnlocked ? "text-gray-900" : "text-gray-400"}`}>{bd.name}</h5>
                            <p className="text-[10px] text-gray-500 leading-tight">{bd.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated multi-device synchronizer status logs */}
                <div className="border border-[#E1EAE4] rounded-xl p-4 space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                    <Cloud className="w-4 h-4 text-emerald-600" />
                    <span>多端多设备同步状态</span>
                  </h4>
                  
                  <ul className="space-y-2 text-[11px] text-gray-600">
                    <li className="flex items-center justify-between">
                      <span className="text-gray-400">iOS 端同步节点</span>
                      <span className="font-mono text-[#1F4D33]">已安全同步</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-400">Android 端同步节点</span>
                      <span className="font-mono text-[#1F4D33]">已安全同步</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-400">本地缓存数据大小</span>
                      <span className="font-mono text-gray-800">12.4 KB (20+条)</span>
                    </li>
                    <li className="flex items-center justify-between border-t border-gray-100 pt-2 font-bold text-gray-900">
                      <span>离线暂存队列</span>
                      <span className="text-emerald-700 font-mono">0 [已并入云端]</span>
                    </li>
                  </ul>
                </div>

                {/* Standard reference information */}
                <div className="bg-[#EDF5F0]/60 rounded-xl p-4 border border-[#CCDCD1]">
                  <h5 className="text-xs font-extrabold text-[#1F4D33] mb-1.5 flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span>官方核心消防规范速查表</span>
                  </h5>
                  <ul className="space-y-1 text-[11px] text-gray-600 leading-normal font-mono">
                    <li>·《建筑设计防火规范》GB 50016</li>
                    <li>·《消防给水及消火栓技术》GB 50974</li>
                    <li>·《自动喷水灭火系统设计》GB 50084</li>
                    <li>·《火灾自动报警系统设计》GB 50116</li>
                  </ul>
                </div>

              </section>

            </div>

            {/* Simulated navigation drawer bar inside Phone Presets */}
            {deviceMode !== "desktop" && (
              <footer className="border-t border-[#E1EAE4] bg-white rounded-b-xl py-2 px-3 flex items-center justify-around gap-1 shrink-0">
                <button
                  onClick={() => setActiveTab("roadmap")}
                  className={`flex flex-col items-center p-1.5 transition ${activeTab === "roadmap" ? "text-[#1F4D33]" : "text-gray-400"}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5">周计划</span>
                </button>
                <button
                  onClick={() => setActiveTab("quiz")}
                  className={`flex flex-col items-center p-1.5 transition ${activeTab === "quiz" ? "text-[#1F4D33]" : "text-gray-400"}`}
                >
                  <BookMarked className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5">题库</span>
                </button>
                <button
                  onClick={() => setActiveTab("lecture")}
                  className={`flex flex-col items-center p-1.5 transition ${activeTab === "lecture" ? "text-[#1F4D33]" : "text-gray-400"}`}
                >
                  <Tv className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5">视频</span>
                </button>
                <button
                  onClick={() => setActiveTab("mistake")}
                  className={`flex flex-col items-center p-1.5 transition ${activeTab === "mistake" ? "text-[#1F4D33]" : "text-gray-400"}`}
                >
                  <Award className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5">错题本</span>
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`flex flex-col items-center p-1.5 transition ${activeTab === "stats" ? "text-[#1F4D33]" : "text-gray-400"}`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] mt-0.5">AI评测</span>
                </button>
              </footer>
            )}

          </div>

        </div>

      </main>

      <footer className="bg-white border-t border-[#E1EAE4] py-8 mt-12 text-center text-xs text-slate-500">
        <p className="max-w-md mx-auto leading-relaxed">
          一级消防工程师智能备考平台 © 2026. 依据中国《中华人民共和国消防法》、GB 50016 规范联合编纂。助您筑牢防线，轻松通过考试。
        </p>
      </footer>

    </div>
  );
}
