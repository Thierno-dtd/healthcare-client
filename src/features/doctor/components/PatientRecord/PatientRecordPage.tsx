import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BedDouble, Beaker, ClipboardList, FileText, ListChecks, Stethoscope } from 'lucide-react';

import {
  PATIENT_RECORDS,
  CONSULTATIONS,
  HOSPITALISATIONS,
  ANALYSES,
  ORDONNANCES_RECORD,
  DEPENSES,
} from '@shared/data/mock-data';

import type { PatientRecordTabId } from '@shared/types/patient-record.types';
import PatientRecordTabs, { PatientRecordTab } from './PatientRecordTabs';
import PatientRecordOverview from './PatientRecordOverview';
import PatientRecordConsultations from './PatientRecordConsultations';
import PatientRecordHospitalisations from './PatientRecordHospitalisations';
import PatientRecordAnalyses from './PatientRecordAnalyses';
import PatientRecordOrdonnances from './PatientRecordOrdonnances';
import PatientRecordAntecedents from './PatientRecordAntecedents';
import PatientRecordDepenses from './PatientRecordDepenses';
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

  const depenses = useMemo(
    () => DEPENSES.filter((d) => d.patientId === patientId),
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
      'depenses',
      'timeline',
    ];
    return segment && validTabs.includes(segment) ? segment : 'consultations';
  }, [location.pathname, basePath]);

  React.useEffect(() => {
    if (!location.pathname.startsWith(`${basePath}/`)) {
      navigate(`${basePath}/consultations`, { replace: true });
    }
  }, [basePath, location.pathname, navigate]);

  if (!patient) {
    return (
      <div className="page-content">
        <div className="content-header-app">
          <div className="header-overlay">
            <h1>Dossier patient</h1>
            <p>Patient introuvable ou accès non autorisé.</p>
          </div>
        </div>

        <div className="content-body">
          <div className="content-card-app">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">Aucun dossier trouvé pour l’identifiant passé en paramètre.</p>
              <button
                type="button"
                onClick={() => navigate('/medecin/patients')}
                className="btn btn-primary w-max"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabList: PatientRecordTab[] = [
    { id: 'overview', label: 'Vue d’ensemble', icon: Stethoscope },
    { id: 'consultations', label: 'Consultations', icon: ClipboardList },
    { id: 'hospitalisations', label: 'Hospitalisations', icon: BedDouble },
    { id: 'analyses', label: 'Analyses', icon: Beaker },
    { id: 'ordonnances', label: 'Ordonnances', icon: FileText },
    { id: 'antecedents', label: 'Antécédents', icon: ListChecks },
    { id: 'depenses', label: 'Dépenses', icon: ClipboardList },
    { id: 'timeline', label: 'Chronologie', icon: ListChecks },
  ];

  const handleTabClick = (tab: PatientRecordTabId) => {
    navigate(`${basePath}/${tab}`);
  };

  return (
    <div className="page-content">
      <div className="content-header-app">
        <div
          className="header-image"
          style={{
            background:
              'linear-gradient(rgba(24, 160, 251, 0.85), rgba(37, 99, 235, 0.85)), url(https://images.unsplash.com/photo-1587502536263-1c373e29d671?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
          }}
        >
          <div className="header-overlay">
            <h1>Fiche patient</h1>
            <p>Consultez les informations médicales et l'historique complet.</p>
          </div>
        </div>
      </div>

      <div className="content-body">
        <div className="alert alert-success">
          <i className="fas fa-check-circle" />
          Accès autorisé jusqu'au <strong>Illimité</strong> — Dossier médical complet
        </div>

        <div className="content-card-app">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl font-semibold text-foreground">
                    {patient.prenom.slice(0, 1)}{patient.nom.slice(0, 1)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      {patient.prenom} {patient.nom}
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      {patient.sexe === 'F' ? 'Féminin' : 'Masculin'} · {patient.age} ans · Né(e) le {patient.dateNaissance}
                    </div>
                    <div className="text-sm text-muted-foreground">Groupe sanguin : {patient.groupeSanguin}</div>
                  </div>
                </div>

                <div className="info-grid">
                  <div className="info-card">
                    <h4>Coordonnées</h4>
                    <div className="info-item">
                      <span className="label">Téléphone</span>
                      <span className="value">{patient.telephone}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Email</span>
                      <span className="value">{patient.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Adresse</span>
                      <span className="value">{patient.adresse}</span>
                    </div>
                  </div>

                  <div className="info-card">
                    <h4>Identifiants</h4>
                    <div className="info-item">
                      <span className="label">N° dossier</span>
                      <span className="value">{patient.numeroDossier}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Sécu</span>
                      <span className="value">{patient.securiteSociale}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Allergies</span>
                      <span className="value">
                        {patient.allergies.length ? (
                          patient.allergies.join(' · ')
                        ) : (
                          'Aucune'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="info-card">
                <h4 className="mb-3">Accès & statut</h4>
                <div className="info-item">
                  <span className="label">Type d’accès</span>
                  <span className="value">Illimité</span>
                </div>
                <div className="info-item">
                  <span className="label">Dernière consultation</span>
                  <span className="value">{lastConsultation ? `${lastConsultation.date} à ${lastConsultation.heure}` : 'Aucune'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-sm border border-gray-200">
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

            {activeTab === 'depenses' && <PatientRecordDepenses depenses={depenses} />}

            {activeTab === 'timeline' && <PatientRecordTimeline events={patient.timeline} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecordPage;
