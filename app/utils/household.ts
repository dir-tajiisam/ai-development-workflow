import type { Transaction, MonthlyStats, CategoryStats, CategoryType } from '../types/household';

export function calculateMonthlyStats(
  transactions: Transaction[],
  month: string
): MonthlyStats {
  const monthTransactions = transactions.filter(t => t.date.startsWith(month));

  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    month,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}

export function calculateCategoryStats(
  transactions: Transaction[],
  month: string,
  type: 'income' | 'expense'
): CategoryStats[] {
  const monthTransactions = transactions.filter(
    t => t.date.startsWith(month) && t.type === type
  );

  const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const categoryMap = new Map<CategoryType, { amount: number; count: number }>();

  monthTransactions.forEach(t => {
    const existing = categoryMap.get(t.category) || { amount: 0, count: 0 };
    categoryMap.set(t.category, {
      amount: existing.amount + t.amount,
      count: existing.count + 1,
    });
  });

  // Convert to array and calculate percentages
  const stats: CategoryStats[] = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({
      category,
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
      count: data.count,
    })
  );

  // Sort by amount descending
  return stats.sort((a, b) => b.amount - a.amount);
}

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getMonthList(transactions: Transaction[]): string[] {
  const months = new Set<string>();
  transactions.forEach(t => {
    const month = t.date.substring(0, 7); // YYYY-MM
    months.add(month);
  });

  // Add current month if no transactions
  if (months.size === 0) {
    months.add(getCurrentMonth());
  }

  return Array.from(months).sort().reverse();
}
