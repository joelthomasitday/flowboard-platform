import { db } from "@/lib/db";
import crypto from "crypto";
import { logger } from "@/lib/logger";

interface WebhookPayload {
  eventId: string;
  eventType: string;
  timestamp: string;
  data: any;
}

export async function dispatchWebhook(
  workspaceId: string,
  eventType: string,
  data: any
) {
  try {
    // 1. Fetch active webhooks for workspace that subscribe to this event
    const endpoints = await db.webhookEndpoint.findMany({
      where: {
        workspaceId,
        isActive: true,
        events: { has: eventType },
      },
    });

    if (endpoints.length === 0) return;

    const eventId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const payload: WebhookPayload = {
      eventId,
      eventType,
      timestamp,
      data,
    };

    logger.info({ workspaceId, eventType, endpointCount: endpoints.length }, "Dispatching webhooks");

    // 2. Dispatch to each endpoint in parallel
    const promises = endpoints.map(async (endpoint) => {
      const startTime = Date.now();
      let success = false;
      let statusCode = 0;
      let responseBody = "";

      try {
        const body = JSON.stringify(payload);
        
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "X-FlowBoard-Event": eventType,
          "X-FlowBoard-Delivery": eventId,
          "User-Agent": "FlowBoard-Webhook-Bot/1.0",
        };

        // Sign payload if secret exists
        if (endpoint.secret) {
          const signature = crypto
            .createHmac("sha256", endpoint.secret)
            .update(body)
            .digest("hex");
          headers["X-FlowBoard-Signature"] = `sha256=${signature}`;
        }

        const response = await fetch(endpoint.url, {
          method: "POST",
          headers,
          body,
          signal: AbortSignal.timeout(5000), // 5s timeout
        });

        statusCode = response.status;
        success = response.ok;
        
        // Try to read generic response for debugging
        try {
          const text = await response.text();
          responseBody = text ? text.slice(0, 500) : ""; // Truncate logging
        } catch {
          // ignore parsing error
        }

      } catch (err: any) {
        statusCode = 0;
        success = false;
        responseBody = err.message || "Network Error";
      }

      const durationMs = Date.now() - startTime;

      // 3. Log delivery attempt
      try {
        await db.webhookDeliveryLog.create({
          data: {
            webhookEndpointId: endpoint.id,
            eventId,
            eventType,
            payload: payload as any,
            statusCode,
            responseBody,
            success,
            durationMs,
          },
        });
      } catch (logErr) {
        console.error("Failed to log webhook delivery", logErr);
      }
    });

    await Promise.all(promises);

  } catch (error) {
    logger.error({ error, workspaceId, eventType }, "Failed to dispatch webhooks");
  }
}
