import { z } from "zod";

export const expenseSchema = z.object({
  // z.coerce.number() automatically handles "10.50" (string) -> 10.50 (number)
  amount: z.coerce.number().min(0.01, "Amount must be at least 0.01"),

  note: z.string().optional().or(z.literal("")),
  occurredAt: z.string(),
  currency: z.string(),
  // Allow empty string, undefined, or null, transforming empty string to null/undefined
  categoryId: z.string().optional().nullable(),
});

export type ExpenseFormType = z.infer<typeof expenseSchema>;
