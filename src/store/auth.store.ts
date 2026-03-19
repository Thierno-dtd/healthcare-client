import { create } from 'zustand';
import type { User } from '@/data/models/user.model';
import { authService } from '../services/auth.service';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    restoreSession: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // Start true to allow session restore
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { user, token } = await authService.login({ email, password });
            set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Erreur de connexion',
                isLoading: false,
            });
            throw err;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await authService.logout();
        } finally {
            set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
        }
    },

    restoreSession: () => {
        const session = authService.restoreSession();
        if (session) {
            set({
                user: session.user,
                token: session.token,
                isAuthenticated: true,
                isLoading: false,
            });
        } else {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));