import {PatientType} from "@/data/models/patienRequest.model.ts";

export type ComplianceStatus = 'compliant' | 'partial' | 'non_compliant' | 'critical';

export interface PatientCompliance {
    patientId: string;
    patientName: string;
    patientType: PatientType;
    weekCompliance: number; // 0-100
    medicationAdherence: number; // 0-100
    status: ComplianceStatus;
    missedMeasurements: number;
    totalRequired: number;
    lastActivity?: string;
    criticalAlerts: number;
}