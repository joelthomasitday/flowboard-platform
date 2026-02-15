"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Printer, TrendingUp, ShieldCheck, Zap, X } from "lucide-react";
import { generateNarrativeReport } from "@/lib/ai-simulation";

export function NarrativeReport() {
  const [isOpen, setIsOpen] = useState(false);
  const report = generateNarrativeReport();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-deep-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-deep-blue/90 transition-all shadow-soft active:scale-95"
      >
        <FileText className="w-4 h-4" />
        Generate Executive Report
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-deep-blue/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FDFCF7] rounded-none shadow-mega border border-deep-blue/10 flex flex-col"
            >
              {/* Report Header */}
              <div className="sticky top-0 z-10 flex justify-between items-center p-8 bg-[#FDFCF7]/80 backdrop-blur-md border-b border-deep-blue/5">
                <div className="space-y-1">
                  <h2 className="font-instrument-serif text-3xl text-deep-blue italic">Executive Narrative</h2>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-deep-blue/40">
                    Confidential · AI-Orchestrated Insights · Q1 2026
                  </p>
                </div>
                <div className="flex gap-4">
                  <button className="p-2 hover:bg-deep-blue/5 rounded-full transition-colors">
                    <Printer className="w-5 h-5 text-deep-blue/60" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-deep-blue/5 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-deep-blue/60" />
                  </button>
                </div>
              </div>

              {/* Report Content */}
              <div className="p-12 space-y-16">
                {/* Summary Section */}
                <section className="max-w-2xl">
                  <h3 className="font-syne font-bold text-xs uppercase tracking-widest text-deep-blue/30 mb-6">
                    01. Strategic Summary
                  </h3>
                  <p className="font-instrument-serif text-2xl leading-relaxed text-deep-blue/90 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
                    {report.summary}
                  </p>
                </section>

                {/* Metrics Grid */}
                <section>
                  <h3 className="font-syne font-bold text-xs uppercase tracking-widest text-deep-blue/30 mb-8">
                    02. Performance Deltas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="border-l border-deep-blue/10 pl-6 space-y-2">
                      <p className="font-mono text-[10px] text-deep-blue/40 uppercase">Productivity Increase</p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-syne font-bold text-deep-blue">+{report.productivityDelta}%</span>
                        <TrendingUp className="w-5 h-5 text-light-green mb-1" />
                      </div>
                    </div>
                    <div className="border-l border-deep-blue/10 pl-6 space-y-2">
                      <p className="font-mono text-[10px] text-deep-blue/40 uppercase">Risk Reduction</p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-syne font-bold text-deep-blue">-{report.riskReduction}%</span>
                        <ShieldCheck className="w-5 h-5 text-soft-blue mb-1" />
                      </div>
                    </div>
                    <div className="border-l border-deep-blue/10 pl-6 space-y-2">
                      <p className="font-mono text-[10px] text-deep-blue/40 uppercase">Weekly Hours Saved</p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-syne font-bold text-deep-blue">{report.timeSaved}h</span>
                        <Zap className="w-5 h-5 text-light-green mb-1" />
                      </div>
                    </div>
                    <div className="border-l border-deep-blue/10 pl-6 space-y-2">
                      <p className="font-mono text-[10px] text-deep-blue/40 uppercase">Capital Efficiency</p>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-syne font-bold text-deep-blue">${report.automationSavings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Key Insights Section */}
                <section className="bg-deep-blue p-12 -mx-12">
                  <h3 className="font-syne font-bold text-xs uppercase tracking-widest text-soft-blue/40 mb-10">
                    03. Critical Insights
                  </h3>
                  <div className="space-y-4">
                    {report.topInsights.map((insight, idx) => (
                      <div key={idx} className="flex gap-6 items-start py-4 border-b border-white/10 group">
                        <span className="font-mono text-xs text-soft-blue mt-1">[{String(idx + 1).padStart(2, '0')}]</span>
                        <p className="text-white/80 font-syne font-medium text-lg group-hover:text-white transition-colors">
                          {insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Sign-off */}
                <section className="pt-20 pb-10 border-t border-deep-blue/5 flex justify-between items-end">
                  <div className="space-y-4">
                    <div className="w-48 h-12 bg-deep-blue/5 rounded-lg flex items-center justify-center">
                      <span className="font-instrument-serif font-bold text-xl italic opacity-20">FlowBoard AI</span>
                    </div>
                    <p className="font-mono text-[9px] text-deep-blue/30">
                      AUTONOMOUSLY GENERATED ON {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <button className="flex items-center gap-2 group">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-deep-blue transition-all group-hover:mr-2">
                      Export Full PDF
                    </span>
                    <Download className="w-4 h-4 text-deep-blue" />
                  </button>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
