import { z } from "zod";

export const incomeSchema = z.object({
  // FIX: Use z.coerce.number() to handle string inputs from HTML forms
  amount: z.coerce
    .number({ message: "Amount is required" })
    .positive("Amount must be positive"),

  currency: z.string().min(1, "Currency is required"),
  receivedAt: z.string(),
  source: z.string().optional(),
  note: z.string().optional(),
  categoryId: z.string().optional(),
});

export type IncomeFormType = z.infer<typeof incomeSchema>;

// The server schemas below were already correct (they used coerce),
// but including them here for completeness.

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
