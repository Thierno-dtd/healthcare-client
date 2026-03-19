import { MOCK_DOCTORS } from '@/data/mocks/mock-data';
import {Doctor, DoctorFilters} from "@/data/models/doctor.model.ts";
import {delay} from "@/data/mocks/mock-data.ts";

let doctorsStore: Doctor[] = [...MOCK_DOCTORS];

class DoctorService {
    async getDoctors(filters: DoctorFilters = {}): Promise<Doctor[]> {
        await delay(400);
        let result = [...doctorsStore];

        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(
                (d) =>
                    d.name.toLowerCase().includes(q) ||
                    d.email.toLowerCase().includes(q) ||
                    d.specialization.toLowerCase().includes(q)
            );
        }
        if (filters.status && filters.status !== 'all') {
            result = result.filter((d) => d.status === filters.status);
        }
        if (filters.hospitalId) {
            result = result.filter((d) => d.hospitalId === filters.hospitalId);
        }
        if (filters.specialization) {
            result = result.filter((d) => d.specialization === filters.specialization);
        }
        return result;
    }

    async getDoctorById(id: string): Promise<Doctor> {
        await delay(300);
        const d = doctorsStore.find((d) => d.id === id);
        if (!d) throw new Error('Doctor not found');
        return { ...d };
    }

    async getDoctorByUserId(userId: string): Promise<Doctor | null> {
        await delay(200);
        return doctorsStore.find((d) => d.userId === userId) ?? null;
    }

    async updateDoctorStatus(id: string, status: Doctor['status']): Promise<Doctor> {
        await delay(300);
        const idx = doctorsStore.findIndex((d) => d.id === id);
        if (idx === -1) throw new Error('Doctor not found');
        doctorsStore[idx] = { ...doctorsStore[idx], status };
        return { ...doctorsStore[idx] };
    }

    async createDoctor(data: Omit<Doctor, 'id' | 'joinedAt' | 'patientCount' | 'alertCount'>): Promise<Doctor> {
        await delay(500);
        const newD: Doctor = {
            ...data,
            id: `d_${Date.now()}`,
            patientCount: 0,
            alertCount: 0,
            joinedAt: new Date().toISOString(),
        };
        doctorsStore = [newD, ...doctorsStore];
        return { ...newD };
    }
}

export const doctorService = new DoctorService();
