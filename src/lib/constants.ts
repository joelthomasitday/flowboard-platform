export const siteConfig = {
  name: "FlowBoard",
  description: "Manage your projects with flow. The modern productivity platform for teams.",
  url: "https://flowboard.app",
} as const;

export const marketingNav = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
] as const;

export const dashboardNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Tasks", href: "/dashboard/tasks" },
  { label: "Settings", href: "/dashboard/settings" },
] as const;
