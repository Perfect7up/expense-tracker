import { z } from "zod";

export const investmentFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string().optional(),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or more"),
  averageBuyPrice: z.coerce.number().min(0, "Price must be 0 or more"),
  currentPrice: z.coerce.number().optional().default(0),
  currency: z.string().min(1, "Currency is required").default("USD"),
  categoryId: z.string().optional().nullable(),
  type: z.enum(["buy", "sell"]).default("buy"),
});

export type InvestmentFormValues = z.infer<typeof investmentFormSchema>;