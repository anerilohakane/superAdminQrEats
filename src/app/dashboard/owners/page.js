"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Phone, ExternalLink, Loader2, Search, X, Store, MapPin, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";

const OwnerDetailsPanel = ({ owner, cafes, onClose }) => {
  if (!owner) return null;

  const ownerCafes = cafes.filter(c => c.email === owner.email);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-950 p-6 overflow-y-auto animate-in slide-in-from-right">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-200"
        >
          <X size={24} />
        </button>

        <div className="mt-6 space-y-8">
          {/* Owner Profile */}
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-3xl font-bold text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
              {owner.name.charAt(0)}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{owner.name}</h2>
            <div className="mt-2 flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><Mail size={14} /> {owner.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={14} /> {owner.phone}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Cafes</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{ownerCafes.length}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</p>
              <p className="mt-1 text-2xl font-bold text-green-600">Active</p>
            </div>
          </div>

          {/* Cafes List */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Associated Cafes</h3>
            <div className="space-y-4">
              {ownerCafes.map((cafe) => (
                <div key={cafe._id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400">
                      <Store size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{cafe.name}</h4>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin size={12} /> {cafe.address || "No address provided"}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          cafe.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          cafe.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {cafe.status}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Calendar size={10} /> {new Date(cafe.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OwnersPage() {
  const [owners, setOwners] = useState([]);
  const [allCafes, setAllCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOwner, setSelectedOwner] = useState(null);

  useEffect(() => {
    const fetchOwners = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/cafes");
        const data = await res.json();
        if (data.success) {
          setAllCafes(data.data);
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
    <div className="flex flex-col gap-6">
      <Header searchValue={search} setSearchValue={setSearch} />
      
      <div className="px-6 lg:px-10 pb-10 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Cafe <span className="text-slate-400 font-light">Owners</span></h1>
          <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">Manage owner profiles and their associated cafes.</p>
        </div>
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
              <button 
                onClick={() => setSelectedOwner(owner)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              >
                View Details
                <ExternalLink size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      </div>
      
      {/* Detail Slide-over */}
      {selectedOwner && (
        <OwnerDetailsPanel 
          owner={selectedOwner} 
          cafes={allCafes} 
          onClose={() => setSelectedOwner(null)} 
        />
      )}
    </div>
  );
}
