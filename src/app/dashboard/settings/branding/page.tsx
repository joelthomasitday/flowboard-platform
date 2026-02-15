import { Metadata } from "next";
import BrandingPanel from "@/components/system/BrandingPanel";

export const metadata: Metadata = {
  title: "Workspace Branding | FlowBoard",
  description: "Customize your workspace appearance.",
};

export default function BrandingPage() {
  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-light text-slate-900 dark:text-white">Workspace Branding</h1>
        <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400 mt-2 font-light">
          Make FlowBoard your own with custom colors, logos, and domains.
        </p>
      </div>
      
      <BrandingPanel />
    </div>
  );
}
