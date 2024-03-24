export interface IExpense {
  id: string;
  category: { id: string; type: string; name: string };
  amount: number;
  date: Date;
  note?: string | null;
  location?: string | null;
  categoryId: string;
}

export interface IIncome {
  id: string;
  category: { id: string; type: string; name: string };
  amount: number;
  date: Date;
  note?: string | null;
  categoryId: string;
}

export interface IBudget {
  id: string;
  category: { id: string; type: string; name: string };
  initAmount: number;
  resetPeriod: "daily" | "weekly" | "monthly" | "yearly" | string;
  currentAmount: number;
  color: string;
  categoryId: string;
}

export interface ITransactionCategory {
  id: string;
  type: "expense" | "income" | string;
  name: string;
}
