import React, { useState } from 'react';

interface PharmacieInfo {
  nom: string;
  adresse: string;
  telephone: string;
  horaires: string;
  garde: boolean;
}

const GestionPharmacie: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('informations');

    const pharmacieInfo: PharmacieInfo = {
        nom: 'Pharmacie Centrale',
        adresse: 'B.P 2326 Tokoin, Lomé',
        telephone: '+228 91 45 48 82',
        horaires: 'Lun-Sam: 8h-20h, Dim: 9h-13h',
        garde: true
    };

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(16, 185, 129, 0.8), rgba(16, 185, 129, 0.9)), url(https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Gestion de la Pharmacie</h1>
                        <p>Gérez les informations et disponibilités de votre pharmacie</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                <div className="tabs-container mb-6">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'informations' ? 'active' : ''}`}
                            onClick={() => setActiveTab('informations')}
                        >
                            <i className="fas fa-info-circle"></i> Informations
                        </button>
                        <button
                            className={`tab ${activeTab === 'disponibilite' ? 'active' : ''}`}
                            onClick={() => setActiveTab('disponibilite')}
                        >
                            <i className="fas fa-clock"></i> Disponibilité
                        </button>
                        <button
                            className={`tab ${activeTab === 'statistiques' ? 'active' : ''}`}
                            onClick={() => setActiveTab('statistiques')}
                        >
                            <i className="fas fa-chart-bar"></i> Statistiques
                        </button>
                    </div>
                </div>

                {activeTab === 'informations' && (
                    <div className="content-card-app">
                        <h3 className="card-title">Informations de la pharmacie</h3>
                        <form className="space-y-4">
                            <div className="form-group">
                                <label>Nom de la pharmacie</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue={pharmacieInfo.nom}
                                />
                            </div>
                            <div className="form-group">
                                <label>Adresse complète</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    defaultValue={pharmacieInfo.adresse}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label>Téléphone</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        defaultValue={pharmacieInfo.telephone}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Horaires</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={pharmacieInfo.horaires}
                                    />
                                </div>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    id="garde"
                                    defaultChecked={pharmacieInfo.garde}
                                />
                                <label htmlFor="garde">Pharmacie de garde</label>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                <i className="fas fa-save"></i> Enregistrer les modifications
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'disponibilite' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="content-card-app">
                            <h3 className="card-title">Statut actuel</h3>
                            <div className="status-toggle">
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                    <div>
                                        <h4 className="font-semibold text-green-900">Pharmacie ouverte</h4>
                                        <p className="text-sm text-green-700">Disponible pour les clients</p>
                                    </div>
                                    <div className="toggle-switch active">
                                        <input type="checkbox" defaultChecked />
                                        <span className="toggle-slider"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="content-card-app">
                            <h3 className="card-title">Horaires d'ouverture</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-2">
                                    <span>Lundi - Vendredi</span>
                                    <span className="font-semibold">8h00 - 20h00</span>
                                </div>
                                <div className="flex justify-between items-center p-2">
                                    <span>Samedi</span>
                                    <span className="font-semibold">8h00 - 20h00</span>
                                </div>
                                <div className="flex justify-between items-center p-2">
                                    <span>Dimanche</span>
                                    <span className="font-semibold">9h00 - 13h00</span>
                                </div>
                            </div>
                            <button className="btn btn-outline w-full mt-4">
                                <i className="fas fa-edit"></i> Modifier les horaires
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'statistiques' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="stat-card">
                            <div className="stat-icon blue">
                                <i className="fas fa-prescription-bottle"></i>
                            </div>
                            <div className="stat-info">
                                <h3>156</h3>
                                <p>Ordonnances ce mois</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon green">
                                <i className="fas fa-euro-sign"></i>
                            </div>
                            <div className="stat-info">
                                <h3>12,450€</h3>
                                <p>Chiffre d'affaires</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon orange">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-info">
                                <h3>847</h3>
                                <p>Clients servis</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestionPharmacie;
