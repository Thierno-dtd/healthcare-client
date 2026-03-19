import type { LoginCredentials, LoginResult, User } from '../data/models/user.model';
import { MOCK_USERS, DEMO_CREDENTIALS, delay } from '@/data/mocks/mock-data';

class AuthService {
    private readonly TOKEN_KEY = 'mediconnect_token';
    private readonly USER_KEY = 'mediconnect_user';

    // ── Login ───────────────────────────────────────────────
    async login(credentials: LoginCredentials): Promise<LoginResult> {
        await delay(600);

        const expectedPassword = DEMO_CREDENTIALS[credentials.email];
        if (!expectedPassword || expectedPassword !== credentials.password) {
            throw new Error('Email ou mot de passe incorrect.');
        }

        const user = MOCK_USERS.find((u) => u.email === credentials.email);
        if (!user) {
            throw new Error('Utilisateur introuvable.');
        }

        // Generate a mock JWT-style token
        const token = `mock_token_${user.id}_${Date.now()}`;

        // Persist session
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        return { user, token };
    }

    // ── Logout ──────────────────────────────────────────────
    async logout(): Promise<void> {
        await delay(200);
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    // ── Restore session (on page reload) ────────────────────
    restoreSession(): LoginResult | null {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const userJson = localStorage.getItem(this.USER_KEY);

        if (!token || !userJson) return null;

        try {
            const user: User = JSON.parse(userJson);
            return { user, token };
        } catch {
            this.clearStorage();
            return null;
        }
    }

    // ── Refresh token (stub) ─────────────────────────────────
    async refreshToken(): Promise<string> {
        await delay(300);
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (!token) throw new Error('No token to refresh');
        const newToken = `mock_token_refreshed_${Date.now()}`;
        localStorage.setItem(this.TOKEN_KEY, newToken);
        return newToken;
    }

    // ── Helpers ──────────────────────────────────────────────
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private clearStorage(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }
}

// Export as singleton — replace with DI later if needed
export const authService = new AuthService();