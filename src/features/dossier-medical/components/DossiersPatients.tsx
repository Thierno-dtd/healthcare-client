import React, { useState } from 'react';
import { PATIENTS } from '@shared/data/mock-data';

const DossiersPatients: React.FC = () => {
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredPatients = PATIENTS.filter(p =>
        p.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.9)), url(https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Dossiers Patients</h1>
                        <p>Accédez aux dossiers médicaux de vos patients autorisés</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                <div className="flex gap-6">
                    {/* Liste des patients */}
                    <div className="w-1/3">
                        <div className="content-card-app sticky top-4">
                            <h3 className="card-title">
                                <i className="fas fa-users"></i> Mes patients
                            </h3>
                            <div className="search-box mb-4">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder="Rechercher un patient..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="patients-list">
                                {filteredPatients.map(patient => (
                                    <div
                                        key={patient.id}
                                        className={`patient-item ${selectedPatient?.id === patient.id ? 'active' : ''}`}
                                        onClick={() => setSelectedPatient(patient)}
                                    >
                                        <div className="patient-avatar">{patient.avatar}</div>
                                        <div className="patient-info">
                                            <h4>{patient.nom}</h4>
                                            <p>{patient.age} ans • {patient.groupeSanguin}</p>
                                        </div>
                                        <span className={`status-badge ${patient.status === 'Stable' ? 'success' : 'warning'}`}>
                      {patient.status}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Détails du patient */}
                    <div className="flex-1">
                        {selectedPatient ? (
                            <div className="space-y-6">
                                {/* En-tête patient */}
                                <div className="content-card-app">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="patient-avatar-large">{selectedPatient.avatar}</div>
                                            <div>
                                                <h2>{selectedPatient.nom}</h2>
                                                <p className="text-gray-600">{selectedPatient.age} ans • Groupe {selectedPatient.groupeSanguin}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="btn btn-outline">
                                                <i className="fas fa-prescription"></i> Ordonnance
                                            </button>
                                            <button className="btn btn-primary">
                                                <i className="fas fa-calendar"></i> RDV
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="content-card-app">
                                    <div className="tabs mb-4">
                                        <button className="tab active">
                                            <i className="fas fa-file-medical"></i> Dossier
                                        </button>
                                        <button className="tab">
                                            <i className="fas fa-history"></i> Historique
                                        </button>
                                        <button className="tab">
                                            <i className="fas fa-pills"></i> Traitements
                                        </button>
                                    </div>

                                    {/* Informations médicales */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="info-card">
                                            <h4>Dernière consultation</h4>
                                            <p>{selectedPatient.dernierExamen}</p>
                                        </div>
                                        <div className="info-card">
                                            <h4>État de santé</h4>
                                            <span className="badge badge-success">{selectedPatient.status}</span>
                                        </div>
                                        <div className="info-card">
                                            <h4>Allergies</h4>
                                            <p>Pénicilline, Pollen</p>
                                        </div>
                                        <div className="info-card">
                                            <h4>Maladies chroniques</h4>
                                            <p>Aucune</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes médicales */}
                                <div className="content-card-app">
                                    <h3 className="card-title">
                                        <i className="fas fa-sticky-note"></i> Notes médicales
                                    </h3>
                                    <textarea
                                        className="form-control"
                                        rows={6}
                                        placeholder="Ajouter une note médicale..."
                                    ></textarea>
                                    <button className="btn btn-primary mt-3">
                                        <i className="fas fa-save"></i> Enregistrer
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="content-card-app text-center py-12">
                                <i className="fas fa-user-injured text-6xl text-gray-300 mb-4"></i>
                                <p className="text-gray-500">Sélectionnez un patient pour voir son dossier</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DossiersPatients;
