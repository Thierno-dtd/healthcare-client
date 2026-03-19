import {Medication} from "@/data/models/medication.model.ts";

export interface Prescription {
    id: string;
    patientId: string;
    referenceNumber: string;
    imageUrl: string;
    issuedAt: string;
    expiresAt: string;
    doctorId: string;
    medications: Medication[];
}