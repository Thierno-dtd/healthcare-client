import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="error-page">
            <div className="error-content">
                <div className="error-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                </div>

                <h1>404</h1>
                <h2>Page introuvable</h2>

                <p>
                    La page que vous recherchez n'existe pas, a été déplacée
                    ou vous avez saisi une mauvaise URL.
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

export default NotFound;
