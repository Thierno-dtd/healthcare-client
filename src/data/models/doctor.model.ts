export type DoctorStatus = 'active' | 'inactive' | 'pending';

export interface Doctor {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    hospitalId: string;
    patientCount: number;
    status: DoctorStatus;
    joinedAt: string;
}