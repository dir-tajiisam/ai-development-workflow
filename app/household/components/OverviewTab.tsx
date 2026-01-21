'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Transaction, TransactionType, CategoryType } from '../../types/household';
import { calculateMonthlyStats, formatCurrency } from '../../utils/household';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/household';

interface OverviewTabProps {
  transactions: Transaction[];
  selectedMonth: string;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export default function OverviewTab({
  transactions,
  selectedMonth,
  onAddTransaction,
}: OverviewTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<CategoryType>('食費');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const stats = calculateMonthlyStats(transactions, selectedMonth);
  const totalBalance = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    onAddTransaction({
      type: transactionType,
      category,
      amount: parseFloat(amount),
      date,
      description,
    });

    // Reset form
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsDialogOpen(false);
  };

  const categories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-3xl shadow-2xl p-8 text-white transform hover:scale-105 transition-transform duration-300">
        <p className="text-emerald-100 text-lg mb-2">総資産残高</p>
        <p className="text-6xl font-bold mb-4 animate-pulse">{formatCurrency(totalBalance)}</p>
        <div className="h-1 w-32 bg-white/30 rounded-full"></div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
              💰
            </div>
            <div>
              <p className="text-slate-600 text-sm">今月の収入</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(stats.totalIncome)}</p>
            </div>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-2xl">
              💸
            </div>
            <div>
              <p className="text-slate-600 text-sm">今月の支出</p>
              <p className="text-3xl font-bold text-red-600">{formatCurrency(stats.totalExpense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Balance */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-lg mb-2">今月の収支</p>
            <p className={`text-4xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.balance)}
            </p>
          </div>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
            stats.balance >= 0 ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {stats.balance >= 0 ? '📈' : '📉'}
          </div>
        </div>
      </div>

      {/* Add Transaction Button */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Trigger asChild>
          <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            ➕ 新しい取引を追加
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-scale-in">
            <Dialog.Title className="text-3xl font-bold text-slate-800 mb-6">
              取引を追加
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  種類
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType('income');
                      setCategory('給与');
                    }}
                    className={`py-3 rounded-xl font-semibold transition-all duration-300 ${
                      transactionType === 'income'
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    💰 収入
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType('expense');
                      setCategory('食費');
                    }}
                    className={`py-3 rounded-xl font-semibold transition-all duration-300 ${
                      transactionType === 'expense'
                        ? 'bg-red-500 text-white shadow-lg scale-105'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    💸 支出
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  カテゴリ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  金額
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  日付
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  説明（任意）
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="例: スーパーで買い物"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
                  >
                    キャンセル
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  追加
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
