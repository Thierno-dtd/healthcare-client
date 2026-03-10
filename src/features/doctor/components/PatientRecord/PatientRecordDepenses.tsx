import React from 'react';
import type { DepenseRecord } from '@shared/types/patient-record.types';

interface PatientRecordDepensesProps {
  depenses: DepenseRecord[];
}

const PatientRecordDepenses: React.FC<PatientRecordDepensesProps> = ({ depenses }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Dépenses</h3>
      <p className="text-sm text-muted-foreground">
        Suivez les dépenses liées aux consultations et examens du patient.
      </p>

      {depenses.length === 0 ? (
        <div className="medical-card">
          <p className="text-sm text-muted-foreground">Aucune dépense enregistrée pour ce patient.</p>
        </div>
      ) : (
        <div className="medical-card p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Catégorie</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Description</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Montant</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Payé par</th>
              </tr>
            </thead>
            <tbody>
              {depenses.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-sm text-foreground whitespace-nowrap">{d.date}</td>
                  <td className="px-5 py-3 text-sm text-foreground">{d.categorie}</td>
                  <td className="px-5 py-3 text-sm text-foreground">{d.description}</td>
                  <td className="px-5 py-3 text-sm text-foreground text-right">{d.montant}</td>
                  <td className="px-5 py-3 text-sm text-foreground">{d.payeur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientRecordDepenses;
