/**
 * Real-Time Simulation Layer for FlowBoard
 * Simulates presence and collaborative activity
 */

export interface UserPresence {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'idle';
  color: string;
  isTyping?: boolean;
}

export interface ActivityEvent {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: 'edit' | 'comment' | 'status' | 'ai';
}

const MOCK_USERS: UserPresence[] = [
  { id: '1', name: 'Sarah Chen', avatar: 'SC', status: 'active', color: '#6366F1' },
  { id: '2', name: 'Marcus Miller', avatar: 'MM', status: 'active', color: '#10B981' },
  { id: '3', name: 'Elena Rodriguez', avatar: 'ER', status: 'active', color: '#F59E0B' },
  { id: '4', name: 'Julian Vance', avatar: 'JV', status: 'active', color: '#0EA5E9' },
  { id: '5', name: 'AI Assistant', avatar: 'AI', status: 'active', color: '#8B5CF6' },
];

class RealtimeSimulator {
  private listeners: Set<(presence: UserPresence[], events: ActivityEvent[]) => void> = new Set();
  private presence: UserPresence[] = MOCK_USERS.slice(0, 3);
  private events: ActivityEvent[] = [
    {
      id: '1',
      user: { name: 'Sarah Chen', avatar: 'SC' },
      action: 'updated status of',
      target: 'Q1 Strategy Planning',
      timestamp: '2m ago',
      type: 'status',
    },
    {
      id: '2',
      user: { name: 'Marcus Miller', avatar: 'MM' },
      action: 'commented on',
      target: 'Design Tokens Revamp',
      timestamp: '5m ago',
      type: 'comment',
    }
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      this.startSimulation();
    }
  }

  private startSimulation() {
    // Random events every 8-15 seconds
    const scheduleNextEvent = () => {
      const delay = Math.floor(Math.random() * 7000) + 8000;
      setTimeout(() => {
        this.simulateEvent();
        scheduleNextEvent();
      }, delay);
    };

    // Random presence changes every 12-20 seconds
    const scheduleNextPresence = () => {
      const delay = Math.floor(Math.random() * 8000) + 12000;
      setTimeout(() => {
        this.simulatePresenceChange();
        scheduleNextPresence();
      }, delay);
    };

    scheduleNextEvent();
    scheduleNextPresence();
  }

  private simulateEvent() {
    const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
    const types: ActivityEvent['type'][] = ['edit', 'comment', 'status', 'ai'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let action = '';
    let target = '';

    const targets = ['Brand Guidelines', 'API Documentation', 'User Onboarding Flow', 'Quarterly Report', 'Component Library'];
    target = targets[Math.floor(Math.random() * targets.length)];

    if (type === 'edit') {
      action = 'updated the logic for';
    } else if (type === 'comment') {
      action = 'requested review on';
    } else if (type === 'status') {
      action = 'marked as ready:';
    } else {
      action = 'AI optimized tags for';
    }

    const newEvent: ActivityEvent = {
      id: Math.random().toString(36).substr(2, 9),
      user: { name: user.name, avatar: user.avatar },
      action,
      target,
      timestamp: 'Just now',
      type,
    };

    this.events = [newEvent, ...this.events].slice(0, 8);
    this.notify();
  }

  private simulatePresenceChange() {
    // Randomly pick a user and make them "type"
    const index = Math.floor(Math.random() * this.presence.length);
    if (this.presence[index]) {
      this.presence[index].isTyping = true;
      this.notify();
      
      setTimeout(() => {
        if (this.presence[index]) {
          this.presence[index].isTyping = false;
          this.notify();
        }
      }, 4000);
    }

    // Occasionally add/remove a user from the stack
    if (Math.random() > 0.7) {
      if (this.presence.length < 5) {
        const newUser = MOCK_USERS[this.presence.length];
        this.presence.push(newUser);
      } else {
        this.presence.pop();
      }
      this.notify();
    }
  }

  subscribe(listener: (presence: UserPresence[], events: ActivityEvent[]) => void) {
    this.listeners.add(listener);
    // Initial emission
    listener([...this.presence], [...this.events]);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l([...this.presence], [...this.events]));
  }
}

export const realtimeSimulator = new RealtimeSimulator();
