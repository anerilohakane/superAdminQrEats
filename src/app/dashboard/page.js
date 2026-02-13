"use client";

import { useEffect, useState } from "react";
import { Store, Users, Clock, CheckCircle2, TrendingUp, ArrowUpRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";

const StatCard = ({ title, value, icon: Icon, trend, color, trendValue }) => (
  <div className="group relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/60 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-slate-800/50 dark:bg-slate-950/60 dark:shadow-none">
    <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 transition-transform group-hover:scale-150", 
      color === 'blue' ? 'bg-blue-500' :
      color === 'amber' ? 'bg-amber-500' :
      color === 'green' ? 'bg-green-500' :
      'bg-indigo-500'
    )} />
    
    <div className="flex items-center justify-between relative z-10">
      <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3", 
        color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
        color === 'amber' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' :
        color === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' :
        'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
      )}>
        <Icon size={26} strokeWidth={1.5} />
      </div>
      {trend && (
        <div className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
           trend === 'Live' ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" :
           trend === 'Action Required' ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
           trend === 'Verified' ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" :
           "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
        )}>
          {trendValue && <span className="mr-1">{trendValue}</span>}
          {trend}
        </div>
      )}
    </div>
    <div className="mt-6 relative z-10">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="mt-1 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalCafes: 0,
    pendingApprovals: 0,
    activeSubscribers: 0,
    totalRevenue: "₹0"
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStats({
            totalCafes: data.data.totalCafes,
            pendingApprovals: data.data.pendingApprovals,
            activeSubscribers: data.data.activeSubscribers,
            totalRevenue: data.data.totalRevenue
          });
          setRecentRequests(data.data.recentRequests);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Header />
      <div className="px-6 lg:px-10 pb-10 space-y-10">
        {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard <span className="text-slate-400 font-light">Overview</span></h1>
          <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">Welcome back, Aneri! Here's your daily platform summary.</p>
        </div>
        <button className="group flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-105 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-100 sm:w-auto w-full justify-center">
          Generate Report
          <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Cafes" 
          value={loading ? "..." : stats.totalCafes} 
          icon={Store} 
          trend="Live" 
          color="blue" 
        />
        <StatCard 
          title="Pending Approvals" 
          value={loading ? "..." : stats.pendingApprovals} 
          icon={Clock} 
          trend="Action Required" 
          color="amber" 
        />
        <StatCard 
          title="Active Subscribers" 
          value={loading ? "..." : stats.activeSubscribers} 
          icon={CheckCircle2} 
          trend="Verified" 
          color="green" 
        />
        <StatCard 
          title="Monthly Revenue" 
          value={loading ? "..." : stats.totalRevenue} 
          icon={TrendingUp} 
          trend="Estimated" 
          color="indigo" 
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2.5rem] border border-white/50 bg-white/60 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/60 dark:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Approval Requests</h3>
            <a href="/dashboard/cafes" className="flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              View All <ArrowRight size={16} />
            </a>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-sm font-medium text-slate-500 animate-pulse">Loading requests...</p>
              </div>
            ) : recentRequests.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800/50">
                <p className="text-sm font-medium text-slate-400">No pending requests</p>
              </div>
            ) : (
              recentRequests.map((request) => (
                <div key={request._id} className="group flex items-center justify-between rounded-3xl border border-slate-100 bg-white/50 p-4 transition-all hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 dark:border-slate-800/50 dark:bg-slate-900/50 dark:hover:border-blue-900/50 dark:hover:bg-slate-900">
                  <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/20 dark:text-blue-400">
                      <Store size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{request.name}</p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        {request.ownerName} • <span className="opacity-70">{new Date(request.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                  <a href="/dashboard/cafes" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-blue-900/20 dark:hover:text-blue-400">
                    <ArrowRight size={18} />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/50 bg-white/60 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/60 dark:shadow-none">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">System Health</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-[1.02]">
              <p className="text-xs text-indigo-100 uppercase font-bold tracking-widest opacity-80">Growth Rate</p>
              <div className="mt-4 flex items-end gap-2">
                <p className="text-4xl font-extrabold">+24%</p>
              </div>
              <p className="mt-2 text-sm text-indigo-100 font-medium opacity-80">Consistent monthly growth</p>
            </div>
            <div className="rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg shadow-emerald-500/25 transition-transform hover:scale-[1.02]">
              <p className="text-xs text-emerald-100 uppercase font-bold tracking-widest opacity-80">Server Status</p>
              <div className="mt-4 flex items-end gap-2">
                <p className="text-4xl font-extrabold">99.9%</p>
              </div>
              <p className="mt-2 text-sm text-emerald-100 font-medium opacity-80">Uptime this week</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
