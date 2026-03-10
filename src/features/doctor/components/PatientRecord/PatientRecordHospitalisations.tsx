import React from 'react';
import type { HospitalisationRecord } from '@shared/types/patient-record.types';
import { Eye } from 'lucide-react';

interface PatientRecordHospitalisationsProps {
  hospitalisations: HospitalisationRecord[];
  selectedId: string | null;
  // eslint-disable-next-line no-unused-vars
  onSelect: (_id: string | null) => void;
}

const PatientRecordHospitalisations: React.FC<PatientRecordHospitalisationsProps> = ({
  hospitalisations,
  selectedId,
  onSelect,
}) => {
  const selected = hospitalisations.find((h) => h.id === selectedId);

  if (selected) {
    return (
      <div>
        <button
          onClick={() => onSelect(null)}
          className="text-sm text-primary font-medium mb-4 flex items-center gap-1 hover:underline"
        >
          ← Retour à la liste
        </button>
        <div className="medical-card space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">Détail de l'hospitalisation</h3>
            <p className="text-sm text-muted-foreground">
              {selected.hopital} — {selected.service}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Admission', value: selected.dateAdmission },
              { label: 'Sortie', value: selected.dateSortie ?? 'En cours' },
              { label: 'Durée', value: selected.duree },
              { label: 'Chambre', value: selected.chambre },
            ].map((info) => (
              <div key={info.label} className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{info.label}</p>
                <p className="text-sm font-medium text-foreground">{info.value}</p>
              </div>
            ))}
          </div>

          {[
            { label: "Motif d'admission", content: selected.motif },
            { label: 'Diagnostic final', content: selected.diagnosticFinal },
            { label: 'Traitement de sortie', content: selected.traitementSortie },
            { label: 'Bilan à réaliser', content: selected.bilanARealiser },
            { label: 'Prochain rendez-vous', content: selected.prochainRdv },
          ].map((section) => (
            <div key={section.label}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {section.label}
              </h4>
              <p className="text-sm text-foreground">{section.content}</p>
            </div>
          ))}

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Médecins
            </h4>
            <div className="flex flex-wrap gap-2">
              {selected.medecins.map((m) => (
                <span key={m} className="badge-status bg-primary/10 text-primary">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-2">Historique des hospitalisations</h3>
      {hospitalisations.map((h) => (
        <div key={h.id} className="medical-card">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-foreground">{h.motif}</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {h.dateAdmission} → {h.dateSortie ?? 'En cours'} · {h.duree}
              </p>
              <p className="text-sm text-foreground mt-1">
                {h.hopital} — {h.service} — Chambre {h.chambre}
              </p>
              <p className="text-sm text-foreground">
                <strong>Diagnostic:</strong> {h.diagnosticFinal}
              </p>
            </div>
            <button
              onClick={() => onSelect(h.id)}
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
            >
              <Eye className="w-3.5 h-3.5" /> Détails
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientRecordHospitalisations;
