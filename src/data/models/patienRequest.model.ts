export type RequestStatus = 'pending' | 'approved' | 'rejected';

export type PatientType = 'hypertension' | 'diabetes' | 'both';

export interface PatientRequest {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
    patientType: PatientType;
    hospitalId: string;
    hospitalName: string;
    doctorId: string;
    healthRecordImageUrl: string;
    receiptImageUrl: string;
    status: RequestStatus;
    rejectionMessage?: string;
    submittedAt: string;
    reviewedAt?: string;
}