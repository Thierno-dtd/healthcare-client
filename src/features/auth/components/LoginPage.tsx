import React, { useState, useEffect } from 'react';
import { LoginCredentials } from "@/data/models/user.model.ts";
import { useLogin } from "@/hook/useLogin.ts";

/* ─── Floating particle ───────────────────────────────────── */
const Particle = ({ style }: { style: React.CSSProperties }) => (
    <div style={{
        position: 'absolute',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        animation: 'float linear infinite',
        ...style,
    }} />
);

/* ─── Animated ECG line ───────────────────────────────────── */
const EcgLine = () => (
    <svg viewBox="0 0 400 60" style={{ width: '100%', opacity: 0.2, marginBottom: 8 }}>
        <polyline
            points="0,30 60,30 80,10 95,50 110,10 125,50 140,30 200,30 220,5 235,55 250,30 400,30"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: 'ecgDraw 3s ease-in-out infinite' }}
        />
    </svg>
);

/* ─── Feature pill ────────────────────────────────────────── */
const FeaturePill = ({ icon, text, delay }: { icon: string; text: string; delay: number }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 18px',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        animation: 'slideInLeft 0.6s ease both',
        animationDelay: `${delay}s`,
        opacity: 0,
    }}>
        <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(147,197,253,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
        }}>
            <i className={icon} style={{ color: '#93c5fd', fontSize: 14 }} />
        </div>
        <span style={{
            fontSize: 13.5,
            color: 'rgba(255,255,255,0.80)',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            lineHeight: 1.4,
        }}>
            {text}
        </span>
    </div>
);

