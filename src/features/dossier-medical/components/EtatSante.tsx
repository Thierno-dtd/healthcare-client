import React from 'react';

interface HealthCategory {
  nom: string;
  score: number;
  icon: string;
  color: string;
}

interface HealthData {
  score: number;
  tendance: string;
  categories: HealthCategory[];
  recommandations: string[];
}

const EtatSante: React.FC = () => {
    const healthData: HealthData = {
        score: 85,
        tendance: 'stable',
        categories: [
            { nom: 'Cardiovasculaire', score: 90, icon: 'fas fa-heartbeat', color: 'green' },
            { nom: 'Respiratoire', score: 85, icon: 'fas fa-lungs', color: 'green' },
            { nom: 'Métabolique', score: 75, icon: 'fas fa-fire', color: 'orange' },
            { nom: 'Immunité', score: 88, icon: 'fas fa-shield-alt', color: 'green' }
        ],
        recommandations: [
            'Continuer l\'activité physique régulière',
            'Surveiller la glycémie',
            'Maintenir une alimentation équilibrée',
            'Consultation de contrôle dans 3 mois'
        ]
    };

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
                                    stroke="#10b981"
                                    strokeWidth="20"
                                    strokeDasharray={`${healthData.score * 5.65} 565`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 100 100)"
                                />
                            </svg>
                            <div className="score-value">
                                <span className="score-number">{healthData.score}</span>
                                <span className="score-max">/100</span>
                            </div>
                        </div>
                        <p className="mt-4 text-lg">
                            État de santé: <span className="badge badge-success">Excellent</span>
                        </p>
                    </div>
                </div>

                {/* Catégories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {healthData.categories.map((cat, idx) => (
                        <div key={idx} className="content-card-app">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`health-icon ${cat.color}`}>
                                        <i className={cat.icon}></i>
                                    </div>
                                    <h4>{cat.nom}</h4>
                                </div>
                                <span className="text-2xl font-bold">{cat.score}%</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className={`progress-fill ${cat.color}`}
                                    style={{width: `${cat.score}%`}}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recommandations */}
                <div className="content-card-app">
                    <h3 className="card-title">
                        <i className="fas fa-lightbulb"></i> Recommandations
                    </h3>
                    <ul className="recommandations-list">
                        {healthData.recommandations.map((rec, idx) => (
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
