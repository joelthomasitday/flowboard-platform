
"use client";

import React from 'react';
import { UserRole, Permission } from '@/types/workspace';
import { hasPermission, getPermissionErrorMessage } from '@/lib/permissions';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AccessGateProps {
  role: UserRole;
  action: Permission['action'];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showBlur?: boolean;
}

export const AccessGate = ({ 
  role, 
  action, 
  children, 
  fallback, 
  showBlur = true 
}: AccessGateProps) => {
  const allowed = hasPermission(role, action);

  if (allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative group">
      <div className={showBlur ? "opacity-40 pointer-events-none filter blur-[1px] transition-all" : "opacity-50 pointer-events-none"}>
        {children}
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <motion.div 
          initial={{ scale: 0.9, y: 5 }}
          whileHover={{ scale: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm border border-amber-200 px-4 py-2 rounded-xl shadow-lg flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Lock size={16} />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900 leading-tight">Restricted Access</p>
            <p className="text-[10px] text-stone-500 font-medium">{getPermissionErrorMessage(action)}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
