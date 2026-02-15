
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Plus, 
  Check, 
  LayoutGrid, 
  Settings, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWorkspaces, getActiveWorkspace } from '@/lib/workspace-engine';
import { WorkspaceMetadata } from '@/types/workspace';

export const WorkspaceSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const workspaces = getWorkspaces();
  const activeWs = getActiveWorkspace();
  const [selectedWs, setSelectedWs] = useState<WorkspaceMetadata>(activeWs);

  return (
    <div className="relative w-full px-4 py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300",
          "bg-stone-50/50 border border-stone-200/60 hover:border-blue-200 hover:bg-white shadow-sm",
          isOpen && "ring-2 ring-blue-100 border-blue-200 bg-white"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <LayoutGrid size={18} />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Workspace</p>
            <p className="text-sm font-semibold text-stone-900 truncate max-w-[120px]">
              {selectedWs.name}
            </p>
          </div>
        </div>
        <ChevronDown 
          size={16} 
          className={cn("text-stone-400 transition-transform duration-300", isOpen && "rotate-180")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="absolute left-4 right-4 top-full mt-2 z-50 bg-[#FCFBF8] border border-stone-200/80 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-2 space-y-1">
                <p className="px-3 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Your Workspaces
                </p>
                
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setSelectedWs(ws);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group",
                      selectedWs.id === ws.id 
                        ? "bg-blue-50/50 text-blue-700" 
                        : "hover:bg-blue-50/30 text-stone-600 hover:text-blue-600"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        selectedWs.id === ws.id ? "bg-emerald-400 ring-4 ring-emerald-100" : "bg-stone-300"
                      )} />
                      <div className="text-left">
                        <p className="text-sm font-semibold">{ws.name}</p>
                        <p className="text-[10px] opacity-70">
                          {ws.memberCount} members • {ws.plan.type}
                        </p>
                      </div>
                    </div>
                    {selectedWs.id === ws.id && <Check size={14} className="text-emerald-500" />}
                  </button>
                ))}
              </div>

              <div className="border-t border-stone-100 p-2 bg-stone-50/50">
                <button 
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-stone-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all text-sm font-medium"
                >
                  <Plus size={16} />
                  <span>Create Workspace</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
