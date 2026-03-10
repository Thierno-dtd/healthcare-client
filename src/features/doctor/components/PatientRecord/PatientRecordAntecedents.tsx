import React from 'react';
import type { PatientRecord } from '@shared/types/patient-record.types';

interface PatientRecordAntecedentsProps {
  antecedents: PatientRecord['antecedents'];
}

const PatientRecordAntecedents: React.FC<PatientRecordAntecedentsProps> = ({ antecedents }) => {
  if (!antecedents.length) {
    return (
      <div className="medical-card">
        <p className="text-sm text-muted-foreground">Aucun antécédent enregistré.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {antecedents.map((item) => (
        <div key={item.id} className="medical-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-base font-semibold text-foreground">{item.titre}</h4>
              <p className="text-sm text-muted-foreground">{item.date}</p>
              <p className="text-sm text-foreground mt-2">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientRecordAntecedents;
