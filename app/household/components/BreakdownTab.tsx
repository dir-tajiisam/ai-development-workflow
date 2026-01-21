'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Transaction } from '../../types/household';
import { calculateCategoryStats, formatCurrency } from '../../utils/household';
import { CATEGORY_COLORS } from '../../constants/household';

interface BreakdownTabProps {
  transactions: Transaction[];
  selectedMonth: string;
}

export default function BreakdownTab({ transactions, selectedMonth }: BreakdownTabProps) {
  const expenseStats = calculateCategoryStats(transactions, selectedMonth, 'expense');
  const incomeStats = calculateCategoryStats(transactions, selectedMonth, 'income');

  const expenseChartData = expenseStats.map(stat => ({
    name: stat.category,
    value: stat.amount,
    percentage: stat.percentage,
  }));

  const incomeChartData = incomeStats.map(stat => ({
    name: stat.category,
    value: stat.amount,
    percentage: stat.percentage,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-xl shadow-xl border-2 border-slate-200">
          <p className="font-bold text-slate-800">{payload[0].name}</p>
          <p className="text-slate-600">{formatCurrency(payload[0].value)}</p>
          <p className="text-slate-500 text-sm">{payload[0].payload.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Expense Breakdown */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 animate-slide-in">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <span className="text-4xl">💸</span>
          支出の内訳
        </h2>

        {expenseStats.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-slate-600 text-lg">この月の支出データがありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="h-96 animate-fade-in">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage.toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {expenseChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="space-y-3">
              {expenseStats.map((stat, index) => (
                <div
                  key={stat.category}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-2xl hover:shadow-lg transition-all duration-300 animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="w-6 h-6 rounded-lg shadow-md"
                    style={{ backgroundColor: CATEGORY_COLORS[stat.category] }}
                  ></div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{stat.category}</p>
                    <p className="text-sm text-slate-500">{stat.count}件の取引</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-red-600">{formatCurrency(stat.amount)}</p>
                    <p className="text-sm text-slate-500">{stat.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Income Breakdown */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 animate-slide-in" style={{ animationDelay: '200ms' }}>
        <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <span className="text-4xl">💰</span>
          収入の内訳
        </h2>

        {incomeStats.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-slate-600 text-lg">この月の収入データがありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="h-96 animate-fade-in">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage.toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {incomeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="space-y-3">
              {incomeStats.map((stat, index) => (
                <div
                  key={stat.category}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-2xl hover:shadow-lg transition-all duration-300 animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="w-6 h-6 rounded-lg shadow-md"
                    style={{ backgroundColor: CATEGORY_COLORS[stat.category] }}
                  ></div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{stat.category}</p>
                    <p className="text-sm text-slate-500">{stat.count}件の取引</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-blue-600">{formatCurrency(stat.amount)}</p>
                    <p className="text-sm text-slate-500">{stat.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
