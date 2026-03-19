export interface Medication {
    id: string;
    prescriptionId: string;
    name: string;
    dosage: string;
    intakeTimes: string[]; // e.g. ['08:00', '20:00']
    renewalDays: number;
    startDate: string;
    endDate: string;
}