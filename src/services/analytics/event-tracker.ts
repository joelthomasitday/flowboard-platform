import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export type EventType =
  | "WORKSPACE_CREATED"
  | "PROJECT_CREATED"
  | "TASK_COMPLETED"
  | "AI_REPORT_GENERATED"
  | "AUTOMATION_CREATED"
  | "PLAN_UPGRADED"
  | "TRIAL_STARTED"
  | "TRIAL_CONVERTED"
  | "CHURN_RISK_DETECTED"
  | "EXPANSION_SIGNAL_DETECTED";

export const eventTracker = {
  /**
   * Log a product analytics event
   */
  async track(
    eventType: EventType,
    params: {
      workspaceId: string;
      userId?: string;
      metadata?: Record<string, any>;
    }
  ) {
    const { workspaceId, userId, metadata } = params;

    // 1. Database Log
    try {
      await db.analyticsEvent.create({
        data: {
          eventType,
          workspaceId,
          userId,
          metadata: metadata || {},
        },
      });

      // 2. Structured Log
      logger.info({
        event: "product_analytics",
        eventType,
        workspaceId,
        userId,
        ...metadata,
      }, `[Analytics] ${eventType}`);

      // 3. Dispatch Webhooks (Process in background)
      // Convert EventType to slug format (e.g. WORKSPACE_CREATED -> workspace.created)
      const webhookEventName = eventType.toLowerCase().replace(/_/g, ".");
      
      // Fire and forget - don't block the main thread
      import("@/services/webhooks/webhook-dispatcher").then(({ dispatchWebhook }) => {
        dispatchWebhook(workspaceId, webhookEventName, {
          userId,
          metadata,
          timestamp: new Date().toISOString(),
        }).catch(err => {
          console.error("Failed to dispatch background webhook", err);
        });
      });

    } catch (error) {
      logger.error({ error, eventType }, "Failed to track analytics event");
    }
  }
};
