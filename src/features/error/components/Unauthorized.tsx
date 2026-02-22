import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="error-page">
            <div className="error-content">
                <div className="error-icon">
                    <i className="fas fa-ban"></i>
                </div>
                <h1>403</h1>
                <h2>Accès non autorisé</h2>
                <p>
                    Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                </p>
                <div className="error-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/dashboard')}
                    >
                        <i className="fas fa-home"></i> Retour au tableau de bord
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate(-1)}
                    >
                        <i className="fas fa-arrow-left"></i> Page précédente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
