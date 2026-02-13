"use client";

import { useState, useEffect } from "react";
import { 
  Store, 
  Search, 
  MapPin,
  Phone,
  Mail,
  Loader2,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", styles[status])}>
      {status}
    </span>
  );
};

export default function AllCafes() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCafes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cafes?search=${search}`);
      const data = await res.json();
      if (data.success) {
        setCafes(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, [search]);

  return (
    <div className="flex flex-col gap-6">
      <Header searchValue={search} setSearchValue={setSearch} />

      <div className="px-6 lg:px-10 pb-10 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">All <span className="text-slate-400 font-light">Cafes</span></h1>
            <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">View and manage all cafes registered on the platform.</p>
          </div>
        </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/40 overflow-hidden dark:border-slate-800 dark:bg-slate-950 dark:shadow-none overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-900 dark:bg-slate-900/50">
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Cafe Name</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Owner</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Contact</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-slate-500">Loading catalog...</span>
                  </div>
                </td>
              </tr>
            ) : cafes.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center text-slate-500">
                  <p className="font-medium">No cafes found in the database.</p>
                </td>
              </tr>
            ) : (
              cafes.map((cafe) => (
                <tr key={cafe._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/20 dark:text-blue-400">
                        <Store size={20} />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{cafe.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{cafe.ownerName}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Mail size={12} className="text-slate-400" /> {cafe.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Phone size={12} className="text-slate-400" /> {cafe.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={cafe.status} />
                  </td>
                   <td className="px-8 py-5 text-sm font-medium text-slate-500">
                    {new Date(cafe.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
