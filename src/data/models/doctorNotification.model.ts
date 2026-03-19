export interface DoctorNotification {
    id: string;
    doctorId: string;
    patientId: string;
    patientName: string;
    message: string;
    sentAt: string;
    read: boolean;
}