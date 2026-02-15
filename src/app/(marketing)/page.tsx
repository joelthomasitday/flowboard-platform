import Hero from "@/components/sections/Hero";
import Statement from "@/components/sections/Statement";
import FeatureGrid from "@/components/sections/FeatureGrid";
import AIDemo from "@/components/sections/AIDemo";
import SocialProof from "@/components/sections/SocialProof";
import Pricing from "@/components/sections/Pricing";
import FlowBoardChatbot from "@/components/chat/FlowBoardChatbot";

export default function MarketingPage() {
  return (
    <main className="flex flex-col w-full bg-cream">
      <Hero />
      <Statement />
      <FeatureGrid />
      <AIDemo />
      <SocialProof />
      <Pricing />
      
      <FlowBoardChatbot />
      
      {/* Footer / Final CTA End Block */}
      <div className="h-64 bg-surface-tinted w-full border-t border-border-soft flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 editorial-grid opacity-20" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-12 h-1 bg-light-green rounded-full" />
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-deep-blue/20">
            End of Line // FlowBoard Ecosystem // 2026
          </span>
        </div>
      </div>
    </main>
  );
}
