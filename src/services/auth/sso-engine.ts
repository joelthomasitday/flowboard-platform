import { db } from "@/lib/db";
import { User, Workspace, Role } from "@prisma/client";

export type SSOProvider = "google" | "azure-ad" | "okta" | "saml";

export interface SSOConfig {
  entryPoint?: string;
  issuer?: string;
  cert?: string;
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
}

export class SSOEngine {
  /**
   * Configures SSO for a workspace
   */
  static async configureSSO(
    workspaceId: string,
    provider: SSOProvider,
    config: SSOConfig,
    domain?: string
  ) {
    return await db.workspace.update({
      where: { id: workspaceId },
      data: {
        ssoEnabled: true,
        ssoProvider: provider,
        ssoConfig: config as any, // Cast to avoid Prisma JSON type issues
        ssoDomain: domain,
      },
    });
  }

  /**
   * Finds a workspace by SSO domain (Auto-Discovery)
   */
  static async findWorkspaceByDomain(email: string) {
    const domain = email.split("@")[1];
    if (!domain) return null;

    return await db.workspace.findFirst({
      where: {
        ssoDomain: domain,
        ssoEnabled: true,
      },
    });
  }

  /**
   * JIT (Just-In-Time) Provisioning
   * Creates or updates a user from SSO login and adds them to the workspace
   */
  static async jitProvision(
    email: string,
    name: string,
    ssoId: string,
    workspaceId: string
  ) {
    // 1. Find or Create User
    const user = await db.user.upsert({
      where: { email },
      update: {
        name,
        ssoId,
        emailVerified: new Date(),
      },
      create: {
        email,
        name,
        ssoId,
        emailVerified: new Date(),
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      },
    });

    // 2. Ensure Workspace Membership
    const membership = await db.membership.findFirst({
      where: {
        userId: user.id,
        workspaceId,
      },
    });

    if (!membership) {
      await db.membership.create({
        data: {
          userId: user.id,
          workspaceId,
          role: "MEMBER", // Default role for JIT users
        },
      });
    }

    return user;
  }

  /**
   * Validates if a user is allowed to login via password
   * Returns false if SSO is enforced and user's email domain matches an SSO workspace
   */
  static async isPasswordLoginAllowed(email: string): Promise<boolean> {
    const workspace = await this.findWorkspaceByDomain(email);
    if (workspace && workspace.ssoEnabled) {
      // If workspace has SSO enforced, password login should be disabled for that domain
      return false;
    }
    return true;
  }
}
