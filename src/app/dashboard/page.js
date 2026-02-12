"use client";

import { useEffect, useState } from "react";
import { Store, Users, Clock, CheckCircle2, TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="group rounded-3xl border border-white bg-white/50 p-6 shadow-sm shadow-slate-200/50 transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
    <div className="flex items-center justify-between">
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-${color}-50 text-${color}-600 dark:bg-${color}-900/20 dark:text-${color}-400", 
        color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
        color === 'amber' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
        color === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
        'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
      )}>
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900/20">
        <TrendingUp size={12} />
        {trend}
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening with QrEats today.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
          Generate Report
          <ArrowUpRight size={16} />
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
          trend={stats.pendingApprovals > 0 ? "Action Required" : "Up to date"} 
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
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Approval Requests</h3>
          <div className="space-y-4">
            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-sm text-slate-500">Loading requests...</p>
              </div>
            ) : recentRequests.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-500">No recent requests</p>
              </div>
            ) : (
              recentRequests.map((request) => (
                <div key={request._id} className="flex items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/50 p-4 dark:border-slate-900 dark:bg-slate-900/50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/20">
                      <Store size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{request.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Request from {request.ownerName} • {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <a href="/dashboard/cafes" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">View Details</a>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Growth</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">Steady</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Server State</p>
              <p className="text-xl font-bold text-green-600 mt-1">Optimal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
