import React, { useState } from 'react';
import type { PatientDossier } from '../types/dossiersPatients.types';
import { C } from '../services/dossiersPatients.constants';
import { getAccesBadge, formatDate, getStatusStyle } from '../services/dossiersPatients.utils';

interface PatientGridProps {
  patients: PatientDossier[];
  // eslint-disable-next-line no-unused-vars
  onSelect: (_patient: PatientDossier) => void;
}

const PatientGrid: React.FC<PatientGridProps> = ({ patients, onSelect }) => {
  const [cardHover, setCardHover] = useState<string | null>(null);

  return (
    <div className="content-grid">
      {patients.map((patient) => {
        const acces = getAccesBadge(patient.typeAcces);
        const isHovered = cardHover === patient.id;

        return (
          <div
            key={patient.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(patient)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect(patient);
            }}
            onMouseEnter={() => setCardHover(patient.id)}
            onMouseLeave={() => setCardHover(null)}
            className={`content-card-app cursor-pointer transition ${isHovered ? 'shadow-lg' : ''}`}
            style={{ borderColor: isHovered ? C.blue : C.gray200 }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-4">
                <div
                  className="user-avatar"
                  style={{
                    background: `linear-gradient(135deg, ${C.blue}20, ${C.blue}40)`,
                    color: C.blue,
                  }}
                >
                  {patient.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">
                    {patient.prenom} {patient.nom}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {patient.age} ans • {patient.groupeSanguin}
                  </div>
                </div>
              </div>
              <span className="badge" style={{ ...getStatusStyle(patient.status), padding: '4px 10px' }}>
                {patient.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge" style={{ background: acces.bg, color: acces.color }}>
                <i className={acces.icon} style={{ marginRight: 5, fontSize: 11 }} />
                {acces.label}
              </span>
              <span className="badge badge-info">{patient.specialite}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
              <div>
                <i className="fas fa-calendar mr-1" /> Dernier examen : {formatDate(patient.dernierExamen)}
              </div>
              <i className="fas fa-chevron-right" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PatientGrid;
