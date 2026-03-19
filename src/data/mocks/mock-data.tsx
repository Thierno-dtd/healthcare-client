
import type {
    Alert
} from '../models';
import {User, UserRole} from "@/data/models/user.model.ts";
import {Hospital} from "@/data/models/hospital.model.ts";
import {Doctor} from "@/data/models/doctor.model.ts";
import {HealthMetric, Patient} from "@/data/models/patient.model.ts";
import {Message, Notification} from "@/data/models/notification.model.ts";
import {HealthContent} from "@/data/models/healthContent.model.ts";
import {PatientRequest} from "@/data/models/patienRequest.model.ts";
import {Prescription} from "@/data/models/prescription.model.ts";
import {Measurement} from "@/data/models/measurement.model.ts";
import {MedicationIntake} from "@/data/models/measurementIntake.model.ts";
import {MeasurementFrequency} from "@/data/models/measurementFrequency.model.ts";
import {DoctorNotification} from "@/data/models/doctorNotification.model.ts";

// ─── Delay helper ────────────────────────────────────────────
export const delay = (ms = 350): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

// ─── Users ──────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
    {
        id: 'u_001',
        email: 'dr.martin@clinic.com',
        name: 'Dr. Martin Dupont',
        role: 'doctor',
        avatar: 'MD',
        hospitalId: 'h_001',
        createdAt: '2024-01-10',
    },
    {
        id: 'u_002',
        email: 'manager@hopital-central.com',
        name: 'Sophie Bernard',
        role: 'hospital_manager',
        avatar: 'SB',
        hospitalId: 'h_001',
        createdAt: '2023-09-15',
    },
    {
        id: 'u_003',
        email: 'admin@healthplatform.com',
        name: 'Admin Système',
        role: 'admin',
        avatar: 'AS',
        createdAt: '2023-01-01',
    },
    {
        id: 'u_004',
        email: 'dr.moreau@clinic.com',
        name: 'Dr. Claire Moreau',
        role: 'doctor',
        avatar: 'CM',
        hospitalId: 'h_001',
        createdAt: '2023-06-20',
    },
    {
        id: 'u_005',
        email: 'dr.leclerc@clinic.com',
        name: 'Dr. Paul Leclerc',
        role: 'doctor',
        avatar: 'PL',
        hospitalId: 'h_002',
        createdAt: '2023-03-15',
    },
];

// ─── Demo credentials map ───────────────────────────────────
export const DEMO_CREDENTIALS: Record<string, string> = {
    'dr.martin@clinic.com': 'password123',
    'manager@hopital-central.com': 'password123',
    'admin@healthplatform.com': 'password123',
};

// ─── Hospitals ──────────────────────────────────────────────
export const MOCK_HOSPITALS: Hospital[] = [
    {
        id: 'h_001',
        name: 'Hôpital Central de Paris',
        address: '12 Rue de la Santé',
        city: 'Paris',
        country: 'France',
        phone: '+33 1 42 34 56 78',
        email: 'contact@hopital-central.fr',
        managerId: 'u_002',
        doctorCount: 24,
        patientCount: 312,
        coordinates: { lat: 48.8566, lng: 2.3522 },
        status: 'active',
        createdAt: '2022-03-15',
    },
    {
        id: 'h_002',
        name: 'Clinique Saint-Louis',
        address: '45 Avenue des Fleurs',
        city: 'Lyon',
        country: 'France',
        phone: '+33 4 72 11 23 45',
        email: 'contact@clinique-stlouis.fr',
        managerId: 'u_003',
        doctorCount: 12,
        patientCount: 178,
        coordinates: { lat: 45.764, lng: 4.8357 },
        status: 'active',
        createdAt: '2022-08-20',
    },
    {
        id: 'h_003',
        name: 'Centre Médical Bordeaux',
        address: '8 Cours Victor Hugo',
        city: 'Bordeaux',
        country: 'France',
        phone: '+33 5 56 90 12 34',
        email: 'contact@cm-bordeaux.fr',
        managerId: 'u_003',
        doctorCount: 8,
        patientCount: 95,
        coordinates: { lat: 44.8378, lng: -0.5792 },
        status: 'inactive',
        createdAt: '2023-01-10',
    },
    {
        id: 'h_004',
        name: 'Polyclinique Marseille',
        address: '17 Boulevard Longchamp',
        city: 'Marseille',
        country: 'France',
        phone: '+33 4 91 33 44 55',
        email: 'contact@poly-marseille.fr',
        managerId: 'u_003',
        doctorCount: 15,
        patientCount: 210,
        coordinates: { lat: 43.2965, lng: 5.3698 },
        status: 'active',
        createdAt: '2022-11-05',
    },
];

