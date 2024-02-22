export interface IExpense {
  id: string;
  category: string;
  amount: number;
  date: Date;
  note?: string | null;
  location?: string | null;
}

export interface IIncome {
  id: string;
  category: string;
  amount: number;
  date: Date;
  note?: string | null;
}

export interface IBudget {
  id: string;
  category: string;
  initAmount: number;
  resetPeriod: "daily" | "weekly" | "monthly" | "yearly" | string;
  currentAmount: number;
  color: string;
}

export interface ITransactionCategory {
  id: string;
  type: "expense" | "income" | string;
  name: string;
}
