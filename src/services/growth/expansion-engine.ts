import { db } from "@/lib/db";
import { PLAN_CONFIGS, PlanType } from "@/types/workspace";

export type ExpansionSignal = {
  type: "UPGRADE" | "ADD_SEATS" | "AUTOMATION_ADDON" | "ENTERPRISE_CALL";
  score: number; // 0-100
  reason: string;
};

export const expansionEngine = {
  /**
   * Analyze a workspace for potential expansion opportunities
   */
  async analyze(workspaceId: string): Promise<ExpansionSignal | null> {
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        _count: { select: { memberships: true } },
      }
    });

    if (!workspace) return null;

    const plan = PLAN_CONFIGS[workspace.planType as PlanType];
    const isStarter = workspace.planType === "starter";
    
    // 1. Check Use Limits (Smart Upgrade Triggers)
    const tokenUsagePercent = (workspace.aiTokenUsage / plan.aiTokenLimit) * 100;
    const automationUsagePercent = (workspace.automationUsage / plan.automationLimit) * 100;
    const memberUsagePercent = (workspace._count.memberships / plan.memberLimit) * 100;

    // Trigger Logic
    if (isStarter && tokenUsagePercent > 80) {
      return {
        type: "UPGRADE",
        score: 95,
        reason: "You're hitting 80% of your AI capacity. Upgrade to unlock unlimited creative flows.",
      };
    }

    if (isStarter && automationUsagePercent > 90) {
      return {
        type: "UPGRADE",
        score: 90,
        reason: "Your automation workflows are extensive. Get more power with the Architect plan.",
      };
    }

    if (isStarter && memberUsagePercent >= 95) {
      return {
        type: "ADD_SEATS",
        score: 85,
        reason: "Your team is growing fast. Add more seats to collaborate effectively.",
      };
    }

    // 2. Detect Heavy AI Usage Pattern (Enterprise Signal)
    if (workspace.aiTokenUsage > 500000 && workspace.planType !== "enterprise") {
      return {
        type: "ENTERPRISE_CALL",
        score: 100,
        reason: "Your AI usage is exceptional. Let's discuss a custom enterprise plan for optimal performance.",
      };
    }

    return null;
  }
};
