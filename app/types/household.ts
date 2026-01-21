export type TransactionType = 'income' | 'expense';

export type CategoryType =
  | '食費'
  | '交通費'
  | '住居費'
  | '光熱費'
  | '通信費'
  | '娯楽費'
  | '医療費'
  | '教育費'
  | '被服費'
  | '交際費'
  | '給与'
  | '副業'
  | 'その他';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: CategoryType;
  amount: number;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  description: string;
  createdAt: number; // timestamp
}

export interface MonthlyStats {
  month: string; // YYYY-MM format
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryStats {
  category: CategoryType;
  amount: number;
  percentage: number;
  count: number;
}
