import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  BedDouble, 
  Beaker, 
  ClipboardList, 
  FileText, 
  ListChecks, 
  Stethoscope, 
  Plus,
  AlertTriangle 
} from 'lucide-react';

import {
  PATIENT_RECORDS,
  CONSULTATIONS,
  HOSPITALISATIONS,
  ANALYSES,
  ORDONNANCES_RECORD,
} from '@shared/data/mock-data';

import type { PatientRecordTabId } from '@shared/types/patient-record.types';
import PatientRecordTabs, { PatientRecordTab } from './PatientRecordTabs';
import PatientRecordOverview from './PatientRecordOverview';
import PatientRecordConsultations from './PatientRecordConsultations';
import PatientRecordHospitalisations from './PatientRecordHospitalisations';
import PatientRecordAnalyses from './PatientRecordAnalyses';
import PatientRecordOrdonnances from './PatientRecordOrdonnances';
import PatientRecordAntecedents from './PatientRecordAntecedents';
import PatientRecordTimeline from './PatientRecordTimeline';

const PatientRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patientId } = useParams<{ patientId: string }>();
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [selectedHospitalisationId, setSelectedHospitalisationId] = useState<string | null>(null);

  const patient = useMemo(
    () => PATIENT_RECORDS.find((p) => p.id === patientId),
    [patientId]
  );

  const consultations = useMemo(
    () => CONSULTATIONS.filter((c) => c.patientId === patientId),
    [patientId]
  );

  const hospitalisations = useMemo(
    () => HOSPITALISATIONS.filter((h) => h.patientId === patientId),
    [patientId]
  );

  const analyses = useMemo(
    () => ANALYSES.filter((a) => a.patientId === patientId),
    [patientId]
  );

  const ordonnances = useMemo(
    () => ORDONNANCES_RECORD.filter((o) => o.patientId === patientId),
    [patientId]
  );

  const lastConsultation = useMemo(() => {
    return [...consultations].sort((a, b) => (b.date.localeCompare(a.date) || b.heure.localeCompare(a.heure)));
  }, [consultations])[0];

  const lastHospitalisation = useMemo(() => {
    return [...hospitalisations].sort((a, b) => b.dateAdmission.localeCompare(a.dateAdmission));
  }, [hospitalisations])[0];

  const activeOrdonnances = useMemo(
    () => ordonnances.filter((o) => o.statut === 'Active'),
    [ordonnances]
  );

  const basePath = `/medecin/patients/${patientId}`;
  const activeTab = useMemo<PatientRecordTabId>(() => {
    const segment = location.pathname.replace(basePath, '').split('/').filter(Boolean)[0] as PatientRecordTabId | undefined;
    const validTabs: PatientRecordTabId[] = [
      'overview',
      'consultations',
      'hospitalisations',
      'analyses',
      'ordonnances',
      'antecedents',
      'timeline',
    ];
    return segment && validTabs.includes(segment) ? segment : 'consultations';
  }, [location.pathname, basePath]);

  React.useEffect(() => {
    if (!location.pathname.startsWith(`${basePath}/`)) {
      navigate(`${basePath}/consultations`, { replace: true });
    }
  }, [basePath, location.pathname, navigate]);

  const handleCreateConsultation = () => {
    // Navigation vers la page de création de consultation
    navigate(`/medecin/nouvelle-consultation?patientId=${patientId}`);
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Patient introuvable</h2>
          <p className="text-gray-600 mb-6">Aucun dossier trouvé pour l'identifiant passé en paramètre.</p>
          <button
            type="button"
            onClick={() => navigate('/medecin/patients')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const tabList: PatientRecordTab[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Stethoscope },
    { id: 'consultations', label: 'Consultations', icon: ClipboardList },
    { id: 'hospitalisations', label: 'Hospitalisations', icon: BedDouble },
    { id: 'analyses', label: 'Analyses', icon: Beaker },
    { id: 'ordonnances', label: 'Ordonnances', icon: FileText },
    { id: 'antecedents', label: 'Antécédents', icon: ListChecks },
    { id: 'timeline', label: 'Chronologie', icon: ListChecks },
  ];

  const handleTabClick = (tab: PatientRecordTabId) => {
    navigate(`${basePath}/${tab}`);
  };

  return (
     <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="min-h-screen bg-gray-50">
      {/* Header avec gradient */}
      <div
  style={{
    background: 'linear-gradient(to right, #163344, #1e293b)',
    borderRadius: '1rem',
    padding: '2rem',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  }}
>
  <div style={{ position: 'relative', zIndex: 10 }}>
    
    {/* Boutons */}
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => navigate('/medecin/patients')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à la liste
      </button>

      <button
        onClick={handleCreateConsultation}
        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-white font-semibold shadow-lg shadow-green-500/30"
      >
        <Plus className="w-5 h-5" />
        Créer une consultation
      </button>
    </div>

    {/* Infos patient */}
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-2 border-white/30">
        {patient.prenom.slice(0, 1)}{patient.nom.slice(0, 1)}
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">
          {patient.prenom} {patient.nom}
        </h1>

        <div className="flex flex-wrap gap-4 text-white/90">
          <span>
            {patient.sexe === 'F' ? '👩 Féminin' : '👨 Masculin'}
          </span>

          <span>•</span>

          <span>{patient.age} ans</span>

          <span>•</span>

          <span>Né(e) le {patient.dateNaissance}</span>

          <span>•</span>

          <span className="px-3 py-1 bg-white/20 rounded-full font-semibold">
            Groupe {patient.groupeSanguin}
          </span>
        </div>
      </div>
    </div>
  </div>

  {/* Icône décorative */}
  <div
    style={{
      position: 'absolute',
      right: 0,
      top: 0,
      height: '100%',
      width: '33%',
      opacity: 0.1,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    }}
  >
    <i
      className="fas fa-file-medical"
      style={{
        fontSize: '180px',
        marginRight: -10,
        transform: 'rotate(12deg)',
      }}
    />
  </div>
</div>

      {/* Bannière d'accès */}
      <div
          style={{
            margin: '12px 16px 12px 16px',
            padding: '10px 14px',
            borderRadius: 10,
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <i
            className="fas fa-check-circle"
            style={{
              color: '#059669',
              fontSize: 14,
              marginTop: 2,
              flexShrink: 0,
            }}
          />

          <span
            style={{
              fontSize: 13,
              color: '#065f46',
              lineHeight: 1.5,
            }}
          >
            Accès autorisé jusqu'au Illimité — Dossier médical complet
          </span>
        </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-8 ">
        {/* Carte d'informations patient */}
        <div className="content-card-app mb-6">
  <h3 className="card-title flex items-center gap-2 mb-6">
    <i className="fas fa-user-injured"></i> Informations du patient
  </h3>

   <div className="grid grid-cols-3 divide-x divide-gray-200">

    {/* Coordonnées */}
    <div>
      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-4 tracking-wider">
        Coordonnées
      </h4>

      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-500 uppercase">Téléphone</div>
          <div className="font-medium">{patient.telephone}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 uppercase">Email</div>
          <div className="font-medium">{patient.email}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 uppercase">Adresse</div>
          <div className="font-medium">{patient.adresse}</div>
        </div>
      </div>
    </div>

    {/* Identifiants */}
    <div>
      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-4 tracking-wider">
        Identifiants
      </h4>

      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-500 uppercase">N° dossier</div>
          <div className="font-medium">{patient.numeroDossier}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 uppercase">Sécurité sociale</div>
          <div className="font-medium">{patient.securiteSociale}</div>
        </div>
      </div>
    </div>

    {/* Informations médicales */}
    <div>
      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-4 tracking-wider">
        Informations médicales
      </h4>

      <div>
        <div className="text-xs text-gray-500 uppercase mb-1">Allergies</div>

        {patient.allergies?.length ? (
          <div className="flex flex-wrap gap-2">
            {patient.allergies.map((a, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full"
              >
                {a}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm text-gray-600">Aucune</span>
        )}
      </div>
    </div>

  </div>
</div>

        {/* Onglets et contenu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <PatientRecordTabs tabs={tabList} activeTab={activeTab} setActiveTab={handleTabClick} />

          <div className="p-6">
            {activeTab === 'overview' && (
              <PatientRecordOverview
                patient={patient}
                lastConsultation={lastConsultation}
                lastHospitalisation={lastHospitalisation}
                activeOrdonnances={activeOrdonnances}
              />
            )}

            {activeTab === 'consultations' && (
              <PatientRecordConsultations
                consultations={consultations}
                selectedId={selectedConsultationId}
                onSelect={setSelectedConsultationId}
              />
            )}

            {activeTab === 'hospitalisations' && (
              <PatientRecordHospitalisations
                hospitalisations={hospitalisations}
                selectedId={selectedHospitalisationId}
                onSelect={setSelectedHospitalisationId}
              />
            )}

            {activeTab === 'analyses' && <PatientRecordAnalyses analyses={analyses} />}

            {activeTab === 'ordonnances' && <PatientRecordOrdonnances ordonnances={ordonnances} />}

            {activeTab === 'antecedents' && <PatientRecordAntecedents antecedents={patient.antecedents} />}

            {activeTab === 'timeline' && <PatientRecordTimeline events={patient.timeline} />}
          </div>
        </div>
      </div>
    </div>
     </div>
    
  );
};

export default PatientRecordPage;