// ─── Doctors ────────────────────────────────────────────────
export const MOCK_DOCTORS: Doctor[] = [
    {
        id: 'd_001',
        userId: 'u_001',
        name: 'Dr. Martin Dupont',
        email: 'dr.martin@clinic.com',
        phone: '+33 6 11 22 33 44',
        specialization: 'Cardiologie',
        hospitalId: 'h_001',
        patientCount: 45,
        alertCount: 3,
        status: 'active',
        joinedAt: '2024-01-10',
    },
    {
        id: 'd_002',
        userId: 'u_004',
        name: 'Dr. Claire Moreau',
        email: 'dr.moreau@clinic.com',
        phone: '+33 6 55 66 77 88',
        specialization: 'Médecine générale',
        hospitalId: 'h_001',
        patientCount: 38,
        alertCount: 1,
        status: 'active',
        joinedAt: '2023-06-20',
    },
    {
        id: 'd_003',
        userId: 'u_005',
        name: 'Dr. Paul Leclerc',
        email: 'dr.leclerc@clinic.com',
        phone: '+33 6 22 33 44 55',
        specialization: 'Endocrinologie',
        hospitalId: 'h_002',
        patientCount: 52,
        alertCount: 2,
        status: 'active',
        joinedAt: '2023-03-15',
    },
    {
        id: 'd_004',
        userId: 'u_006',
        name: 'Dr. Amélie Petit',
        email: 'dr.petit@clinic.com',
        phone: '+33 6 88 99 00 11',
        specialization: 'Cardiologie',
        hospitalId: 'h_002',
        patientCount: 27,
        alertCount: 0,
        status: 'pending',
        joinedAt: '2024-03-01',
    },
    {
        id: 'd_005',
        userId: 'u_007',
        name: 'Dr. François Blanc',
        email: 'dr.blanc@clinic.com',
        phone: '+33 6 44 55 66 77',
        specialization: 'Neurologie',
        hospitalId: 'h_001',
        patientCount: 31,
        alertCount: 0,
        status: 'active',
        joinedAt: '2022-10-01',
    },
];

// ─── Patients ───────────────────────────────────────────────
export const MOCK_PATIENTS: Patient[] = [
    {
        id: 'p_001',
        name: 'Jean Dubois',
        email: 'jean.dubois@email.com',
        phone: '+33 6 11 11 11 11',
        dateOfBirth: '1968-04-12',
        gender: 'male',
        hospitalId: 'h_001',
        doctorId: 'd_001',
        status: 'active',
        conditions: ['hypertension', 'diabète type 2'],
        lastActivity: '2026-03-17T08:30:00Z',
        createdAt: '2024-02-15',
    },
    {
        id: 'p_002',
        name: 'Marie Fontaine',
        email: 'marie.fontaine@email.com',
        phone: '+33 6 22 22 22 22',
        dateOfBirth: '1975-09-28',
        gender: 'female',
        hospitalId: 'h_001',
        doctorId: 'd_001',
        status: 'active',
        conditions: ['asthme'],
        lastActivity: '2026-03-16T14:00:00Z',
        createdAt: '2024-01-20',
    },
    {
        id: 'p_003',
        name: 'Pierre Martin',
        email: 'pierre.martin@email.com',
        phone: '+33 6 33 33 33 33',
        dateOfBirth: '1952-11-05',
        gender: 'male',
        hospitalId: 'h_001',
        doctorId: 'd_002',
        status: 'active',
        conditions: ['insuffisance cardiaque', 'diabète type 2'],
        lastActivity: '2026-03-15T11:20:00Z',
        createdAt: '2023-11-10',
    },
    {
        id: 'p_004',
        name: 'Sophie Lambert',
        email: 'sophie.lambert@email.com',
        phone: '+33 6 44 44 44 44',
        dateOfBirth: '1990-06-18',
        gender: 'female',
        hospitalId: 'h_001',
        doctorId: 'd_001',
        status: 'pending',
        conditions: ['obésité'],
        lastActivity: '2026-03-10T09:00:00Z',
        createdAt: '2026-03-10',
    },
    {
        id: 'p_005',
        name: 'Alain Rousseau',
        email: 'alain.rousseau@email.com',
        phone: '+33 6 55 55 55 55',
        dateOfBirth: '1945-02-28',
        gender: 'male',
        hospitalId: 'h_002',
        doctorId: 'd_003',
        status: 'active',
        conditions: ['hypertension', 'insuffisance rénale'],
        lastActivity: '2026-03-17T07:15:00Z',
        createdAt: '2023-08-05',
    },
    {
        id: 'p_006',
        name: 'Isabelle Durand',
        email: 'isabelle.durand@email.com',
        phone: '+33 6 66 66 66 66',
        dateOfBirth: '1983-07-14',
        gender: 'female',
        hospitalId: 'h_001',
        doctorId: 'd_002',
        status: 'suspended',
        conditions: ['dépression'],
        lastActivity: '2026-02-01T16:45:00Z',
        createdAt: '2024-03-01',
    },
    {
        id: 'p_007',
        name: 'Nicolas Leroy',
        email: 'nicolas.leroy@email.com',
        phone: '+33 6 77 77 77 77',
        dateOfBirth: '1988-03-20',
        gender: 'male',
        hospitalId: 'h_001',
        doctorId: 'd_001',
        status: 'active',
        conditions: ['hypertension'],
        lastActivity: '2026-03-18T09:00:00Z',
        createdAt: '2025-01-12',
    },
    {
        id: 'p_008',
        name: 'Camille Girard',
        email: 'camille.girard@email.com',
        phone: '+33 6 88 88 88 88',
        dateOfBirth: '2001-11-30',
        gender: 'female',
        hospitalId: 'h_002',
        doctorId: 'd_003',
        status: 'pending',
        conditions: ['diabète type 1'],
        lastActivity: '2026-03-17T12:00:00Z',
        createdAt: '2026-03-17',
    },
];

