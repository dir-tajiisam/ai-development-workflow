'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Transaction, TransactionType, CategoryType } from '../../types/household';
import { formatCurrency, formatDate } from '../../utils/household';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/household';

interface HistoryTabProps {
  transactions: Transaction[];
  selectedMonth: string;
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
}

export default function HistoryTab({
  transactions,
  selectedMonth,
  onUpdateTransaction,
  onDeleteTransaction,
}: HistoryTabProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const monthTransactions = transactions
    .filter(t => t.date.startsWith(selectedMonth))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTransaction) return;

    const formData = new FormData(e.currentTarget);
    onUpdateTransaction(editingTransaction.id, {
      type: formData.get('type') as TransactionType,
      category: formData.get('category') as CategoryType,
      amount: parseFloat(formData.get('amount') as string),
      date: formData.get('date') as string,
      description: formData.get('description') as string,
    });

    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  const categories = editingTransaction?.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="space-y-4">
      {monthTransactions.length === 0 ? (
        <div className="glass-morph rounded-2xl p-12 text-center border-2 border-yellow-400 hover:shadow-[0_0_30px_rgba(255,255,0,0.6)] transition-all">
          <div className="text-6xl mb-4 animate-float">📭</div>
          <p className="text-cyan-300 text-xl font-bold">この月の取引はまだありません</p>
          <p className="text-cyan-400 text-sm mt-2">概要タブから取引を追加してください</p>
        </div>
      ) : (
        monthTransactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="glass-morph rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transform hover:scale-105 transition-all duration-300 animate-slide-in border border-cyan-400/30 hover:border-cyan-400"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md animate-float ${
                    transaction.type === 'income'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_0_20px_rgba(0,128,255,0.8)]'
                      : 'bg-gradient-to-br from-magenta-500 to-red-600 shadow-[0_0_20px_rgba(255,0,255,0.8)]'
                  }`}
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  {transaction.type === 'income' ? '💰' : '💸'}
                </div>

                {/* Transaction Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xl text-cyan-100">{transaction.category}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        transaction.type === 'income'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-400 shadow-[0_0_10px_rgba(0,128,255,0.5)]'
                          : 'bg-magenta-500/20 text-magenta-400 border-magenta-400 shadow-[0_0_10px_rgba(255,0,255,0.5)]'
                      }`}
                    >
                      {transaction.type === 'income' ? '収入' : '支出'}
                    </span>
                  </div>
                  <p className="text-cyan-300 text-sm">{formatDate(transaction.date)}</p>
                  {transaction.description && (
                    <p className="text-cyan-400 text-sm mt-1 italic">{transaction.description}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p
                    className={`text-4xl font-bold animate-neon-pulse ${
                      transaction.type === 'income' ? 'text-blue-400' : 'text-magenta-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(transaction)}
                  className="px-4 py-2 bg-slate-800 text-cyan-400 rounded-xl hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all font-bold border border-cyan-400"
                >
                  ✏️ 編集
                </button>
                <button
                  onClick={() => {
                    if (confirm('この取引を削除しますか？')) {
                      onDeleteTransaction(transaction.id);
                    }
                  }}
                  className="px-4 py-2 bg-slate-800 text-magenta-400 rounded-xl hover:shadow-[0_0_15px_rgba(255,0,255,0.6)] transition-all font-bold border border-magenta-400"
                >
                  🗑️ 削除
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Edit Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-morph rounded-3xl shadow-[0_0_50px_rgba(0,255,255,0.6)] p-8 w-full max-w-md animate-scale-in border-2 border-cyan-400">
            <Dialog.Title className="text-4xl font-bold text-cyan-400 mb-6 animate-neon-pulse">
              取引を編集
            </Dialog.Title>

            {editingTransaction && (
              <form onSubmit={handleUpdate} className="space-y-5">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-bold text-cyan-300 mb-2">
                    種類
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTransaction({ ...editingTransaction, type: 'income', category: '給与' })
                      }
                      className={`py-3 rounded-xl font-bold transition-all duration-300 ${
                        editingTransaction.type === 'income'
                          ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(0,128,255,0.8)] scale-105 border-2 border-blue-400'
                          : 'bg-slate-800 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400'
                      }`}
                    >
                      💰 収入
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTransaction({ ...editingTransaction, type: 'expense', category: '食費' })
                      }
                      className={`py-3 rounded-xl font-bold transition-all duration-300 ${
                        editingTransaction.type === 'expense'
                          ? 'bg-magenta-500 text-white shadow-[0_0_20px_rgba(255,0,255,0.8)] scale-105 border-2 border-magenta-400'
                          : 'bg-slate-800 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400'
                      }`}
                    >
                      💸 支出
                    </button>
                  </div>
                  <input type="hidden" name="type" value={editingTransaction.type} />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-cyan-300 mb-2">
                    カテゴリ
                  </label>
                  <select
                    name="category"
                    defaultValue={editingTransaction.category}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        category: e.target.value as CategoryType,
                      })
                    }
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
                    name="amount"
                    defaultValue={editingTransaction.amount}
                    min="0"
                    step="1"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-cyan-400 bg-slate-900 text-cyan-100 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-bold text-cyan-300 mb-2">
                    日付
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingTransaction.date}
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
                    name="description"
                    defaultValue={editingTransaction.description}
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
                    更新
                  </button>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
