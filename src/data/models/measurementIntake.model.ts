export interface MedicationIntake {
    id: string;
    medicationId: string;
    patientId: string;
    scheduledTime: string;
    takenAt?: string;
    missed: boolean;
    date: string;
}