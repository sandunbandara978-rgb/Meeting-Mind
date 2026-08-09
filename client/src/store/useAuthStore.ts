import { create } from 'zustand';
import { User, UserRole, Workspace } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  activeWorkspaceId: string;
  activeTeamId: string;
  workspaces: Workspace[];
  setRole: (role: UserRole) => void;
  setActiveWorkspaceId: (wsId: string) => void;
  setActiveTeamId: (teamId: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'demo-user-123',
    email: 'alex.vance@meetingmind.ai',
    name: 'කසුන් පෙරේරා',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'MANAGER'
  },
  token: 'demo-jwt-token-2026',
  isAuthenticated: true,
  activeWorkspaceId: 'ws-acme',
  activeTeamId: 'ALL',

  workspaces: [
    {
      id: 'ws-acme',
      name: 'Acme Corp Engineering',
      ownerId: 'demo-user-123',
      teams: [
        { id: 'team-backend', name: 'Core Backend Team' },
        { id: 'team-frontend', name: 'Frontend & UI Team' },
        { id: 'team-sec', name: 'Security & DevOps' }
      ],
      members: [
        { id: 'm-1', name: 'කසුන් පෙරේරා', role: 'MANAGER', email: 'alex.vance@meetingmind.ai' },
        { id: 'm-2', name: 'සාරා ජයසිංහ', role: 'EMPLOYEE', email: 'sarah.j@meetingmind.ai' },
        { id: 'm-3', name: 'දිනුක ප්‍රනාන්දු', role: 'EMPLOYEE', email: 'david.m@meetingmind.ai' },
        { id: 'm-4', name: 'ඉලේෂා වික්‍රමසිංහ', role: 'ADMIN', email: 'elena.r@meetingmind.ai' }
      ]
    },
    {
      id: 'ws-growth',
      name: 'Product Growth & Marketing',
      ownerId: 'demo-user-123',
      teams: [
        { id: 'team-mkt', name: 'Performance Marketing' },
        { id: 'team-design', name: 'Brand & Creative Design' }
      ],
      members: [
        { id: 'm-1', name: 'කසුන් පෙරේරා', role: 'MANAGER', email: 'alex.vance@meetingmind.ai' },
        { id: 'm-5', name: 'මාලක සංජය', role: 'EMPLOYEE', email: 'marcus.w@meetingmind.ai' },
        { id: 'm-6', name: 'යසෝධා තිලකරත්න', role: 'EMPLOYEE', email: 'jessica.t@meetingmind.ai' }
      ]
    }
  ],

  setRole: (role) => set((state) => ({
    user: state.user ? { ...state.user, role } : null
  })),

  setActiveWorkspaceId: (wsId) => set({ activeWorkspaceId: wsId, activeTeamId: 'ALL' }),
  setActiveTeamId: (teamId) => set({ activeTeamId: teamId }),

  login: (user, token) => {
    localStorage.setItem('meetingmind_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('meetingmind_token');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
