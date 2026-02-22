// ============================================================
// useLogin hook - Logique de connexion isolée
// ============================================================

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@core/auth/auth.store';
import type { LoginCredentials } from '@shared/types';
import { ROUTES } from '@shared/utils/constants';

export const useLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      setIsSubmitting(true);
      try {
        const result = login(credentials);
        if (result.success) {
          navigate(ROUTES.DASHBOARD, { replace: true });
        }
        return result;
      } finally {
        setIsSubmitting(false);
      }
    },
    [login, navigate]
  );

  return {
    handleLogin,
    isSubmitting,
  };
};
