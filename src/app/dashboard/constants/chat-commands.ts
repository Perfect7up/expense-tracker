import { DollarSign, TrendingUp, Download } from "lucide-react";

export const HELP_CATEGORIES = [
  {
    id: "transaction",
    label: "Add Transactions",
    icon: DollarSign,
    color: "text-green-500",
    examples: [
      "Spent $50 on Groceries",
      "Income $5000 from Salary",
      "Paid $15 for Netflix monthly",
    ],
  },
  {
    id: "investment",
    label: "Investments",
    icon: TrendingUp,
    color: "text-blue-500",
    examples: [
      "Buy 10 AAPL at $150",
      "Sell 2 BTC at $40000",
      "Bought 50 shares of TSLA",
    ],
  },
  {
    id: "reports",
    label: "Download Reports",
    icon: Download,
    color: "text-purple-500",
    examples: [
      "Download expense report",
      "Export incomes as JSON",
      "Get expense CSV",
    ],
  },
];