"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Type, AlignLeft, Flag, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskData: { title: string; description: string; status: string; priority: string; dueDate?: string }) => Promise<void>;
  initialData?: {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate?: string;
  };
}

export function TaskModal({ isOpen, onClose, onConfirm, initialData }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with initialData when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setStatus(initialData?.status || "TODO");
      setPriority(initialData?.priority || "MEDIUM");
      setDueDate(initialData?.dueDate && initialData.dueDate !== "No date" ? initialData.dueDate : "");
    }
  }, [isOpen, initialData]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirm({ title, description, status, priority, dueDate: dueDate || undefined });
      onClose();
    } catch (error) {
      console.error("Failed to process task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-deep-blue/20 backdrop-blur-md transition-opacity duration-500 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={cn(
        "relative w-full max-w-lg bg-white rounded-[32px] shadow-elevated border border-border-soft overflow-hidden transition-all duration-500 ease-out transform",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
      )}>
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-syne text-2xl font-bold text-deep-blue">
              {initialData ? "Refine Strategic Pulse" : "New Strategic Pulse"}
            </h2>
            <p className="text-deep-blue/40 text-sm font-medium">
              {initialData ? "Update the details of your objective." : "Define a new objective for your workspace."}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-surface-sunken text-deep-blue/20 hover:text-deep-blue transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-deep-blue/40 ml-1 flex items-center gap-2">
              <Type className="w-3 h-3" />
              Task Title
            </label>
            <input 
              autoFocus
              required
              type="text"
              placeholder="e.g., Finalize Q1 Roadmap"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-sunken/50 border border-transparent focus:border-soft-blue/30 focus:bg-white rounded-2xl px-5 py-4 text-deep-blue font-medium outline-hidden transition-all text-lg placeholder:text-deep-blue/20 shadow-inner"
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-deep-blue/40 ml-1 flex items-center gap-2">
              <AlignLeft className="w-3 h-3" />
              Description
            </label>
            <textarea 
              placeholder="What needs to be done? Add relevant context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-surface-sunken/50 border border-transparent focus:border-soft-blue/30 focus:bg-white rounded-2xl px-5 py-4 text-deep-blue font-medium outline-hidden transition-all text-sm placeholder:text-deep-blue/20 shadow-inner resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-deep-blue/40 ml-1 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                Initial Status
              </label>
              <div className="relative">
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none bg-surface-sunken/50 border border-transparent focus:border-soft-blue/30 focus:bg-white rounded-2xl px-5 py-3 text-deep-blue text-xs font-bold uppercase tracking-widest outline-hidden transition-all cursor-pointer"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-deep-blue/20">
                  <Plus className="w-3 h-3 rotate-45" />
                </div>
              </div>
            </div>

            {/* Priority Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-deep-blue/40 ml-1 flex items-center gap-2">
                <Flag className="w-3 h-3" />
                Priority Level
              </label>
              <div className="relative">
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full appearance-none bg-surface-sunken/50 border border-transparent focus:border-soft-blue/30 focus:bg-white rounded-2xl px-5 py-3 text-deep-blue text-xs font-bold uppercase tracking-widest outline-hidden transition-all cursor-pointer"
                >
                  <option value="LOW">Low Pulse</option>
                  <option value="MEDIUM">Medium Pulse</option>
                  <option value="HIGH">High Pulse</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-deep-blue/20">
                  <Plus className="w-3 h-3 rotate-45" />
                </div>
              </div>
            </div>
          </div>

          {/* Due Date Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-deep-blue/40 ml-1 flex items-center gap-2">
              <Plus className="w-3 h-3" />
              Target Completion Date
            </label>
            <input 
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-surface-sunken/50 border border-transparent focus:border-soft-blue/30 focus:bg-white rounded-2xl px-5 py-3 text-deep-blue text-xs font-bold uppercase tracking-widest outline-hidden transition-all cursor-pointer shadow-inner"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-sunken text-deep-blue/60 hover:text-deep-blue py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              disabled={isSubmitting || !title.trim()}
              type="submit"
              className="flex-2 bg-deep-blue text-cream hover:bg-deep-blue-dark py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg shadow-deep-blue/10 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : initialData ? (
                <>Update Pulse</>
              ) : (
                <>
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  Initiate Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
