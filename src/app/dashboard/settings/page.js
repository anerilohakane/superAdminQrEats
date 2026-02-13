"use client";

import { useState } from "react";
import { Settings, Shield, Bell, Globe, Save, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <Header />
      <div className="px-6 lg:px-10 pb-10 space-y-8">
      <div className="flex items-flex-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Site Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Configure global platform parameters and security.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="grid gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20">
              <Shield size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security & Access</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-sm text-slate-500">Require 2FA for all admin accounts.</p>
              </div>
              <div className="h-6 w-11 rounded-full bg-blue-600 relative cursor-pointer">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-50 pt-6 dark:border-slate-900">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Session Timeout</p>
                <p className="text-sm text-slate-500">Automatically logout after 30 minutes of inactivity.</p>
              </div>
               <select 
                 defaultValue="30 Minutes"
                 className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none dark:border-slate-800 dark:bg-slate-900"
               >
                  <option>15 Minutes</option>
                  <option>30 Minutes</option>
                  <option>1 Hour</option>
               </select>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20">
              <Bell size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Email Notifications</h2>
          </div>
          <div className="space-y-6">
             <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">New Cafe Requests</p>
                <p className="text-sm text-slate-500">Get notified when a new cafe signs up for approval.</p>
              </div>
              <div className="h-6 w-11 rounded-full bg-slate-200 relative cursor-pointer dark:bg-slate-800">
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </section>

         <section className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/20">
              <Globe size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Maintenance Mode</h2>
          </div>
          <div className="p-4 rounded-2xl bg-red-50 border border-red-100 dark:bg-red-900/10 dark:border-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">Warning: Enabling maintenance mode will prevent all users and cafe owners from accessing the platform.</p>
            <button className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700">Enable Maintenance Mode</button>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}
