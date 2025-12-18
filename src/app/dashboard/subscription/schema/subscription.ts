import { z } from "zod";
import { formatISO } from "date-fns";

export const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  currency: z.string().default("USD"),
  cycle: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "QUARTERLY", "BIANNUALLY"]),
  startDate: z.string().default(() => formatISO(new Date())),
  nextBilling: z.string().default(() => formatISO(new Date())),
  endDate: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  autoExpense: z.boolean().default(true),
  note: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

export const CYCLE_OPTIONS = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "YEARLY", label: "Yearly" },
];

// Currency options
export const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD (C$)" },
  { value: "AUD", label: "AUD (A$)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "INR", label: "INR (₹)" },
];