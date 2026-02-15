import { db } from "@/lib/db";
import { PLAN_CONFIGS, PlanType } from "@/types/workspace";

export const usageService = {
  /**
   * Increments AI token usage for a workspace
   */
  async trackAIUsage(workspaceId: string, tokens: number) {
    return await db.workspace.update({
      where: { id: workspaceId },
      data: {
        aiTokenUsage: {
          increment: tokens,
        },
      },
    });
  },

  /**
   * Increments automation execution count
   */
  async trackAutomationUsage(workspaceId: string) {
    return await db.workspace.update({
      where: { id: workspaceId },
      data: {
        automationUsage: {
          increment: 1,
        },
      },
      select: {
        automationUsage: true,
        planType: true,
      }
    });
  },

  /**
   * Returns whether a workspace has exceeded its limits for a specific feature
   */
  async checkUsageLimit(workspaceId: string, feature: "ai" | "automation" | "members") {
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        _count: {
          select: { memberships: true }
        }
      }
    });

    if (!workspace) return { allowed: false, reason: "Workspace not found" };

    const plan = PLAN_CONFIGS[workspace.planType as PlanType];
    
    if (feature === "ai") {
      const isOver = workspace.aiTokenUsage >= plan.aiTokenLimit && plan.aiTokenLimit !== -1;
      return { allowed: !isOver, current: workspace.aiTokenUsage, limit: plan.aiTokenLimit };
    }

    if (feature === "automation") {
      const isOver = workspace.automationUsage >= plan.automationLimit && plan.automationLimit !== -1;
      return { allowed: !isOver, current: workspace.automationUsage, limit: plan.automationLimit };
    }

    if (feature === "members") {
      const isOver = workspace._count.memberships >= plan.memberLimit && plan.memberLimit !== -1;
      return { allowed: !isOver, current: workspace._count.memberships, limit: plan.memberLimit };
    }

    return { allowed: true };
  },

  async getWorkspaceUsage(workspaceId: string) {
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        _count: {
          select: { memberships: true }
        }
      }
    });

    if (!workspace) return null;

    const plan = PLAN_CONFIGS[workspace.planType as PlanType];

    return {
      ai: {
        used: workspace.aiTokenUsage,
        limit: plan.aiTokenLimit,
        percentage: plan.aiTokenLimit === -1 ? 0 : (workspace.aiTokenUsage / plan.aiTokenLimit) * 100
      },
      automation: {
        used: workspace.automationUsage,
        limit: plan.automationLimit,
        percentage: plan.automationLimit === -1 ? 0 : (workspace.automationUsage / plan.automationLimit) * 100
      },
      members: {
        used: workspace._count.memberships,
        limit: plan.memberLimit,
        percentage: plan.memberLimit === -1 ? 0 : (workspace._count.memberships / plan.memberLimit) * 100
      },
      subscriptionStatus: workspace.subscriptionStatus,
      trialEndsAt: workspace.trialEndsAt
    };
  }
};
