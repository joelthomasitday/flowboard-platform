"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Globe, Activity, CheckCircle, XCircle } from "lucide-react";

// Mock data structure matching our schema, normally fetched from API
interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
}

interface WebhookManagerProps {
  initialWebhooks?: WebhookEndpoint[];
}

export default function WebhookManager({ initialWebhooks = [] }: WebhookManagerProps) {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(initialWebhooks);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [newUrl, setNewUrl] = useState("");
  const [newEvents, setNewEvents] = useState<string[]>([]);

  const availableEvents = [
    "task.created",
    "task.completed",
    "project.updated",
    "automation.triggered",
    "ai.report.generated",
  ];

  const handleCreate = async () => {
    if (!newUrl) return toast.error("URL is required");
    if (newEvents.length === 0) return toast.error("Select at least one event");

    // In a real app, call API here
    const newWebhook: WebhookEndpoint = {
      id: Math.random().toString(),
      url: newUrl,
      events: newEvents,
      isActive: true,
      secret: "whsec_" + Math.random().toString(36).substring(7),
    };

    setWebhooks([...webhooks, newWebhook]);
    setIsCreating(false);
    setNewUrl("");
    setNewEvents([]);
    toast.success("Webhook endpoint registered");
  };

  const handleDelete = (id: string) => {
    setWebhooks(webhooks.filter((w) => w.id !== id));
    toast.success("Webhook endpoint deleted");
  };

  const toggleEvent = (event: string) => {
    if (newEvents.includes(event)) {
      setNewEvents(newEvents.filter((e) => e !== event));
    } else {
      setNewEvents([...newEvents, event]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Webhooks</h2>
          <p className="text-sm text-slate-500">
            Receive real-time updates for workspace events.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Endpoint
        </button>
      </div>

      {isCreating && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Endpoint URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://api.your-app.com/webhooks"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Events to Subscribe</label>
            <div className="flex flex-wrap gap-2">
              {availableEvents.map((event) => (
                <button
                  key={event}
                  onClick={() => toggleEvent(event)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    newEvents.includes(event)
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {event}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium"
            >
              Register Webhook
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {webhooks.length === 0 && !isCreating ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Globe className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No webhooks configured yet.</p>
          </div>
        ) : (
          webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="group p-5 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-900 truncate max-w-[300px]">
                        {webhook.url}
                      </h3>
                      {webhook.isActive ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex gap-2">
                      <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                        {webhook.secret ? `${webhook.secret.substring(0, 8)}...` : "No Secret"}
                      </code>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(webhook.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-50">
                {webhook.events.map((event) => (
                  <span
                    key={event}
                    className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] rounded font-medium"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
