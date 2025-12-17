export interface Investment {
    id: string;
    name: string;
    symbol?: string | null;
    quantity: number;
    averageBuyPrice: number;
    currentPrice?: number | null;
    categoryId?: string | null;
    categoryName?: string;
    type?: "buy" | "sell";
    createdAt?: string | Date;
    updatedAt?: string | Date;
    note?: string;
  }