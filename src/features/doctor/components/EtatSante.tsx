import React from 'react';
import { useAuthStore } from '@core/auth/auth.store';
import { useEtatSante, useMarquerAlerteLue } from '@features/patient/hooks/useEtatSante';

const EtatSante: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const { data, isLoading, error } = useEtatSante(user?.id);
    const marquerLue = useMarquerAlerteLue(user?.id ?? '');

    if (isLoading) {
        return (
            <div className="page-content">
                <div className="content-body text-center py-12">
                    <i className="fas fa-spinner fa-spin text-3xl text-primary"></i>
                    <p className="mt-4">Chargement de votre état de santé...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="page-content">
                <div className="content-body">
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>Impossible de charger les données de santé</span>
                    </div>
                </div>
            </div>
        );
    }

    const scoreLabel = data.score.global >= 80 ? 'Excellent' : data.score.global >= 60 ? 'Bon' : 'À surveiller';
    const scoreColor = data.score.global >= 80 ? '#10b981' : data.score.global >= 60 ? '#f59e0b' : '#ef4444';

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(239, 68, 68, 0.8), rgba(239, 68, 68, 0.9)), url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Mon État de Santé</h1>
                        <p>Suivi prédictif de votre santé basé sur vos analyses</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                {/* Alertes non lues */}
                {data.alertes.filter((a) => !a.lue).length > 0 && (
                    <div className="mb-6">
                        {data.alertes.filter((a) => !a.lue).map((alerte) => (
                            <div key={alerte.id} className={`alert alert-${alerte.type} mb-2 flex justify-between items-center`}>
                                <div>
                                    <i className={`fas ${alerte.type === 'danger' ? 'fa-exclamation-circle' : alerte.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                                    <span className="ml-2">{alerte.message}</span>
                                </div>
                                <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => marquerLue.mutate(alerte.id)}
                                >
                                    <i className="fas fa-check"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Score global */}
                <div className="content-card-app text-center mb-6">
                    <h3 className="card-title mb-4">Score de santé global</h3>
                    <div className="health-score">
                        <div className="score-circle">
                            <svg width="200" height="200">
                                <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                                <circle
                                    cx="100" cy="100" r="90"
                                    fill="none"
                                    stroke={scoreColor}
                                    strokeWidth="20"
                                    strokeDasharray={`${data.score.global * 5.65} 565`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 100 100)"
                                />
                            </svg>
                            <div className="score-value">
                                <span className="score-number">{data.score.global}</span>
                                <span className="score-max">/100</span>
                            </div>
                        </div>
                        <p className="mt-4 text-lg">
                            État de santé: <span className={`badge ${data.score.global >= 80 ? 'badge-success' : data.score.global >= 60 ? 'badge-warning' : 'badge-danger'}`}>{scoreLabel}</span>
                        </p>
                    </div>
                </div>

                {/* Indicateurs clés */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {data.indicateurs.map((ind) => (
                        <div key={ind.id} className="content-card-app">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`health-icon ${ind.status === 'normal' ? 'green' : ind.status === 'attention' ? 'orange' : 'red'}`}>
                                    <i className={ind.icon}></i>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{ind.label}</p>
                                    <p className="text-xl font-bold">{ind.valeur}</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">{ind.description}</p>
                        </div>
                    ))}
                </div>

                {/* Catégories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {data.score.categories.map((cat, idx) => {
                        const pct = Math.round((cat.score / cat.maxScore) * 100);
                        const catColor = pct >= 80 ? 'green' : pct >= 60 ? 'orange' : 'red';
                        return (
                            <div key={idx} className="content-card-app">
                                <div className="flex items-center justify-between mb-3">
                                    <h4>{cat.label}</h4>
                                    <span className="text-2xl font-bold">{pct}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className={`progress-fill ${catColor}`} style={{ width: `${pct}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recommandations */}
                <div className="content-card-app">
                    <h3 className="card-title">
                        <i className="fas fa-lightbulb"></i> Recommandations
                    </h3>
                    <ul className="recommandations-list">
                        {data.recommandations.map((rec, idx) => (
                            <li key={idx}>
                                <i className="fas fa-check-circle"></i>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EtatSante;
