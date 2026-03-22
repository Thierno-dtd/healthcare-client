import {
    MOCK_MEASUREMENTS,
    MOCK_MEDICATION_INTAKES,
    MOCK_PRESCRIPTIONS,
    MOCK_PATIENTS,
    MOCK_FREQUENCIES,
    MOCK_ALERTS,
    delay,
} from '../data/mocks/mock-data';
import type { Measurement } from '../data/models/measurement.model';
import type { MedicationIntake } from '../data/models/measurementIntake.model';
import type { Alert } from '../data/models';

export type ActivityType = 'measurement' | 'medication' | 'alert';

export interface ActivityEntry {
    id: string;
    type: ActivityType;
    patientId: string;
    patientName: string;
    timestamp: string;
    // measurement fields
    measurement?: Measurement;
    // medication fields
    intake?: MedicationIntake & { medicationName?: string; dosage?: string; prescriptionRef?: string };
    // alert fields
    alert?: Alert;
    isNew?: boolean;
}

export interface WeeklyStats {
    measurementsDone: number;
    measurementsExpected: number;
    medicationsTaken: number;
    medicationsExpected: number;
    patientStats: Array<{
        patientId: string;
        patientName: string;
        measurementsDone: number;
        measurementsExpected: number;
        medicationsTaken: number;
        medicationsExpected: number;
        missedMeasurements: number;
        missedMedications: number;
    }>;
}

function getISOWeek(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

const currentWeek = getISOWeek(new Date());

class ActivityService {
    private measureStore: Measurement[] = [...MOCK_MEASUREMENTS];
    private intakeStore: MedicationIntake[] = [...MOCK_MEDICATION_INTAKES];

    // Build a flat, merged activity feed sorted by timestamp desc
    async getActivityFeed(doctorId: string = 'd_001', limit = 50): Promise<ActivityEntry[]> {
        await delay(300);

        const doctorPatients = MOCK_PATIENTS.filter(p => p.doctorId === doctorId);
        const patientIds = new Set(doctorPatients.map(p => p.id));

        const entries: ActivityEntry[] = [];

        // Measurement entries
        for (const m of this.measureStore) {
            if (!patientIds.has(m.patientId)) continue;
            const patient = doctorPatients.find(p => p.id === m.patientId);
            if (!patient) continue;
            entries.push({
                id: `measure-${m.id}`,
                type: 'measurement',
                patientId: m.patientId,
                patientName: patient.name,
                timestamp: m.recordedAt,
                measurement: m,
            });
        }

        // Medication intake entries
        for (const intake of this.intakeStore) {
            if (!patientIds.has(intake.patientId)) continue;
            const patient = doctorPatients.find(p => p.id === intake.patientId);
            if (!patient) continue;

            // Find medication info
            let medicationName = 'Médicament';
            let dosage = '';
            let prescriptionRef = '';
            for (const presc of MOCK_PRESCRIPTIONS) {
                if (presc.patientId !== intake.patientId) continue;
                for (const med of presc.medications) {
                    if (med.id === intake.medicationId) {
                        medicationName = med.name;
                        dosage = med.dosage;
                        prescriptionRef = presc.referenceNumber;
                    }
                }
            }

            const ts = intake.takenAt ?? `${intake.date}T${intake.scheduledTime}:00Z`;
            entries.push({
                id: `intake-${intake.id}`,
                type: 'medication',
                patientId: intake.patientId,
                patientName: patient.name,
                timestamp: ts,
                intake: { ...intake, medicationName, dosage, prescriptionRef },
            });
        }

        // Alert entries (active/unresolved)
        for (const alert of MOCK_ALERTS) {
            if (!patientIds.has(alert.patientId)) continue;
            if (alert.isResolved) continue;
            entries.push({
                id: `alert-${alert.id}`,
                type: 'alert',
                patientId: alert.patientId,
                patientName: alert.patientName,
                timestamp: alert.createdAt,
                alert,
            });
        }

        // Sort desc by timestamp
        entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return entries.slice(0, limit);
    }

    // Simulate a new real-time activity (called from polling)
    async getLatestActivity(doctorId: string = 'd_001', since: string): Promise<ActivityEntry[]> {
        await delay(100);
        const all = await this.getActivityFeed(doctorId, 100);
        return all.filter(e => new Date(e.timestamp) > new Date(since)).map(e => ({ ...e, isNew: true }));
    }

    async getWeeklyStats(doctorId: string = 'd_001'): Promise<WeeklyStats> {
        await delay(200);

        const doctorPatients = MOCK_PATIENTS.filter(p => p.doctorId === doctorId && p.status === 'active');

        let totalMeasDone = 0;
        let totalMeasExpected = 0;
        let totalMedTaken = 0;
        let totalMedExpected = 0;

        const patientStats = doctorPatients.map(patient => {
            const freq = MOCK_FREQUENCIES.find(f => f.patientId === patient.id);
            const measExpected = freq?.timesPerWeek ?? 3;
            const measDone = this.measureStore.filter(m => m.patientId === patient.id && m.week === currentWeek).length;

            const patientIntakes = this.intakeStore.filter(i => i.patientId === patient.id);
            const medExpected = patientIntakes.length;
            const medTaken = patientIntakes.filter(i => !i.missed).length;

            totalMeasDone += measDone;
            totalMeasExpected += measExpected;
            totalMedTaken += medTaken;
            totalMedExpected += medExpected;

            return {
                patientId: patient.id,
                patientName: patient.name,
                measurementsDone: measDone,
                measurementsExpected: measExpected,
                medicationsTaken: medTaken,
                medicationsExpected: medExpected,
                missedMeasurements: Math.max(0, measExpected - measDone),
                missedMedications: Math.max(0, medExpected - medTaken),
            };
        });

        return {
            measurementsDone: totalMeasDone,
            measurementsExpected: totalMeasExpected,
            medicationsTaken: totalMedTaken,
            medicationsExpected: totalMedExpected,
            patientStats,
        };
    }

    // Inject a simulated real-time measurement
    injectFakeActivity(patientId: string): void {
        const types: Measurement['type'][] = ['blood_pressure', 'heart_rate', 'glucose'];
        const type = types[Math.floor(Math.random() * types.length)];
        const values: Record<string, { value: number; unit: string }> = {
            blood_pressure: { value: 130 + Math.floor(Math.random() * 40), unit: 'mmHg' },
            heart_rate: { value: 65 + Math.floor(Math.random() * 40), unit: 'bpm' },
            glucose: { value: parseFloat((6 + Math.random() * 4).toFixed(1)), unit: 'mmol/L' },
        };
        const { value, unit } = values[type];
        const newMeasure: Measurement = {
            id: `ms_live_${Date.now()}`,
            patientId,
            type,
            value,
            unit,
            takenBy: 'self',
            recordedAt: new Date().toISOString(),
            week: currentWeek,
        };
        this.measureStore.unshift(newMeasure);
    }
}

export const activityService = new ActivityService();