import React from 'react';
import type { OrdonnanceRecord } from '@shared/types/patient-record.types';
import { FileText } from 'lucide-react';

interface PatientRecordOrdonnancesProps {
  ordonnances: OrdonnanceRecord[];
}

const PatientRecordOrdonnances: React.FC<PatientRecordOrdonnancesProps> = ({ ordonnances }) => {
  if (!ordonnances.length) {
    return (
      <div className="medical-card">
        <p className="text-sm text-muted-foreground">Aucune ordonnance disponible pour ce patient.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ordonnances.map((ordonnance) => (
        <div key={ordonnance.id} className="medical-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-base font-semibold text-foreground">Ordonnance du {ordonnance.date}</h4>
              <p className="text-sm text-muted-foreground">Médecin : {ordonnance.medecin}</p>
              <p className="text-sm text-foreground mt-2">{ordonnance.instructions ?? 'Aucune note disponible.'}</p>
            </div>
            {ordonnance.documentUrl && (
              <a
                href={ordonnance.documentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <FileText className="w-4 h-4" /> Voir
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientRecordOrdonnances;
