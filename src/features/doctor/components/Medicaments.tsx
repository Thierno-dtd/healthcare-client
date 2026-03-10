import React, { useState } from 'react';
import { useAuthStore } from '@core/auth/auth.store';
import { useMedicamentsSuivi, useRappelsMedicaments, useMarquerPrise } from '@features/patient/hooks/useMedicamentsSuivi';

const Medicaments: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const { data: medicaments, isLoading } = useMedicamentsSuivi(user?.id);
    const { data: rappels } = useRappelsMedicaments(user?.id);
    const marquerPrise = useMarquerPrise(user?.id ?? '');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMeds = medicaments?.filter(
        (m) => !searchQuery || m.nom.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

    const enCours = filteredMeds.filter((m) => m.status === 'en_cours');
    const termines = filteredMeds.filter((m) => m.status === 'termine');
    const rappelsNonPris = rappels?.filter((r) => !r.pris) ?? [];

    if (isLoading) {
        return (
            <div className="page-content">
                <div className="content-body text-center py-12">
                    <i className="fas fa-spinner fa-spin text-3xl text-primary"></i>
                    <p className="mt-4">Chargement de vos médicaments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(16, 185, 129, 0.8), rgba(16, 185, 129, 0.9)), url(https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Mes Médicaments</h1>
                        <p>Suivi de vos traitements et rappels de prise</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                {/* Rappels du jour */}
                {rappelsNonPris.length > 0 && (
                    <div className="content-card-app mb-6">
                        <h3 className="card-title">
                            <i className="fas fa-bell"></i> Rappels du jour
                        </h3>
                        <div className="space-y-3">
                            {rappelsNonPris.map((rappel) => (
                                <div key={rappel.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <div className="flex items-center gap-3">
                                        <i className="fas fa-clock text-orange-500"></i>
                                        <div>
                                            <p className="font-medium">{rappel.medicamentNom}</p>
                                            <p className="text-sm text-gray-500">Prévu à {rappel.heure}</p>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => marquerPrise.mutate(rappel.id)}
                                        disabled={marquerPrise.isPending}
                                    >
                                        <i className="fas fa-check"></i> Pris
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recherche */}
                <div className="content-card-app mb-6">
                    <div className="search-input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher un médicament..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Médicaments en cours */}
                <div className="content-card-app mb-6">
                    <h3 className="card-title">
                        <i className="fas fa-pills"></i> Traitements en cours ({enCours.length})
                    </h3>
                    <div className="medicaments-list">
                        {enCours.map((med) => (
                            <div key={med.id} className="medicament-card">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4>{med.nom} - {med.dosage}</h4>
                                        <p className="text-sm text-gray-600">{med.frequence}</p>
                                        <p className="text-xs text-gray-400">Prescrit par {med.prescripteur}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="badge badge-primary">
                                            {med.prisesAujourdhui}/{med.prisesTotalesJour}
                                        </span>
                                        {med.prochainePrise && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                <i className="fas fa-clock"></i> {med.prochainePrise}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {med.instructions && (
                                    <p className="text-xs text-blue-600 mt-2">
                                        <i className="fas fa-info-circle"></i> {med.instructions}
                                    </p>
                                )}
                            </div>
                        ))}
                        {enCours.length === 0 && (
                            <p className="text-gray-400 text-center py-4">Aucun traitement en cours</p>
                        )}
                    </div>
                </div>

                {/* Traitements terminés */}
                {termines.length > 0 && (
                    <div className="content-card-app">
                        <h3 className="card-title">
                            <i className="fas fa-check-circle"></i> Traitements terminés ({termines.length})
                        </h3>
                        <div className="medicaments-list">
                            {termines.map((med) => (
                                <div key={med.id} className="medicament-card opacity-60">
                                    <h4>{med.nom} - {med.dosage}</h4>
                                    <p className="text-sm text-gray-500">{med.frequence} • {med.duree}</p>
                                    <p className="text-xs text-gray-400">Du {med.debut} au {med.fin}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Medicaments;
