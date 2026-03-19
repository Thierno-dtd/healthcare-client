// ============================================================
// LoginPage — Authentication page
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../core/stores/auth.store';

const DEMO_ACCOUNTS = [
    { email: 'dr.martin@clinic.com', password: 'password123', role: 'Médecin', icon: 'fas fa-user-md', color: '#2a6b8f' },
    { email: 'manager@hopital-central.com', password: 'password123', role: 'Gestionnaire', icon: 'fas fa-hospital', color: '#4a9d7c' },
    { email: 'admin@healthplatform.com', password: 'password123', role: 'Administrateur', icon: 'fas fa-shield-alt', color: '#7c3aed' },
];

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard');
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        try {
            await login(email, password);
            toast.success('Connexion réussie');
            navigate('/dashboard');
        } catch (err) {
            // error is already in store
        }
    };

    const useDemoAccount = (account: typeof DEMO_ACCOUNTS[0]) => {
        setEmail(account.email);
        setPassword(account.password);
    };

    return (
        <div id="login-page">
            <div className="login-container">

                {/* ── Left panel ──────────────────────────────────── */}
                <div className="login-left" style={{ position: 'relative' }}>
                    <div className="back-home">
                        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.8)' }}>
                            <i className="fas fa-arrow-left"></i> Accueil
                        </a>
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                            <div style={{
                                width: 48, height: 48, background: 'rgba(255,255,255,0.15)',
                                borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <i className="fas fa-heartbeat" style={{ fontSize: 24 }}></i>
                            </div>
                            <span style={{ fontSize: 24, fontWeight: 800 }}>MediConnect</span>
                        </div>

                        <h2 style={{ fontSize: '2.2rem', marginBottom: 16 }}>
                            Plateforme de santé préventive
                        </h2>
                        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: 40 }}>
                            Surveillance en temps réel, alertes intelligentes et gestion complète de vos patients.
                        </p>

                        <div className="login-features">
                            {[
                                { icon: 'fas fa-chart-line', text: 'Monitoring des métriques de santé' },
                                { icon: 'fas fa-bell', text: 'Alertes automatiques par seuil' },
                                { icon: 'fas fa-comments', text: 'Communication médecin-patient' },
                                { icon: 'fas fa-hospital', text: 'Gestion multi-établissements' },
                            ].map((f) => (
                                <div key={f.text} className="login-feature">
                                    <div style={{
                                        width: 40, height: 40, background: 'rgba(255,255,255,0.15)',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <i className={f.icon}></i>
                                    </div>
                                    <span style={{ opacity: 0.9, fontSize: 15 }}>{f.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Right panel ─────────────────────────────────── */}
                <div className="login-right">
                    <div className="login-form">
                        <h3>Connexion</h3>
                        <p>Accédez à votre espace professionnel</p>

                        {/* Demo accounts */}
                        <div style={{ marginBottom: 28 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 10 }}>
                                <i className="fas fa-magic" style={{ marginRight: 6 }}></i>
                                Comptes de démonstration :
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {DEMO_ACCOUNTS.map((acc) => (
                                    <button
                                        key={acc.email}
                                        type="button"
                                        onClick={() => useDemoAccount(acc)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '10px 14px', borderRadius: 8,
                                            border: `1px solid ${email === acc.email ? acc.color : '#e5e7eb'}`,
                                            background: email === acc.email ? `${acc.color}10` : 'white',
                                            cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                                        }}
                                    >
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 8, background: `${acc.color}20`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: acc.color, fontSize: 14,
                                        }}>
                                            <i className={acc.icon}></i>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 0 }}>
                                                {acc.role}
                                            </p>
                                            <p style={{ fontSize: 11, color: '#9ca3af' }}>{acc.email}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="alert alert-danger" style={{ marginBottom: 20 }}>
                                    <i className="fas fa-exclamation-triangle"></i> {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Mot de passe</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        className="form-control"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                        style={{ paddingRight: 44 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        style={{
                                            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
                                        }}
                                    >
                                        <i className={`fas fa-${showPass ? 'eye-slash' : 'eye'}`}></i>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary login-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner icon-spin" style={{ marginRight: 8 }}></i>
                                        Connexion en cours...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt" style={{ marginRight: 8 }}></i>
                                        Se connecter
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="demo-note" style={{ marginTop: 20 }}>
                            <i className="fas fa-info-circle"></i>
                            Mot de passe démo : <strong>password123</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;