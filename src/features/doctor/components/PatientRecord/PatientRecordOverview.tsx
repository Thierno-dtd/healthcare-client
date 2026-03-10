import React from 'react';
import type { PatientRecord, ConsultationRecord, HospitalisationRecord, OrdonnanceRecord } from '@shared/types/patient-record.types';
import { AlertTriangle, BedDouble, Calendar, MapPin, Pill, Stethoscope } from 'lucide-react';

interface PatientRecordOverviewProps {
  patient: PatientRecord;
  lastConsultation?: ConsultationRecord;
  lastHospitalisation?: HospitalisationRecord;
  activeOrdonnances: OrdonnanceRecord[];
}

const PatientRecordOverview: React.FC<PatientRecordOverviewProps> = ({
  patient,
  lastConsultation,
  lastHospitalisation,
  activeOrdonnances,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="medical-card">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <Stethoscope className="w-4 h-4 text-primary" /> Dernière consultation
          </h3>
          {lastConsultation ? (
            <>
              <p className="text-sm text-muted-foreground mb-1">
                <Calendar className="w-3.5 h-3.5 inline mr-1" />
                {lastConsultation.date} à {lastConsultation.heure}
              </p>
              <p className="text-sm text-foreground">
                <strong>Motif:</strong> {lastConsultation.motif}
              </p>
              <p className="text-sm text-foreground">
                <strong>Diagnostic:</strong> {lastConsultation.diagnostic}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5 inline mr-1" />
                {lastConsultation.hopital} — {lastConsultation.medecin}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune consultation</p>
          )}
        </div>

        <div className="medical-card">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <BedDouble className="w-4 h-4 text-warning" /> Dernière hospitalisation
          </h3>
          {lastHospitalisation ? (
            <>
              <p className="text-sm text-muted-foreground mb-1">
                <Calendar className="w-3.5 h-3.5 inline mr-1" />
                {lastHospitalisation.dateAdmission} → {lastHospitalisation.dateSortie}
              </p>
              <p className="text-sm text-foreground">
                <strong>Motif:</strong> {lastHospitalisation.motif}
              </p>
              <p className="text-sm text-foreground">
                <strong>Diagnostic:</strong> {lastHospitalisation.diagnosticFinal}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5 inline mr-1" />
                {lastHospitalisation.hopital} — {lastHospitalisation.service}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune hospitalisation</p>
          )}
        </div>
      </div>

      <div className="medical-card">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
          <Pill className="w-4 h-4 text-success" /> Traitements en cours
        </h3>
        <div className="space-y-2">
          {activeOrdonnances.flatMap((o) => o.medicaments).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun traitement en cours</p>
          ) : (
            activeOrdonnances.flatMap((o) => o.medicaments).map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded bg-success/10 text-success flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {m.nom} {m.dosage} — {m.forme}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {m.posologie} · {m.duree}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {patient.allergies.length > 0 && (
        <div className="medical-card border-destructive/20 bg-destructive/5">
          <h3 className="font-semibold text-destructive flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" /> Allergies et contre-indications
          </h3>
          <div className="flex flex-wrap gap-2">
            {patient.allergies.map((a) => (
              <span key={a} className="badge-status badge-urgent text-sm px-3 py-1">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="medical-card">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-primary" /> Chronologie des événements
        </h3>
        <div className="relative pl-8 space-y-6">
          <div className="timeline-line" />
          {/* Timeline content is rendered by the parent component */}
          <p className="text-sm text-muted-foreground">Consulter les onglets pour voir plus de détails.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientRecordOverview;
