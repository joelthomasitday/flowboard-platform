import { db } from "@/lib/db";

export type ConversionStep = {
  step: string;
  count: number;
  dropoffRate: number;
};

export const analyticsEngine = {
  /**
   * Calculate conversion funnel from Signup -> Upgrade
   */
  async getConversionFunnel(): Promise<ConversionStep[]> {
    const counts = await Promise.all([
      db.analyticsEvent.count({ where: { eventType: "WORKSPACE_CREATED" } }),
      db.analyticsEvent.count({ where: { eventType: "PROJECT_CREATED" } }),
      db.analyticsEvent.count({ where: { eventType: "TRIAL_STARTED" } }),
      db.analyticsEvent.count({ where: { eventType: "PLAN_UPGRADED" } }),
    ]);

    const [workspaces, projects, trials, upgrades] = counts;

    return [
      { step: "Workspace Created", count: workspaces, dropoffRate: 0 },
      { step: "Project Created", count: projects, dropoffRate: workspaces ? 1 - (projects / workspaces) : 0 },
      { step: "Trial Started", count: trials, dropoffRate: projects ? 1 - (trials / projects) : 0 },
      { step: "Upgraded", count: upgrades, dropoffRate: trials ? 1 - (upgrades / trials) : 0 },
    ];
  },

  /**
   * Analyze AI usage distribution across workspaces
   */
  async getAIUsageDistribution() {
    // This is a simplified distribution query. 
    // In a real scenario, we'd use raw SQL for efficient bucketing.
    const workspaces = await db.workspace.findMany({
      select: { aiTokenUsage: true },
    });

    const buckets = {
      low: 0,    // < 1k tokens
      medium: 0, // 1k - 50k tokens
      heavy: 0,  // > 50k tokens
    };

    workspaces.forEach(ws => {
      if (ws.aiTokenUsage < 1000) buckets.low++;
      else if (ws.aiTokenUsage > 50000) buckets.heavy++;
      else buckets.medium++;
    });

    return buckets;
  },

  /**
   * Get total metrics for CEO Dashboard
   */
  async getKeyMetrics() {
    const totalWorkspaces = await db.workspace.count({ where: { subscriptionStatus: "active" }});
    // Simplified MRR calculation (assuming strict plan prices)
    const paidWorkspaces = await db.workspace.findMany({
      where: { subscriptionStatus: "active", planType: { not: "starter" } },
      select: { planType: true }
    });

    let mrr = 0;
    paidWorkspaces.forEach(ws => {
      if (ws.planType === "architect") mrr += 29;
      if (ws.planType === "enterprise") mrr += 299; // Assume base enterprise price
    });

    const arr = mrr * 12;

    return {
      activeWorkspaces: totalWorkspaces,
      mrr,
      arr,
    };
  }
};
