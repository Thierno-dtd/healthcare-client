import {
    delay,
    MOCK_MEASUREMENTS,
    MOCK_FREQUENCIES,
    MOCK_MEDICATION_INTAKES,
} from '../data/mocks/mock-data';
import { MOCK_PATIENTS } from '../data/mocks/mock-data';
import {Measurement} from "@/data/models/measurement.model.ts";
import {MeasurementFrequency} from "@/data/models/measurementFrequency.model.ts";
import {ComplianceStatus, PatientCompliance} from "@/data/models/patientCompliance.model.ts";

let measureStore: Measurement[] = [...MOCK_MEASUREMENTS];
let freqStore: MeasurementFrequency[] = [...MOCK_FREQUENCIES];

function getISOWeek(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function currentWeek(): number {
    return getISOWeek(new Date());
}

class MeasurementService {
    async getMeasurements(patientId: string, days = 14): Promise<Measurement[]> {
        await delay(350);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return measureStore
            .filter((m) => m.patientId === patientId && new Date(m.recordedAt) >= cutoff)
            .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    }

    async getRecentMeasurements(patientId: string, limit = 10): Promise<Measurement[]> {
        await delay(300);
        return measureStore
            .filter((m) => m.patientId === patientId)
            .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
            .slice(0, limit);
    }

    async getFrequency(patientId: string): Promise<MeasurementFrequency | null> {
        await delay(150);
        return freqStore.find((f) => f.patientId === patientId) ?? null;
    }

    async setFrequency(patientId: string, doctorId: string, timesPerWeek: number): Promise<MeasurementFrequency> {
        await delay(300);
        const idx = freqStore.findIndex((f) => f.patientId === patientId);
        const freq: MeasurementFrequency = { patientId, timesPerWeek, doctorId, updatedAt: new Date().toISOString() };
        if (idx === -1) freqStore.push(freq);
        else freqStore[idx] = freq;
        return { ...freq };
    }

    async getWeeklyCompliance(patientId: string, weekOffset = 0): Promise<{ measured: number; required: number; percent: number }> {
        await delay(250);
        const week = currentWeek() - weekOffset;
        const freq = freqStore.find((f) => f.patientId === patientId);
        const required = freq?.timesPerWeek ?? 3;
        const measured = measureStore.filter((m) => m.patientId === patientId && m.week === week).length;
        return { measured, required, percent: Math.min(100, Math.round((measured / required) * 100)) };
    }

    async getDoctorPatientCompliance(doctorId: string): Promise<PatientCompliance[]> {
        await delay(500);
        const week = currentWeek();

        // Get patients for this doctor (simulated)
        const doctorPatients = MOCK_PATIENTS.filter((p) => p.doctorId === 'd_001' && p.status === 'active');

        return doctorPatients.map((patient) => {
            const freq = freqStore.find((f) => f.patientId === patient.id);
            const required = freq?.timesPerWeek ?? 3;

            const weekMeasurements = measureStore.filter((m) => m.patientId === patient.id && m.week === week);
            const measured = weekMeasurements.length;
            const weekCompliance = Math.min(100, Math.round((measured / required) * 100));

            const intakes = MOCK_MEDICATION_INTAKES.filter((i) => i.patientId === patient.id);
            const taken = intakes.filter((i) => !i.missed).length;
            const medicationAdherence = intakes.length ? Math.round((taken / intakes.length) * 100) : 100;

            const missed = Math.max(0, required - measured);
            const criticalAlerts = measureStore.filter((m) =>
                m.patientId === patient.id && m.week === week &&
                ((m.type === 'blood_pressure' && m.value > 180) ||
                    (m.type === 'glucose' && m.value > 10) ||
                    (m.type === 'heart_rate' && m.value > 110))
            ).length;

            let status: ComplianceStatus = 'compliant';
            if (criticalAlerts > 0) status = 'critical';
            else if (weekCompliance === 0) status = 'non_compliant';
            else if (weekCompliance < 70) status = 'partial';

            const patientType = patient.conditions.includes('hypertension') && patient.conditions.includes('diabète')
                ? 'both'
                : patient.conditions.includes('hypertension') ? 'hypertension' : 'diabetes';

            return {
                patientId: patient.id,
                patientName: patient.name,
                patientType,
                weekCompliance,
                medicationAdherence,
                status,
                missedMeasurements: missed,
                totalRequired: required,
                lastActivity: patient.lastActivity,
                criticalAlerts,
            } as PatientCompliance;
        });
    }

    async getWeeklyTrend(patientId: string, weeks = 4): Promise<Array<{ week: number; measured: number; required: number }>> {
        await delay(300);
        const curWeek = currentWeek();
        const freq = freqStore.find((f) => f.patientId === patientId);
        const required = freq?.timesPerWeek ?? 3;

        return Array.from({ length: weeks }, (_, i) => {
            const w = curWeek - (weeks - 1 - i);
            const measured = measureStore.filter((m) => m.patientId === patientId && m.week === w).length;
            return { week: w, measured, required };
        });
    }
}

export const measurementService = new MeasurementService();