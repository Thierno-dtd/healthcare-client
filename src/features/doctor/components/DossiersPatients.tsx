import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PatientGrid from './DossiersPatientsGrid';
import HistoryView from './DossiersPatientsHistoryView';

import { MOCK_PATIENTS } from '../services/dossiersPatients.mock';
import type { PatientDossier, TabId } from '../types/dossiersPatients.types';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'total', label: 'Autorisation totale', icon: 'fas fa-lock-open' },
  { id: 'lecture', label: 'Autorisation en lecture', icon: 'fas fa-eye' },
  { id: 'refuse', label: 'Autorisation refusée', icon: 'fas fa-ban' },
  { id: 'historique', label: 'Historique', icon: 'fas fa-history' },
];

const DossiersPatients: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('total');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = MOCK_PATIENTS.filter(
    (p) =>
      p.typeAcces === activeTab &&
      (`${p.nom} ${p.prenom}`.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="page-content">
      <div className="content-header-app">
        <div
          className="header-image"
          style={{
            background:
              'linear-gradient(rgba(24, 160, 251, 0.85), rgba(37, 99, 235, 0.85)), url(https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
          }}
        >
          <div className="header-overlay">
            <h1>Dossiers Patients</h1>
            <p>Accédez aux dossiers médicaux de vos patients autorisés</p>
          </div>
        </div>
      </div>

      <div className="content-body">
        <div className="tabs-container mb-6">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
              >
                <i className={tab.icon} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'historique' ? (
            <HistoryView />
          ) : (
            <>
              <div className="flex items-center justify-between mb-5 gap-4">
                <div className="flex items-center gap-3">
                  <i className="fas fa-search text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher un patient..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {filteredPatients.length} patient(s) trouvé(s)
                </div>
              </div>

              {filteredPatients.length === 0 ? (
                <div className="content-card-app text-center">
                  <i className="fas fa-user-slash text-4xl text-muted-foreground mb-4" />
                  <div className="text-lg font-semibold text-foreground mb-1">Aucun patient trouvé</div>
                  <div className="text-sm text-muted-foreground">
                    {searchQuery ? 'Essayez un autre terme de recherche' : 'Aucun patient dans cette catégorie'}
                  </div>
                </div>
              ) : (
                <PatientGrid
                  patients={filteredPatients}
                  onSelect={(patient) => navigate(`/medecin/patients/${patient.id}/consultations`)}
                />
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default DossiersPatients;
