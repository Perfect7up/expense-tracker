import {
  Bot,
  CreditCard,
  Menu,
  TrendingUp,
  Zap,
  Shield,
  Sparkles,
  Download,
  Play,
  ChevronRight,
  BarChart3,
  PieChart,
  Wallet,
  Target,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function PhoneVisual() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeChart, setActiveChart] = useState(0);

  // Rotate through different chart data
  const chartDataSets = [
    [40, 60, 35, 80, 55, 30],
    [65, 45, 70, 50, 85, 60],
    [30, 75, 50, 65, 40, 90],
  ];

  const [currentChartData, setCurrentChartData] = useState(chartDataSets[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveChart((prev) => (prev + 1) % chartDataSets.length);
      setCurrentChartData(
        chartDataSets[(activeChart + 1) % chartDataSets.length]
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [activeChart]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute -top-10 -left-10 sm:-top-20 sm:-left-20 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-r from-cyan-100/30 to-blue-100/30 rounded-full blur-2xl sm:blur-3xl" />
      <div className="absolute -bottom-10 -right-10 sm:-bottom-20 sm:-right-20 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-2xl sm:blur-3xl" />

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-center">
        {/* Left Side: Stats & Metrics */}
        <div className="space-y-4 md:space-y-6 transform transition-all duration-500 hover:scale-[1.02] lg:hover:scale-105 order-2 lg:order-1">
          {/* Stats Card 1 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 shadow-lg border border-slate-200/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Savings Rate</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">+24.5%</p>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: "75%" }}
              />
            </div>
          </div>

          {/* Stats Card 2 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 shadow-lg border border-slate-200/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">AI Tips</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">12 Active</p>
              </div>
            </div>
            <div className="space-y-2">
              {["Cancel unused subs", "Lower bills", "Travel hack"].map(
                (tip, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-xs text-slate-600">{tip}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Center: Phone */}
        <div
          className="relative perspective-1000 order-1 lg:order-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Floating notification */}
          <div
            className={`absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-xl sm:shadow-2xl border border-slate-200 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"} w-[90%] max-w-[200px] sm:w-auto`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  AI Insight
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500">
                  Save $240 this month
                </p>
              </div>
            </div>
          </div>

          {/* Phone Container */}
          <div
            className={`relative w-[200px] h-[380px] sm:w-[220px] sm:h-[420px] lg:w-[250px] lg:h-[480px] mx-auto transform transition-all duration-700 ${isHovered ? "rotate-y-0 rotate-z-0 scale-105" : "rotate-y-12 rotate-z-6"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-purple-400/20 rounded-[30px] sm:rounded-[36px] blur-lg sm:blur-xl" />
            <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 rounded-[26px] sm:rounded-[30px] border-4 sm:border-6 border-slate-800 shadow-xl sm:shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-20 sm:h-5 sm:w-24 bg-slate-900 rounded-b-md sm:rounded-b-lg z-20" />

              {/* Dynamic Status Bar */}
              <div className="absolute top-1 left-0 right-0 px-4 sm:px-6 flex justify-between items-center z-10">
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-300">
                  9:41
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-10 h-1 sm:w-12 sm:h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-6 sm:w-8 bg-slate-300 rounded-full" />
                  </div>
                  <div className="w-1 h-1 sm:w-1 sm:h-1.5 bg-slate-300 rounded-full" />
                  <div className="w-1.5 h-1 sm:w-2 sm:h-1.5 bg-slate-300 rounded-full" />
                </div>
              </div>

              {/* Screen */}
              <div className="w-full h-full bg-gradient-to-b from-slate-50 to-white relative flex flex-col pt-6 sm:pt-8 px-2 sm:px-3">
                {/* Header */}
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] sm:text-xs text-slate-500">Live</span>
                  </div>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-[9px] sm:text-[10px] font-bold text-white">JD</span>
                  </div>
                </div>

                {/* Title with trend indicator */}
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <h3 className="text-slate-800 font-bold text-xs sm:text-sm">
                    Expense Dashboard
                  </h3>
                  <div className="flex items-center gap-1 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                    <span className="text-[9px] sm:text-[10px] font-bold text-green-700">
                      +12%
                    </span>
                  </div>
                </div>

                {/* Animated Bar Chart */}
                <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-sm border border-slate-100 mb-2 sm:mb-3 h-24 sm:h-32 flex items-end justify-between px-1.5 sm:px-2 gap-1 sm:gap-1.5">
                  {currentChartData.map((h, i) => (
                    <div key={i} className="relative w-full group">
                      <div
                        className="w-full bg-gradient-to-t from-cyan-300 to-blue-400 rounded-t-xs sm:rounded-t-sm transition-all duration-1000 ease-out"
                        style={{ height: `${h}%` }}
                      />
                      <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[7px] sm:text-[8px] px-1 py-0.5 sm:px-1.5 sm:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${h * 10}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Indicators */}
                <div className="flex justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                  {chartDataSets.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveChart(i);
                        setCurrentChartData(chartDataSets[i]);
                      }}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${i === activeChart ? "bg-blue-500 scale-125" : "bg-slate-300"}`}
                    />
                  ))}
                </div>

                {/* Progress Bars with Labels */}
                <div className="space-y-2 sm:space-y-3 mb-2 sm:mb-3">
                  <div>
                    <div className="flex justify-between text-[10px] sm:text-xs text-slate-600 mb-1">
                      <span>Food & Dining</span>
                      <span className="font-semibold">$420 / $600</span>
                    </div>
                    <div className="h-1.5 sm:h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-[70%] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-1000" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] sm:text-xs text-slate-600 mb-1">
                      <span>Entertainment</span>
                      <span className="font-semibold">$180 / $450</span>
                    </div>
                    <div className="h-1.5 sm:h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-[40%] bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full transition-all duration-1000" />
                    </div>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  {[
                    {
                      icon: CreditCard,
                      label: "Cards",
                      color: "blue",
                      bg: "blue",
                      count: "3",
                    },
                    {
                      icon: Bot,
                      label: "AI Tips",
                      color: "cyan",
                      bg: "cyan",
                      count: "12",
                    },
                    {
                      icon: Wallet,
                      label: "Income",
                      color: "green",
                      bg: "green",
                      count: "$4.2k",
                    },
                    {
                      icon: Target,
                      label: "Budget",
                      color: "purple",
                      bg: "purple",
                      count: "85%",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-sm flex flex-col items-center hover:scale-105 transition-transform"
                      style={{ 
                        backgroundColor: `rgba(var(--${item.color}-50), 0.5)`,
                        background: `var(--${item.color}-50, #eff6ff)`
                      }}
                    >
                      <div
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-${item.color}-400 to-${item.color}-500 flex items-center justify-center mb-1 sm:mb-1.5`}
                      >
                        <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-slate-700">
                        {item.label}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-bold text-slate-900 mt-0.5">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Donut Chart with Details */}
                <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-white/50 rounded-lg sm:rounded-xl">
                  <div className="relative w-10 h-10 sm:w-14 sm:h-14">
                    <svg
                      viewBox="0 0 36 36"
                      className="w-full h-full rotate-[-90deg]"
                    >
                      <path
                        className="text-slate-100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                      />
                      <path
                        className="text-blue-500 transition-all duration-1000"
                        strokeDasharray="75, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-blue-900 font-bold text-[10px] sm:text-xs">
                        75%
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] sm:text-[10px] font-semibold text-slate-800 mb-0.5 sm:mb-1">
                      Monthly Goal
                    </p>
                    <div className="space-y-1 sm:space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] sm:text-[9px] text-slate-500">
                          Spending
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-900">
                          $2,850
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] sm:text-[9px] text-slate-500">
                          Remaining
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-bold text-green-600">
                          $950
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Features & Actions */}
        <div className="space-y-4 md:space-y-6 transform transition-all duration-500 hover:scale-[1.02] lg:hover:scale-105 order-3">
          {/* Feature Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 shadow-lg border border-slate-200/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Security</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900">100% Safe</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bank-level encryption & real-time fraud detection
            </p>
          </div>

          {/* Download Stats */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl md:rounded-2xl p-4 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-3">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <div>
                <p className="text-xs opacity-90">Downloads</p>
                <p className="text-lg sm:text-xl font-bold">50K+</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-1.5 sm:-space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 border-2 border-blue-500"
                  />
                ))}
              </div>
              <button className="text-xs font-semibold bg-white/20 hover:bg-white/30 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full transition-colors">
                Join Now
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 shadow-lg border border-slate-200/50">
            <p className="text-xs font-semibold text-slate-900 mb-3">
              Quick Actions
            </p>
            <div className="space-y-2">
              {[
                { icon: Play, label: "Watch Tutorial", color: "blue" },
                { icon: BarChart3, label: "View Report", color: "green" },
                { icon: PieChart, label: "Export Data", color: "purple" },
              ].map((action, i) => (
                <button
                  key={i}
                  className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-slate-50/50 transition-colors group"
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${action.color === 'blue' ? 'bg-blue-100' : action.color === 'green' ? 'bg-green-100' : 'bg-purple-100'} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <action.icon
                      className={`${action.color === 'blue' ? 'text-blue-600' : action.color === 'green' ? 'text-green-600' : 'text-purple-600'} w-3.5 h-3.5 sm:w-4 sm:h-4`}
                    />
                  </div>
                  <span className="text-xs text-slate-700 flex-1 text-left">
                    {action.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}