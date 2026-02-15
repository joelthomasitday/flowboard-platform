
import React from 'react';
import { UserRole } from '@/types/workspace';
import { getRoleLabel } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { Shield, User, Star, Crown } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
  const config = {
    owner: {
      color: "bg-amber-50 text-amber-700 border-amber-200/50",
      icon: Crown,
    },
    admin: {
      color: "bg-blue-50 text-blue-700 border-blue-200/50",
      icon: Shield,
    },
    member: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
      icon: Star,
    },
    viewer: {
      color: "bg-stone-50 text-stone-600 border-stone-200/50",
      icon: User,
    },
  };

  const { color, icon: Icon } = config[role];

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm",
      color,
      className
    )}>
      <Icon size={10} />
      {getRoleLabel(role)}
    </div>
  );
};
