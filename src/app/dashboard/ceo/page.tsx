"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnalyticsDashboard } from "@/components/system/AnalyticsDashboard";
import { ExpansionInsights } from "@/components/system/ExpansionInsights";
import { Container } from "@/components/ui/Container";

// Mock Data for CEO Dashboard
const MOCK_ANALYTICS = {
  activeWorkspaces: 142,
  mrr: 12450,
  arr: 149400,
  conversionFunnel: [
    { step: "Workspace Created", count: 1200, dropoffRate: 0 },
    { step: "Project Created", count: 850, dropoffRate: 0.29 },
    { step: "Trial Started", count: 400, dropoffRate: 0.53 },
    { step: "Upgraded", count: 85, dropoffRate: 0.79 },
  ],
  aiUsageDistribution: {
    low: 450,
    medium: 320,
    heavy: 80,
  }
};

const MOCK_SIGNALS = [
  {
    type: "UPGRADE",
    score: 92,
    reason: "3 Workspaces are hitting 95% of their AI token limits this week.",
  },
  {
    type: "ENTERPRISE_CALL",
    score: 88,
    reason: "Design Team Alpha has 25 active members but is on the Architect plan.",
  },
];

export default function CEODashboardPage() {
  const [data, setData] = useState(MOCK_ANALYTICS);

  // In a real implementation, fetch data from analytics-engine via API
  // useEffect(() => { ... }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-md bg-slate-900" />
            <h1 className="text-lg font-bold text-slate-900">CEO Command Center</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span>Live Data</span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </Container>
      </header>

      <Container className="mt-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KPICard label="MRR" value={`$${data.mrr.toLocaleString()}`} trend="+12%" />
          <KPICard label="ARR" value={`$${data.arr.toLocaleString()}`} trend="+15%" />
          <KPICard label="Active Workspaces" value={data.activeWorkspaces.toString()} trend="+8%" />
        </div>

        {/* Growth Engine */}
        <ExpansionInsights signals={MOCK_SIGNALS as any} />

        {/* Analytics Deep Dive */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Product Health</h2>
          <AnalyticsDashboard
            conversionFunnel={data.conversionFunnel}
            aiUsageDistribution={data.aiUsageDistribution}
          />
        </div>
      </Container>
    </div>
  );
}

function KPICard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
          {trend}
        </span>
      </div>
    </motion.div>
  );
}
