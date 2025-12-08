export interface IncomeAggregate {
  period: string;
  periodDisplay: string;
  totalAmount: number;
  incomeCount: number;
  currency: string;
  categoryId?: string;
  source?: string;
  year?: number;
  month?: number;
}

export interface IncomeSummary {
  period: string;
  totalAmount: number;
  incomeCount: number;
  averageAmount: number;
}

export interface IncomePeriodTotals {
  period: string;
  totalAmount: number;
  incomeCount: number;
  previousPeriodTotal: number;
  percentageChange: number;
  startDate: string;
  endDate: string;
}
