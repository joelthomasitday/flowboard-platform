"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface UpgradeBannerProps {
  type: "trial" | "usage" | "status";
  message: string;
  daysRemaining?: number;
  percentage?: number;
  onUpgrade?: () => void;
  className?: string;
}

export function UpgradeBanner({
  type,
  message,
  daysRemaining,
  percentage,
  onUpgrade,
  className,
}: UpgradeBannerProps) {
  const isWarning = (percentage && percentage > 80) || type === "status";
  const isCritical = (percentage && percentage >= 100) || (daysRemaining !== undefined && daysRemaining <= 3);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      className={cn(
        "relative overflow-hidden border-b px-6 py-3 transition-colors duration-500",
        type === "trial" && "bg-indigo-50/50 border-indigo-100",
        type === "usage" && !isCritical && "bg-amber-50/50 border-amber-100",
        isCritical && "bg-rose-50/50 border-rose-100",
        className
      )}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110",
            type === "trial" && "bg-indigo-100 text-indigo-600",
            type === "usage" && !isCritical && "bg-amber-100 text-amber-600",
            isCritical && "bg-rose-100 text-rose-600"
          )}>
            {type === "trial" && <Clock className="h-4 w-4" />}
            {type === "usage" && <Sparkles className="h-4 w-4" />}
            {type === "status" && <AlertTriangle className="h-4 w-4" />}
          </div>
          
          <div className="flex flex-col">
            <span className={cn(
              "text-sm font-medium",
              type === "trial" && "text-indigo-900",
              type === "usage" && !isCritical && "text-amber-900",
              isCritical && "text-rose-900"
            )}>
              {message}
            </span>
            {percentage !== undefined && (
              <div className="mt-1 h-1 w-48 rounded-full bg-black/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  className={cn(
                    "h-full transition-colors",
                    percentage > 90 ? "bg-rose-500" : percentage > 70 ? "bg-amber-500" : "bg-indigo-500"
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {daysRemaining !== undefined && (
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left
            </span>
          )}
          <Button
            size="sm"
            onClick={onUpgrade}
            className={cn(
              "group relative overflow-hidden border-none shadow-sm transition-all hover:shadow-md",
              type === "trial" && "bg-indigo-600 text-white hover:bg-indigo-700",
              type === "usage" && !isCritical && "bg-amber-600 text-white hover:bg-amber-700",
              isCritical && "bg-rose-600 text-white hover:bg-rose-700"
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              Upgrade to Architect
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </div>

      {/* Subtle decorative background detail */}
      <div className="absolute right-0 top-0 -z-10 h-full w-1/3 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 100" className="h-full w-full fill-current">
          <circle cx="180" cy="20" r="40" className={cn(
            type === "trial" && "text-indigo-200",
            type === "usage" && "text-amber-200",
            isCritical && "text-rose-200"
          )} />
        </svg>
      </div>
    </motion.div>
  );
}
