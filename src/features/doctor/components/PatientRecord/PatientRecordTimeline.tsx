import React from 'react';
import type { TimelineEvent } from '@shared/types/patient-record.types';

interface PatientRecordTimelineProps {
  events: TimelineEvent[];
}

const PatientRecordTimeline: React.FC<PatientRecordTimelineProps> = ({ events }) => {
  if (!events.length) {
    return (
      <div className="medical-card">
        <p className="text-sm text-muted-foreground">Aucun évènement à afficher.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="medical-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{event.date}</p>
              <h4 className="text-base font-semibold text-foreground mt-1">{event.title}</h4>
              <p className="text-sm text-foreground mt-2">{event.description}</p>
            </div>
            <span className="badge-status bg-muted/50 text-muted-foreground">{event.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientRecordTimeline;
