export interface IExpense {
  id: string;
  category: ITransactionCategory;
  amount: number;
  date: Date;
  note?: string | null;
  location?: string | null;
}

export interface IIncome {
  id: string;
  category: ITransactionCategory;
  amount: number;
  date: Date;
  note?: string | null;
}

export interface IBudget {
  id: string;
  category: ITransactionCategory;
  initAmount: number;
  resetPeriod: "daily" | "weekly" | "monthly" | "yearly" | string;
  currentAmount: number;
  color: string;
}

export interface ITransactionCategory {
  type: string;
  name: string;
  emoji: string;
}

export interface ILocalCategory {
  id: number;
  oldVal: string;
  newVal: string;
  emoji: string;
  isEditing?: boolean;
  isAdded?: boolean;
  isDeletedLocally?: boolean;
  isUpdated?: boolean;
  errors?: {
    emoji?: string | null;
    newVal?: string | null;
  };
}
