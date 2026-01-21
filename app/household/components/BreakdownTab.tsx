'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
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
        <div className="glass-morph px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.6)] border-2 border-cyan-400">
          <p className="font-bold text-cyan-400">{payload[0].name}</p>
          <p className="text-cyan-100">{formatCurrency(payload[0].value)}</p>
          <p className="text-magenta-300 text-sm">{payload[0].payload.percentage?.toFixed(1) || ''}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Expense Breakdown */}
      <div className="glass-morph rounded-3xl p-8 animate-slide-in border-2 border-magenta-400 hover:shadow-[0_0_40px_rgba(255,0,255,0.6)] transition-all">
        <h2 className="text-4xl font-bold text-magenta-400 mb-6 flex items-center gap-3 animate-neon-pulse">
          <span className="text-5xl animate-float">💸</span>
          支出の内訳
        </h2>

        {expenseStats.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-float">📊</div>
            <p className="text-cyan-300 text-lg">この月の支出データがありません</p>
          </div>
        ) : (
          <>
            {/* Bar Chart */}
            <div className="h-96 mb-8 animate-fade-in">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.2)" />
                  <XAxis
                    dataKey="name"
                    stroke="#00ffff"
                    tick={{ fill: '#00ffff', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#00ffff"
                    tick={{ fill: '#00ffff' }}
                    tickFormatter={(value) => `¥${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fill="#ff00ff"
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    radius={[10, 10, 0, 0]}
                  >
                    {expenseChartData.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={`url(#gradient-${index})`}
                        style={{
                          filter: `drop-shadow(0 0 10px ${CATEGORY_COLORS[entry.name]})`
                        }}
                      />
                    ))}
                  </Bar>
                  <defs>
                    {expenseChartData.map((entry, index) => (
                      <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CATEGORY_COLORS[entry.name]} stopOpacity={1} />
                        <stop offset="100%" stopColor={CATEGORY_COLORS[entry.name]} stopOpacity={0.3} />
                      </linearGradient>
                    ))}
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

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
                      label={({ name, payload }) => `${name} ${payload.percentage.toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1200}
                      animationEasing="ease-in-out"
                    >
                      {expenseChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[entry.name]}
                          style={{
                            filter: `drop-shadow(0 0 8px ${CATEGORY_COLORS[entry.name]})`
                          }}
                        />
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
                    className="flex items-center gap-4 p-4 bg-slate-800/60 rounded-2xl hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all duration-300 animate-slide-in border border-magenta-400/30 hover:border-magenta-400"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg shadow-md animate-glow-pulse"
                      style={{
                        backgroundColor: CATEGORY_COLORS[stat.category],
                        boxShadow: `0 0 15px ${CATEGORY_COLORS[stat.category]}`
                      }}
                    ></div>
                    <div className="flex-1">
                      <p className="font-bold text-cyan-100">{stat.category}</p>
                      <p className="text-sm text-cyan-400">{stat.count}件の取引</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl text-magenta-400 animate-flicker">{formatCurrency(stat.amount)}</p>
                      <p className="text-sm text-cyan-300">{stat.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Income Breakdown */}
      <div className="glass-morph rounded-3xl p-8 animate-slide-in border-2 border-blue-400 hover:shadow-[0_0_40px_rgba(0,128,255,0.6)] transition-all" style={{ animationDelay: '200ms' }}>
        <h2 className="text-4xl font-bold text-blue-400 mb-6 flex items-center gap-3 animate-neon-pulse">
          <span className="text-5xl animate-float" style={{ animationDelay: '1s' }}>💰</span>
          収入の内訳
        </h2>

        {incomeStats.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-float" style={{ animationDelay: '2s' }}>📊</div>
            <p className="text-cyan-300 text-lg">この月の収入データがありません</p>
          </div>
        ) : (
          <>
            {/* Line Chart */}
            <div className="h-96 mb-8 animate-fade-in">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incomeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.2)" />
                  <XAxis
                    dataKey="name"
                    stroke="#00ffff"
                    tick={{ fill: '#00ffff', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#00ffff"
                    tick={{ fill: '#00ffff' }}
                    tickFormatter={(value) => `¥${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0080ff"
                    strokeWidth={4}
                    dot={{
                      r: 8,
                      fill: '#00ffff',
                      strokeWidth: 3,
                      stroke: '#0080ff',
                      filter: 'drop-shadow(0 0 10px #00ffff)'
                    }}
                    activeDot={{
                      r: 12,
                      fill: '#00ffff',
                      filter: 'drop-shadow(0 0 15px #00ffff)'
                    }}
                    animationBegin={0}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                    style={{
                      filter: 'drop-shadow(0 0 8px #0080ff)'
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

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
                      label={({ name, payload }) => `${name} ${payload.percentage.toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1200}
                      animationEasing="ease-in-out"
                    >
                      {incomeChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[entry.name]}
                          style={{
                            filter: `drop-shadow(0 0 8px ${CATEGORY_COLORS[entry.name]})`
                          }}
                        />
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
                    className="flex items-center gap-4 p-4 bg-slate-800/60 rounded-2xl hover:shadow-[0_0_20px_rgba(0,128,255,0.4)] transition-all duration-300 animate-slide-in border border-blue-400/30 hover:border-blue-400"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg shadow-md animate-glow-pulse"
                      style={{
                        backgroundColor: CATEGORY_COLORS[stat.category],
                        boxShadow: `0 0 15px ${CATEGORY_COLORS[stat.category]}`,
                        animationDelay: `${index * 0.2}s`
                      }}
                    ></div>
                    <div className="flex-1">
                      <p className="font-bold text-cyan-100">{stat.category}</p>
                      <p className="text-sm text-cyan-400">{stat.count}件の取引</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl text-blue-400 animate-flicker">{formatCurrency(stat.amount)}</p>
                      <p className="text-sm text-cyan-300">{stat.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