// ─── Health Metrics ─────────────────────────────────────────
export const MOCK_METRICS: HealthMetric[] = [
    { id: 'm_001', patientId: 'p_001', type: 'blood_pressure', value: 185, unit: 'mmHg', recordedAt: '2026-03-17T08:30:00Z' },
    { id: 'm_002', patientId: 'p_001', type: 'blood_pressure', value: 172, unit: 'mmHg', recordedAt: '2026-03-16T08:15:00Z' },
    { id: 'm_003', patientId: 'p_001', type: 'blood_pressure', value: 165, unit: 'mmHg', recordedAt: '2026-03-15T09:00:00Z' },
    { id: 'm_004', patientId: 'p_001', type: 'blood_pressure', value: 145, unit: 'mmHg', recordedAt: '2026-03-14T08:45:00Z' },
    { id: 'm_005', patientId: 'p_001', type: 'blood_pressure', value: 138, unit: 'mmHg', recordedAt: '2026-03-13T08:20:00Z' },
    { id: 'm_006', patientId: 'p_001', type: 'glucose', value: 8.4, unit: 'mmol/L', recordedAt: '2026-03-17T07:00:00Z' },
    { id: 'm_007', patientId: 'p_001', type: 'glucose', value: 7.9, unit: 'mmol/L', recordedAt: '2026-03-16T07:00:00Z' },
    { id: 'm_008', patientId: 'p_002', type: 'heart_rate', value: 112, unit: 'bpm', recordedAt: '2026-03-16T14:00:00Z' },
    { id: 'm_009', patientId: 'p_002', type: 'heart_rate', value: 98, unit: 'bpm', recordedAt: '2026-03-15T14:00:00Z' },
    { id: 'm_010', patientId: 'p_002', type: 'heart_rate', value: 88, unit: 'bpm', recordedAt: '2026-03-14T14:00:00Z' },
    { id: 'm_011', patientId: 'p_003', type: 'heart_rate', value: 95, unit: 'bpm', recordedAt: '2026-03-15T11:20:00Z' },
    { id: 'm_012', patientId: 'p_003', type: 'weight', value: 94, unit: 'kg', recordedAt: '2026-03-15T10:00:00Z' },
    { id: 'm_013', patientId: 'p_005', type: 'blood_pressure', value: 195, unit: 'mmHg', recordedAt: '2026-03-17T07:15:00Z' },
    { id: 'm_014', patientId: 'p_005', type: 'blood_pressure', value: 178, unit: 'mmHg', recordedAt: '2026-03-16T07:00:00Z' },
    { id: 'm_015', patientId: 'p_007', type: 'blood_pressure', value: 142, unit: 'mmHg', recordedAt: '2026-03-18T09:00:00Z' },
    { id: 'm_016', patientId: 'p_007', type: 'heart_rate', value: 78, unit: 'bpm', recordedAt: '2026-03-18T09:00:00Z' },
];

// ─── Alerts ─────────────────────────────────────────────────
export const MOCK_ALERTS: Alert[] = [
    {
        id: 'a_001',
        patientId: 'p_001',
        patientName: 'Jean Dubois',
        doctorId: 'd_001',
        type: 'blood_pressure',
        severity: 'critical',
        value: 185,
        unit: 'mmHg',
        threshold: 160,
        message: 'Tension artérielle critique : 185 mmHg (seuil : 160)',
        isRead: false,
        isResolved: false,
        createdAt: '2026-03-17T08:30:00Z',
    },
    {
        id: 'a_002',
        patientId: 'p_005',
        patientName: 'Alain Rousseau',
        doctorId: 'd_003',
        type: 'blood_pressure',
        severity: 'critical',
        value: 195,
        unit: 'mmHg',
        threshold: 160,
        message: 'Tension artérielle très élevée : 195 mmHg',
        isRead: false,
        isResolved: false,
        createdAt: '2026-03-17T07:15:00Z',
    },
    {
        id: 'a_003',
        patientId: 'p_002',
        patientName: 'Marie Fontaine',
        doctorId: 'd_001',
        type: 'heart_rate',
        severity: 'high',
        value: 112,
        unit: 'bpm',
        threshold: 100,
        message: 'Fréquence cardiaque élevée : 112 bpm',
        isRead: false,
        isResolved: false,
        createdAt: '2026-03-16T14:00:00Z',
    },
    {
        id: 'a_004',
        patientId: 'p_001',
        patientName: 'Jean Dubois',
        doctorId: 'd_001',
        type: 'glucose',
        severity: 'medium',
        value: 8.4,
        unit: 'mmol/L',
        threshold: 7.0,
        message: 'Glycémie élevée : 8.4 mmol/L (seuil : 7.0)',
        isRead: true,
        isResolved: false,
        createdAt: '2026-03-17T07:00:00Z',
    },
    {
        id: 'a_005',
        patientId: 'p_003',
        patientName: 'Pierre Martin',
        doctorId: 'd_002',
        type: 'heart_rate',
        severity: 'low',
        value: 95,
        unit: 'bpm',
        threshold: 100,
        message: 'Fréquence cardiaque à surveiller',
        isRead: true,
        isResolved: true,
        resolvedAt: '2026-03-16T09:00:00Z',
        resolvedBy: 'u_004',
        createdAt: '2026-03-15T11:20:00Z',
    },
];

