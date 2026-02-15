"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";

interface AnalyticsDashboardProps {
  conversionFunnel: { step: string; count: number; dropoffRate: number }[];
  aiUsageDistribution: { low: number; medium: number; heavy: number };
}

export function AnalyticsDashboard({
  conversionFunnel,
  aiUsageDistribution,
}: AnalyticsDashboardProps) {
  // Simplified SVG Charts
  // Funnel visualization (Rects with decreasing width)
  const maxStepCount = Math.max(...conversionFunnel.map((s) => s.count));

  // Pie chart segments (Manual calculation for SVG path - Simplification: use simple rects for distribution for now)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 1. Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Conversion Funnel</h3>
            <p className="text-sm text-slate-500">User journey from signup to paid.</p>
          </div>
        </div>

        <div className="space-y-4">
          {conversionFunnel.map((step, index) => {
            const widthPercentage = (step.count / maxStepCount) * 100;
            return (
              <div key={index} className="relative group">
                <div className="flex justify-between items-center text-sm font-medium text-slate-700 mb-1">
                  <span>{step.step}</span>
                  <span className="text-slate-500">{step.count} Users</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full bg-emerald-500/80 rounded-full"
                  />
                </div>
                {index < conversionFunnel.length - 1 && (
                    <div className="text-xs text-rose-500 mt-1 pl-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Dropoff: {(step.dropoffRate * 100).toFixed(1)}%
                    </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 2. AI Usage Distribution */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Users className="h-5 w-5" />
            </div>
            <div>
            <h3 className="text-lg font-semibold text-slate-900">AI Usage Segments</h3>
            <p className="text-sm text-slate-500">Token consumption across active workspaces.</p>
            </div>
        </div>
        
        <div className="flex h-48 items-end gap-2 px-4 py-8 relative border-b border-slate-100">
            {/* Simple Bar Chart */}
            <div className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-xs font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Low Usage
                </span>
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(aiUsageDistribution.low / (aiUsageDistribution.low + aiUsageDistribution.medium + aiUsageDistribution.heavy)) * 100}%` }}
                    className="w-full bg-indigo-200 rounded-t-lg"
                />
                <span className="text-sm font-medium text-slate-700">{aiUsageDistribution.low}</span>
            </div>
             <div className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-xs font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Medium
                </span>
                <motion.div
                    initial={{ height: 0 }}
                     animate={{ height: `${(aiUsageDistribution.medium / (aiUsageDistribution.low + aiUsageDistribution.medium + aiUsageDistribution.heavy)) * 100}%` }}
                    className="w-full bg-indigo-400 rounded-t-lg"
                />
                 <span className="text-sm font-medium text-slate-700">{aiUsageDistribution.medium}</span>
            </div>
             <div className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-xs font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Heavy AI
                </span>
                <motion.div
                     initial={{ height: 0 }}
                    animate={{ height: `${(aiUsageDistribution.heavy / (aiUsageDistribution.low + aiUsageDistribution.medium + aiUsageDistribution.heavy)) * 100}%` }}
                    className="w-full bg-indigo-600 rounded-t-lg"
                />
                 <span className="text-sm font-medium text-slate-700">{aiUsageDistribution.heavy}</span>
            </div>
        </div>
        <div className="mt-4 flex justify-between text-xs text-slate-400 px-4">
            <span>&lt; 1k Tokens</span>
            <span>1k - 50k</span>
            <span>&gt; 50k (Power Users)</span>
        </div>
      </motion.div>
    </div>
  );
}
