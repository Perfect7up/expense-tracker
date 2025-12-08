export interface ExpenseAggregate {
  period: string;
  periodDisplay: string;
  totalAmount: number;
  expenseCount: number;
  currency: string;
  categoryId?: string;
  year?: number;
  month?: number;
}

export interface ExpenseSummary {
  period: string;
  totalAmount: number;
  expenseCount: number;
  averageAmount: number;
}

export interface PeriodTotals {
  period: string;
  totalAmount: number;
  expenseCount: number;
  previousPeriodTotal: number;
  percentageChange: number;
  startDate: string;
  endDate: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