// ─── Notifications ──────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'n_001',
        userId: 'u_001',
        type: 'alert',
        title: 'Alerte critique — Jean Dubois',
        body: 'Tension artérielle : 185 mmHg. Intervention requise.',
        isRead: false,
        metadata: { patientId: 'p_001', alertId: 'a_001' },
        createdAt: '2026-03-17T08:30:00Z',
    },
    {
        id: 'n_002',
        userId: 'u_001',
        type: 'message',
        title: 'Nouveau message de Sophie Lambert',
        body: "Bonjour docteur, j'ai des douleurs depuis hier soir...",
        isRead: false,
        createdAt: '2026-03-16T10:00:00Z',
    },
    {
        id: 'n_003',
        userId: 'u_001',
        type: 'system',
        title: 'Compte patient validé',
        body: 'Le compte de Sophie Lambert a été activé avec succès.',
        isRead: true,
        createdAt: '2026-03-15T09:00:00Z',
    },
    {
        id: 'n_004',
        userId: 'u_002',
        type: 'system',
        title: 'Nouveau médecin enregistré',
        body: 'Dr. Amélie Petit a rejoint votre établissement.',
        isRead: false,
        createdAt: '2026-03-14T11:30:00Z',
    },
    {
        id: 'n_005',
        userId: 'u_003',
        type: 'system',
        title: 'Nouvel hôpital inscrit',
        body: 'Centre Médical Bordeaux a été ajouté à la plateforme.',
        isRead: false,
        createdAt: '2026-03-13T15:00:00Z',
    },
];

// ─── Messages ───────────────────────────────────────────────
export const MOCK_MESSAGES: Message[] = [
    {
        id: 'msg_001',
        fromId: 'p_004',
        fromName: 'Sophie Lambert',
        toId: 'u_001',
        subject: 'Douleurs persistantes',
        body: "Bonjour docteur, j'ai des douleurs thoraciques depuis hier soir. Dois-je venir aux urgences ?",
        isRead: false,
        sentAt: '2026-03-16T10:00:00Z',
    },
    {
        id: 'msg_002',
        fromId: 'p_001',
        fromName: 'Jean Dubois',
        toId: 'u_001',
        subject: "Résultats d'analyse",
        body: "Bonjour, j'ai reçu mes résultats. Est-ce que vous pouvez les consulter?",
        isRead: true,
        sentAt: '2026-03-14T15:30:00Z',
    },
];

// ─── Health Content ─────────────────────────────────────────
export const MOCK_CONTENT: HealthContent[] = [
    {
        id: 'c_001',
        type: 'advice',
        title: '5 conseils pour réduire la tension artérielle naturellement',
        body: "Réduire le sel, pratiquer une activité physique régulière, limiter l'alcool...",
        authorId: 'u_003',
        authorName: 'Admin Système',
        publishedAt: '2026-03-15T10:00:00Z',
        tags: ['hypertension', 'prévention', 'alimentation'],
        isPublished: true,
    },
    {
        id: 'c_002',
        type: 'event',
        title: 'Journée de dépistage diabète — Paris',
        body: "Dépistage gratuit du diabète de type 2 à l'Hôpital Central...",
        authorId: 'u_003',
        authorName: 'Admin Système',
        publishedAt: '2026-03-10T08:00:00Z',
        tags: ['diabète', 'événement', 'dépistage'],
        isPublished: true,
    },
    {
        id: 'c_003',
        type: 'news',
        title: "Nouveau traitement approuvé contre l'insuffisance cardiaque",
        body: 'La FDA a approuvé un traitement révolutionnaire...',
        authorId: 'u_003',
        authorName: 'Admin Système',
        publishedAt: '2026-03-12T14:30:00Z',
        tags: ['cardiologie', 'traitement', 'actualités'],
        isPublished: true,
    },
    {
        id: 'c_004',
        type: 'advice',
        title: 'Gérer son stress au quotidien : techniques éprouvées',
        body: 'La méditation, la respiration profonde et le sport sont vos meilleurs alliés...',
        authorId: 'u_003',
        authorName: 'Admin Système',
        publishedAt: '2026-03-08T09:00:00Z',
        tags: ['stress', 'bien-être', 'mental'],
        isPublished: false,
    },
];



// ─── Notification mock (aligné avec TopBar) ───────────────────
// TopBar utilise : notif.roles, notif.read, notif.message, notif.date, notif.id, notif.type, notif.title
export interface MockNotification {
    id: string;
    type: 'alert' | 'message' | 'system' | 'appointment';
    title: string;
    message: string;
    date: Date;
    read: boolean;
    roles?: UserRole[];         // undefined = visible par tous
}

