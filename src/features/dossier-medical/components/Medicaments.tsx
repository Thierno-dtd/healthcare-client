import React, { useState } from 'react';
import { MEDICAMENTS } from '@shared/data/mock-data';

const Medicaments: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    const analyserMedicament = () => {
        alert('Fonction d\'analyse des interactions médicamenteuses');
    };

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(16, 185, 129, 0.8), rgba(16, 185, 129, 0.9)), url(https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Analyser mes Médicaments</h1>
                        <p>Vérifiez les interactions et obtenez des informations détaillées</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                <div className="content-card-app mb-6">
                    <h3 className="card-title">
                        <i className="fas fa-search"></i> Rechercher un médicament
                    </h3>
                    <div className="search-input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nom du médicament..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={analyserMedicament}>
                            <i className="fas fa-search"></i> Rechercher
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="content-card-app">
                        <h3 className="card-title">
                            <i className="fas fa-pills"></i> Mes médicaments actuels
                        </h3>
                        <div className="medicaments-list">
                            {MEDICAMENTS.map(med => (
                                <div key={med.id} className="medicament-card">
                                    <h4>{med.nom}</h4>
                                    <p className="text-sm text-gray-600">{med.frequence}</p>
                                    <button className="btn btn-outline btn-sm mt-2">
                                        <i className="fas fa-info-circle"></i> Détails
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="content-card-app">
                        <h3 className="card-title">
                            <i className="fas fa-exclamation-triangle"></i> Vérification des interactions
                        </h3>
                        <div className="alert alert-success">
                            <i className="fas fa-check-circle"></i>
                            <span>Aucune interaction détectée entre vos médicaments actuels</span>
                        </div>
                        <button className="btn btn-primary w-full mt-4" onClick={analyserMedicament}>
                            <i className="fas fa-sync"></i> Analyser les interactions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Medicaments;
