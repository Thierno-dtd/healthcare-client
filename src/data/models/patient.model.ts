export type PatientStatus = 'active' | 'pending' | 'suspended';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    hospitalId: string;
    doctorId: string;
    status: PatientStatus;
    conditions: string[]; // e.g. ["diabetes", "hypertension"]
    lastActivity: string;
    createdAt: string;
}

export interface HealthMetric {
    id: string;
    patientId: string;
    type: 'blood_pressure' | 'heart_rate' | 'glucose' | 'weight' | 'steps' | 'sleep';
    value: number;
    unit: string;
    recordedAt: string;
    note?: string;
}

export interface MetricThreshold {
    type: HealthMetric['type'];
    min?: number;
    max?: number;
}