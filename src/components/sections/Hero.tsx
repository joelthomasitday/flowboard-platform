"use client";

import React from "react";
import { ArrowRight, Sparkles, Layout, Zap, Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden bg-cream pt-20">
      {/* ─── Background Orchestration ─── */}
      <div className="absolute inset-0 gradient-hero-glow opacity-60 pointer-events-none" />
      <div className="absolute inset-0 editorial-grid opacity-[0.04] pointer-events-none" />
      
      {/* ─── Static Background Accents (Removed heavy blur animations) ─── */}
      <div 
        className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-soft-blue/10 blur-[80px] opacity-40 rounded-full pointer-events-none" 
      />
      <div 
        className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[70%] bg-light-green/15 blur-[100px] opacity-30 rounded-full pointer-events-none" 
      />
      
      {/* Subtle Grain for Depth */}
      <div className="absolute inset-0 grain-overlay opacity-[0.02] pointer-events-none" />

      {/* ─── Content Layer ─── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        {/* AI Tag */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-soft-blue/30 bg-soft-blue/10 backdrop-blur-md mb-8">
          <Sparkles className="w-3.5 h-3.5 text-deep-blue" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-deep-blue font-bold">
            Intelligence Optimized v2.4
          </span>
        </div>

        {/* Primary Headline */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="font-syne text-clamp-hero font-extrabold uppercase leading-[0.85] tracking-tight text-deep-blue">
            Design the <span className="text-soft-blue">Future</span>.
          </h1>
          <h1 className="font-serif italic text-4xl md:text-7xl lg:text-8xl text-deep-blue/30 -mt-2">
            Flow with clarity.
          </h1>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <button className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-deep-blue text-cream rounded-full font-bold text-sm uppercase tracking-widest shadow-md hover:bg-deep-blue/90 transition-all duration-300">
            <span className="relative z-10 flex items-center gap-2">
              Start Building <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          
          <button className="px-10 py-5 bg-white/50 backdrop-blur-sm text-deep-blue/80 rounded-full font-bold text-sm uppercase tracking-widest border border-border-soft hover:bg-cream-warm transition-colors duration-300">
            View Case Studies
          </button>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
            className="px-8 py-4 bg-transparent text-deep-blue border border-light-green hover:bg-light-green/20 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-soft-blue" />
            Or ask FlowBoard AI how it works
          </button>
        </div>
      </div>

      {/* ─── Architectural Highlights ─── */}
      <div className="max-w-7xl mx-auto px-6 mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-center pb-24 border-t border-border-soft pt-16">
        <HighlightItem 
          icon={<Zap className="w-5 h-5 text-soft-blue" />}
          title="Neural Velocity" 
          desc="AI that doesn't just suggest — it synchronizes your entire workflow architecture."
        />
        <HighlightItem 
          icon={<Search className="w-5 h-5 text-light-green-dark" />}
          title="Deep Clarity" 
          desc="Remove the noise of traditional project management with semantic organization."
        />
        <HighlightItem 
          icon={<Layout className="w-5 h-5 text-deep-blue/40" />}
          title="Architectural UX" 
          desc="Designed for strategic minds who value proportion, calm, and performance."
        />
      </div>
    </section>
  );
}

function HighlightItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center gap-4 group">
      <div className="w-12 h-12 rounded-full bg-surface-sunken flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-500 border border-border-soft">
        {icon}
      </div>
      <h3 className="font-syne font-bold text-lg text-deep-blue tracking-tight uppercase">{title}</h3>
      <p className="text-deep-blue/50 text-sm leading-relaxed max-w-[280px]">
        {desc}
      </p>
    </div>
  );
}