export const NOTIFICATIONS: MockNotification[] = [
    {
        id: 'n_001',
        type: 'alert',
        title: 'Alerte critique — Jean Dubois',
        message: 'Tension artérielle : 185 mmHg. Intervention requise.',
        date: new Date(Date.now() - 25 * 60 * 1000),
        read: false,
        roles: ['doctor'],
    },
    {
        id: 'n_002',
        type: 'message',
        title: 'Nouveau message de Sophie Lambert',
        message: "Bonjour docteur, j'ai des douleurs depuis hier soir...",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        roles: ['doctor'],
    },
    {
        id: 'n_003',
        type: 'system',
        title: 'Compte patient validé',
        message: 'Le compte de Sophie Lambert a été activé avec succès.',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: true,
        roles: ['doctor', 'hospital_manager'],
    },
    {
        id: 'n_004',
        type: 'system',
        title: 'Nouveau médecin enregistré',
        message: 'Dr. Amélie Petit a rejoint votre établissement.',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: false,
        roles: ['hospital_manager'],
    },
    {
        id: 'n_005',
        type: 'system',
        title: 'Nouvel hôpital inscrit',
        message: 'Centre Médical Bordeaux a été ajouté à la plateforme.',
        date: new Date(Date.now() - 48 * 60 * 60 * 1000),
        read: false,
        roles: ['admin'],
    },
    {
        id: 'n_006',
        type: 'appointment',
        title: 'Rapport hebdomadaire disponible',
        message: 'Le rapport de la semaine est prêt à être consulté.',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
        // pas de roles = visible par tous
    },
];

// ─── MenuItem & MenuSection types ────────────────────────────


export let MOCK_PATIENT_REQUESTS: PatientRequest[] = [
    {
        id: 'req_001',
        fullName: 'Antoine Moreau',
        email: 'antoine.moreau@email.com',
        phone: '+33 6 12 34 56 78',
        dateOfBirth: '1978-05-15',
        gender: 'male',
        patientType: 'hypertension',
        hospitalId: 'h_001',
        hospitalName: 'Hôpital Central de Paris',
        doctorId: 'd_001',
        healthRecordImageUrl: 'https://placehold.co/800x600/dbeafe/1d4ed8?text=Dossier+Médical',
        receiptImageUrl: 'https://placehold.co/800x400/d1fae5/065f46?text=Reçu+Consultation',
        status: 'pending',
        submittedAt: '2026-03-18T09:00:00Z',
    },
    {
        id: 'req_002',
        fullName: 'Lucie Henriot',
        email: 'lucie.henriot@email.com',
        phone: '+33 6 98 76 54 32',
        dateOfBirth: '1985-11-22',
        gender: 'female',
        patientType: 'diabetes',
        hospitalId: 'h_001',
        hospitalName: 'Hôpital Central de Paris',
        doctorId: 'd_001',
        healthRecordImageUrl: 'https://placehold.co/800x600/dbeafe/1d4ed8?text=Dossier+Médical',
        receiptImageUrl: 'https://placehold.co/800x400/d1fae5/065f46?text=Reçu+Consultation',
        status: 'pending',
        submittedAt: '2026-03-17T14:30:00Z',
    },
    {
        id: 'req_003',
        fullName: 'Marc Tessier',
        email: 'marc.tessier@email.com',
        phone: '+33 6 55 44 33 22',
        dateOfBirth: '1960-03-08',
        gender: 'male',
        patientType: 'both',
        hospitalId: 'h_001',
        hospitalName: 'Hôpital Central de Paris',
        doctorId: 'd_001',
        healthRecordImageUrl: 'https://placehold.co/800x600/dbeafe/1d4ed8?text=Dossier+Médical',
        receiptImageUrl: 'https://placehold.co/800x400/d1fae5/065f46?text=Reçu+Consultation',
        status: 'approved',
        submittedAt: '2026-03-10T11:00:00Z',
        reviewedAt: '2026-03-12T09:00:00Z',
    },
    {
        id: 'req_004',
        fullName: 'Sylvie Renard',
        email: 'sylvie.renard@email.com',
        phone: '+33 6 11 22 33 44',
        dateOfBirth: '1992-07-19',
        gender: 'female',
        patientType: 'hypertension',
        hospitalId: 'h_001',
        hospitalName: 'Hôpital Central de Paris',
        doctorId: 'd_001',
        healthRecordImageUrl: 'https://placehold.co/800x600/dbeafe/1d4ed8?text=Dossier+Médical',
        receiptImageUrl: 'https://placehold.co/800x400/d1fae5/065f46?text=Reçu+Consultation',
        status: 'rejected',
        rejectionMessage: 'Documents insuffisants. Veuillez fournir un dossier médical complet avec vos antécédents.',
        submittedAt: '2026-03-05T08:00:00Z',
        reviewedAt: '2026-03-06T10:00:00Z',
    },
];

