// ============================================================
// useLogin — Hook d'authentification
// Utilisé par LoginPage : const { handleLogin, isSubmitting } = useLogin()
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginCredentials } from '@/data/models/user.model';
import {useAuthStore} from "@/store/auth.store.ts";

interface LoginResult {
    success: boolean;
    error?: string;
}

export function useLogin() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (credentials: LoginCredentials): Promise<LoginResult> => {
        setIsSubmitting(true);
        try {
            await login(credentials.email, credentials.password);
            navigate('/dashboard');
            return { success: true };
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Identifiants incorrects';
            return { success: false, error: message };
        } finally {
            setIsSubmitting(false);
        }
    };

    return { handleLogin, isSubmitting };
}