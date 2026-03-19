import {PatientRequest, RequestStatus} from "@/data/models/patienRequest.model.ts";
import {delay, MOCK_PATIENT_REQUESTS} from "@/data/mocks/mock-data.tsx";

let store: PatientRequest[] = [...MOCK_PATIENT_REQUESTS];

class PatientrequestService {
    async getRequests(doctorId: string, status?: RequestStatus): Promise<PatientRequest[]> {
        await delay(400);
        let result = store.filter((r) => r.doctorId === doctorId);
        if (status) result = result.filter((r) => r.status === status);
        return result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }

    async approveRequest(id: string): Promise<PatientRequest> {
        await delay(500);
        const idx = store.findIndex((r) => r.id === id);
        if (idx === -1) throw new Error('Request not found');
        store[idx] = { ...store[idx], status: 'approved', reviewedAt: new Date().toISOString() };
        return { ...store[idx] };
    }

    async rejectRequest(id: string, message: string): Promise<PatientRequest> {
        await delay(500);
        if (!message.trim()) throw new Error('Rejection message required');
        const idx = store.findIndex((r) => r.id === id);
        if (idx === -1) throw new Error('Request not found');
        store[idx] = { ...store[idx], status: 'rejected', rejectionMessage: message, reviewedAt: new Date().toISOString() };
        return { ...store[idx] };
    }

    async getPendingCount(doctorId: string): Promise<number> {
        await delay(150);
        return store.filter((r) => r.doctorId === doctorId && r.status === 'pending').length;
    }
}

export const patientRequestService = new PatientrequestService();