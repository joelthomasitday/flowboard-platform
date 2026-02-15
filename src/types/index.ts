// Global type definitions for FlowBoard

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
}
