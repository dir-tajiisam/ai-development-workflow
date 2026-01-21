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
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-slate-600 text-lg">この月の取引はまだありません</p>
          <p className="text-slate-400 text-sm mt-2">概要タブから取引を追加してください</p>
        </div>
      ) : (
        monthTransactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md ${
                    transaction.type === 'income'
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                      : 'bg-gradient-to-br from-red-400 to-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '💰' : '💸'}
                </div>

                {/* Transaction Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-slate-800">{transaction.category}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === 'income'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.type === 'income' ? '収入' : '支出'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{formatDate(transaction.date)}</p>
                  {transaction.description && (
                    <p className="text-slate-500 text-sm mt-1 italic">{transaction.description}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p
                    className={`text-3xl font-bold ${
                      transaction.type === 'income' ? 'text-blue-600' : 'text-red-600'
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
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                >
                  ✏️ 編集
                </button>
                <button
                  onClick={() => {
                    if (confirm('この取引を削除しますか？')) {
                      onDeleteTransaction(transaction.id);
                    }
                  }}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-medium"
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
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-scale-in">
            <Dialog.Title className="text-3xl font-bold text-slate-800 mb-6">
              取引を編集
            </Dialog.Title>

            {editingTransaction && (
              <form onSubmit={handleUpdate} className="space-y-5">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    種類
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTransaction({ ...editingTransaction, type: 'income', category: '給与' })
                      }
                      className={`py-3 rounded-xl font-semibold transition-all duration-300 ${
                        editingTransaction.type === 'income'
                          ? 'bg-blue-500 text-white shadow-lg scale-105'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      💰 収入
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTransaction({ ...editingTransaction, type: 'expense', category: '食費' })
                      }
                      className={`py-3 rounded-xl font-semibold transition-all duration-300 ${
                        editingTransaction.type === 'expense'
                          ? 'bg-red-500 text-white shadow-lg scale-105'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      💸 支出
                    </button>
                  </div>
                  <input type="hidden" name="type" value={editingTransaction.type} />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
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
                    name="amount"
                    defaultValue={editingTransaction.amount}
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
                    name="date"
                    defaultValue={editingTransaction.date}
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
                    name="description"
                    defaultValue={editingTransaction.description}
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
