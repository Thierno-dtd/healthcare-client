export type HospitalStatus = 'active' | 'inactive';

export interface Hospital {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    managerId: string;
    doctorCount: number;
    patientCount: number;
    coordinates: { lat: number; lng: number };
    status: HospitalStatus;
    createdAt: string;
}

export interface HospitalFilters {
    search?: string;
    status?: HospitalStatus | 'all';
    city?: string;
}