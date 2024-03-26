export interface IExpense {
  id: string;
  category: { id: string; type: string; name: string };
  amount: number;
  date: Date;
  note?: string | null;
  location?: string | null;
}

export interface IIncome {
  id: string;
  category: { id: string; type: string; name: string };
  amount: number;
  date: Date;
  note?: string | null;
}

export interface IBudget {
  id: string;
  category: { type?: string; name: string };
  initAmount: number;
  resetPeriod: "daily" | "weekly" | "monthly" | "yearly" | string;
  currentAmount: number;
  color: string;
}

export interface ITransactionCategory {
  type: "expense" | "income" | string;
  name: string;
}
