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
      <div className="glass-morph rounded-3xl p-8 text-white transform hover:scale-105 transition-transform duration-300 hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] animate-float border-2 border-cyan-400">
        <p className="text-cyan-300 text-xl mb-2 font-bold">総資産残高</p>
        <p className="text-7xl font-bold mb-4 text-cyan-400 animate-neon-pulse">{formatCurrency(totalBalance)}</p>
        <div className="h-2 w-40 bg-gradient-to-r from-cyan-400 via-magenta-400 to-yellow-400 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.8)]"></div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Card */}
        <div className="glass-morph rounded-2xl p-6 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,128,255,0.6)] transition-all duration-300 border border-blue-400 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(0,128,255,0.8)] animate-float">
              💰
            </div>
            <div>
              <p className="text-cyan-300 text-sm font-bold">今月の収入</p>
              <p className="text-4xl font-bold text-blue-400 animate-flicker">{formatCurrency(stats.totalIncome)}</p>
            </div>
          </div>
        </div>

        {/* Expense Card */}
        <div className="glass-morph rounded-2xl p-6 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,255,0.6)] transition-all duration-300 border border-magenta-400 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-magenta-500 to-red-600 rounded-xl flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(255,0,255,0.8)] animate-float" style={{ animationDelay: '1s' }}>
              💸
            </div>
            <div>
              <p className="text-cyan-300 text-sm font-bold">今月の支出</p>
              <p className="text-4xl font-bold text-magenta-400 animate-flicker">{formatCurrency(stats.totalExpense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Balance */}
      <div className="glass-morph rounded-2xl p-6 border-2 border-yellow-400 hover:shadow-[0_0_30px_rgba(255,255,0,0.6)] transition-all animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-cyan-300 text-xl mb-2 font-bold">今月の収支</p>
            <p className={`text-5xl font-bold ${stats.balance >= 0 ? 'text-green-400 animate-neon-pulse' : 'text-red-400 animate-neon-pulse'}`}>
              {formatCurrency(stats.balance)}
            </p>
          </div>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${
            stats.balance >= 0 ? 'bg-green-500/20 border-2 border-green-400 shadow-[0_0_20px_rgba(0,255,128,0.8)]' : 'bg-red-500/20 border-2 border-red-400 shadow-[0_0_20px_rgba(255,0,0,0.8)]'
          } animate-float`}>
            {stats.balance >= 0 ? '📈' : '📉'}
          </div>
        </div>
      </div>

      {/* Add Transaction Button */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Trigger asChild>
          <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white rounded-2xl font-bold text-xl shadow-[0_0_30px_rgba(0,255,255,0.8)] hover:shadow-[0_0_40px_rgba(255,0,255,0.9)] hover:scale-105 transition-all duration-300 border-2 border-cyan-400 animate-glow-pulse">
            ➕ 新しい取引を追加
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-morph rounded-3xl shadow-[0_0_50px_rgba(0,255,255,0.6)] p-8 w-full max-w-md animate-scale-in border-2 border-cyan-400">
            <Dialog.Title className="text-4xl font-bold text-cyan-400 mb-6 animate-neon-pulse">
              取引を追加
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-bold text-cyan-300 mb-2">
                  種類
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTransactionType('income');
                      setCategory('給与');
                    }}
                    className={`py-3 rounded-xl font-bold transition-all duration-300 ${
                      transactionType === 'income'
                        ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(0,128,255,0.8)] scale-105 border-2 border-blue-400'
                        : 'bg-slate-800 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400'
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
                    className={`py-3 rounded-xl font-bold transition-all duration-300 ${
                      transactionType === 'expense'
                        ? 'bg-magenta-500 text-white shadow-[0_0_20px_rgba(255,0,255,0.8)] scale-105 border-2 border-magenta-400'
                        : 'bg-slate-800 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400'
                    }`}
                  >
                    💸 支出
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-cyan-300 mb-2">
                  カテゴリ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-cyan-400 bg-slate-900 text-cyan-100 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-bold text-cyan-300 mb-2">
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-cyan-400 bg-slate-900 text-cyan-100 placeholder-cyan-600 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-bold text-cyan-300 mb-2">
                  日付
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-cyan-400 bg-slate-900 text-cyan-100 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-cyan-300 mb-2">
                  説明（任意）
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="例: スーパーで買い物"
                  className="w-full px-4 py-3 rounded-xl border-2 border-cyan-400 bg-slate-900 text-cyan-100 placeholder-cyan-600 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex-1 py-3 bg-slate-700 text-cyan-100 rounded-xl font-bold hover:shadow-[0_0_15px_rgba(100,100,100,0.8)] transition-all border border-slate-500"
                  >
                    キャンセル
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(0,255,255,0.6)] hover:shadow-[0_0_30px_rgba(255,0,255,0.8)] hover:scale-105 transition-all border-2 border-cyan-400"
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
