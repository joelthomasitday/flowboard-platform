"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  MoreHorizontal,
  Plus,
  Zap,
  MessageSquare,
  Clock,
  Layout,
  Calendar,
  BarChart3,
  Users,
  Trash2,
  Edit2,
  X,
  Check
} from "lucide-react";
import { PresenceSystem } from "@/components/system/PresenceSystem";
import { ActivityFeed } from "@/components/system/ActivityFeed";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle, Trash2 as LucideTrash2 } from "lucide-react";
import { useActivity } from "@/context/ActivityContext";
import { useSearchParams } from "next/navigation";

export function ProjectView() {
  const searchParams = useSearchParams();
  const { addEvent } = useActivity();
  
  const projectIdFromUrl = searchParams.get('id');
  const projectName = searchParams.get('name') || "Design System";
  const projectDesc = searchParams.get('description') || "Core architectural tokens, component library, and brand identity refactor.";

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Task Editing State
  const [editingId, setEditingId] = useState<any>(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const editInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch Tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const url = projectIdFromUrl 
          ? `/api/tasks?projectId=${projectIdFromUrl}` 
          : '/api/tasks';
        const res = await fetch(url);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        toast.error("Failed to load project tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectIdFromUrl]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      toast.info(`Uploading ${file.name}...`);
      
      setTimeout(() => {
        setIsUploading(false);
        toast.success("Task file connected and uploaded successfully!");
        addEvent({
          user: { name: "You" },
          action: "imported tasks from",
          target: file.name,
          type: "ai"
        });
      }, 2000);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const phases = React.useMemo(() => {
    const total = tasks.length;
    if (total === 0) return [
      { name: "Discovery", status: "pending", progress: 0 },
      { name: "Design", status: "pending", progress: 0 },
      { name: "Development", status: "pending", progress: 0 },
      { name: "Testing", status: "pending", progress: 0 },
    ];

    const completed = tasks.filter(t => t.status === 'completed').length;
    const overallProgress = (completed / total) * 100;
    
    const getStatus = (p: number) => p === 100 ? 'completed' : (p > 0 ? 'in-progress' : 'pending');

    // Strategic breakdown of phases based on overall task progress
    const discProg = 100; // If project exists with tasks, discovery is done
    const designProg = Math.min(100, Math.max(0, (overallProgress / 30) * 100));
    const devProg = overallProgress <= 30 ? 0 : Math.min(100, Math.max(0, ((overallProgress - 30) / 40) * 100));
    const testProg = overallProgress <= 70 ? 0 : Math.min(100, Math.max(0, ((overallProgress - 70) / 30) * 100));

    return [
      { name: "Discovery", status: getStatus(discProg), progress: discProg },
      { name: "Design", status: getStatus(designProg), progress: Math.round(designProg) },
      { name: "Development", status: getStatus(devProg), progress: Math.round(devProg) },
      { name: "Testing", status: getStatus(testProg), progress: Math.round(testProg) },
    ];
  }, [tasks]);

  const handleNewObjective = () => {
    // Safety: Check if we already have an empty temp task
    const existingTemp = tasks.find(t => typeof t.id === 'string' && t.id.startsWith('temp-') && !t.title);
    if (existingTemp) {
      setEditingId(existingTemp.id);
      return;
    }

    const newId = 'temp-' + Date.now();
    const newTask = {
      id: newId,
      title: "",
      status: "pending",
      priority: "medium",
      time: "Just now",
      assignee: "You"
    };
    setTasks([newTask, ...tasks]);
    setEditingId(newId);
    setEditText("");
    setEditPriority("medium");
  };

  const startEdit = (task: any) => {
    setEditingId(task.id);
    setEditText(task.title);
    setEditPriority(task.priority);
  };

  const saveEdit = async (id: any) => {
    if (isSaving) return;
    if (!editText.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
        const isNew = String(id).startsWith('temp-');
        const method = isNew ? 'POST' : 'PUT';
        const payload = isNew 
            ? { title: editText, priority: editPriority, projectId: projectIdFromUrl }
            : { id, title: editText, priority: editPriority };

        const res = await fetch('/api/tasks', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const savedTask = await res.json();

        if (isNew) {
            setTasks(tasks.map(t => t.id === id ? { ...savedTask, status: 'pending', priority: editPriority.toLowerCase(), time: 'Just now', assignee: 'You' } : t));
        } else {
            setTasks(tasks.map(t => t.id === id ? { ...t, title: editText, priority: editPriority.toLowerCase() } : t));
        }

        addEvent({
            user: { name: "You" },
            action: isNew ? "defined objective" : "updated objective",
            target: editText,
            type: isNew ? "ai" : "edit"
        });

        setEditingId(null);
        toast.success(isNew ? "Objective created" : "Task updated");
    } catch (err) {
        toast.error("Failed to save changes");
    } finally {
        setIsSaving(false);
    }
  };


  const cancelEdit = (id: any) => {
    if (String(id).startsWith('temp-')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
    setEditingId(null);
  };

  const deleteTask = async (id: any) => {
    try {
        await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
        setTasks(tasks.filter(t => t.id !== id));
        toast.success("Task deleted");
    } catch (err) {
        toast.error("Failed to delete task");
    }
  };

  const toggleTaskCompletion = async (id: any) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === "completed" ? "pending" : "completed";
    
    try {
        await fetch('/api/tasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        });

        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
        toast.info("Task status updated");
        
        addEvent({
          user: { name: "You" },
          action: newStatus === "completed" ? "completed task" : "reopened task",
          target: task.title,
          type: "status"
        });
    } catch (err) {
        toast.error("Failed to update status");
    }
  };

  const handleViewBoard = () => {
    console.log("[ProjectView] View Board clicked");
    toast("Board view coming soon!");
  };

  const handleMoreActions = () => {
    console.log("[ProjectView] More actions clicked");
    toast("More actions menu coming soon!");
  };

  const handleApplyStrategy = (index: number) => {
    console.log(`[ProjectView] Applying AI Strategy #${index}`);
    toast.success("AI Strategy applied successfully!");
  };

  return (
    <div className="space-y-8 pb-20 fade-in-up">
      {/* Editorial Header Block - Refined & Aligned */}
      <div className="relative overflow-hidden rounded-[40px] bg-linear-to-br from-deep-blue to-deep-blue/90 p-10 lg:p-14 text-cream shadow-2xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-soft-blue/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-light-green/20 blur-[120px] rounded-full" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-light-green/90 backdrop-blur-md text-deep-blue border-none px-3 py-1 font-mono text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-light-green/20">
                Active Project
              </Badge>
              <div className="h-px w-8 bg-white/20" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
                {projectIdFromUrl ? `ID: ${projectIdFromUrl.slice(0, 8).toUpperCase()}` : "Global Workspace"}
              </span>
            </div>
            
            <div className="space-y-3">
              <h1 className="font-syne text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9] text-transparent bg-clip-text bg-linear-to-r from-cream via-white to-cream/80">
                {projectName}
              </h1>
              <p className="text-lg text-cream/70 font-medium leading-relaxed max-w-xl">
                {projectDesc}
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <PresenceSystem />
              <div className="h-4 w-px bg-white/20" />
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-deep-blue bg-surface-tinted flex items-center justify-center text-[10px] font-bold text-deep-blue">
                     U{i}
                   </div>
                 ))}
                 <div className="w-8 h-8 rounded-full border-2 border-deep-blue bg-deep-blue flex items-center justify-center text-[10px] font-bold text-white">
                   +4
                 </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between h-full gap-6">
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 w-full max-w-xs transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 rounded-lg bg-light-green/20 text-light-green">
                     <Clock className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-wider text-white/80">Timeline</span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-syne font-bold">14</span>
                   <span className="text-sm font-medium opacity-60">days remaining</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                   <div className="bg-light-green h-full w-[65%] rounded-full" />
                </div>
             </div>
             
             <div className="flex gap-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".csv,.json,.txt"
                />
                <button 
                  onClick={triggerUpload}
                  disabled={isUploading}
                  className="h-10 px-5 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-3 h-3" />}
                  {isUploading ? "Uploading..." : "Upload Tasks"}
                </button>
                <button 
                  onClick={handleViewBoard}
                  className="h-10 px-5 rounded-full bg-cream text-deep-blue text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  <Layout className="w-3 h-3" /> View Board
                </button>
                <button 
                  onClick={handleMoreActions}
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white cursor-pointer"
                >
                   <MoreHorizontal className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content: Tasks & Roadmap */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Strategic Tasks Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <h2 className="font-syne text-2xl font-bold text-deep-blue">Strategic Tasks</h2>
                <Badge variant="outline" className="border-border-soft text-deep-blue/50 text-[10px]">
                  {tasks.filter(t => t.status !== "completed").length} OPEN
                </Badge>
              </div>
              <button 
                onClick={handleNewObjective}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-soft hover:bg-deep-blue hover:text-white hover:border-transparent transition-all duration-300 text-xs font-bold text-deep-blue uppercase tracking-widest shadow-sm hover:shadow-md cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                New Objective
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                  <div 
                  key={task.id}
                  className="group relative p-6 rounded-xl bg-white border border-transparent shadow-sm hover:shadow-elevated hover:border-soft-blue/20 transition-all duration-300 hover:-translate-y-1 cursor-default"
                >
                  {editingId === task.id ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-xs font-bold uppercase tracking-wider text-deep-blue/40">Editing Task</span>
                         <div className="flex gap-2">
                           <button 
                             onClick={() => saveEdit(task.id)}
                             className="p-1.5 rounded-full bg-light-green text-deep-blue hover:bg-light-green/80 transition-colors"
                           >
                             <Check className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => cancelEdit(task.id)}
                             className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                      </div>
                      <textarea
                        ref={editInputRef as any}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-surface-sunken/50 border-b-2 border-deep-blue/20 text-deep-blue font-medium p-2 focus:outline-none focus:border-deep-blue resize-none rounded-t-lg"
                        rows={2}
                        placeholder="Enter task objective..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            saveEdit(task.id);
                          }
                        }}
                      />
                      <div className="flex gap-2 pt-2">
                         {['high', 'medium', 'low'].map((p) => (
                           <button
                             key={p}
                             onClick={() => setEditPriority(p)}
                             className={cn(
                               "text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-all border",
                               editPriority === p 
                                 ? (p === 'high' ? "bg-red-100 text-red-700 border-red-200" :
                                    p === 'medium' ? "bg-orange-100 text-orange-700 border-orange-200" :
                                    "bg-blue-100 text-blue-700 border-blue-200")
                                 : "bg-transparent text-deep-blue/40 border-transparent hover:bg-surface-sunken"
                             )}
                           >
                             {p}
                           </button>
                         ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <button 
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer",
                            task.status === "completed" 
                              ? "bg-light-green text-deep-blue scale-110" 
                              : "border-2 border-border-soft text-transparent hover:border-soft-blue group-hover:scale-110"
                          )}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                             <button 
                               onClick={() => startEdit(task)}
                               className="p-1.5 rounded-full hover:bg-surface-tinted text-deep-blue/60 hover:text-deep-blue transition-colors cursor-pointer"
                               title="Edit"
                             >
                                <Edit2 className="w-3 h-3" />
                             </button>
                             <button 
                               onClick={() => deleteTask(task.id)}
                               className="p-1.5 rounded-full hover:bg-red-50 text-deep-blue/60 hover:text-red-600 transition-colors cursor-pointer"
                               title="Delete"
                             >
                                <Trash2 className="w-3 h-3" />
                             </button>
                          </div>
                          <Badge variant="secondary" className={cn(
                            "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5",
                            task.priority === 'high' ? "bg-red-50 text-red-600" :
                            task.priority === 'medium' ? "bg-orange-50 text-orange-600" :
                            "bg-blue-50 text-blue-600"
                          )}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <h3 className={cn(
                        "font-medium text-deep-blue leading-snug mb-4 h-12 line-clamp-2",
                        task.status === "completed" && "opacity-50 line-through decoration-deep-blue/20"
                      )}>
                        {task.title}
                      </h3>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-dashed border-border-soft text-[11px] font-bold text-deep-blue/40 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 group-hover:text-soft-blue transition-colors">
                          <Clock className="w-3 h-3" /> {task.time}
                        </span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <div className="w-6 h-6 rounded-full bg-surface-tinted flex items-center justify-center text-[9px] text-deep-blue">
                            {task.assignee[0]}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Project Roadmap Section - Fills the vertical space */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-1">
                <h2 className="font-syne text-2xl font-bold text-deep-blue">Phase Roadmap</h2>
                <div className="h-px w-full bg-border-soft/50 flex-1 ml-4" />
            </div>
            
            <div className="rounded-[32px] bg-white border border-border-soft p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-full bg-linear-to-l from-surface-tinted/50 to-transparent pointer-events-none" />
               <div className="relative z-10 space-y-8">
                  {phases.map((phase, i) => (
                    <div key={i} className="group cursor-default">
                       <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                             <div className={cn(
                               "w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors",
                               phase.status === 'completed' ? "bg-deep-blue text-white" : 
                               phase.status === 'in-progress' ? "bg-light-green text-deep-blue" :
                               "bg-surface-sunken text-deep-blue/40"
                             )}>
                               {i + 1}
                             </div>
                             <span className={cn(
                               "font-bold text-sm uppercase tracking-wider",
                               phase.status === 'pending' ? "text-deep-blue/40" : "text-deep-blue"
                             )}>{phase.name}</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-deep-blue/50">{phase.progress}%</span>
                       </div>
                       <div className="w-full bg-surface-sunken h-2 rounded-full overflow-hidden relative">
                          <div 
                             className={cn("h-full rounded-full transition-all duration-1000 ease-out", 
                               phase.status === 'completed' ? "bg-deep-blue" : 
                               phase.status === 'in-progress' ? "bg-light-green" : "bg-transparent"
                             )} 
                             style={{ width: `${phase.progress}%` }} 
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        </div>

        {/* Right Side Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-8 space-y-8">
            {/* AI Insights Card */}
            <Card className="bg-linear-to-br from-white to-surface-tinted/30 border-white/50 backdrop-blur-sm rounded-[32px] overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500">
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-deep-blue flex items-center justify-center shadow-lg shadow-deep-blue/20">
                      <Zap className="w-5 h-5 text-light-green" />
                    </div>
                    <div>
                      <h3 className="font-syne text-lg font-bold text-deep-blue uppercase tracking-tight">AI Strategies</h3>
                      <p className="text-[9px] font-mono text-deep-blue/40 uppercase tracking-tighter">Synthesized just now</p>
                    </div>
                  </div>
                  <div className="animate-pulse w-2 h-2 rounded-full bg-light-green" />
                </div>

                <div className="space-y-3">
                  {[
                    "Consolidate design tokens into a central theme file for 20% faster implementation.",
                    "Review 'Task 4' - critical path blocker detected.",
                  ].map((suggestion, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleApplyStrategy(i)}
                      className="p-4 rounded-2xl bg-white border border-border-soft/60 hover:border-soft-blue/40 hover:bg-surface-elevated transition-all cursor-pointer group"
                    >
                      <p className="text-xs font-medium text-deep-blue/70 leading-relaxed group-hover:text-deep-blue transition-colors">
                        {suggestion}
                      </p>
                      <div className="mt-2 h-0 overflow-hidden group-hover:h-auto group-hover:mt-3 transition-all">
                        <span className="text-[10px] font-bold text-soft-blue uppercase tracking-widest flex items-center gap-1">
                          Apply <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                   <div className="rounded-2xl bg-deep-blue p-6 relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <BarChart3 className="w-16 h-16 text-white" />
                      </div>
                      <div className="space-y-2 relative z-10">
                         <div className="text-[10px] font-bold text-light-green uppercase tracking-[.2em]">Heuristic Score</div>
                         <div className="flex items-end justify-between">
                            <span className="text-4xl font-syne font-bold text-white leading-none">88</span>
                            <span className="text-[10px] font-bold text-white/40 uppercase mb-1">Optimal</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                           <div className="h-full bg-light-green w-[88%] shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </Card>

            {/* Live Activity Feed */}
            <div className="bg-surface-elevated/50 backdrop-blur-md rounded-[32px] border border-white/50 p-1">
              <div className="p-6 pb-2">
                 <h3 className="font-syne text-sm font-bold text-deep-blue uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-4 h-4 text-deep-blue/40" /> Live Activity
                 </h3>
              </div>
              <div className="h-[300px] overflow-hidden relative">
                 <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent via-transparent to-surface-elevated pointer-events-none" />
                 <ActivityFeed />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
