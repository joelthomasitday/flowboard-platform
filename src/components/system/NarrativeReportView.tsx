"use client";

import { useState, useEffect } from "react";
import { Download, Printer, X, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function NarrativeReportView() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "narrative-report",
          context: {
            workspaceName: "Global Workspace",
            timestamp: new Date().toLocaleDateString(),
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to generate AI report");
      
      setReport(data.data);
    } catch (err: any) {
      console.error("Narrative Report Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <p className="text-gray-500 text-sm">Generating report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-red-800 font-semibold mb-2">Report Generation Failed</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchReport}
            className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded hover:bg-red-50 text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden print:shadow-none print:border-none">
        
        {/* Header Actions */}
        <div className="bg-gray-50 border-b border-gray-200 px-8 py-4 flex justify-between items-center print:hidden">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex gap-3">
             <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded border border-gray-300 transition-colors">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-8 md:p-12 space-y-8">
          
          {/* Document Header */}
          <header className="border-b border-gray-200 pb-8 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Narrative Report</h1>
                <p className="text-gray-500 mt-1">FlowBoard Intelligence System</p>
              </div>
              <div className="text-right text-sm text-gray-500 space-y-1">
                <p>Date: {new Date().toLocaleDateString()}</p>
                <p>Workspace: Global</p>
                <p>Ref: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            </div>
          </header>

          {/* Executive Summary */}
          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 uppercase tracking-wider">01. Executive Summary</h2>
            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
              <p>{report.summary}</p>
            </div>
          </section>

          {/* Key Metrics Table */}
          <section>
             <h2 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 uppercase tracking-wider">02. Key Performance Indicators</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Productivity</p>
                  <p className="text-2xl font-semibold text-gray-900">+{report.productivityDelta}%</p>
                  <p className="text-xs text-gray-500 mt-1">Commit density & PRs</p>
                </div>
                <div className="p-4 bg-gray-50 rounded border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Risk Reduction</p>
                  <p className="text-2xl font-semibold text-gray-900">-{report.riskReduction}%</p>
                   <p className="text-xs text-gray-500 mt-1">Bottleneck mitigation</p>
                </div>
                <div className="p-4 bg-gray-50 rounded border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Time Saved</p>
                  <p className="text-2xl font-semibold text-gray-900">{report.timeSaved}h</p>
                   <p className="text-xs text-gray-500 mt-1">Automated tasks</p>
                </div>
                <div className="p-4 bg-gray-50 rounded border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Savings</p>
                  <p className="text-2xl font-semibold text-gray-900">${report.automationSavings.toLocaleString()}</p>
                   <p className="text-xs text-gray-500 mt-1">Estimated efficiency</p>
                </div>
             </div>
          </section>

          {/* Deep Insights */}
          <section>
             <h2 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-6 uppercase tracking-wider">03. Strategic Insights</h2>
             <div className="space-y-4">
                {report.topInsights.map((insight: string, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs font-medium text-gray-600 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-gray-700 leading-relaxed">{insight}</p>
                  </div>
                ))}
             </div>
          </section>
          
          {/* Footer */}
          <footer className="pt-12 mt-12 border-t border-gray-200 text-center text-xs text-gray-400">
            <p>Generated by FlowBoard Intelligence System. Confidential.</p>
          </footer>

        </div>
      </div>
    </div>
  );
}
