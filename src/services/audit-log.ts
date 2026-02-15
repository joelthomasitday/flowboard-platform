import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export type AuditAction = 
  | "ROLE_CHANGE" 
  | "BILLING_UPDATE" 
  | "AUTOMATION_EDIT" 
  | "PROJECT_DELETE" 
  | "MEMBER_INVITE"
  | "SETTINGS_CHANGE";

export const auditService = {
  /**
   * Log a security-sensitive event to the database and structured logs
   */
  async log(params: {
    workspaceId: string;
    userId: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    metadata?: Record<string, any>;
  }) {
    const { workspaceId, userId, action, entityType, entityId, metadata } = params;

    // 1. Database Log (Audit Trail)
    const dbLog = await db.activityLog.create({
      data: {
        workspaceId,
        action: action,
        entityType,
        entityId,
        metadata: {
          ...metadata,
          initiatedBy: userId,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // 2. Structured Application Log
    logger.info({
      event: "audit_event",
      action,
      workspaceId,
      userId,
      entityId,
      entityType,
      ...metadata,
    }, `Audit: ${action} on ${entityType} ${entityId}`);

    return dbLog;
  }
};
