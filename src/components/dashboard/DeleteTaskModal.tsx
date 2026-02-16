"use client";

import React, { useEffect, useState } from "react";
import { X, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  taskTitle?: string;
}

export function DeleteTaskModal({ isOpen, onClose, onConfirm, taskTitle }: DeleteTaskModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, isDeleting]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      // Modal will be closed by parent after successful deletion or we can close it here
      onClose();
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-deep-blue/40 backdrop-blur-sm transition-opacity duration-500 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className={cn(
        "relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-red-100 overflow-hidden transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) transform",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-8"
      )}>
        {/* Header Visual */}
        <div className="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 shadow-inner">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-syne text-2xl font-bold text-deep-blue text-center">
            Delete Task?
          </h2>
        </div>

        {/* Body */}
        <div className="p-8 text-center space-y-4">
          <p className="text-deep-blue/60 font-medium leading-relaxed">
            You are about to permanently delete <span className="font-bold text-deep-blue">"{taskTitle || "this task"}"</span>.
            <br />
            This action involves erasing all associated data and cannot be undone.
          </p>

          {/* Actions */}
          <div className="pt-4 flex items-center gap-3">
            <button 
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 bg-surface-sunken text-deep-blue/60 hover:text-deep-blue hover:bg-surface-sunken/80 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-500 text-white hover:bg-red-600 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Forever
                </>
              )}
            </button>
          </div>
        </div>

        {/* Close Button (Top Right) */}
        {!isDeleting && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white text-deep-blue/20 hover:text-deep-blue transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
