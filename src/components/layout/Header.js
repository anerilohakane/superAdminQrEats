"use client";

import { Bell, Search, User, Menu } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

export default function Header({ searchValue, setSearchValue }) {
  const { setSidebarOpen } = useSidebar();

  return (
    <header className="sticky top-0 z-40 flex h-16 lg:h-[100px] items-center justify-between border-b border-slate-200/50 bg-white/80 px-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/80 lg:px-10">
      <div className="flex items-center gap-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 shadow-sm"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md hidden sm:block ml-4 lg:ml-0">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-blue-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-2xl border-none bg-white py-3.5 pl-11 pr-4 text-sm font-medium shadow-sm outline-none ring-1 ring-slate-200/50 transition-all focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-900 dark:ring-slate-800"
            value={searchValue || ""}
            onChange={(e) => setSearchValue && setSearchValue(e.target.value)}
            disabled={!setSearchValue}
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 lg:gap-6 ml-auto">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-blue-600 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400">
          <Bell size={20} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500 dark:border-slate-950" />
        </button>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Aneri Lohakane</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Super Admin</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 ring-2 ring-white dark:ring-slate-950 transition-transform group-hover:scale-105">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
