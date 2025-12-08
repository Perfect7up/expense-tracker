import { ReactNode } from "react";

export const INITIAL_WELCOME_MESSAGE = {
  id: "initial-welcome-message",
  type: "ai" as const,
  text: `Hi! I'm your finance assistant. You can:

 **Track Transactions:**
• 'I spent $15 on lunch'
• 'Add $50 for groceries'
• 'Add income of $5000'
• 'Got paid $2000 salary'

 **Download Reports:**
• 'Download expense summary'
• 'Give me income report'

 **Or just chat with me!** `,
  timestamp: new Date(),
};

export const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#8DD1E1",
  "#A4DE6C",
  "#D0ED57",
  "#FFC0CB",
  "#FFA07A",
];

export interface CardInfo {
  title: string;
  icon: ReactNode;
  color: string;
}
