export type PatientStatus = 'active' | 'pending' | 'suspended';
export type Gender = 'male' | 'female' | 'other';
export type MetricType =
    | 'blood_pressure'
    | 'heart_rate'
    | 'glucose'
    | 'weight'
    | 'steps'
    | 'sleep'
    | 'oxygen_saturation';

export interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: Gender;
    hospitalId: string;
    doctorId: string;
    status: PatientStatus;
    conditions: string[];
    lastActivity: string;
    createdAt: string;
}

export interface HealthMetric {
    id: string;
    patientId: string;
    type: MetricType;
    value: number;
    unit: string;
    recordedAt: string;
    note?: string;
}

export interface MetricThreshold {
    type: MetricType;
    min?: number;
    max?: number;
    unit: string;
    label: string;
}

export interface PatientFilters {
    search?: string;
    status?: PatientStatus | 'all';
    doctorId?: string;
    hospitalId?: string;
    page?: number;
    pageSize?: number;
}

export interface PatientStats {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    newThisMonth: number;
}