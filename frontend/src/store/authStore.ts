import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

export interface Attribute {
  id: string;
  name: 'INTELLECT' | 'STRENGTH' | 'DISCIPLINE' | 'CREATIVITY';
  value: number;
}

export interface Streak {
  id: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

export interface Character {
  id: string;
  userId: string;
  level: number;
  currentXp: number;
  currencyBalance: number;
  attributes?: Attribute[];
  streak?: Streak;
  inventory?: any[];
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt?: string;
  character?: Character;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<User>;
  signup: (displayName: string, email: string, password: string) => Promise<User>;
  loginWithDemo: () => Promise<User>;
  updateCharacter: (partial: Partial<Character>) => void;
  updateProfile: (data: { displayName?: string; avatarUrl?: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  ensureAuthenticated: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setToken: (token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.removeItem('explicit_logout');
        }
        set({ token, isAuthenticated: !!token });
      },

      setUser: (user) => set({ user, isAuthenticated: true }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post<{ accessToken: string; token?: string; user: User }>('/api/auth/login', {
            email: email.trim(),
            password,
          });
          const token = res.accessToken || res.token || '';
          get().setToken(token);
          if (res.user) {
            set({ user: res.user, isAuthenticated: true });
          }
          await get().fetchProfile();
          return get().user!;
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (displayName, email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post<{ accessToken: string; token?: string; user: User }>('/api/auth/signup', {
            displayName: displayName.trim(),
            email: email.trim(),
            password,
          });
          const token = res.accessToken || res.token || '';
          get().setToken(token);
          if (res.user) {
            set({ user: res.user, isAuthenticated: true });
          }
          await get().fetchProfile();
          return get().user!;
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithDemo: async () => {
        set({ isLoading: true });
        try {
          return await get().login('hero@liferpg.com', 'hero123');
        } catch {
          // If login fails (fresh DB), sign up the default hero
          return await get().signup('Basudev', 'hero@liferpg.com', 'hero123');
        } finally {
          set({ isLoading: false });
        }
      },

      updateCharacter: (partial) => {
        const currentUser = get().user;
        if (!currentUser?.character) return;
        const updatedChar = { ...currentUser.character, ...partial };
        set({ user: { ...currentUser, character: updatedChar } });
      },

      updateProfile: async (data) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...data } });
        }
        try {
          const updated = await api.patch<User>('/api/me', data);
          if (updated) {
            set({ user: updated });
          }
        } catch (err) {
          console.error('Failed to update profile:', err);
        }
      },

      logout: async () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.setItem('explicit_logout', 'true');
        }
        set({ token: null, user: null, isAuthenticated: false });
        try {
          await api.post('/api/auth/logout');
        } catch {
          // Ignore network errors on logout
        }
      },

      ensureAuthenticated: async () => {
        const currentToken = get().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
        if (currentToken) {
          await get().fetchProfile();
          return;
        }

        const wasExplicitLogout = typeof window !== 'undefined' && localStorage.getItem('explicit_logout') === 'true';
        if (wasExplicitLogout) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        // Auto-initialize demo hero session for instant guest preview if not explicitly logged out
        try {
          await get().loginWithDemo();
        } catch (err) {
          console.error('Demo auto-auth error:', err);
        }
      },

      fetchProfile: async () => {
        const token = get().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await api.get<User>('/api/me');
          set({ user, isAuthenticated: true });
        } catch (error: any) {
          console.error('Failed to fetch profile:', error);
          if (error?.status === 401 || error?.statusCode === 401) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
            }
            set({ token: null, user: null, isAuthenticated: false });
          }
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
