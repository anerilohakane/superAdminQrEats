"use client";

import { useState, useEffect } from "react";
import { 
  Store, 
  Search, 
  Check, 
  X, 
  MoreVertical, 
  MapPin,
  Phone,
  Mail,
  Loader2,
  Calendar,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    approved: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    rejected: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide", styles[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", 
        status === 'pending' ? 'bg-amber-500' : 
        status === 'approved' ? 'bg-green-500' : 'bg-red-500'
      )} />
      {status}
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
    <div className="flex flex-col gap-6">
      <Header searchValue={search} setSearchValue={setSearch} />
      
      <div className="px-6 lg:px-10 pb-10 space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Cafe <span className="text-slate-400 font-light">Management</span></h1>
            <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">Manage cafe owner approvals and details.</p>
          </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select 
              className="appearance-none rounded-2xl border-none bg-white py-3.5 pl-11 pr-10 text-sm font-medium shadow-sm outline-none ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-900 dark:ring-slate-800 cursor-pointer"
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
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-slate-500">Loading cafes...</p>
          </div>
        ) : cafes.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/50 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
              <Store className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">No cafes found</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your filters or search terms.</p>
            </div>
          </div>
        ) : (
          cafes.map((cafe) => (
            <div 
              key={cafe._id} 
              className="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white/60 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition-all hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800/50 dark:bg-slate-950/60 dark:shadow-none dark:hover:border-blue-900/50"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-slate-900 dark:to-slate-800">
                    <Store className="text-blue-600 dark:text-blue-400" size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{cafe.name}</h3>
                      <StatusBadge status={cafe.status} />
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Owned by <span className="text-slate-900 dark:text-white font-bold">{cafe.ownerName}</span></p>
                    <div className="flex flex-wrap gap-4 pt-2">
                       <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg">
                        <Mail size={14} /> {cafe.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg">
                        <Phone size={14} /> {cafe.phone}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg">
                        <MapPin size={14} /> {cafe.address ? cafe.address.substring(0, 30) : 'No address'}...
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 self-end md:self-start">
                  {cafe.status === 'pending' && (
                    <>
                      <button 
                        disabled={actionLoading === cafe._id}
                        onClick={() => handleStatusUpdate(cafe._id, 'approved')}
                        className="flex h-11 items-center gap-2 rounded-2xl bg-green-600 px-5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {actionLoading === cafe._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check size={18} strokeWidth={3} />}
                        Approve
                      </button>
                      <button 
                        disabled={actionLoading === cafe._id}
                        onClick={() => handleStatusUpdate(cafe._id, 'rejected')}
                        className="flex h-11 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-red-600 shadow-lg shadow-red-500/10 transition-all hover:bg-red-50 hover:text-red-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 dark:bg-slate-900 dark:shadow-none dark:hover:bg-slate-800"
                      >
                        {actionLoading === cafe._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X size={18} strokeWidth={3} />}
                        Reject
                      </button>
                    </>
                  )}
                  {cafe.status !== 'pending' && (
                    <button 
                       onClick={() => handleStatusUpdate(cafe._id, 'pending')}
                       className="flex h-11 items-center gap-2 rounded-2xl bg-white border border-slate-200 px-5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                      Reset Status
                    </button>
                  )}
                  <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}
