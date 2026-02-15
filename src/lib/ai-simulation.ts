/**
 * AI Logic Simulation for FlowBoard
 * - Task rescheduling logic
 * - Deadline risk recalculation
 * - Productivity impact scoring
 * - Scalability & Usage Simulation
 */

import { WorkspaceMetadata } from '@/types/workspace';

export interface MockTask {
  id: string;
  title: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  estimatedHours: number;
}

export interface Recommendation {
  id: string;
  action: string;
  reason: string;
  impactScore: number;
  newDueDate?: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const calculateDeadlineRisk = (task: MockTask): Recommendation | null => {
  const today = new Date();
  const diffTime = task.dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (task.status === 'completed') return null;

  let riskScore = 0;
  if (diffDays < 0) riskScore = 100;
  else if (diffDays === 0) riskScore = 90;
  else if (diffDays <= 2) riskScore = 70;
  else if (diffDays <= 5) riskScore = 40;

  // Weight by priority
  const priorityWeight = { high: 1.5, medium: 1.0, low: 0.5 };
  riskScore *= priorityWeight[task.priority];

  if (riskScore > 50) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      action: "Reschedule Task",
      reason: `Task "${task.title}" is ${diffDays < 0 ? 'overdue' : 'approaching deadline'} with ${task.priority} priority.`,
      impactScore: Math.min(Math.round(riskScore), 100),
      newDueDate: new Date(today.getTime() + (diffDays + 3) * 86400000).toISOString(),
      urgencyLevel: riskScore > 80 ? 'critical' : riskScore > 60 ? 'high' : 'medium'
    };
  }

  return null;
};

export const calculateProductivityScore = (tasks: MockTask[]): number => {
  const totalTasks = tasks.length;
  if (totalTasks === 0) return 100;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => t.status !== 'completed' && t.dueDate < new Date()).length;

  const completionRate = (completedTasks / totalTasks) * 100;
  const overduePenalty = (overdueTasks / totalTasks) * 50;

  return Math.max(0, Math.min(100, Math.round(completionRate - overduePenalty + 20))); // +20 as base baseline
};

export const simulateAIAnalysis = (tasks: MockTask[]) => {
  const recommendations = tasks
    .map(calculateDeadlineRisk)
    .filter((r): r is Recommendation => r !== null);
  
  const productivityScore = calculateProductivityScore(tasks);
  
  const overloadThreshold = 0.8; // 80% capacity
  const currentLoad = tasks.filter(t => t.status !== 'completed').reduce((acc, t) => acc + t.estimatedHours, 0);
  const isOverloaded = currentLoad > 40 * overloadThreshold; // Assuming 40h week

  return {
    recommendations,
    productivityScore,
    isOverloaded,
    currentLoad,
    summary: recommendations.length > 0 
      ? `AI has identified ${recommendations.length} critical deadline risks.` 
      : "Your schedule looks optimal for this week."
  };
};

/**
 * Investor Demo & Narrative Report Logic
 */

export interface NarrativeReportData {
  summary: string;
  productivityDelta: number;
  riskReduction: number;
  timeSaved: number;
  automationSavings: number;
  topInsights: string[];
}

export const generateNarrativeReport = (projectName: string = "Global Workspace"): NarrativeReportData => {
  return {
    summary: `The ${projectName} has undergone a significant transformation through AI-led orchestration. By autonomously redistributing 24% of low-impact tasks and prioritizing architectural bottlenecks, the system has stabilized the development velocity. Current trends indicate a shift from 'reactive maintenance' to 'proactive innovation'.`,
    productivityDelta: 18.5,
    riskReduction: 42,
    timeSaved: 12.4,
    automationSavings: 3800,
    topInsights: [
      "AI-driven task reallocation saved 4.2 hours per developer this week.",
      "Predictive bottleneck detection prevented a 3-day delay in Phase 2.",
      "Automated documentation sync reduced context-switching overhead by 15%."
    ]
  };
};

/**
 * Scalability Simulation
 * - Real-time token consumption
 * - Automation hit tracking
 * - Member activity distribution
 */

export const simulateUsageDrift = (workspace: WorkspaceMetadata): WorkspaceMetadata => {
  // Simulate some "work" being done
  const newTokenUsage = workspace.aiUsage.tokensUsed + Math.floor(Math.random() * 500);
  const newAutomationUsage = workspace.automationUsage.executed + (Math.random() > 0.8 ? 1 : 0);
  
  return {
    ...workspace,
    aiUsage: {
      ...workspace.aiUsage,
      tokensUsed: Math.min(newTokenUsage, workspace.aiUsage.tokensLimit)
    },
    automationUsage: {
      ...workspace.automationUsage,
      executed: workspace.automationUsage.limit === -1 
        ? newAutomationUsage 
        : Math.min(newAutomationUsage, workspace.automationUsage.limit)
    }
  };
};

export const getWorkspaceAnalytics = (workspace: WorkspaceMetadata) => {
  return {
    memberActivity: Array.from({ length: 7 }, () => Math.floor(Math.random() * workspace.memberCount)),
    aiEfficiency: 88 + Math.random() * 10,
    automationHealth: 99.4,
    bottlenecksPrevented: Math.floor(Math.random() * 15),
  };
};

export const getDemoWalkthroughSteps = () => [
  {
    target: "AI Insight Panel",
    title: "Intelligence Hub",
    content: "The system constantly analyzes project velocity and team health, providing actionable strategic pivots."
  },
  {
    target: "Productivity Score",
    title: "Efficiency Delta",
    content: "Watch as AI-led automation pushes the team's output beyond traditional project management limits."
  },
  {
    target: "Automation Engine",
    title: "Autonomous Workflows",
    content: "Repetitive tasks are identified and handled by the system, allowing for deep work optimization."
  },
  {
    target: "Activity Feed",
    title: "Real-time Orchestration",
    content: "The workspace is alive. Every move is tracked and optimized for maximum strategic impact."
  }
];