/* ─── Main ────────────────────────────────────────────────── */
const LoginPage: React.FC = () => {
    const { handleLogin, isSubmitting } = useLogin();
    const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
    const [error, setError] = useState('');
    const [focused, setFocused] = useState<string | null>(null);

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,700;1,600&display=swap';
        document.head.appendChild(link);
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const result = await handleLogin(credentials);
            if (!result.success) setError('Identifiants incorrects. Veuillez réessayer.');
        } catch {
            setError('Une erreur est survenue lors de la connexion.');
        }
    };

    const particles = [
        { width: 6,  height: 6,  top: '12%', left: '7%',  animationDuration: '14s', animationDelay: '0s'   },
        { width: 10, height: 10, top: '68%', left: '4%',  animationDuration: '20s', animationDelay: '2s'   },
        { width: 4,  height: 4,  top: '38%', left: '91%', animationDuration: '16s', animationDelay: '1s'   },
        { width: 8,  height: 8,  top: '82%', left: '87%', animationDuration: '18s', animationDelay: '3.5s' },
        { width: 5,  height: 5,  top: '22%', left: '94%', animationDuration: '12s', animationDelay: '0.5s' },
        { width: 7,  height: 7,  top: '50%', left: '2%',  animationDuration: '22s', animationDelay: '4s'   },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,700;1,600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }

                @keyframes float {
                    0%   { transform: translateY(0) translateX(0);   opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 0.5; }
                    100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-24px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(24px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes logoReveal {
                    0%   { opacity: 0; transform: scale(0.75) rotate(-6deg); }
                    65%  { transform: scale(1.04) rotate(1deg); }
                    100% { opacity: 1; transform: scale(1) rotate(0deg); }
                }
                @keyframes ecgDraw {
                    0%   { stroke-dashoffset: 800; opacity: 0.1; }
                    40%  { opacity: 0.3; }
                    100% { stroke-dashoffset: 0; opacity: 0.1; }
                }
                @keyframes pulseRing {
                    0%   { transform: scale(1);   opacity: 0.5; }
                    100% { transform: scale(1.7); opacity: 0; }
                }
                @keyframes shimmerBtn {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes taglineFade {
                    from { opacity: 0; letter-spacing: 0.35em; }
                    to   { opacity: 1; letter-spacing: 0.06em; }
                }

                polyline { stroke-dasharray: 800; stroke-dashoffset: 800; }

                .lmd-page {
                    min-height: 100vh;
                    display: flex;
                    font-family: 'DM Sans', sans-serif;
                    overflow: hidden;
                    position: relative;
                    background: #0d1f2d;
                }

                /* ── LEFT ─────────────────────────────────────── */
                .lmd-left {
                    width: 52%;
                    background: linear-gradient(155deg, #1a3c52 0%, #0f2c3f 50%, #1a3c52 100%);
                    padding: 52px 56px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                }
                .lmd-left::before {
                    content: '';
                    position: absolute;
                    top: -130px; right: -130px;
                    width: 460px; height: 460px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(42,107,143,0.35) 0%, transparent 70%);
                    pointer-events: none;
                }
                .lmd-left::after {
                    content: '';
                    position: absolute;
                    bottom: -90px; left: -70px;
                    width: 340px; height: 340px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(42,107,143,0.15) 0%, transparent 70%);
                    pointer-events: none;
                }

                .lmd-logo-wrap {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    animation: logoReveal 0.8s cubic-bezier(0.34,1.56,0.64,1) both;
                }
                .lmd-logo-img {
                    width: 64px; height: 64px;
                    object-fit: contain;
                    filter: drop-shadow(0 4px 14px rgba(42,107,143,0.7));
                    position: relative; z-index: 1;
                }
                .lmd-logo-pulse {
                    position: absolute;
                    width: 64px; height: 64px;
                    border-radius: 50%;
                    border: 2px solid rgba(147,197,253,0.35);
                    animation: pulseRing 2.2s ease-out infinite;
                }
                .lmd-brand {
                    font-size: 21px;
                    font-weight: 800;
                    letter-spacing: 0.04em;
                    color: #ffffff;
                }
                .lmd-brand-sub {
                    font-size: 11px;
                    color: rgba(255,255,255,0.45);
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-top: 3px;
                }

                .lmd-hero {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 28px;
                    padding: 44px 0;
                }
                .lmd-headline {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: clamp(28px, 3.2vw, 42px);
                    font-weight: 700;
                    color: #ffffff;
                    line-height: 1.22;
                    animation: fadeUp 0.7s ease both 0.3s;
                    opacity: 0;
                }
                .lmd-headline em { font-style: italic; color: #93c5fd; }
                .lmd-subtitle {
                    font-size: 14.5px;
                    color: rgba(255,255,255,0.55);
                    line-height: 1.75;
                    max-width: 380px;
                    animation: fadeUp 0.7s ease both 0.45s;
                    opacity: 0;
                }
                .lmd-features { display: flex; flex-direction: column; gap: 10px; }
                .lmd-conditions {
                    display: flex; gap: 8px; flex-wrap: wrap;
                    animation: fadeUp 0.6s ease both 1.1s;
                    opacity: 0;
                }
                .lmd-cond {
                    padding: 5px 14px; border-radius: 20px;
                    font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
                }

                /* ── RIGHT ────────────────────────────────────── */
                .lmd-right {
                    flex: 1;
                    background: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 48px 52px;
                    position: relative;
                }
                .lmd-right::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #1a3c52, #2a6b8f, #1a3c52);
                }
                .lmd-form-wrap {
                    width: 100%; max-width: 400px;
                    animation: fadeInRight 0.7s ease both 0.2s;
                    opacity: 0;
                }
                .lmd-secure-badge {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-size: 11px; font-weight: 700; color: #2a6b8f;
                    background: rgba(42,107,143,0.08); border: 1px solid rgba(42,107,143,0.2);
                    padding: 4px 12px; border-radius: 20px; margin-bottom: 16px;
                    text-transform: uppercase; letter-spacing: 0.07em;
                    animation: taglineFade 0.8s ease both 0.6s; opacity: 0;
                }
                .lmd-form-title {
                    font-size: 28px; font-weight: 800;
                    color: #0d1f2d; margin-bottom: 6px;
                    font-family: 'DM Sans', sans-serif; line-height: 1.2;
                }
                .lmd-form-title span { color: #2a6b8f; }
                .lmd-form-sub {
                    font-size: 14px; color: #7a8f99;
                    line-height: 1.6; margin-bottom: 32px;
                }
                .lmd-group { margin-bottom: 20px; }
                .lmd-label {
                    display: block; font-size: 11.5px; font-weight: 700;
                    color: #4a6070; text-transform: uppercase;
                    letter-spacing: 0.07em; margin-bottom: 8px;
                }
                .lmd-input-wrap { position: relative; }
                .lmd-icon {
                    position: absolute; left: 16px; top: 50%;
                    transform: translateY(-50%); color: #9ab8c8;
                    font-size: 13px; transition: color 0.2s; pointer-events: none;
                }
                .lmd-input {
                    width: 100%; padding: 14px 16px 14px 44px;
                    border: 1.5px solid #d4e4ee; border-radius: 12px;
                    font-size: 14.5px; font-family: 'DM Sans', sans-serif;
                    color: #0d1f2d; background: #f4f9fc;
                    outline: none; transition: all 0.22s; -webkit-appearance: none;
                }
                .lmd-input::placeholder { color: #a8c0cc; }
                .lmd-input:focus {
                    border-color: #2a6b8f; background: #ffffff;
                    box-shadow: 0 0 0 4px rgba(42,107,143,0.1);
                }
                .lmd-input:focus ~ .lmd-icon { color: #2a6b8f; }
                .lmd-check-row {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 28px; margin-top: -4px;
                }
                .lmd-check-label {
                    display: flex; align-items: center; gap: 8px;
                    font-size: 13px; color: #5a7080; cursor: pointer; user-select: none;
                }
                .lmd-check-label input[type="checkbox"] {
                    accent-color: #2a6b8f; width: 15px; height: 15px; cursor: pointer;
                }
                .lmd-forgot {
                    font-size: 13px; color: #2a6b8f; font-weight: 600;
                    text-decoration: none; transition: color 0.2s;
                }
                .lmd-forgot:hover { color: #1a3c52; }
                .lmd-error {
                    display: flex; align-items: center; gap: 10px;
                    padding: 12px 16px; background: rgba(220,38,38,0.05);
                    border: 1px solid rgba(220,38,38,0.18); border-radius: 10px;
                    margin-bottom: 20px; font-size: 13.5px; color: #dc2626;
                    animation: fadeUp 0.3s ease;
                }
                .lmd-btn {
                    width: 100%; padding: 15px; border: none; border-radius: 12px;
                    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
                    letter-spacing: 0.04em; cursor: pointer; transition: all 0.25s;
                    position: relative; overflow: hidden;
                    background: linear-gradient(135deg, #1a3c52 0%, #2a6b8f 50%, #1a3c52 100%);
                    background-size: 200% auto; color: white;
                    box-shadow: 0 6px 20px rgba(26,60,82,0.35);
                }
                .lmd-btn:hover:not(:disabled) {
                    background-position: right center;
                    box-shadow: 0 8px 28px rgba(42,107,143,0.45);
                    transform: translateY(-1px);
                }
                .lmd-btn:active:not(:disabled) { transform: translateY(0); }
                .lmd-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
                .lmd-shimmer {
                    position: absolute; inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
                    background-size: 200% 100%;
                    animation: shimmerBtn 2.2s linear infinite;
                }
                .lmd-demo {
                    margin-top: 20px; padding: 12px 14px;
                    background: rgba(42,107,143,0.05);
                    border: 1px dashed rgba(42,107,143,0.22); border-radius: 10px;
                    font-size: 12.5px; color: #4a7a99;
                    display: flex; gap: 8px; align-items: flex-start; line-height: 1.55;
                }
                .lmd-footer {
                    margin-top: 28px; text-align: center;
                    font-size: 12px; color: #9ab0bc; line-height: 1.7;
                }
                .lmd-footer strong { color: #2a6b8f; }

                @media (max-width: 860px) {
                    .lmd-left { display: none; }
                    .lmd-right { padding: 40px 28px; }
                }
            `}</style>

            <div className="lmd-page">

                {particles.map((p, i) => <Particle key={i} style={p} />)}

                {/* ══ LEFT ════════════════════════════════════════ */}
                <div className="lmd-left">

                    <div className="lmd-logo-wrap">
                        <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
                            <div className="lmd-logo-pulse" />
                            <img src="/logo.png" alt="Laméssé Dama" className="lmd-logo-img" />
                        </div>
                        <div>
                            <div className="lmd-brand">LAMÉSSÉDAMA</div>
                            <div className="lmd-brand-sub">by MedTech Vision</div>
                        </div>
                    </div>

                    <div className="lmd-hero">
                        <div>
                            <EcgLine />
                            <h1 className="lmd-headline">
                                Suivre,<br />
                                <em>prévenir</em>,<br />
                                et mieux guérir.
                            </h1>
                        </div>

                        <p className="lmd-subtitle">
                            Une plateforme médicale  dédiée au suivi continu
                            des patients atteints de maladies chroniques( cas de l'Hypertension, diabète)
                        </p>

                        <div className="lmd-features">
                            <FeaturePill icon="fas fa-shield-alt" text="Données médicales chiffrées et sécurisées"           delay={0.6}  />
                            <FeaturePill icon="fas fa-heartbeat"  text="Monitoring en temps réel — hypertension & diabète"   delay={0.75} />
                            <FeaturePill icon="fas fa-bell"       text="Alertes pour réagir au bon moment"     delay={0.9}  />
                            <FeaturePill icon="fas fa-user-md"    text="Interface pour les médecins garantissant un suivi continu"       delay={1.05} />
                        </div>

                        <div className="lmd-conditions">
                            <span className="lmd-cond" style={{ background: 'rgba(220,38,38,0.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.25)' }}>
                                🩸 Hypertension
                            </span>
                            <span className="lmd-cond" style={{ background: 'rgba(251,191,36,0.12)', color: '#fcd34d', border: '1px solid rgba(251,191,36,0.22)' }}>
                                💉 Diabète
                            </span>
                        </div>
                    </div>

                </div>

                {/* ══ RIGHT ═══════════════════════════════════════ */}
                <div className="lmd-right">
                    <div className="lmd-form-wrap">

                        <div className="lmd-secure-badge">
                            <i className="fas fa-lock" style={{ fontSize: 9 }} />
                            Espace sécurisé
                        </div>

                        <h2 className="lmd-form-title">
                            Bon retour,<br />
                            <span>Docteur.</span>
                        </h2>

                        <p className="lmd-form-sub">
                            Connectez-vous pour accéder au tableau de bord
                            et suivre vos patients en temps réel.
                        </p>

                        {error && (
                            <div className="lmd-error">
                                <i className="fas fa-exclamation-circle" style={{ flexShrink: 0 }} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={onSubmit}>

                            <div className="lmd-group">
                                <label className="lmd-label" htmlFor="lmd-id">Identifiant unique</label>
                                <div className="lmd-input-wrap">
                                    <input
                                        id="lmd-id"
                                        type="text"
                                        className="lmd-input"
                                        placeholder="Entrez votre identifiant"
                                        value={credentials.email}
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                    />
                                    <i className="fas fa-user-md lmd-icon" />
                                </div>
                            </div>

                            <div className="lmd-group">
                                <label className="lmd-label" htmlFor="lmd-pw">Mot de passe</label>
                                <div className="lmd-input-wrap">
                                    <input
                                        id="lmd-pw"
                                        type="password"
                                        className="lmd-input"
                                        placeholder="••••••••••••"
                                        value={credentials.password}
                                        onFocus={() => setFocused('password')}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    />
                                    <i className="fas fa-lock lmd-icon" />
                                </div>
                            </div>

                            <div className="lmd-check-row">
                                <label className="lmd-check-label">
                                    <input type="checkbox" id="remember-me" />
                                    Se souvenir de moi
                                </label>
                                <a href="#forgot" className="lmd-forgot">Mot de passe oublié ?</a>
                            </div>

                            <button type="submit" className="lmd-btn" disabled={isSubmitting}>
                                <span className="lmd-shimmer" />
                                {isSubmitting ? (
                                    <><i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }} />Connexion en cours...</>
                                ) : (
                                    <><i className="fas fa-sign-in-alt" style={{ marginRight: 8 }} />Se connecter</>
                                )}
                            </button>
                        </form>

                        <div className="lmd-demo">
                            <i className="fas fa-info-circle" style={{ marginTop: 1, flexShrink: 0, color: '#2a6b8f' }} />

                            <strong style={{ color: '#1a3c52', margin: '0 3px' }}>Vos patients comptent sur vous — connectez-vous et gardez un œil sur leur santé au quotidien.</strong>{' '}

                        </div>

                        <div className="lmd-footer">
                            <strong>LAMÉSSÉDAMA</strong> · Prévenir et mieux guérir<br />
                            <span style={{ opacity: 0.65 }}>© 2025 MedTech Vision — Tous droits réservés</span>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;