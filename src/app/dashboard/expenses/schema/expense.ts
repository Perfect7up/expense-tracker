import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  note: z.string().optional(),
  occurredAt: z.string(),
  currency: z.string().default("USD"),
  categoryId: z.string().nullable().optional(),
  subscriptionId: z.string().nullable().optional(), // Add this
});
export type ExpenseFormType = z.infer<typeof expenseSchema>;
