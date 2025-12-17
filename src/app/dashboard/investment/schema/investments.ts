import { z } from "zod";

export const investmentFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    symbol: z.string().optional(),
    quantity: z.coerce.number().min(0),
    averageBuyPrice: z.coerce.number().min(0),
    currentPrice: z.coerce.number().optional(),
    // New fields
    categoryId: z.string().optional(),
    type: z.enum(["buy", "sell"]).default("buy"),
  });

export type InvestmentFormValues = z.infer<typeof investmentFormSchema>;
