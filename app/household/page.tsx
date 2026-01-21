'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getCurrentMonth, getMonthList } from '../utils/household';
import type { Transaction } from '../types/household';
import OverviewTab from './components/OverviewTab';
import HistoryTab from './components/HistoryTab';
import BreakdownTab from './components/BreakdownTab';

export default function HouseholdPage() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('household-transactions', []);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [activeTab, setActiveTab] = useState('overview');

  const months = getMonthList(transactions);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(
      transactions.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-3 animate-fade-in">
            家計簿アプリ
          </h1>
          <p className="text-slate-600 text-lg">あなたのお金を賢く管理</p>
        </div>

        {/* Month Selector */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex gap-2">
            {months.map(month => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedMonth === month
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-lg">
            <Tabs.Trigger
              value="overview"
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              📊 概要
            </Tabs.Trigger>
            <Tabs.Trigger
              value="history"
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              📜 履歴
            </Tabs.Trigger>
            <Tabs.Trigger
              value="breakdown"
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'breakdown'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🥧 内訳
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="overview" className="animate-slide-in">
            <OverviewTab
              transactions={transactions}
              selectedMonth={selectedMonth}
              onAddTransaction={addTransaction}
            />
          </Tabs.Content>

          <Tabs.Content value="history" className="animate-slide-in">
            <HistoryTab
              transactions={transactions}
              selectedMonth={selectedMonth}
              onUpdateTransaction={updateTransaction}
              onDeleteTransaction={deleteTransaction}
            />
          </Tabs.Content>

          <Tabs.Content value="breakdown" className="animate-slide-in">
            <BreakdownTab transactions={transactions} selectedMonth={selectedMonth} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
