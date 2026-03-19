import type {
    PaginatedResult,
} from '../data/models';
import { MOCK_PATIENTS, MOCK_METRICS, delay } from '../data/mocks/mock-data';
import {Patient, PatientFilters, PatientStats, PatientStatus} from "../data/models/patient.model.ts";

// In-memory mutable store (simulates DB mutations per session)
let patientsStore: Patient[] = [...MOCK_PATIENTS];

class PatientService {
    // ── GET all (paginated + filtered) ────────────────────────
    async getPatients(filters: PatientFilters
                      = {}): Promise<PaginatedResult<Patient>> {
        await delay(400);

        let result = [...patientsStore];

        // Filter by search
        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.email.toLowerCase().includes(q) ||
                    p.conditions.some((c) => c.toLowerCase().includes(q))
            );
        }

        // Filter by status
        if (filters.status && filters.status !== 'all') {
            result = result.filter((p) => p.status === filters.status);
        }

        // Filter by doctor
        if (filters.doctorId) {
            result = result.filter((p) => p.doctorId === filters.doctorId);
        }

        // Filter by hospital
        if (filters.hospitalId) {
            result = result.filter((p) => p.hospitalId === filters.hospitalId);
        }

        // Pagination
        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? 10;
        const total = result.length;
        const totalPages = Math.ceil(total / pageSize);
        const data = result.slice((page - 1) * pageSize, page * pageSize);

        return { data, total, page, pageSize, totalPages };
    }

    // ── GET by ID ──────────────────────────────────────────────
    async getPatientById(id: string): Promise<Patient> {
        await delay(300);
        const patient = patientsStore.find((p) => p.id === id);
        if (!patient) throw new Error(`Patient ${id} introuvable.`);
        return { ...patient };
    }

    // ── GET metrics for a patient ──────────────────────────────
    async getPatientMetrics(
        patientId: string,
        type?: string,
        limit = 7
    ) {
        await delay(350);
        let metrics = MOCK_METRICS.filter((m) => m.patientId === patientId);
        if (type) {
            metrics = metrics.filter((m) => m.type === type);
        }
        // Sort by date desc, return limit
        return metrics
            .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
            .slice(0, limit);
    }

    // ── GET stats ─────────────────────────────────────────────
    async getPatientStats(filters: { doctorId?: string; hospitalId?: string } = {}): Promise<PatientStats> {
        await delay(300);

        let patients = [...patientsStore];
        if (filters.doctorId) patients = patients.filter((p) => p.doctorId === filters.doctorId);
        if (filters.hospitalId) patients = patients.filter((p) => p.hospitalId === filters.hospitalId);

        const now = new Date();
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);

        return {
            total: patients.length,
            active: patients.filter((p) => p.status === 'active').length,
            pending: patients.filter((p) => p.status === 'pending').length,
            suspended: patients.filter((p) => p.status === 'suspended').length,
            newThisMonth: patients.filter((p) => new Date(p.createdAt) >= monthAgo).length,
        };
    }

    // ── CREATE ─────────────────────────────────────────────────
    async createPatient(data: Omit<Patient, 'id' | 'createdAt' | 'lastActivity'>): Promise<Patient> {
        await delay(500);

        const newPatient: Patient = {
            ...data,
            id: `p_${Date.now()}`,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
        };

        patientsStore = [newPatient, ...patientsStore];
        return { ...newPatient };
    }

    // ── UPDATE ─────────────────────────────────────────────────
    async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
        await delay(400);

        const index = patientsStore.findIndex((p) => p.id === id);
        if (index === -1) throw new Error(`Patient ${id} introuvable.`);

        patientsStore[index] = { ...patientsStore[index], ...updates };
        return { ...patientsStore[index] };
    }

    // ── UPDATE STATUS (validate / suspend) ────────────────────
    async updatePatientStatus(id: string, status: PatientStatus): Promise<Patient> {
        return this.updatePatient(id, { status });
    }

    // ── DELETE ─────────────────────────────────────────────────
    async deletePatient(id: string): Promise<void> {
        await delay(400);
        const exists = patientsStore.some((p) => p.id === id);
        if (!exists) throw new Error(`Patient ${id} introuvable.`);
        patientsStore = patientsStore.filter((p) => p.id !== id);
    }

    // ── RESET store (for testing) ─────────────────────────────
    _resetStore() {
        patientsStore = [...MOCK_PATIENTS];
    }
}

export const patientService = new PatientService();