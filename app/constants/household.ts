import type { CategoryType } from '../types/household';

export const EXPENSE_CATEGORIES: CategoryType[] = [
  '食費',
  '交通費',
  '住居費',
  '光熱費',
  '通信費',
  '娯楽費',
  '医療費',
  '教育費',
  '被服費',
  '交際費',
  'その他',
];

export const INCOME_CATEGORIES: CategoryType[] = ['給与', '副業', 'その他'];

export const CATEGORY_COLORS: Record<CategoryType, string> = {
  食費: '#ef4444',
  交通費: '#f97316',
  住居費: '#f59e0b',
  光熱費: '#eab308',
  通信費: '#84cc16',
  娯楽費: '#22c55e',
  医療費: '#10b981',
  教育費: '#14b8a6',
  被服費: '#06b6d4',
  交際費: '#0ea5e9',
  給与: '#3b82f6',
  副業: '#6366f1',
  その他: '#8b5cf6',
};
