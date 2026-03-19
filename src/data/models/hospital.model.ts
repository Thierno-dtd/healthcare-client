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
    status: 'active' | 'inactive';
    createdAt: string;
}