import React from 'react';
import { MOCK_HISTORIQUE } from '../services/dossiersPatients.mock';
import { formatDate } from '../services/dossiersPatients.utils';

const HistoryView: React.FC = () => {
  return (
    <div className="medical-card">
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-history text-amber" />
        <h3 className="text-lg font-semibold text-foreground">Historique des accès</h3>
        <span className="badge-status badge-amber ml-auto">{MOCK_HISTORIQUE.length} entrées</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {['Patient', 'Action', 'Détails', 'Date'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_HISTORIQUE.map((entry) => (
              <tr key={entry.id} className="border-b border-border">
                <td className="px-5 py-3 text-sm font-semibold text-foreground">{entry.patientNom}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{entry.action}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{entry.details}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{formatDate(entry.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryView;
