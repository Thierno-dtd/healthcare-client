import React, { useState } from 'react';

interface CasSpecial {
  id: number;
  titre: string;
  patient: string;
  specialites: string[];
  contributeurs: number;
  messages: number;
  urgence: string;
  dateCreation: string;
}

const CasSpeciaux: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('actifs');

    const casActifs: CasSpecial[] = [
        {
            id: 1,
            titre: 'Cardiomyopathie complexe',
            patient: 'Patient #4523',
            specialites: ['Cardiologie', 'Chirurgie'],
            contributeurs: 3,
            messages: 12,
            urgence: 'haute',
            dateCreation: '2024-03-10'
        },
        {
            id: 2,
            titre: 'Syndrome rare non diagnostiqué',
            patient: 'Patient #3891',
            specialites: ['Neurologie', 'Génétique'],
            contributeurs: 5,
            messages: 24,
            urgence: 'normale',
            dateCreation: '2024-03-05'
        }
    ];

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(139, 92, 246, 0.8), rgba(139, 92, 246, 0.9)), url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Cas Spéciaux - Collaboration</h1>
                        <p>Discutez de cas médicaux complexes avec d'autres experts</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                <div className="flex justify-between items-center mb-6">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'actifs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('actifs')}
                        >
                            <i className="fas fa-folder-open"></i> Cas actifs ({casActifs.length})
                        </button>
                        <button
                            className={`tab ${activeTab === 'resolus' ? 'active' : ''}`}
                            onClick={() => setActiveTab('resolus')}
                        >
                            <i className="fas fa-check-circle"></i> Cas résolus
                        </button>
                    </div>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i> Nouveau cas
                    </button>
                </div>

                <div className="grid gap-4">
                    {casActifs.map(cas => (
                        <div key={cas.id} className="content-card-app cas-card">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3>{cas.titre}</h3>
                                        <span className={`badge ${cas.urgence === 'haute' ? 'badge-danger' : 'badge-info'}`}>
                      {cas.urgence === 'haute' ? 'Urgent' : 'Normal'}
                    </span>
                                    </div>
                                    <p className="text-gray-600 mb-3">{cas.patient}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      <i className="fas fa-users"></i> {cas.contributeurs} experts
                    </span>
                                        <span>
                      <i className="fas fa-comments"></i> {cas.messages} messages
                    </span>
                                        <span>
                      <i className="fas fa-calendar"></i> {cas.dateCreation}
                    </span>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        {cas.specialites.map((spec, idx) => (
                                            <span key={idx} className="badge badge-medical">{spec}</span>
                                        ))}
                                    </div>
                                </div>
                                <button className="btn btn-outline">
                                    <i className="fas fa-eye"></i> Consulter
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CasSpeciaux;
