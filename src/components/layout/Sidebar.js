"use client";

import { 
  LayoutDashboard, 
  Store, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  Menu,
  BarChart3,
  Coffee,
  X
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";
import { useState } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Store, label: "Cafe Approvals", href: "/dashboard/cafes" },
  { icon: Store, label: "All Cafes", href: "/dashboard/all-cafes" },
  { icon: Users, label: "Owners", href: "/dashboard/owners" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Settings, label: "Site Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/50 bg-white/80 backdrop-blur-xl transition-all duration-300 dark:border-slate-800/50 dark:bg-slate-950/80",
          // Mobile: slide in from left
          "lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: collapsible width
          collapsed ? "lg:w-20" : "lg:w-72",
          // Mobile: full width on small screens, fixed width on medium
          "w-72"
        )}
      >
        {/* Header */}
        <div className="flex h-16 lg:h-[100px] items-center justify-between px-6">
          <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", collapsed && "lg:w-0 lg:opacity-0")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <span className="text-lg font-bold">Q</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 dark:text-white">QrEats</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Super Admin</span>
            </div>
          </div>
          
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
          >
            <ChevronLeft size={16} className={cn("transition-transform duration-300", collapsed && "rotate-180")} />
          </button>

          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <div className="space-y-1.5">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 group",
                    isActive 
                      ? "bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-900/20 dark:text-blue-400" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400" />
                  )}
                  <item.icon size={22} className={cn("shrink-0 transition-transform group-hover:scale-110", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200")} />
                  {!collapsed && <span className="text-sm font-semibold tracking-wide">{item.label}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-4 hidden rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xl lg:group-hover:block dark:bg-white dark:text-slate-900 z-50 whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200/50 p-4 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <button className={cn(
            "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400",
            collapsed && "justify-center px-0"
          )}>
            <LogOut size={22} className="shrink-0 transition-transform group-hover:-translate-x-1" />
            {!collapsed && <span className="text-sm font-semibold">Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
