"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Activity, 
  Zap, 
  Clock, 
  Users, 
  ArrowUpRight, 
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIInsightPanel } from "./AIInsightPanel";
import { DataVizSystem } from "./DataVizSystem";
import { PresenceSystem } from "@/components/system/PresenceSystem";
import { ActivityFeed } from "@/components/system/ActivityFeed";
import { useDemoMode } from "@/context/DemoContext";

export function DashboardOverview() {
  const { isDemoMode } = useDemoMode();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <Badge variant="secondary" className="bg-soft-blue/10 text-deep-blue border-soft-blue/20 font-mono text-[10px] uppercase tracking-widest px-3 py-1">
            System Workspace
          </Badge>
          <h1 className="font-syne text-6xl md:text-7xl font-bold text-deep-blue tracking-tight leading-[0.9]">
            Overview
          </h1>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-deep-blue/40 mt-4">
            Heuristic productivity monitoring active
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <PresenceSystem />
          <div className="flex items-center gap-3 bg-surface-sunken/50 border border-border-soft px-4 py-2 rounded-full shadow-soft hover-lift cursor-default group">
            <Calendar className="w-4 h-4 text-soft-blue group-hover:text-deep-blue transition-colors" />
            <span className="font-mono text-[11px] font-bold text-deep-blue uppercase tracking-wider">
              {currentDate}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: 8/4 split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Primary Panel 1: Active Projects Summary */}
        <Card className="lg:col-span-12 xl:col-span-8 overflow-hidden bg-white/40 border-soft-blue/20 shadow-soft hover:shadow-medium transition-all duration-500 rounded-2xl group">
          <CardHeader className="border-b border-border-soft/50 bg-white/30 p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-syne text-deep-blue">Active Projects Summary</CardTitle>
                <CardDescription className="text-deep-blue/50">Current velocity across 14 active modules</CardDescription>
              </div>
              <div className="p-3 bg-light-green/30 rounded-xl group-hover:scale-110 transition-transform duration-500">
                <Layers className="w-6 h-6 text-deep-blue" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Design System", progress: 85, status: "Active" },
                  { label: "API Integration", progress: 62, status: "Pending" },
                  { label: "User Feedback", progress: 40, status: "In Review" },
                ].map((project, i) => (
                  <div key={i} className="space-y-4 p-5 rounded-xl bg-surface-tinted/30 border border-border-blue/10 hover:border-border-blue/40 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="font-syne font-bold text-deep-blue">{project.label}</span>
                      <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-soft-blue/30 text-soft-blue">
                        {project.status}
                      </Badge>
                    </div>
                    <div className="relative h-1.5 w-full bg-soft-blue/10 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-soft-blue rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-deep-blue/40 uppercase">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                  </div>
                ))}
             </div>
             
             {/* Large metric footer */}
             <div className="mt-10 pt-8 border-t border-border-soft/50 flex flex-wrap gap-10">
                <div className="space-y-1 relative group/metric">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-deep-blue/40">Total Velocity</div>
                   <div className="text-3xl font-syne font-bold text-deep-blue flex items-center gap-2">
                     {isDemoMode ? "98.8%" : "94.2%"}
                     {isDemoMode && (
                       <span className="text-[10px] text-light-green animate-bounce">▲ 4.6%</span>
                     )}
                   </div>
                   {isDemoMode && (
                     <div className="absolute -inset-4 bg-light-green/20 blur-xl rounded-full -z-10 animate-pulse" />
                   )}
                </div>
                <div className="space-y-1">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-deep-blue/40">Active Nodes</div>
                   <div className="text-3xl font-syne font-bold text-deep-blue">
                     {isDemoMode ? "52" : "38"}
                   </div>
                </div>
                <div className="space-y-1">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-deep-blue/40">Deployments</div>
                   <div className="text-3xl font-syne font-bold text-deep-blue">
                     {isDemoMode ? "24" : "12"}
                   </div>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* AI Insight Engine Module */}
        <div className="lg:col-span-12 xl:col-span-4">
          <AIInsightPanel />
        </div>
      </div>

      {/* Editorial Data Visualization System */}
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-syne text-3xl font-bold text-deep-blue">Strategic Operations</h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-deep-blue/40">System-wide performance telemetry</p>
        </div>
        <DataVizSystem />
      </div>

      {/* Tertiary Row: Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Client Activity (Preserved but Refined) */}
        <div className="md:col-span-1 h-[400px]">
          <ActivityFeed />
        </div>

        {/* System Health / Secondary Metric */}
        <Card className="card-editorial border-none bg-white p-2">
          <div className="rounded-xl border border-border-soft p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <h3 className="font-syne text-xl font-bold text-deep-blue">System Health</h3>
                <p className="text-xs text-deep-blue/40 font-mono uppercase tracking-tight">Node stability report</p>
              </div>
              <div className="p-2 bg-soft-blue/10 rounded-lg">
                <Activity className="w-5 h-5 text-soft-blue" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-sunken/50 border border-border-soft flex justify-between items-center">
                <span className="text-xs font-bold text-deep-blue/60 uppercase">Uptime</span>
                <span className="font-syne font-bold text-deep-blue">99.98%</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-sunken/50 border border-border-soft flex justify-between items-center">
                <span className="text-xs font-bold text-deep-blue/60 uppercase">Latency</span>
                <span className="font-syne font-bold text-deep-blue">24ms</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
