"use client";

import { BarChart3, TrendingUp, Users, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Header from "@/components/layout/Header";

const ChartPlaceholder = ({ title, height = "h-64" }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <button className="text-xs font-medium text-blue-600 hover:underline">View Full Report</button>
    </div>
    <div className={`${height} flex items-end gap-2 px-2`}>
      {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 100].map((h, i) => (
        <div 
          key={i} 
          className="flex-1 bg-blue-100 rounded-t-lg transition-all hover:bg-blue-600 dark:bg-blue-900/30" 
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
    <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
      <span>Jan</span>
      <span>Jun</span>
      <span>Dec</span>
    </div>
  </div>
);

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Header />
      <div className="px-6 lg:px-10 pb-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Platform Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Deep dive into platform growth and user engagement.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-500/20">
          <div className="flex items-center justify-between">
            <TrendingUp size={32} className="opacity-80" />
            <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs font-bold">
              <ArrowUpRight size={12} />
              18%
            </div>
          </div>
          <div className="mt-8">
            <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Projected Revenue</p>
            <h2 className="mt-1 text-4xl font-bold">₹12.4M</h2>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 p-8 text-white dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <Users size={32} className="opacity-80" />
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs font-bold">
              <ArrowUpRight size={12} />
              24%
            </div>
          </div>
          <div className="mt-8">
            <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Active Users</p>
            <h2 className="mt-1 text-4xl font-bold">48.6K</h2>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <PieChart size={32} className="text-blue-600" />
            <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-600 dark:bg-red-900/20">
              <ArrowDownRight size={12} />
              2%
            </div>
          </div>
          <div className="mt-8">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Churn Rate</p>
            <h2 className="mt-1 text-4xl font-bold text-slate-900 dark:text-white">1.2%</h2>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder title="Cafe Onboarding Growth" />
        <ChartPlaceholder title="Daily Active Sessions" />
      </div>
      </div>
    </div>
  );
}