// ─── Prescriptions ────────────────────────────────────────────
export let MOCK_PRESCRIPTIONS: Prescription[] = [
    {
        id: 'presc_001',
        patientId: 'p_001',
        referenceNumber: 'ORD-2026-0312-A',
        imageUrl: 'https://placehold.co/800x600/fff7ed/c2410c?text=Ordonnance+N°ORD-2026-0312-A',
        issuedAt: '2026-03-01T00:00:00Z',
        expiresAt: '2026-06-01T00:00:00Z',
        doctorId: 'd_001',
        medications: [
            {
                id: 'med_001',
                prescriptionId: 'presc_001',
                name: 'Amlodipine',
                dosage: '5mg',
                intakeTimes: ['08:00'],
                renewalDays: 30,
                startDate: '2026-03-01',
                endDate: '2026-06-01',
            },
            {
                id: 'med_002',
                prescriptionId: 'presc_001',
                name: 'Ramipril',
                dosage: '10mg',
                intakeTimes: ['08:00', '20:00'],
                renewalDays: 30,
                startDate: '2026-03-01',
                endDate: '2026-06-01',
            },
        ],
    },
    {
        id: 'presc_002',
        patientId: 'p_001',
        referenceNumber: 'ORD-2026-0115-B',
        imageUrl: 'https://placehold.co/800x600/fff7ed/c2410c?text=Ordonnance+N°ORD-2026-0115-B',
        issuedAt: '2026-01-15T00:00:00Z',
        expiresAt: '2026-04-15T00:00:00Z',
        doctorId: 'd_001',
        medications: [
            {
                id: 'med_003',
                prescriptionId: 'presc_002',
                name: 'Metformine',
                dosage: '500mg',
                intakeTimes: ['08:00', '13:00', '20:00'],
                renewalDays: 90,
                startDate: '2026-01-15',
                endDate: '2026-04-15',
            },
        ],
    },
    {
        id: 'presc_003',
        patientId: 'p_002',
        referenceNumber: 'ORD-2026-0205-C',
        imageUrl: 'https://placehold.co/800x600/fff7ed/c2410c?text=Ordonnance+N°ORD-2026-0205-C',
        issuedAt: '2026-02-05T00:00:00Z',
        expiresAt: '2026-05-05T00:00:00Z',
        doctorId: 'd_001',
        medications: [
            {
                id: 'med_004',
                prescriptionId: 'presc_003',
                name: 'Salbutamol',
                dosage: '100mcg',
                intakeTimes: ['08:00', '20:00'],
                renewalDays: 30,
                startDate: '2026-02-05',
                endDate: '2026-05-05',
            },
        ],
    },
];

// ─── Measurements ─────────────────────────────────────────────
const now = new Date('2026-03-19');

function daysAgo(d: number): string {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    return date.toISOString();
}

export const MOCK_MEASUREMENTS: Measurement[] = [
    // Patient p_001 — Jean Dubois (hypertension + diabetes) — mostly compliant
    { id: 'ms_001', patientId: 'p_001', type: 'blood_pressure', value: 158, value2: 95, unit: 'mmHg', feeling: 'Un peu fatigué', takenBy: 'self', recordedAt: daysAgo(0), week: 12 },
    { id: 'ms_002', patientId: 'p_001', type: 'blood_pressure', value: 162, value2: 98, unit: 'mmHg', takenBy: 'self', recordedAt: daysAgo(1), week: 12 },
    { id: 'ms_003', patientId: 'p_001', type: 'glucose', value: 7.8, unit: 'mmol/L', feeling: 'Bien', takenBy: 'self', recordedAt: daysAgo(1), week: 12 },
    { id: 'ms_004', patientId: 'p_001', type: 'blood_pressure', value: 155, value2: 92, unit: 'mmHg', takenBy: 'family', takenByName: 'Marie', takenBySurname: 'Dubois', takenByAge: 55, recordedAt: daysAgo(2), week: 12 },
    { id: 'ms_005', patientId: 'p_001', type: 'glucose', value: 8.2, unit: 'mmol/L', takenBy: 'self', recordedAt: daysAgo(2), week: 12 },
    { id: 'ms_006', patientId: 'p_001', type: 'blood_pressure', value: 185, value2: 110, unit: 'mmHg', feeling: 'Mal de tête intense', takenBy: 'self', recordedAt: daysAgo(7), week: 11 },
    { id: 'ms_007', patientId: 'p_001', type: 'blood_pressure', value: 172, value2: 105, unit: 'mmHg', takenBy: 'self', recordedAt: daysAgo(8), week: 11 },
    { id: 'ms_008', patientId: 'p_001', type: 'glucose', value: 9.1, unit: 'mmol/L', takenBy: 'self', recordedAt: daysAgo(8), week: 11 },
    { id: 'ms_009', patientId: 'p_001', type: 'blood_pressure', value: 168, value2: 100, unit: 'mmHg', takenBy: 'self', recordedAt: daysAgo(9), week: 11 },
    { id: 'ms_010', patientId: 'p_001', type: 'glucose', value: 7.5, unit: 'mmol/L', takenBy: 'self', recordedAt: daysAgo(10), week: 11 },

    // Patient p_002 — Marie Fontaine (asthme) — partial compliance
    { id: 'ms_011', patientId: 'p_002', type: 'heart_rate', value: 112, unit: 'bpm', feeling: 'Essoufflée', takenBy: 'self', recordedAt: daysAgo(1), week: 12 },
    { id: 'ms_012', patientId: 'p_002', type: 'heart_rate', value: 98, unit: 'bpm', takenBy: 'self', recordedAt: daysAgo(3), week: 12 },
    { id: 'ms_013', patientId: 'p_002', type: 'heart_rate', value: 105, unit: 'bpm', takenBy: 'healthcare', takenByName: 'Inf.', takenBySurname: 'Laurent', takenByAge: 40, recordedAt: daysAgo(8), week: 11 },
    { id: 'ms_014', patientId: 'p_002', type: 'heart_rate', value: 88, unit: 'bpm', takenBy: 'self', recordedAt: daysAgo(10), week: 11 },

    // Patient p_007 — Nicolas Leroy (hypertension) — non-compliant this week
    { id: 'ms_015', patientId: 'p_007', type: 'blood_pressure', value: 142, value2: 88, unit: 'mmHg', takenBy: 'self', recordedAt: daysAgo(6), week: 11 },
    { id: 'ms_016', patientId: 'p_007', type: 'blood_pressure', value: 138, value2: 85, unit: 'mmHg', takenBy: 'self', recordedAt: daysAgo(8), week: 11 },
    { id: 'ms_017', patientId: 'p_007', type: 'blood_pressure', value: 145, value2: 90, unit: 'mmHg', takenBy: 'self', recordedAt: daysAgo(10), week: 11 },
    { id: 'ms_018', patientId: 'p_007', type: 'heart_rate', value: 78, unit: 'bpm', takenBy: 'self', recordedAt: daysAgo(10), week: 11 },

    // Patient p_004 — Sophie Lambert (obésité) — no measurements this week
    { id: 'ms_019', patientId: 'p_004', type: 'weight', value: 94, unit: 'kg', feeling: 'Correctement', takenBy: 'self', recordedAt: daysAgo(14), week: 10 },
    { id: 'ms_020', patientId: 'p_004', type: 'weight', value: 93.5, unit: 'kg', takenBy: 'self', recordedAt: daysAgo(21), week: 9 },
];

