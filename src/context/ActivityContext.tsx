"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ActivityEvent {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: 'edit' | 'comment' | 'status' | 'ai';
}

interface ActivityContextType {
  events: ActivityEvent[];
  addEvent: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

import { useWorkspaces } from './WorkspaceContext';

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const { activeWorkspace } = useWorkspaces();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = async () => {
    if (!activeWorkspace?.id) return;
    try {
      const res = await fetch(`/api/dashboard/overview?workspaceId=${activeWorkspace.id}`);
      const data = await res.json();
      if (data.activities) {
        setEvents(data.activities);
      }
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [activeWorkspace?.id]);

  useEffect(() => {
    const handleRefresh = () => {
      console.log("[ActivityProvider] Refreshing activities...");
      fetchActivities();
    };
    window.addEventListener("refresh-tasks", handleRefresh);
    return () => window.removeEventListener("refresh-tasks", handleRefresh);
  }, [activeWorkspace?.id]);

  const addEvent = (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    const newEvent: ActivityEvent = {
        ...event,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: 'Just now'
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  return (
    <ActivityContext.Provider value={{ events, addEvent }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}
