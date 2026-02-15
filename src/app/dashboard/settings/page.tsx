"use client";

import React from "react";
import { AutomationPanel } from "@/components/system/AutomationPanel";
import { Settings, Shield, Bell, Zap, Database } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SettingsPage() {
  const tabs = [
    { id: "automations", label: "Automations", icon: Zap, active: true },
    { id: "notifications", label: "Notifications", icon: Bell, active: false },
    { id: "security", label: "Security", icon: Shield, active: false },
    { id: "data", label: "Data Export", icon: Database, active: false },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-soft-blue/10 text-deep-blue">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="text-4xl font-syne font-black text-deep-blue tracking-tight">System Settings</h1>
        </div>
        <p className="text-soft-blue font-medium max-w-2xl">
          Configure your workspace, manage AI permissions, and architect your ideal workflow automation system.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                tab.active 
                  ? "bg-deep-blue text-cream shadow-medium" 
                  : "text-soft-blue/60 hover:bg-soft-blue/5 hover:text-deep-blue"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="tracking-wider uppercase text-[10px]">{tab.label}</span>
              {tab.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-light-green" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/50 rounded-2xl border border-soft-blue/10 overflow-hidden shadow-soft">
          <AutomationPanel />
        </div>
      </div>
    </div>
  );
}
