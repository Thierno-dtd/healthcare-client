import React, { useState } from 'react';

/* ─── Types ─── */
type TabId = 'total' | 'lecture' | 'refuse' | 'historique';

interface PatientDossier {
  id: string;
  nom: string;
  prenom: string;
  age: number;
  groupeSanguin: string;
  avatar: string;
  typeAcces: 'total' | 'lecture' | 'refuse';
  specialite: string;
  dernierExamen: string;
  status: 'Stable' | 'Suivi requis' | 'Critique';
  allergies: string[];
  maladiesChroniques: string[];
  telephone: string;
}

interface HistoriqueEntry {
  id: string;
  patientNom: string;
  action: string;
  date: string;
  details: string;
}

/* ─── Mock data ─── */
const MOCK_PATIENTS: PatientDossier[] = [
  { id: 'pat_001', nom: 'BIMA', prenom: 'Afi', age: 35, groupeSanguin: 'A+', avatar: 'BA', typeAcces: 'total', specialite: 'Cardiologie', dernierExamen: '2026-02-10', status: 'Stable', allergies: ['Pénicilline'], maladiesChroniques: [], telephone: '+228 91 00 11 22' },
  { id: 'pat_002', nom: 'KOFFI', prenom: 'Mensah', age: 52, groupeSanguin: 'O+', avatar: 'KM', typeAcces: 'total', specialite: 'Diabétologie', dernierExamen: '2026-02-15', status: 'Suivi requis', allergies: [], maladiesChroniques: ['Diabète type 2'], telephone: '+228 90 22 33 44' },
  { id: 'pat_003', nom: 'ADJO', prenom: 'Sophie', age: 28, groupeSanguin: 'B+', avatar: 'AS', typeAcces: 'lecture', specialite: 'Dermatologie', dernierExamen: '2026-01-22', status: 'Stable', allergies: ['Pollen'], maladiesChroniques: [], telephone: '+228 93 44 55 66' },
  { id: 'pat_004', nom: 'AMEGAH', prenom: 'Koku', age: 45, groupeSanguin: 'AB-', avatar: 'AK', typeAcces: 'lecture', specialite: 'Neurologie', dernierExamen: '2026-02-01', status: 'Stable', allergies: [], maladiesChroniques: ['Hypertension'], telephone: '+228 97 66 77 88' },
  { id: 'pat_005', nom: 'DZIFA', prenom: 'Ama', age: 60, groupeSanguin: 'O-', avatar: 'DA', typeAcces: 'refuse', specialite: 'Consultation générale', dernierExamen: '2026-01-10', status: 'Critique', allergies: ['Aspirine', 'Latex'], maladiesChroniques: ['Asthme'], telephone: '+228 96 88 99 00' },
];

const MOCK_HISTORIQUE: HistoriqueEntry[] = [
  { id: 'h1', patientNom: 'BIMA Afi', action: 'Consultation du dossier', date: '2026-02-20', details: 'Consulté les résultats de l\'ECG' },
  { id: 'h2', patientNom: 'KOFFI Mensah', action: 'Modification du traitement', date: '2026-02-18', details: 'Ajout de Metformine 500mg' },
  { id: 'h3', patientNom: 'ADJO Sophie', action: 'Lecture du dossier', date: '2026-02-15', details: 'Consultation des antécédents' },
  { id: 'h4', patientNom: 'BIMA Afi', action: 'Prescription ajoutée', date: '2026-02-12', details: 'Ordonnance cardiologie renouvelée' },
  { id: 'h5', patientNom: 'AMEGAH Koku', action: 'Lecture du dossier', date: '2026-02-08', details: 'Vérification des résultats IRM' },
];

/* ─── Colors ─── */
const C = {
  primary: '#163344',
  blue: '#3b82f6',
  blueDark: '#1d4ed8',
  blueLight: '#eff6ff',
  medical: '#10b981',
  medicalLight: '#ecfdf5',
  amber: '#f59e0b',
  amberLight: '#fffbeb',
  danger: '#ef4444',
  dangerLight: '#fef2f2',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  white: '#ffffff',
};

const responsiveCSS = `
  .dossiers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
  @media (max-width: 760px) { .dossiers-grid { grid-template-columns: 1fr; } }
`;

const TABS: { id: TabId; label: string; icon: string; color: string }[] = [
  { id: 'total', label: 'Autorisation totale', icon: 'fas fa-lock-open', color: C.medical },
  { id: 'lecture', label: 'Autorisation en lecture', icon: 'fas fa-eye', color: C.blue },
  { id: 'refuse', label: 'Autorisation refusée', icon: 'fas fa-ban', color: C.danger },
  { id: 'historique', label: 'Historique', icon: 'fas fa-history', color: C.amber },
];

