"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Phone, ExternalLink, Loader2, Search } from "lucide-react";

export default function OwnersPage() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/cafes");
        const data = await res.json();
        if (data.success) {
          // Extract unique owners from cafes
          const uniqueOwners = data.data.reduce((acc, cafe) => {
            if (!acc.find(o => o.email === cafe.email)) {
              acc.push({
                name: cafe.ownerName,
                email: cafe.email,
                phone: cafe.phone,
                cafeCount: data.data.filter(c => c.email === cafe.email).length
              });
            }
            return acc;
          }, []);
          setOwners(uniqueOwners);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  const filteredOwners = owners.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Cafe Owners</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage owner profiles and their associated cafes.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search owners..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredOwners.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">No owners found.</div>
        ) : (
          filteredOwners.map((owner, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 transition-all hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                  <span className="text-xl font-bold">{owner.name.charAt(0)}</span>
                </div>
                <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  {owner.cafeCount} {owner.cafeCount === 1 ? 'Cafe' : 'Cafes'}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{owner.name}</h3>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail size={14} /> {owner.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone size={14} /> {owner.phone}
                  </div>
                </div>
              </div>
              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
                View Details
                <ExternalLink size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
