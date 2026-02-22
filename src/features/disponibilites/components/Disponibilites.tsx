import React, { useState } from 'react';

interface EtablissementData {
  id: number;
  nom: string;
  type: string;
  adresse: string;
  distance: string;
  disponibilite: string;
  services: string[];
}

const Disponibilites: React.FC = () => {
    const [etablissements] = useState<EtablissementData[]>([
        {
            id: 1,
            nom: 'Hôpital Saint-Louis',
            type: 'Hôpital',
            adresse: 'Agoe-Assiyéyé, Lomé',
            distance: '2.3 km',
            disponibilite: 'Disponible',
            services: ['Urgences', 'Cardiologie', 'Neurologie']
        },
        {
            id: 2,
            nom: 'Pharmacie Centrale',
            type: 'Pharmacie',
            adresse: 'Camps Fir, Lomé',
            distance: '0.8 km',
            disponibilite: 'Ouvert',
            services: ['Garde 24h', 'Orthopédie']
        },
        {
            id: 3,
            nom: 'Clinique du Parc',
            type: 'Clinique',
            adresse: 'Zossimé, Lomé',
            distance: '5.1 km',
            disponibilite: 'Complet',
            services: ['Consultations', 'Imagerie']
        }
    ]);

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image"   >
                    <div className="header-overlay">
                        <h1>Disponibilités des Centres</h1>
                        <p>Trouvez les établissements de santé disponibles près de vous</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Filtres */}
                    <div className="lg:col-span-1">
                        <div className="content-card-app sticky top-4">
                            <h3 className="card-title">Filtres</h3>
                            <div className="space-y-4">
                                <div className="form-group">
                                    <label>Type d'établissement</label>
                                    <select className="form-control">
                                        <option>Tous</option>
                                        <option>Hôpitaux</option>
                                        <option>Cliniques</option>
                                        <option>Pharmacies</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Distance maximale</label>
                                    <select className="form-control">
                                        <option>5 km</option>
                                        <option>10 km</option>
                                        <option>20 km</option>
                                        <option>50 km</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Services</label>
                                    <div className="space-y-2">
                                        <div className="form-check">
                                            <input type="checkbox" id="urgences" />
                                            <label htmlFor="urgences">Urgences</label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" id="garde" />
                                            <label htmlFor="garde">Garde 24h</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des établissements */}
                    <div className="lg:col-span-2 space-y-4">
                        {etablissements.map(etab => (
                            <div key={etab.id} className="content-card-app">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-xl font-semibold">{etab.nom}</h3>
                                        <p className="text-gray-600">{etab.type}</p>
                                    </div>
                                    <span className={`badge ${
                                        etab.disponibilite === 'Disponible' || etab.disponibilite === 'Ouvert'
                                            ? 'badge-success'
                                            : 'badge-danger'
                                    }`}>
                    {etab.disponibilite}
                  </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <p className="flex items-center gap-2 text-gray-600">
                                        <i className="fas fa-map-marker-alt"></i>
                                        {etab.adresse}
                                    </p>
                                    <p className="flex items-center gap-2 text-gray-600">
                                        <i className="fas fa-route"></i>
                                        À {etab.distance}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {etab.services.map((service, idx) => (
                                        <span key={idx} className="badge badge-medical">{service}</span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn btn-outline flex-1">
                                        <i className="fas fa-phone"></i> Contacter
                                    </button>
                                    <button className="btn btn-primary flex-1">
                                        <i className="fas fa-directions"></i> Itinéraire
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Disponibilites;