const DossiersPatients: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('total');
  const [selectedPatient, setSelectedPatient] = useState<PatientDossier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabHover, setTabHover] = useState<TabId | null>(null);
  const [cardHover, setCardHover] = useState<string | null>(null);

  const filteredPatients = MOCK_PATIENTS.filter(
    (p) =>
      p.typeAcces === activeTab &&
      (`${p.nom} ${p.prenom}`.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusStyle = (status: string): React.CSSProperties => {
    if (status === 'Stable') return { background: C.medicalLight, color: '#065f46', border: `1px solid ${C.medical}30` };
    if (status === 'Suivi requis') return { background: C.amberLight, color: '#92400e', border: `1px solid ${C.amber}30` };
    return { background: C.dangerLight, color: '#991b1b', border: `1px solid ${C.danger}30` };
  };

  const getAccesBadge = (type: string) => {
    if (type === 'total') return { bg: C.medicalLight, color: '#065f46', label: 'Accès total', icon: 'fas fa-lock-open' };
    if (type === 'lecture') return { bg: C.blueLight, color: C.blueDark, label: 'Lecture seule', icon: 'fas fa-eye' };
    return { bg: C.dangerLight, color: '#991b1b', label: 'Refusé', icon: 'fas fa-ban' };
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR');

  /* ─── Detail modal ─── */
  const renderDetailModal = () => {
    if (!selectedPatient) return null;
    const acces = getAccesBadge(selectedPatient.typeAcces);
    return (
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }}
        onClick={() => setSelectedPatient(null)}
      >
        <div
          style={{
            background: C.white, borderRadius: 20, maxWidth: 560, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div style={{
            background: `linear-gradient(135deg, ${C.primary}, #1e4d6b)`,
            padding: '24px 28px', color: C.white,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700,
                }}>{selectedPatient.avatar}</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{selectedPatient.prenom} {selectedPatient.nom}</div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>{selectedPatient.age} ans • Groupe {selectedPatient.groupeSanguin}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="fas fa-times" style={{ color: C.white, fontSize: 14 }} />
              </button>
            </div>
          </div>

          {/* Modal body */}
          <div style={{ padding: 28 }}>
            {/* Badges */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <span style={{ ...getStatusStyle(selectedPatient.status), padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                {selectedPatient.status}
              </span>
              <span style={{ background: acces.bg, color: acces.color, padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                <i className={acces.icon} style={{ marginRight: 6, fontSize: 10 }} />{acces.label}
              </span>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {[
                { label: 'Spécialité', value: selectedPatient.specialite, icon: 'fas fa-stethoscope' },
                { label: 'Dernier examen', value: formatDate(selectedPatient.dernierExamen), icon: 'fas fa-calendar' },
                { label: 'Téléphone', value: selectedPatient.telephone, icon: 'fas fa-phone' },
                { label: 'Groupe sanguin', value: selectedPatient.groupeSanguin, icon: 'fas fa-tint' },
              ].map((item, i) => (
                <div key={i} style={{ background: C.gray50, borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 11, color: C.gray500, marginBottom: 4 }}>
                    <i className={item.icon} style={{ marginRight: 6, fontSize: 10 }} />{item.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.gray800 }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Allergies */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 8 }}>
                <i className="fas fa-allergies" style={{ marginRight: 8, color: C.danger }} />Allergies
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {selectedPatient.allergies.length > 0
                  ? selectedPatient.allergies.map((a, i) => (
                    <span key={i} style={{ background: C.dangerLight, color: '#991b1b', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>{a}</span>
                  ))
                  : <span style={{ fontSize: 13, color: C.gray400 }}>Aucune allergie connue</span>
                }
              </div>
            </div>

            {/* Maladies chroniques */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 8 }}>
                <i className="fas fa-heartbeat" style={{ marginRight: 8, color: C.amber }} />Maladies chroniques
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {selectedPatient.maladiesChroniques.length > 0
                  ? selectedPatient.maladiesChroniques.map((m, i) => (
                    <span key={i} style={{ background: C.amberLight, color: '#92400e', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>{m}</span>
                  ))
                  : <span style={{ fontSize: 13, color: C.gray400 }}>Aucune maladie chronique</span>
                }
              </div>
            </div>

            {/* Actions */}
            {selectedPatient.typeAcces !== 'refuse' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{
                  flex: 1, padding: '10px 0', borderRadius: 12, border: 'none',
                  background: C.blue, color: C.white, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                  <i className="fas fa-file-medical" style={{ marginRight: 8 }} />Voir le dossier complet
                </button>
                <button style={{
                  flex: 1, padding: '10px 0', borderRadius: 12, border: `1px solid ${C.gray200}`,
                  background: C.white, color: C.gray700, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                  <i className="fas fa-video" style={{ marginRight: 8 }} />Téléconsultation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{responsiveCSS}</style>
      <div style={{ padding: 24 }}>
        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="fas fa-user-injured" style={{ color: C.white, fontSize: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.primary }}>Dossiers Patients</div>
              <div style={{ fontSize: 13, color: C.gray500 }}>Accédez aux dossiers médicaux de vos patients autorisés</div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{
          background: C.white, borderRadius: 14, border: `1px solid ${C.gray200}`,
          padding: 6, display: 'flex', gap: 4, marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflowX: 'auto',
        }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const isHover = tabHover === tab.id;
            const count = tab.id === 'historique' ? MOCK_HISTORIQUE.length : MOCK_PATIENTS.filter(p => p.typeAcces === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedPatient(null); }}
                onMouseEnter={() => setTabHover(tab.id)}
                onMouseLeave={() => setTabHover(null)}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 10,
                  border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: isActive ? 600 : 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: isActive ? tab.color : isHover ? C.gray50 : 'transparent',
                  color: isActive ? C.white : C.gray600,
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
              >
                <i className={tab.icon} style={{ fontSize: 12 }} />
                {tab.label}
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.3)' : C.gray100,
                  color: isActive ? C.white : C.gray500,
                  padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Search bar (not for historique) */}
        {activeTab !== 'historique' && (
          <div style={{
            position: 'relative', marginBottom: 20, maxWidth: 400,
          }}>
            <i className="fas fa-search" style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: C.gray400, fontSize: 14,
            }} />
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 40px', borderRadius: 12,
                border: `1px solid ${C.gray200}`, fontSize: 13, outline: 'none',
                background: C.white, color: C.gray800, transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.gray200)}
            />
          </div>
        )}

        {/* Content */}
        {activeTab === 'historique' ? (
          /* ─── Historique Tab ─── */
          <div style={{
            background: C.white, borderRadius: 16, border: `1px solid ${C.gray200}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.gray200}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="fas fa-history" style={{ color: C.amber, fontSize: 14 }} />
              <span style={{ fontWeight: 600, fontSize: 14, color: C.gray800 }}>Historique des accès</span>
              <span style={{ background: C.amberLight, color: '#92400e', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, marginLeft: 'auto' }}>
                {MOCK_HISTORIQUE.length} entrées
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: C.gray50 }}>
                    {['Patient', 'Action', 'Détails', 'Date'].map((h) => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: C.gray500, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_HISTORIQUE.map((entry) => (
                    <tr key={entry.id} style={{ borderBottom: `1px solid ${C.gray100}` }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: C.gray800 }}>{entry.patientNom}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: C.gray600 }}>{entry.action}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: C.gray500 }}>{entry.details}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: C.gray400 }}>{formatDate(entry.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ─── Patient Grid ─── */
          <>
            {filteredPatients.length === 0 ? (
              <div style={{
                background: C.white, borderRadius: 16, border: `1px solid ${C.gray200}`,
                padding: 48, textAlign: 'center',
              }}>
                <i className="fas fa-user-slash" style={{ fontSize: 40, color: C.gray300, marginBottom: 12, display: 'block' }} />
                <div style={{ fontSize: 15, fontWeight: 600, color: C.gray600, marginBottom: 4 }}>Aucun patient trouvé</div>
                <div style={{ fontSize: 13, color: C.gray400 }}>
                  {searchQuery ? 'Essayez un autre terme de recherche' : 'Aucun patient dans cette catégorie'}
                </div>
              </div>
            ) : (
              <div className="dossiers-grid">
                {filteredPatients.map((patient) => {
                  const acces = getAccesBadge(patient.typeAcces);
                  const isHovered = cardHover === patient.id;
                  return (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      onMouseEnter={() => setCardHover(patient.id)}
                      onMouseLeave={() => setCardHover(null)}
                      style={{
                        background: C.white, borderRadius: 16,
                        border: `1px solid ${isHovered ? C.blue : C.gray200}`,
                        boxShadow: isHovered ? '0 8px 24px rgba(59,130,246,0.12)' : '0 1px 3px rgba(0,0,0,0.06)',
                        cursor: 'pointer', transition: 'all 0.2s',
                        transform: isHovered ? 'translateY(-2px)' : 'none',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Card header */}
                      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 14,
                          background: `linear-gradient(135deg, ${C.blue}20, ${C.blue}40)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 16, fontWeight: 700, color: C.blue, flexShrink: 0,
                        }}>{patient.avatar}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: C.gray800 }}>{patient.prenom} {patient.nom}</div>
                          <div style={{ fontSize: 12, color: C.gray500 }}>{patient.age} ans • {patient.groupeSanguin}</div>
                        </div>
                        <span style={{ ...getStatusStyle(patient.status), padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {patient.status}
                        </span>
                      </div>

                      {/* Card body */}
                      <div style={{ padding: '0 20px 16px' }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                          <span style={{ background: acces.bg, color: acces.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                            <i className={acces.icon} style={{ marginRight: 5, fontSize: 9 }} />{acces.label}
                          </span>
                          <span style={{ background: C.gray100, color: C.gray600, padding: '3px 10px', borderRadius: 20, fontSize: 11 }}>
                            {patient.specialite}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: `1px solid ${C.gray100}` }}>
                          <div style={{ fontSize: 11, color: C.gray500 }}>
                            <i className="fas fa-calendar" style={{ marginRight: 6, fontSize: 10 }} />
                            Dernier examen : {formatDate(patient.dernierExamen)}
                          </div>
                          <i className="fas fa-chevron-right" style={{ fontSize: 11, color: C.gray400 }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {renderDetailModal()}
    </>
  );
};

export default DossiersPatients;
