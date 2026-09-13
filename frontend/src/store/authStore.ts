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
  updateCharacter: (partial: Partial<Character>) => void;
  updateProfile: (data: { displayName?: string; avatarUrl?: string }) => Promise<void>;
  logout: () => void;
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
        }
        set({ token, isAuthenticated: !!token });
      },

      setUser: (user) => set({ user, isAuthenticated: true }),

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

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({ token: null, user: null, isAuthenticated: false });
      },

      ensureAuthenticated: async () => {
        const currentToken = get().token;
        if (currentToken) {
          await get().fetchProfile();
          return;
        }

        // Auto-initialize demo hero session for instant live experience
        set({ isLoading: true });
        try {
          const res = await api.post<{ accessToken: string; user: User }>('/api/auth/login', {
            email: 'hero@liferpg.com',
            password: 'hero123',
          });

          const token = res.accessToken || (res as any).token;
          if (token) {
            get().setToken(token);
            await get().fetchProfile();
          }
        } catch {
          // If login fails (e.g. fresh DB), register the default hero
          try {
            const res = await api.post<{ accessToken: string; user: User }>('/api/auth/signup', {
              email: 'hero@liferpg.com',
              password: 'hero123',
              displayName: 'Basudev',
            });
            const token = res.accessToken || (res as any).token;
            if (token) {
              get().setToken(token);
              await get().fetchProfile();
            }
          } catch (err) {
            console.error('Auto-auth error:', err);
          }
        } finally {
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        const token = get().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
        if (!token) return;

        set({ isLoading: true });
        try {
          const user = await api.get<User>('/api/me');
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error('Failed to fetch profile:', error);
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
