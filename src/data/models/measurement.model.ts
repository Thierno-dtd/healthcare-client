export type MeasurementTakenBy = 'self' | 'family' | 'healthcare' | 'other';

export interface Measurement {
    id: string;
    patientId: string;
    type: 'blood_pressure' | 'heart_rate' | 'glucose' | 'weight';
    value: number;
    value2?: number; // for blood pressure: diastolic
    unit: string;
    feeling?: string; // how do you feel?
    takenBy: MeasurementTakenBy;
    takenByName?: string;
    takenBySurname?: string;
    takenByAge?: number;
    recordedAt: string;
    week: number; // ISO week number
}