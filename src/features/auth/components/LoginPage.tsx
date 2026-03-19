import React, { useState } from 'react';
import {LoginCredentials} from "@/data/models/user.model.ts";
import {useLogin} from "@/hook/useLogin.ts";

const LoginPage: React.FC = () => {
    const { handleLogin, isSubmitting } = useLogin();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const result = await handleLogin(credentials);
            if (!result.success) {
                setError('Identifiants incorrects');
            }
        } catch {
            setError('Une erreur est survenue lors de la connexion');
        }
    };


    return (
        <div id="login-page">
            <div className="login-container">
                <div className="login-left">

                    <h2>Bienvenue sur LAMESSE DAMA</h2>
                    <p>
                        Connectez-vous pour accéder à votre espace sécurisé et bénéficier de toutes les
                        fonctionnalités de la plateforme.
                    </p>

                    <div className="login-features">
                        <div className="login-feature">
                            <i className="fas fa-shield-alt"></i>
                            <span>Données médicales cryptées de haute sécurité</span>
                        </div>
                        <div className="login-feature">
                            <i className="fas fa-robot"></i>
                            <span>Diagnostic assisté par intelligence artificielle</span>
                        </div>
                        <div className="login-feature">
                            <i className="fas fa-handshake"></i>
                            <span>Collaboration simplifiée entre professionnels</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '50px' }}>
                        <p style={{ fontSize: '14px', opacity: 0.7 }}>
                            <i className="fas fa-info-circle"></i> Application développée pour la compétition
                            nationale de santé.
                        </p>
                    </div>
                </div>

                <div className="login-right">
                    <form className="login-form" onSubmit={onSubmit}>
                        <h3>Connexion</h3>
                        <p>Accédez à votre compte en fonction de votre profil</p>

                        {error && (
                            <div className="alert alert-danger">
                                <i className="fas fa-exclamation-circle"></i> {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="login-id">Identifiant unique</label>
                            <input
                                type="text"
                                id="login-id"
                                className="form-control"
                                placeholder="Entrez votre ID unique"
                                value={credentials.email}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, email: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-password">Mot de passe</label>
                            <input
                                type="password"
                                id="login-password"
                                className="form-control"
                                placeholder="Entrez votre mot de passe"
                                value={credentials.password}
                                onChange={(e) =>
                                    setCredentials({ ...credentials, password: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group form-check">
                            <input type="checkbox" id="remember-me" />
                            <label htmlFor="remember-me">Se souvenir de moi</label>
                        </div>

                        <div className="forgot-password">
                            <a href="#forgot">Mot de passe oublié ?</a>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary login-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Connexion...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>

                        <div className="demo-note">
                            <p>
                                <i className="fas fa-info-circle"></i> Pour la démonstration, cliquez simplement
                                sur &quot;Se connecter&quot; après avoir choisi votre profil.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;