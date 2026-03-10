import React from 'react';
import type { AnalyseRecord } from '@shared/types/patient-record.types';
import { FileSearch, Download } from 'lucide-react';

interface PatientRecordAnalysesProps {
  analyses: AnalyseRecord[];
}

const PatientRecordAnalyses: React.FC<PatientRecordAnalysesProps> = ({ analyses }) => {
  if (!analyses.length) {
    return (
      <div className="medical-card">
        <p className="text-sm text-muted-foreground">Aucune analyse disponible pour ce patient.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {analyses.map((analyse) => (
        <div key={analyse.id} className="medical-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-base font-semibold text-foreground">{analyse.type}</h4>
              <p className="text-sm text-muted-foreground">{analyse.date}</p>
              <p className="text-sm text-foreground mt-2">{analyse.resultats}</p>
            </div>
            <div className="flex items-center gap-2">
              {analyse.documentUrl && (
                <a
                  href={analyse.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <FileSearch className="w-4 h-4" /> Voir
                </a>
              )}
              {analyse.downloadUrl && (
                <a
                  href={analyse.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Download className="w-4 h-4" /> Télécharger
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientRecordAnalyses;
