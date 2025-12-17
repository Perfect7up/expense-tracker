"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  getDate,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";

import { Button } from "@/app/core/components/ui/button";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/core/components/ui/card";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  List,
  Target,
  TrendingUp,
  DollarSign,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Badge } from "@/app/core/components/ui/badge";

interface CalendarDataItem {
  date: Date;
  amount: number;
  [key: string]: any;
}

interface CalendarViewProps {
  // Data
  data?: CalendarDataItem[];
  isLoading?: boolean;

  // Configuration
  title: string;
  description: string;
  colorScheme?: "shared" | "default";
  showMonthlyButton?: boolean;
  showAverage?: boolean;

  // Callbacks
  onDateSelect?: (date: Date | undefined) => void;
  onShowMonthly?: () => void;
  setDailyData?: (data: any[]) => void;
  setSelectedDate?: (date: Date | undefined) => void;

  // Customization
  formatAmount?: (amount: number) => string;
  getItemDate?: (item: any) => Date;
  getItemAmount?: (item: any) => number;
}

export function GenericCalendarView({
  data = [],
  isLoading = false,
  title = "Calendar View",
  description = "Track your daily patterns",
  colorScheme = "default",
  showMonthlyButton = true,
  showAverage = true,
  onDateSelect,
  onShowMonthly,
  setDailyData,
  setSelectedDate,
  formatAmount = (amount) => `$${amount.toFixed(2)}`,
  getItemDate = (item) => new Date(item.date),
  getItemAmount = (item) => item.amount,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [localSelectedDate, setLocalSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // Color schemes
  const colors = {
    shared: {
      primary: "from-blue-500 to-cyan-500",
      secondary: "blue",
      light: "blue",
      bg: "from-blue-50/30 to-cyan-50/30",
      border: "blue-100/30",
      text: "text-blue-600",
      gradient: "bg-gradient-to-br",
    },
    default: {
      primary: "from-slate-500 to-gray-500",
      secondary: "slate",
      light: "slate",
      bg: "from-slate-50/30 to-gray-50/30",
      border: "slate-100/30",
      text: "text-slate-600",
      gradient: "bg-gradient-to-br",
    },
  };

  const scheme = colors[colorScheme];

  // 1. Get total for the month
  const getMonthlyTotal = useCallback(() => {
    if (!data || !Array.isArray(data)) return 0;

    return data
      .filter((item) => {
        if (!item) return false;
        const itemDate = getItemDate(item);
        return isSameMonth(itemDate, currentMonth);
      })
      .reduce((sum, item) => sum + getItemAmount(item), 0);
  }, [data, currentMonth, getItemDate, getItemAmount]);

  // 2. Get days with data
  const getDaysWithData = useCallback(() => {
    if (!data || !Array.isArray(data)) return new Set<number>();

    const days = new Set<number>();
    data.forEach((item) => {
      if (!item) return;
      const itemDate = getItemDate(item);

      if (isSameMonth(itemDate, currentMonth)) {
        days.add(getDate(itemDate));
      }
    });
    return days;
  }, [data, currentMonth, getItemDate]);

  // 3. Get data for specific date
  const getDataForSelectedDate = useCallback(
    (date: Date | undefined) => {
      if (!date || !data || !Array.isArray(data)) return [];

      return data.filter((item) => {
        if (!item) return false;
        return isSameDay(getItemDate(item), date);
      });
    },
    [data, getItemDate]
  );

  // Handle selecting a date
  const handleDateSelect = (date: Date | undefined) => {
    setLocalSelectedDate(date);
    if (onDateSelect) onDateSelect(date);
    if (setSelectedDate) setSelectedDate(date);

    const daily = getDataForSelectedDate(date);
    if (setDailyData) setDailyData(daily);
  };

  // Navigate months
  const goToPreviousMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateSelect(today);
  };

  // Get total for selected date
  const getDailyTotal = (date: Date | undefined) => {
    if (!date) return 0;
    const dailyData = getDataForSelectedDate(date);
    return dailyData.reduce((sum, item) => sum + getItemAmount(item), 0);
  };

  // Calculate days in month for averages
  const getDaysInMonth = useCallback(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    return days.length;
  }, [currentMonth]);

  useEffect(() => {
    const daily = getDataForSelectedDate(localSelectedDate);
    if (setDailyData) setDailyData(daily);
  }, [localSelectedDate, getDataForSelectedDate, setDailyData]);

  const daysWithData = getDaysWithData();
  const monthlyTotal = getMonthlyTotal();
  const daysInMonth = getDaysInMonth();

  // Custom day content renderer
  const renderDayContent = (date: Date) => {
    const dayNumber = getDate(date);
    const dailyTotal = getDailyTotal(date);
    const hasData =
      daysWithData.has(dayNumber) && isSameMonth(date, currentMonth);

    return (
      <div className="relative flex items-center justify-center w-full h-full">
        <span className="z-10">{format(date, "d")}</span>
        {hasData && dailyTotal > 0 && (
          <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 transform -translate-x-1/2">
            <div
              className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-${scheme.secondary}-500 ring-2 ring-white/50`}
            />
          </div>
        )}
      </div>
    );
  };

  // Custom calendar component
  const renderCalendar = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const firstDayOfWeek = start.getDay();

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="space-y-2">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] sm:text-xs md:text-sm font-semibold text-slate-500 py-1 sm:py-2 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square sm:h-12" />
          ))}

          {/* Days of the month */}
          {days.map((date) => {
            const isToday = isSameDay(date, new Date());
            const isSelected =
              localSelectedDate && isSameDay(date, localSelectedDate);
            const isCurrentMonth = isSameMonth(date, currentMonth);

            return (
              <button
                key={date.toISOString()}
                onClick={() => isCurrentMonth && handleDateSelect(date)}
                disabled={!isCurrentMonth || date > new Date()}
                className={`
                  relative aspect-square sm:h-12 w-full rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300
                  flex items-center justify-center
                  ${!isCurrentMonth ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  ${
                    isSelected
                      ? `bg-linear-to-br ${scheme.primary} text-white shadow-lg shadow-${scheme.secondary}-500/30 scale-105`
                      : isToday
                        ? `bg-linear-to-br from-${scheme.light}-100 to-${scheme.light}-200 text-${scheme.text} border border-${scheme.light}-300`
                        : "hover:bg-slate-50 hover:text-slate-700"
                  }
                  ${date > new Date() ? "opacity-30 cursor-not-allowed" : ""}
                `}
              >
                {renderDayContent(date)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px]">
        <Loader2 className={`w-10 h-10 animate-spin text-${scheme.secondary}-500`} />
        <p className="text-slate-500 text-sm">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 rounded-2xl">
        <div
          className={`absolute top-1/3 left-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-${scheme.light}-100/10 rounded-full blur-3xl`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-${scheme.light}-100/10 rounded-full blur-3xl`}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
        {/* Responsive Header */}
        <div className={`relative bg-linear-to-r ${scheme.primary} p-4 sm:p-6`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl" />

          <CardHeader className="relative z-10 p-0 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
                  <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white truncate">
                    {title}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-white/80 truncate">{description}</p>
                </div>
              </div>

              {/* Stats & Actions - Stack on mobile, Row on Desktop */}
              <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full md:w-auto">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/30 grow sm:grow-0 flex sm:block items-center justify-between sm:justify-center gap-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                      Total
                    </span>
                  </div>
                  <p className="text-sm sm:text-lg font-bold text-white sm:mt-1">
                    {formatAmount(monthlyTotal)}
                  </p>
                </div>

                {showMonthlyButton && onShowMonthly && (
                  <Button
                    onClick={onShowMonthly}
                    disabled={!localSelectedDate}
                    className="rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white gap-2 px-4 h-10 sm:h-[62px] grow sm:grow-0 transition-all duration-300 group whitespace-nowrap text-xs sm:text-sm"
                  >
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">Show Month</span>
                    <span className="sm:hidden">List</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Month Navigation - Stacked nicely for mobile */}
          <div
            className={`flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-linear-to-r from-${scheme.light}-50/50 to-${scheme.light}-100/50 rounded-xl border border-${scheme.light}-100/30`}
          >
            {/* Nav Arrows & Title */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
                className={`rounded-lg w-8 h-8 sm:w-10 sm:h-10 border-${scheme.light}-200/50 hover:bg-${scheme.light}-50 hover:border-${scheme.light}-300 p-0`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-center flex-1 sm:flex-none px-2">
                <h3 className="text-base sm:text-xl font-bold text-slate-900">
                  {format(currentMonth, "MMMM yyyy")}
                </h3>
                <Badge
                  variant="outline"
                  className={`mt-0.5 sm:mt-1 bg-transparent text-${scheme.text} border-${scheme.light}-200/50 text-[10px] sm:text-xs h-auto py-0 sm:py-0.5 font-normal`}
                >
                  <Target className="w-3 h-3 mr-1" />
                  {daysWithData.size} days active
                </Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
                className={`rounded-lg w-8 h-8 sm:w-10 sm:h-10 border-${scheme.light}-200/50 hover:bg-${scheme.light}-50 hover:border-${scheme.light}-300 p-0`}
                disabled={addMonths(currentMonth, 1) > new Date()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={goToToday}
                className={`w-full sm:w-auto rounded-xl border-${scheme.light}-200/50 hover:bg-${scheme.light}-50 hover:border-${scheme.light}-300 px-4 h-9 sm:h-10 text-xs sm:text-sm`}
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Go to Today
              </Button>
            </div>
          </div>

          {/* Calendar Grid & Selected Info */}
          <div className="space-y-4">
            <div className="p-2 sm:p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200/50">
              {renderCalendar()}
            </div>

            {/* Selected Date Info Panel */}
            {localSelectedDate && (
              <div className="p-3 sm:p-4 bg-linear-to-r from-slate-50/50 to-white rounded-xl border border-slate-200/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-${scheme.light}-100 to-${scheme.light}-200 flex items-center justify-center shrink-0`}
                    >
                      <Target className={`w-4 h-4 sm:w-5 sm:h-5 text-${scheme.text}`} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm sm:text-base">
                        {format(localSelectedDate, "EEEE, MMMM do")}
                        </h4>
                        <p className="text-xs text-slate-500 sm:hidden">
                          {format(localSelectedDate, "yyyy")}
                        </p>
                    </div>
                  </div>
                  <Badge
                    className={`self-start sm:self-center bg-white text-${scheme.text} border border-${scheme.light}-200 shadow-sm text-xs sm:text-sm py-1`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Total: {formatAmount(getDailyTotal(localSelectedDate))}
                  </Badge>
                </div>

                {/* Responsive Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  <div
                    className={`flex items-center justify-between sm:block p-3 ${scheme.bg} rounded-lg border border-${scheme.border}`}
                  >
                    <p className="text-xs sm:text-sm text-slate-600">Transactions</p>
                    <p className="text-base sm:text-xl font-bold text-slate-900">
                      {getDataForSelectedDate(localSelectedDate).length}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between sm:block p-3 bg-linear-to-r from-slate-50/30 to-gray-50/30 rounded-lg border border-slate-100/30">
                    <p className="text-xs sm:text-sm text-slate-600">Daily Average (Active)</p>
                    <p className="text-base sm:text-xl font-bold text-slate-900">
                      {daysWithData.size > 0
                        ? formatAmount(monthlyTotal / daysWithData.size)
                        : formatAmount(0)}
                    </p>
                  </div>

                  {showAverage && (
                    <div className="flex items-center justify-between sm:block p-3 bg-linear-to-r from-emerald-50/30 to-green-50/30 rounded-lg border border-emerald-100/30">
                      <p className="text-xs sm:text-sm text-slate-600">
                        Daily Average (Month)
                      </p>
                      <p className="text-base sm:text-xl font-bold text-slate-900">
                        {formatAmount(monthlyTotal / daysInMonth)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </div>
  );
}