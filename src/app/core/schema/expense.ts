import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.number().min(0.01, "Amount must be at least 0.01"),
  note: z.string(),
  occurredAt: z.string(),
  currency: z.string(),
  categoryId: z.string().nullable(),
});

export type ExpenseFormType = z.infer<typeof expenseSchema>;
