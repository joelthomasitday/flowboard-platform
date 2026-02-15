
import { UserRole, Permission } from '../types/workspace';

type Action = Permission['action'];

const ROLE_PERMISSIONS: Record<UserRole, Action[]> = {
  owner: [
    'manage_automations',
    'generate_reports',
    'access_ai_center',
    'invite_users',
    'billing_access',
    'delete_workspace',
  ],
  admin: [
    'manage_automations',
    'generate_reports',
    'access_ai_center',
    'invite_users',
  ],
  member: [
    'generate_reports',
    'access_ai_center',
  ],
  viewer: [
    'access_ai_center',
  ],
};

export const hasPermission = (role: UserRole, action: Action): boolean => {
  return ROLE_PERMISSIONS[role].includes(action);
};

export const getRoleLabel = (role: UserRole): string => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export const getPermissionErrorMessage = (action: Action): string => {
  switch (action) {
    case 'manage_automations': return 'Admin permission required to manage automations.';
    case 'generate_reports': return 'Member permission required to generate reports.';
    case 'access_ai_center': return 'Access to AI Command Center restricted.';
    case 'invite_users': return 'Only Admins can invite new users.';
    case 'billing_access': return 'Only Owners can access billing.';
    case 'delete_workspace': return 'Only Owners can delete workspaces.';
    default: return 'Insufficient permissions.';
  }
};
