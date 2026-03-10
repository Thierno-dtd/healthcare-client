import React from 'react';
import type { ConsultationRecord } from '@shared/types/patient-record.types';
import { Eye } from 'lucide-react';

interface PatientRecordConsultationsProps {
  consultations: ConsultationRecord[];
  selectedId: string | null;
  // eslint-disable-next-line no-unused-vars
  onSelect: (_id: string | null) => void;
}

const PatientRecordConsultations: React.FC<PatientRecordConsultationsProps> = ({
  consultations,
  selectedId,
  onSelect,
}) => {
  const selected = consultations.find((c) => c.id === selectedId);

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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Fiche Médecin — Consultation</h3>
              <p className="text-sm text-muted-foreground">
                {selected.date} à {selected.heure} · {selected.hopital} · {selected.medecin}
              </p>
            </div>
            <span
              className={`badge-status ${
                selected.typeArrivee === 'Urgence' ? 'badge-urgent' : 'badge-active'
              }`}
            >
              {selected.typeArrivee}
            </span>
          </div>

          {[
            { label: 'Motif de consultation', content: selected.motif },
            { label: 'Histoire de la maladie', content: selected.histoireMaladie },
            { label: 'Examen clinique', content: selected.examenClinique },
            { label: 'Résumé syndromique', content: selected.resumeSyndromique },
            { label: 'Diagnostic retenu', content: selected.diagnostic },
            { label: 'Conduite à tenir', content: selected.conduiteATenir },
            { label: 'Évolution', content: selected.evolution },
          ].map((section) => (
            <div key={section.label}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {section.label}
              </h4>
              <p className="text-sm text-foreground">{section.content}</p>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Antécédents personnels
              </h4>
              <ul className="space-y-1">
                {selected.antecedentsPersonnels.map((a) => (
                  <li key={a} className="text-sm text-foreground">• {a}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Antécédents familiaux
              </h4>
              <ul className="space-y-1">
                {selected.antecedentsFamiliaux.map((a) => (
                  <li key={a} className="text-sm text-foreground">• {a}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Hypothèses diagnostiques
            </h4>
            <div className="flex flex-wrap gap-2">
              {selected.hypothesesDiagnostiques.map((h) => (
                <span key={h} className="badge-status bg-primary/10 text-primary">
                  {h}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Examens paracliniques demandés
            </h4>
            <div className="flex flex-wrap gap-2">
              {selected.examensParacliniques.map((e) => (
                <span key={e} className="badge-status bg-info/10 text-info">
                  {e}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Traitements habituels
            </h4>
            <ul className="space-y-1">
              {selected.traitementsHabituels.map((t) => (
                <li key={t} className="text-sm text-foreground">
                  • {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-2">Historique des consultations</h3>
      <div className="medical-card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Hôpital</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Médecin</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Motif</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Diagnostic</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((c) => (
              <tr
                key={c.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-5 py-3 text-sm text-foreground whitespace-nowrap">
                  {c.date} {c.heure}
                </td>
                <td className="px-5 py-3 text-sm text-foreground">{c.hopital}</td>
                <td className="px-5 py-3 text-sm text-foreground">{c.medecin}</td>
                <td className="px-5 py-3 text-sm text-foreground">{c.motif}</td>
                <td className="px-5 py-3 text-sm text-foreground">{c.diagnostic}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => onSelect(c.id)}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" /> Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientRecordConsultations;
