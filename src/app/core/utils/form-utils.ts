import { toast } from "sonner";

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "(United States Dollar)", symbol: "$" },
  { value: "EUR", label: "(Euro)", symbol: "€" },
  { value: "GBP", label: "(British Pound)", symbol: "£" },
  { value: "CAD", label: "(Canadian Dollar)", symbol: "$" },
  { value: "AUD", label: "(Australian Dollar)", symbol: "$" },
  { value: "PAK", label: "(Pakistan Ruppees)", symbol: "Rs." },
] as const;

export const formatCurrencySymbol = (currency: string) => {
  const currencyObj = CURRENCY_OPTIONS.find((c) => c.value === currency);
  return currencyObj?.symbol || "$";
};

export const handleFormError = (error: any, defaultMessage: string) => {
  console.error(defaultMessage, error);
  toast.error(error.message || defaultMessage);
};

export const getDefaultDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Common form reset values
export const resetExpenseForm = {
  amount: 0,
  currency: "USD",
  note: "",
  categoryId: "",
  occurredAt: getDefaultDate(),
};

export const resetIncomeForm = {
  amount: 0,
  currency: "USD",
  source: "",
  note: "",
  categoryId: "",
  receivedAt: getDefaultDate(),
};
