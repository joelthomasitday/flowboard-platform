import { Metadata } from "next";
import SecurityPanel from "@/components/system/SecurityPanel";

export const metadata: Metadata = {
  title: "Enterprise Security | FlowBoard",
  description: "Configure SSO, Audit Logs, and Enterprise Policy.",
};

export default function SecurityPage() {
  return (
    <div className="p-8 pb-32">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-light text-slate-900 dark:text-white">Security & Compliance</h1>
        <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400 mt-2 font-light">
          Manage enterprise-grade authentication, access controls, and auditing.
        </p>
      </div>
      
      <SecurityPanel />
    </div>
  );
}
