import { db } from "@/lib/db";

export type ChurnRisk = {
  isRisk: boolean;
  riskScore: number; // 0-100
  reason?: string;
  recommendedAction?: string;
};

export const churnPredictor = {
  /**
   * Calculate churn risk for a workspace based on recent activity
   */
  async analyzeRisk(workspaceId: string): Promise<ChurnRisk> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 1. Check recent activity
    const activityCount = await db.activityLog.count({
      where: {
        workspaceId,
        createdAt: { gte: oneWeekAgo },
      },
    });

    // 2. Check task completions
    const recentTasks = await db.task.count({
      where: {
        projectId: { in: (await db.project.findMany({ where: { workspaceId }, select: { id: true } })).map(p => p.id) },
        status: "DONE",
        updatedAt: { gte: oneWeekAgo },
      },
    });

    let riskScore = 0;
    let reason = "";
    let action = "";

    if (activityCount === 0) {
      riskScore += 80;
      reason += "No activity in the last 7 days.";
      action = "Send re-engagement email with 'New Features' update.";
    } else if (activityCount < 10) {
      riskScore += 40;
      reason += "Low activity levels.";
      action = "Suggest personalized onboarding walkthrough.";
    }

    if (recentTasks === 0 && riskScore > 0) {
      riskScore += 20;
      reason += " No tasks completed recently.";
    }

    if (riskScore >= 60) {
      return {
        isRisk: true,
        riskScore,
        reason,
        recommendedAction: action,
      };
    }

    return { isRisk: false, riskScore };
  }
};
