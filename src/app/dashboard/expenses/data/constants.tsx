import {
    Calendar,
    CalendarDays,
    PieChart,
    BarChart3,
    List,
    Clock,
    Sparkles,
    Target,
    Plus,
    ArrowRight,
  } from "lucide-react";
  
  export const TAB_CONFIGS = [
    {
      value: "list",
      icon: <List className="h-4 w-4" />,
      label: "All Expenses",
      color: "from-blue-500 to-cyan-400",
      description: "View and manage all your expenses",
    },
    {
      value: "daily",
      icon: <Calendar className="h-4 w-4" />,
      label: "Daily View",
      color: "from-emerald-500 to-green-400",
      description: "Daily expense tracking and calendar view",
    },
    {
      value: "monthly",
      icon: <PieChart className="h-4 w-4" />,
      label: "Monthly View",
      color: "from-purple-500 to-pink-400",
      description: "Monthly spending analysis and trends",
    },
    {
      value: "analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      label: "Analytics",
      color: "from-orange-500 to-amber-400",
      description: "Detailed analytics and insights",
    },
  ] as const;
  
  export const TIME_FILTERS = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "quarter", label: "Quarter" },
    { value: "year", label: "Year" },
    { value: "all", label: "All Time" },
  ] as const;
  
  export const INSTRUCTIONS = [
    { text: "Click any date to see expenses for that day", icon: Calendar },
    { text: "Use arrow buttons to navigate between months", icon: CalendarDays },
    { text: "Click 'Show Month' to view monthly expenses", icon: PieChart },
    { text: "Future dates are disabled for entry", icon: Clock },
  ] as const;
  
  export const QUICK_TIPS_CONFIG = {
    icon: Sparkles,
    title: "Quick Tips",
    gradient: "from-purple-50 to-pink-50/30",
    border: "border-purple-100/50",
    iconGradient: "from-purple-500 to-pink-400",
  } as const;
  
  export const ADD_EXPENSE_BUTTON_CONFIG = {
    icon: Plus,
    gradient: "from-blue-500 to-cyan-500",
    hoverGradient: "from-blue-600 to-cyan-600",
    text: "Add Expense",
    arrowIcon: ArrowRight,
  } as const;
  
  export const PAGE_HEADER_CONFIG = {
    title: "EXPENSE TRACKER",
    description:
      "Track, analyze, and optimize your spending with AI-powered insights and real-time financial intelligence.",
    icon: Target,
    tagline: "Smart Expense Management",
  } as const;