// ─── Medication Intake Logs ───────────────────────────────────
export let MOCK_MEDICATION_INTAKES: MedicationIntake[] = [
    // med_001 (Amlodipine 5mg) — p_001
    { id: 'mi_001', medicationId: 'med_001', patientId: 'p_001', scheduledTime: '08:00', takenAt: daysAgo(0).slice(0, 10) + 'T08:05:00Z', missed: false, date: daysAgo(0).slice(0, 10) },
    { id: 'mi_002', medicationId: 'med_001', patientId: 'p_001', scheduledTime: '08:00', takenAt: daysAgo(1).slice(0, 10) + 'T08:12:00Z', missed: false, date: daysAgo(1).slice(0, 10) },
    { id: 'mi_003', medicationId: 'med_001', patientId: 'p_001', scheduledTime: '08:00', missed: true, date: daysAgo(2).slice(0, 10) },
    { id: 'mi_004', medicationId: 'med_001', patientId: 'p_001', scheduledTime: '08:00', takenAt: daysAgo(3).slice(0, 10) + 'T08:30:00Z', missed: false, date: daysAgo(3).slice(0, 10) },
    { id: 'mi_005', medicationId: 'med_001', patientId: 'p_001', scheduledTime: '08:00', takenAt: daysAgo(4).slice(0, 10) + 'T08:02:00Z', missed: false, date: daysAgo(4).slice(0, 10) },

    // med_002 (Ramipril 10mg) — p_001
    { id: 'mi_006', medicationId: 'med_002', patientId: 'p_001', scheduledTime: '08:00', takenAt: daysAgo(0).slice(0, 10) + 'T08:05:00Z', missed: false, date: daysAgo(0).slice(0, 10) },
    { id: 'mi_007', medicationId: 'med_002', patientId: 'p_001', scheduledTime: '20:00', takenAt: daysAgo(0).slice(0, 10) + 'T20:10:00Z', missed: false, date: daysAgo(0).slice(0, 10) },
    { id: 'mi_008', medicationId: 'med_002', patientId: 'p_001', scheduledTime: '08:00', missed: true, date: daysAgo(1).slice(0, 10) },
    { id: 'mi_009', medicationId: 'med_002', patientId: 'p_001', scheduledTime: '20:00', takenAt: daysAgo(1).slice(0, 10) + 'T20:05:00Z', missed: false, date: daysAgo(1).slice(0, 10) },
    { id: 'mi_010', medicationId: 'med_002', patientId: 'p_001', scheduledTime: '08:00', takenAt: daysAgo(2).slice(0, 10) + 'T08:20:00Z', missed: false, date: daysAgo(2).slice(0, 10) },
    { id: 'mi_011', medicationId: 'med_002', patientId: 'p_001', scheduledTime: '20:00', missed: true, date: daysAgo(2).slice(0, 10) },

    // med_004 (Salbutamol) — p_002
    { id: 'mi_012', medicationId: 'med_004', patientId: 'p_002', scheduledTime: '08:00', takenAt: daysAgo(0).slice(0, 10) + 'T08:00:00Z', missed: false, date: daysAgo(0).slice(0, 10) },
    { id: 'mi_013', medicationId: 'med_004', patientId: 'p_002', scheduledTime: '20:00', missed: true, date: daysAgo(0).slice(0, 10) },
    { id: 'mi_014', medicationId: 'med_004', patientId: 'p_002', scheduledTime: '08:00', missed: true, date: daysAgo(1).slice(0, 10) },
    { id: 'mi_015', medicationId: 'med_004', patientId: 'p_002', scheduledTime: '20:00', takenAt: daysAgo(1).slice(0, 10) + 'T20:30:00Z', missed: false, date: daysAgo(1).slice(0, 10) },
];

