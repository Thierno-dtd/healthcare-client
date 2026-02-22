// ============================================================
// Auth Service - Logique métier d'authentification
// ============================================================

import type { LoginCredentials, AuthResponse, User } from '@shared/types';
import { apiPost } from '@core/api';

/**
 * Connexion utilisateur (sera remplacé par un vrai appel API)
 * Pour l'instant, utilise le store Zustand directement
 */
export const authService = {
  /**
   * Login via API (quand le backend sera prêt)
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // TODO: Remplacer par un vrai appel API
    // return apiPost<AuthResponse>('/auth/login', credentials);
    throw new Error('Use useAuthStore.login() for mock auth');
  },

  /**
   * Logout via API
   */
  logout: async (): Promise<void> => {
    // TODO: Remplacer par un vrai appel API
    // return apiPost<void>('/auth/logout');
  },

  /**
   * Récupérer le profil utilisateur
   */
  getProfile: async (): Promise<User> => {
    // TODO: Remplacer par un vrai appel API
    // return apiGet<User>('/auth/profile');
    throw new Error('Use useAuthStore for mock auth');
  },

  /**
   * Rafraîchir le token
   */
  refreshToken: async (): Promise<{ token: string }> => {
    return apiPost<{ token: string }>('/auth/refresh');
  },
};
