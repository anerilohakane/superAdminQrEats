"use client";

import { useState, useEffect } from "react";
import { 
  Store, 
  Search, 
  Filter, 
  Check, 
  X, 
  MoreVertical, 
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    approved: "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    rejected: "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", styles[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", 
        status === 'pending' ? 'bg-amber-500' : 
        status === 'approved' ? 'bg-green-500' : 'bg-red-500'
      )} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function CafeApprovals() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchCafes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cafes?status=${filter}&search=${search}`);
      const data = await res.json();
      if (data.success) {
        setCafes(data.data);
      } else {
        setError("Failed to fetch cafes");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, [filter, search]);

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/cafes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setCafes(cafes.map(cafe => cafe._id === id ? { ...cafe, status } : cafe));
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("An error occurred while updating status");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Cafe Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage cafe owner approvals and details.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, owner or email..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition-all focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-900/50">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-slate-500">Loading cafes...</p>
          </div>
        ) : cafes.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white/50 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
              <Store className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">No cafes found</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your filters or search terms.</p>
            </div>
          </div>
        ) : (
          cafes.map((cafe) => (
            <div 
              key={cafe._id} 
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-50 to-slate-100 p-3 dark:from-slate-900 dark:to-slate-800">
                    <Store className="text-blue-600 dark:text-blue-400" size={32} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{cafe.name}</h3>
                      <StatusBadge status={cafe.status} />
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Owned by {cafe.ownerName}</p>
                    <div className="flex flex-wrap gap-4 pt-2">
                       <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Mail size={14} /> {cafe.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Phone size={14} /> {cafe.phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin size={14} /> {cafe.address ? cafe.address.substring(0, 30) : 'No address'}...
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-end md:self-start">
                  {cafe.status === 'pending' && (
                    <>
                      <button 
                        disabled={actionLoading === cafe._id}
                        onClick={() => handleStatusUpdate(cafe._id, 'approved')}
                        className="flex h-10 items-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50"
                      >
                        {actionLoading === cafe._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check size={18} />}
                        Approve
                      </button>
                      <button 
                        disabled={actionLoading === cafe._id}
                        onClick={() => handleStatusUpdate(cafe._id, 'rejected')}
                        className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900"
                      >
                        {actionLoading === cafe._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X size={18} />}
                        Reject
                      </button>
                    </>
                  )}
                  {cafe.status !== 'pending' && (
                    <button 
                       onClick={() => handleStatusUpdate(cafe._id, 'pending')}
                       className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                    >
                      Reset to Pending
                    </button>
                  )}
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
