import { delay, MOCK_PRESCRIPTIONS, MOCK_MEDICATION_INTAKES } from '../data/mocks/mock-data';
import {Prescription} from "@/data/models/prescription.model.ts";
import {MedicationIntake} from "@/data/models/measurementIntake.model.ts";

let prescStore: Prescription[] = [...MOCK_PRESCRIPTIONS];
let intakeStore: MedicationIntake[] = [...MOCK_MEDICATION_INTAKES];

class PrescriptionService {
    async getPrescriptions(patientId: string): Promise<Prescription[]> {
        await delay(350);
        return prescStore
            .filter((p) => p.patientId === patientId)
            .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
    }

    async getPrescriptionById(id: string): Promise<Prescription> {
        await delay(250);
        const p = prescStore.find((p) => p.id === id);
        if (!p) throw new Error('Prescription not found');
        return { ...p };
    }

    async getIntakeHistory(medicationId: string): Promise<MedicationIntake[]> {
        await delay(300);
        return intakeStore
            .filter((i) => i.medicationId === medicationId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    async getPatientIntakes(patientId: string, days = 7): Promise<MedicationIntake[]> {
        await delay(300);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return intakeStore
            .filter((i) => i.patientId === patientId && new Date(i.date) >= cutoff)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    async getMedicationAdherence(patientId: string): Promise<number> {
        await delay(200);
        const intakes = intakeStore.filter((i) => i.patientId === patientId);
        if (!intakes.length) return 100;
        const taken = intakes.filter((i) => !i.missed).length;
        return Math.round((taken / intakes.length) * 100);
    }
}

export const prescriptionService = new PrescriptionService();