// ─── Measurement Frequencies ──────────────────────────────────
export let MOCK_FREQUENCIES: MeasurementFrequency[] = [
    { patientId: 'p_001', timesPerWeek: 5, doctorId: 'd_001', updatedAt: '2026-03-01T00:00:00Z' },
    { patientId: 'p_002', timesPerWeek: 3, doctorId: 'd_001', updatedAt: '2026-02-15T00:00:00Z' },
    { patientId: 'p_004', timesPerWeek: 2, doctorId: 'd_001', updatedAt: '2026-03-10T00:00:00Z' },
    { patientId: 'p_007', timesPerWeek: 4, doctorId: 'd_001', updatedAt: '2026-02-20T00:00:00Z' },
];

// ─── Doctor Notifications (to patients) ──────────────────────
export let MOCK_DOCTOR_NOTIFICATIONS: DoctorNotification[] = [
    {
        id: 'dn_001',
        doctorId: 'd_001',
        patientId: 'p_001',
        patientName: 'Jean Dubois',
        message: 'Votre tension artérielle est très élevée. Veuillez prendre vos médicaments et me contacter si cela persiste.',
        sentAt: daysAgo(1),
        read: false,
    },
    {
        id: 'dn_002',
        doctorId: 'd_001',
        patientId: 'p_002',
        patientName: 'Marie Fontaine',
        message: 'Rappel: veuillez effectuer vos mesures quotidiennes conformément à la fréquence prescrite.',
        sentAt: daysAgo(3),
        read: true,
    },
];





export interface MenuItem {
    id: string;
    label: string;
    icon: string;
    route: string;
    badge?: string;
}

export interface MenuSection {
    section: string;
    items: MenuItem[];
}

const MENU_DOCTOR: MenuSection[] = [
    {
        section: 'Principal',
        items: [
            { id: 'doctor-dashboard', label: 'Tableau de bord', icon: 'fas fa-th-large', route: '/doctor-dashboard' },
            { id: 'patient-requests', label: 'Demandes patients', icon: 'fas fa-user-plus', route: '/patient-requests', badge: '' },
            { id: 'patients', label: 'Mes patients', icon: 'fas fa-users', route: '/patients' },
            { id: 'alerts', label: 'Alertes', icon: 'fas fa-bell', route: '/alerts', badge: '3' },
        ],
    },
    {
        section: 'Suivi',
        items: [
            { id: 'notifications', label: 'Notifications envoyées', icon: 'fas fa-paper-plane', route: '/notifications' },
        ],
    },
    {
        section: 'Compte',
        items: [
            { id: 'profile', label: 'Profil', icon: 'fas fa-user-circle', route: '/profile' },
            { id: 'settings', label: 'Paramètres', icon: 'fas fa-cog', route: '/settings' },
        ],
    },
];

const MENU_MANAGER: MenuSection[] = [
    {
        section: 'Principal',
        items: [
            { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
            { id: 'patients', label: 'Patients', icon: 'fas fa-users', route: '/patients' },
            { id: 'doctors', label: 'Médecins', icon: 'fas fa-user-md', route: '/doctors' },
        ],
    },
    {
        section: 'Alertes & Messages',
        items: [
            { id: 'alerts', label: 'Alertes', icon: 'fas fa-bell', route: '/alerts' },
            { id: 'notifications', label: 'Notifications', icon: 'fas fa-envelope', route: '/notifications' },
        ],
    },
    {
        section: 'Compte',
        items: [
            { id: 'profile', label: 'Profil', icon: 'fas fa-user-circle', route: '/profile' },
            { id: 'settings', label: 'Paramètres', icon: 'fas fa-cog', route: '/settings' },
        ],
    },
];

const MENU_ADMIN: MenuSection[] = [
    {
        section: 'Administration',
        items: [
            { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
            { id: 'hospitals', label: 'Établissements', icon: 'fas fa-hospital', route: '/hospitals' },
            { id: 'doctors', label: 'Médecins', icon: 'fas fa-user-md', route: '/doctors' },
            { id: 'patients', label: 'Patients', icon: 'fas fa-users', route: '/patients' },
        ],
    },
    {
        section: 'Contenu & Carte',
        items: [
            { id: 'content', label: 'Contenu santé', icon: 'fas fa-newspaper', route: '/content' },
            { id: 'map', label: 'Carte établissements', icon: 'fas fa-map-marker-alt', route: '/map' },
        ],
    },
    {
        section: 'Système',
        items: [
            { id: 'alerts', label: 'Alertes', icon: 'fas fa-bell', route: '/alerts' },
            { id: 'notifications', label: 'Notifications', icon: 'fas fa-envelope', route: '/notifications' },
            { id: 'profile', label: 'Profil', icon: 'fas fa-user-circle', route: '/profile' },
            { id: 'settings', label: 'Paramètres', icon: 'fas fa-cog', route: '/settings' },
        ],
    },
];

export function getMenuForRole(role: UserRole): MenuSection[] {
    switch (role) {
        case 'doctor': return MENU_DOCTOR;
        case 'hospital_manager': return MENU_MANAGER;
        case 'admin': return MENU_ADMIN;
        default: return MENU_DOCTOR;
    }
}