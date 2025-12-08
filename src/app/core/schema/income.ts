import { z } from "zod";

export const createIncomeSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  source: z.string().optional(),
  note: z.string().optional(),
  receivedAt: z.string().datetime().or(z.string()),
  currency: z.string().default("USD"),
  categoryId: z.string().optional().nullable(),
});

export const updateIncomeSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive").optional(),
  source: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  receivedAt: z.string().datetime().or(z.string()).optional(),
  currency: z.string().optional(),
  categoryId: z.string().optional().nullable(),
});

// Types for aggregation
export interface IncomeAggregate {
  period: string;
  periodDisplay: string;
  totalAmount: number;
  incomeCount: number;
  currency: string;
  categoryId?: string | null;
  source?: string | null;
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
