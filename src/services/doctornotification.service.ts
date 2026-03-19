import { delay, MOCK_DOCTOR_NOTIFICATIONS } from '../data/mocks/mock-data';
import {DoctorNotification} from "@/data/models/doctorNotification.model.ts";

let store: DoctorNotification[] = [...MOCK_DOCTOR_NOTIFICATIONS];

class DoctorNotificationService {
    async sendToPatient(doctorId: string, patientId: string, patientName: string, message: string): Promise<DoctorNotification> {
        await delay(400);
        const notif: DoctorNotification = {
            id: `dn_${Date.now()}`,
            doctorId,
            patientId,
            patientName,
            message,
            sentAt: new Date().toISOString(),
            read: false,
        };
        store = [notif, ...store];
        return { ...notif };
    }

    async getSent(doctorId: string): Promise<DoctorNotification[]> {
        await delay(300);
        return store
            .filter((n) => n.doctorId === doctorId)
            .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    }
}

export const doctorNotificationService = new DoctorNotificationService();