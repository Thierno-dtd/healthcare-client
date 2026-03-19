import React from 'react';
import {PATIENT_STATUS_CONFIG} from "@core/utils";
import {PatientStatus} from "@/data/models/patient.model.ts";

interface StatusBadgeProps {
    status: PatientStatus;
}
export const PatientStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const cfg = PATIENT_STATUS_CONFIG[status];
    return (
        <span className={`badge ${cfg.className}`}>
      {cfg.label}
    </span>
    );
};