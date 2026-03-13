import type { PrescriptionData } from '../types/prescription.types';
import { MOCK_PRESCRIPTIONS, getPrescriptionsForPatient } from '@shared/data/mock-data';

export const prescriptionService = {
  getPrescriptions: async (patientId: string): Promise<PrescriptionData[]> => {
    await new Promise((r) => setTimeout(r, 400));
    if (patientId) return getPrescriptionsForPatient(patientId);
    return MOCK_PRESCRIPTIONS;
  },

  getPrescriptionById: async (id: string): Promise<PrescriptionData | undefined> => {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_PRESCRIPTIONS.find((p) => p.id === id);
  },
};
