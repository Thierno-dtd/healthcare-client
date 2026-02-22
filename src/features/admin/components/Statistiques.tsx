import React from 'react';

const Statistiques: React.FC = () => {
    return (
        <div className="page-content">
            <div className="content-body" style={{padding: '30px'}}>
                <h2 className="mb-6">Statistiques de la plateforme</h2>

                <div className="stats-grid mb-6">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-info">
                            <h3>1,234</h3>
                            <p>Utilisateurs actifs</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <i className="fas fa-user-md"></i>
                        </div>
                        <div className="stat-info">
                            <h3>156</h3>
                            <p>Médecins</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <i className="fas fa-file-medical"></i>
                        </div>
                        <div className="stat-info">
                            <h3>3,450</h3>
                            <p>Consultations</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <i className="fas fa-prescription"></i>
                        </div>
                        <div className="stat-info">
                            <h3>2,890</h3>
                            <p>Ordonnances</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="content-card-app">
                        <h3 className="card-title">Activité mensuelle</h3>
                        <div className="chart-placeholder">
                            <i className="fas fa-chart-line text-6xl text-gray-300"></i>
                            <p className="text-gray-500 mt-4">Graphique d'activité</p>
                        </div>
                    </div>
                    <div className="content-card-app">
                        <h3 className="card-title">Répartition par rôle</h3>
                        <div className="chart-placeholder">
                            <i className="fas fa-chart-pie text-6xl text-gray-300"></i>
                            <p className="text-gray-500 mt-4">Graphique en camembert</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistiques;
