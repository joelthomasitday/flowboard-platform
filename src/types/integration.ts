
export type IntegrationProvider = "slack" | "github" | "google_calendar" | "notion";

export interface IntegrationDefinition {
  id: IntegrationProvider;
  name: string;
  description: string;
  icon: string; // simpler to just use a string key for icon component
  categories: ("communication" | "dev" | "productivity")[];
  status?: "connected" | "disconnected";
}

export const AVAILABLE_INTEGRATIONS: IntegrationDefinition[] = [
  {
    id: "slack",
    name: "Slack",
    description: "Get real-time notifications for task updates and team mentions directly in your channels.",
    icon: "slack",
    categories: ["communication"],
  },
  {
    id: "github",
    name: "GitHub",
    description: "Automatically sync GitHub issues with FlowBoard tasks and track pull request status.",
    icon: "github",
    categories: ["dev"],
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Two-way sync between your task due dates and your Google Calendar.",
    icon: "calendar",
    categories: ["productivity"],
  },
  {
    id: "notion",
    name: "Notion",
    description: "Embed FlowBoard views directly into your Notion docs and wikis.",
    icon: "notion",
    categories: ["productivity"],
  },
];
