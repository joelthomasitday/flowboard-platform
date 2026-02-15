import { db } from "@/lib/db";

export interface BrandingConfig {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string; // hex code
  fontFamily?: string;
  companyName?: string;
  customCss?: string;
}

export class BrandingEngine {
  /**
   * Get branding for a given domain or workspace ID
   */
  static async getBranding(identifier: { domain?: string; workspaceId?: string }) {
    if (identifier.workspaceId) {
      const workspace = await db.workspace.findUnique({
        where: { id: identifier.workspaceId },
        select: { brandingConfig: true, name: true, customDomain: true },
      });
      return workspace ? { ...workspace.brandingConfig as BrandingConfig, name: workspace.name } : null;
    }

    if (identifier.domain) {
      // Find workspace by custom domain CNAME or subdomain
      const workspace = await db.workspace.findFirst({
        where: {
          OR: [
            { customDomain: identifier.domain },
            { slug: identifier.domain.split('.')[0] } // simplified subdomain check
          ]
        },
        select: { brandingConfig: true, name: true },
      });
      
      return workspace ? { ...workspace.brandingConfig as BrandingConfig, name: workspace.name } : null;
    }

    return null;
  }

  /**
   * Update branding configuration
   */
  static async updateBranding(workspaceId: string, config: BrandingConfig) {
    return await db.workspace.update({
      where: { id: workspaceId },
      data: {
        brandingConfig: config as any,
      },
    });
  }

  /**
   * Generates CSS variables string for the frontend to inject
   */
  static generateThemeVariables(config: BrandingConfig) {
    if (!config.primaryColor) return "";
    
    // Simple hex to RGB conversion could go here for tailwind vars
    return `
      :root {
        --primary: ${config.primaryColor};
        --brand-font: ${config.fontFamily || 'Inter'};
      }
    `;
  }
}
