// ============================================================
// Auth Store - Zustand - État d'authentification global
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, UserRole, LoginCredentials, AuthResponse } from '@shared/types';
import { MOCK_USERS } from '@shared/data/mock-data';
import toast from 'react-hot-toast';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  // Actions
  login: (credentials: LoginCredentials) => AuthResponse;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;

  // Helpers
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      login: (credentials: LoginCredentials): AuthResponse => {
        const { identifier, password } = credentials;

        const mockUser = Object.values(MOCK_USERS).find(
          (u) => u.id === identifier || u.email === identifier
        );

        if (!mockUser) {
          toast.error('Identifiants incorrects');
          return { success: false, error: 'Invalid credentials' };
        }

        const userWithTimestamp: User = {
          ...mockUser,
          loginTime: new Date().toISOString(),
        } as User;

        set({
          user: userWithTimestamp,
          isAuthenticated: true,
        });

        toast.success(`Bienvenue ${mockUser.prenom} ${mockUser.nom} !`);
        return { success: true, user: userWithTimestamp };
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
        toast.success('Déconnexion réussie');
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...updates } as User;
          set({ user: updatedUser });
        }
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      hasRole: (role: UserRole): boolean => {
        return get().user?.role === role;
      },

      hasAnyRole: (roles: UserRole[]): boolean => {
        const userRole = get().user?.role;
        return userRole ? roles.includes(userRole) : false;
      },
    }),
    {
      name: 'mediconnect_auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
