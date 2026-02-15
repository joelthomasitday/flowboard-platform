"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  MoreHorizontal,
  Plus,
  Zap,
  MessageSquare,
  Clock
} from "lucide-react";
import { PresenceSystem } from "@/components/system/PresenceSystem";
import { ActivityFeed } from "@/components/system/ActivityFeed";
import { cn } from "@/lib/utils";

export function ProjectView() {
  const tasks = [
    { id: 1, title: "Finalize core design system tokens", status: "completed", priority: "high", time: "2h" },
    { id: 2, title: "Implement responsive dashboard sidebar", status: "in-progress", priority: "medium", time: "4h" },
    { id: 3, title: "Define micro-interaction motion curves", status: "pending", priority: "low", time: "1h" },
    { id: 4, title: "Refactor project view for editorial aesthetic", status: "pending", priority: "high", time: "3h" },
    { id: 5, title: "Sync with stakeholders on font choices", status: "completed", priority: "medium", time: "1h" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Editorial Header Block */}
      <div className="relative overflow-hidden rounded-[32px] bg-deep-blue p-12 lg:p-16 text-cream shadow-elevated">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-soft-blue/20 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-light-green/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 max-w-3xl space-y-8">
          <div className="flex flex-wrap items-center gap-4">
            <Badge className="bg-light-green text-deep-blue border-none px-4 py-1 font-mono text-[11px] uppercase tracking-widest font-bold">
              Active Project
            </Badge>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] opacity-40">ID: FB-2026-004</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-syne text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
              Brand Identity & <br />Product Refactor
            </h1>
            <p className="text-lg md:text-xl text-cream/70 font-medium leading-relaxed max-w-2xl">
              Complete overhaul of the digital workspace environment, focusing on architectural calmness and high-precision typography.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-4">
            <div className="flex items-center gap-6">
              <PresenceSystem />
              <div className="h-8 w-px bg-cream/20" />
              <span className="text-xs font-bold text-cream/60 uppercase tracking-widest">+4 Contributors</span>
            </div>
            <div className="h-8 w-px bg-cream/20" />
            <div className="flex items-center gap-2">
               <Clock className="w-4 h-4 text-light-green" />
               <span className="text-sm font-bold">Est. 14 days remaining</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content: Task List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-syne text-2xl font-bold text-deep-blue">Strategic Tasks</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-soft hover:bg-surface-tinted transition-all text-xs font-bold text-deep-blue uppercase tracking-widest">
              <Plus className="w-3 h-3" />
              New Objective
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className="group relative flex items-center justify-between p-6 rounded-2xl bg-white border border-border-soft hover:border-soft-blue/40 hover:bg-surface-tinted/20 transition-all duration-300 hover-lift shadow-soft"
              >
                <div className="flex items-center gap-6">
                  <button className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                    task.status === "completed" ? "bg-light-green text-deep-blue" : "border-2 border-border-soft text-border-soft group-hover:border-soft-blue/50"
                  )}>
                    {task.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </button>
                  <div className="space-y-1">
                    <h3 className={cn(
                      "text-sm font-bold text-deep-blue transition-all",
                      task.status === "completed" && "opacity-40 line-through decoration-deep-blue/20"
                    )}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-deep-blue/30 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {task.time}</span>
                      <span>{task.priority} Priority</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg hover:bg-white text-deep-blue/40 hover:text-deep-blue transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white text-deep-blue/40 hover:text-deep-blue transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions Side Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-6">
            <Card className="bg-surface-tinted/50 border-border-blue/20 rounded-[24px] overflow-hidden shadow-soft">
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-deep-blue flex items-center justify-center">
                    <Zap className="w-5 h-5 text-light-green" />
                  </div>
                  <div>
                    <h3 className="font-syne text-lg font-bold text-deep-blue uppercase tracking-tight">AI Strategies</h3>
                    <p className="text-[10px] font-mono text-deep-blue/40 uppercase tracking-tighter">Synthesized 4m ago</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    "Consolidate design tokens into a central theme file for 20% faster implementation.",
                    "Review 'Task 4' priority - heuristic analysis suggests it's a critical path blocker.",
                    "Auto-generate documentation for the new API endpoints."
                  ].map((suggestion, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border border-border-soft group cursor-pointer hover:border-soft-blue/30 transition-all">
                      <p className="text-xs font-medium text-deep-blue/70 leading-relaxed group-hover:text-deep-blue transition-colors">
                        {suggestion}
                      </p>
                      <div className="mt-3 flex items-center text-[9px] font-bold text-soft-blue uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                        Apply Change <ArrowRight className="ml-1 w-3 h-3" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                   <div className="rounded-xl bg-deep-blue p-5 space-y-3">
                      <div className="text-[10px] font-bold text-light-green uppercase tracking-[.2em]">Heuristic Score</div>
                      <div className="flex items-end justify-between">
                         <span className="text-3xl font-syne font-bold text-white leading-none">88/100</span>
                         <span className="text-[10px] font-bold text-white/40 uppercase">Optimal</span>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-light-green w-[88%]" />
                      </div>
                   </div>
                </div>
              </div>
            </Card>

            <div className="h-[400px]">
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
