import {delay, MOCK_HOSPITALS} from '@/data/mocks/mock-data';
import {Hospital, HospitalFilters} from "@/data/models/hospital.model.ts";

let hospitalsStore: Hospital[] = [...MOCK_HOSPITALS];

class HospitalService {
    async getHospitals(filters: HospitalFilters = {}): Promise<Hospital[]> {
        await delay(400);
        let result = [...hospitalsStore];

        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(
                (h) =>
                    h.name.toLowerCase().includes(q) ||
                    h.city.toLowerCase().includes(q) ||
                    h.email.toLowerCase().includes(q)
            );
        }
        if (filters.status && filters.status !== 'all') {
            result = result.filter((h) => h.status === filters.status);
        }
        if (filters.city) {
            result = result.filter((h) => h.city.toLowerCase() === filters.city!.toLowerCase());
        }
        return result;
    }

    async getHospitalById(id: string): Promise<Hospital> {
        await delay(300);
        const h = hospitalsStore.find((h) => h.id === id);
        if (!h) throw new Error('Hospital not found');
        return { ...h };
    }

    async createHospital(data: Omit<Hospital, 'id' | 'createdAt' | 'doctorCount' | 'patientCount'>): Promise<Hospital> {
        await delay(500);
        const newH: Hospital = {
            ...data,
            id: `h_${Date.now()}`,
            doctorCount: 0,
            patientCount: 0,
            createdAt: new Date().toISOString(),
        };
        hospitalsStore = [newH, ...hospitalsStore];
        return { ...newH };
    }

    async updateHospital(id: string, updates: Partial<Hospital>): Promise<Hospital> {
        await delay(400);
        const idx = hospitalsStore.findIndex((h) => h.id === id);
        if (idx === -1) throw new Error('Hospital not found');
        hospitalsStore[idx] = { ...hospitalsStore[idx], ...updates };
        return { ...hospitalsStore[idx] };
    }

    async deleteHospital(id: string): Promise<void> {
        await delay(400);
        hospitalsStore = hospitalsStore.filter((h) => h.id !== id);
    }

    async getGlobalStats() {
        await delay(300);
        return {
            total: hospitalsStore.length,
            active: hospitalsStore.filter((h) => h.status === 'active').length,
            totalDoctors: hospitalsStore.reduce((s, h) => s + h.doctorCount, 0),
            totalPatients: hospitalsStore.reduce((s, h) => s + h.patientCount, 0),
        };
    }
}

export const hospitalService = new HospitalService();
