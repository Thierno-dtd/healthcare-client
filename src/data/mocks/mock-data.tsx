
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
        email: 'dr.kossi@chu-lome.tg',
        name: 'Dr. Kossi Mensah',
        role: 'doctor',
        avatar: 'KM',
        hospitalId: 'h_001',
        createdAt: '2024-01-10',
    },
    {
        id: 'u_002',
        email: 'manager@chu-lome.tg',
        name: 'Afi Lawson',
        role: 'hospital_manager',
        avatar: 'AL',
        hospitalId: 'h_001',
        createdAt: '2023-09-15',
    },
    {
        id: 'u_003',
        email: 'admin@sante-togo.tg',
        name: 'Admin Santé Togo',
        role: 'admin',
        avatar: 'AT',
        createdAt: '2023-01-01',
    },
    { id: 'u_004', email: 'dr.moreau@clinic.com', name: 'Dr. Claire Moreau', role: 'doctor', avatar: 'CM', hospitalId: 'h_001', createdAt: '2023-06-20', }, { id: 'u_005', email: 'dr.leclerc@clinic.com', name: 'Dr. Paul Leclerc', role: 'doctor', avatar: 'PL', hospitalId: 'h_002', createdAt: '2023-03-15', },
];

// ─── Demo credentials map ───────────────────────────────────
export const DEMO_CREDENTIALS: Record<string, string> = {
    'dr.kossi@chu-lome.tg': 'password123',
    'manager@hopital-central.com': 'password123',
    'admin@healthplatform.com': 'password123',
};

// ─── Hospitals ──────────────────────────────────────────────
export const MOCK_HOSPITALS: Hospital[] = [
    {
        id: 'h_001',
        name: 'CHU Sylvanus Olympio',
        address: 'Boulevard du 13 Janvier',
        city: 'Lomé',
        country: 'Togo',
        phone: '+228 22 21 25 01',
        email: 'contact@chu-sylvanus.tg',
        managerId: 'u_002',
        doctorCount: 30,
        patientCount: 500,
        coordinates: { lat: 6.1319, lng: 1.2228 },
        status: 'active',
        createdAt: '2022-03-15',
    },
    {
        id: 'h_002',
        name: 'CHU Campus de Lomé',
        address: 'Quartier Tokoin',
        city: 'Lomé',
        country: 'Togo',
        phone: '+228 22 25 78 90',
        email: 'contact@chu-campus.tg',
        managerId: 'u_003',
        doctorCount: 20,
        patientCount: 320,
        coordinates: { lat: 6.1656, lng: 1.2145 },
        status: 'active',
        createdAt: '2022-08-20',
    },
    {
        id: 'h_003',
        name: 'Hôpital Régional de Kara',
        address: 'Centre-ville Kara',
        city: 'Kara',
        country: 'Togo',
        phone: '+228 26 60 12 34',
        email: 'contact@hr-kara.tg',
        managerId: 'u_003',
        doctorCount: 10,
        patientCount: 150,
        coordinates: { lat: 9.5511, lng: 1.1865 },
        status: 'active',
        createdAt: '2023-01-10',
    },
    { id: 'h_004', name: 'Polyclinique Marseille', address: '17 Boulevard Longchamp', city: 'Marseille', country: 'France', phone: '+33 4 91 33 44 55', email: 'contact@poly-marseille.fr', managerId: 'u_003', doctorCount: 15, patientCount: 210, coordinates: { lat: 43.2965, lng: 5.3698 }, status: 'active', createdAt: '2022-11-05', },
];

// ─── Doctors ────────────────────────────────────────────────
export const MOCK_DOCTORS: Doctor[] = [
    {
        id: 'd_001',
        userId: 'u_001',
        name: 'Dr. Kossi Mensah',
        email: 'dr.kossi@chu-lome.tg',
        phone: '+228 90 12 34 56',
        specialization: 'Cardiologie',
        hospitalId: 'h_001',
        patientCount: 60,
        alertCount: 4,
        status: 'active',
        joinedAt: '2024-01-10',
    },
    {
        id: 'd_002',
        userId: 'u_004',
        name: 'Dr. Ama Dede',
        email: 'dr.ama@chu-lome.tg',
        phone: '+228 91 45 67 89',
        specialization: 'Médecine générale',
        hospitalId: 'h_001',
        patientCount: 45,
        alertCount: 2,
        status: 'active',
        joinedAt: '2023-06-20',
    },
    { id: 'd_003', userId: 'u_005', name: 'Dr. Paul Leclerc', email: 'dr.leclerc@clinic.com', phone: '+33 6 22 33 44 55', specialization: 'Endocrinologie', hospitalId: 'h_002', patientCount: 52, alertCount: 2, status: 'active', joinedAt: '2023-03-15', }, { id: 'd_004', userId: 'u_006', name: 'Dr. Amélie Petit', email: 'dr.petit@clinic.com', phone: '+33 6 88 99 00 11', specialization: 'Cardiologie', hospitalId: 'h_002', patientCount: 27, alertCount: 0, status: 'pending', joinedAt: '2024-03-01', }, { id: 'd_005', userId: 'u_007', name: 'Dr. François Blanc', email: 'dr.blanc@clinic.com', phone: '+33 6 44 55 66 77', specialization: 'Neurologie', hospitalId: 'h_001', patientCount: 31, alertCount: 0, status: 'active', joinedAt: '2022-10-01', },

];

// ─── Patients ───────────────────────────────────────────────
export const MOCK_PATIENTS: Patient[] = [
    {
        id: 'p_001',
        name: 'Kodjo Agbéko',
        email: 'kodjo.agbeko@gmail.com',
        phone: '+228 90 00 00 01',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        hospitalId: 'h_001',
        doctorId: 'd_001',
        status: 'active',
        conditions: ['hypertension'],
        lastActivity: '2026-03-26T07:00:00Z',
        createdAt: '2026-03-21',
    },
    {
        id: 'p_002',
        name: 'Akouvi Mensah',
        email: 'akouvi@gmail.com',
        phone: '+228 90 00 00 02',
        dateOfBirth: '1990-02-02',
        gender: 'female',
        hospitalId: 'h_001',
        doctorId: 'd_001',
        status: 'active',
        conditions: ['diabete'],
        lastActivity: '2026-03-26T14:00:00Z',
        createdAt: '2026-01-20',
    },
    { id: 'p_003', name: 'Pierre KPATCHA', email: 'pierre.kpatcha@email.com', phone: '+228 90 33 33 33', dateOfBirth: '1952-11-05', gender: 'male', hospitalId: 'h_001', doctorId: 'd_001', status: 'active', conditions: ['diabète type 2'], lastActivity: '2026-03-24T11:20:00Z', createdAt: '2025-12-10', },
    { id: 'p_004', name: 'Sophie LAWANI', email: 'sophie.lawani@email.com', phone: '+229 91 44 44 44', dateOfBirth: '1990-06-18', gender: 'female', hospitalId: 'h_001', doctorId: 'd_001', status: 'suspended', conditions: ['hypertension'], lastActivity: '2026-03-25T09:00:00Z', createdAt: '2026-03-10', },
    { id: 'p_005', name: 'Alain GAGLO', email: 'alain.gaglo@email.com', phone: '+228 99 55 58 05', dateOfBirth: '1945-02-28', gender: 'male', hospitalId: 'h_001', doctorId: 'd_001', status: 'active', conditions: ['hypertension'], lastActivity: '2026-03-25T07:18:00Z', createdAt: '2026-02-05', },
    { id: 'p_006', name: 'Isabelle KOURUKOU', email: 'isabelle.kourukou@email.com', phone: '+228 97 69 69 06', dateOfBirth: '1983-07-14', gender: 'female', hospitalId: 'h_001', doctorId: 'd_001', status: 'suspended', conditions: ['diabète'], lastActivity: '2026-03-23T16:45:00Z', createdAt: '2026-03-01', },
    { id: 'p_007', name: 'Nicolas ABALO', email: 'nicolas.abalo@email.com', phone: '+228 97 01 82 64', dateOfBirth: '1988-03-20', gender: 'male', hospitalId: 'h_001', doctorId: 'd_001', status: 'active', conditions: ['hypertension'], lastActivity: '2026-03-21T09:00:00Z', createdAt: '2026-01-12', },
    { id: 'p_008', name: 'Camille YOVODJIN', email: 'camille.yovodjin@email.com', phone: '+228 93 48 74 13', dateOfBirth: '2001-11-30', gender: 'female', hospitalId: 'h_001', doctorId: 'd_001', status: 'suspended', conditions: ['diabète type 1'], lastActivity: '2026-03-17T12:00:00Z', createdAt: '2026-03-17', },

];

// ─── Health Metrics ─────────────────────────────────────────
export const MOCK_METRICS: HealthMetric[] = [
    { id: 'm_001', patientId: 'p_001', type: 'blood_pressure', value: 185, unit: 'mmHg', recordedAt: '2026-03-17T08:30:00Z' },
    { id: 'm_002', patientId: 'p_001', type: 'blood_pressure', value: 172, unit: 'mmHg', recordedAt: '2026-03-16T08:15:00Z' },
    { id: 'm_003', patientId: 'p_001', type: 'blood_pressure', value: 165, unit: 'mmHg', recordedAt: '2026-03-15T09:00:00Z' },
    { id: 'm_004', patientId: 'p_001', type: 'blood_pressure', value: 145, unit: 'mmHg', recordedAt: '2026-03-14T08:45:00Z' },
    { id: 'm_005', patientId: 'p_001', type: 'blood_pressure', value: 138, unit: 'mmHg', recordedAt: '2026-03-13T08:20:00Z' },
    { id: 'm_006', patientId: 'p_001', type: 'glucose',        value: 8.4, unit: 'mmol/L', recordedAt: '2026-03-17T07:00:00Z' },
    { id: 'm_007', patientId: 'p_001', type: 'glucose',        value: 7.9, unit: 'mmol/L', recordedAt: '2026-03-16T07:00:00Z' },
    { id: 'm_008', patientId: 'p_002', type: 'heart_rate',     value: 112, unit: 'bpm',    recordedAt: '2026-03-16T14:00:00Z' },
    { id: 'm_009', patientId: 'p_002', type: 'heart_rate',     value: 98,  unit: 'bpm',    recordedAt: '2026-03-15T14:00:00Z' },
    { id: 'm_010', patientId: 'p_002', type: 'heart_rate',     value: 88,  unit: 'bpm',    recordedAt: '2026-03-14T14:00:00Z' },
    { id: 'm_011', patientId: 'p_003', type: 'heart_rate',     value: 95,  unit: 'bpm',    recordedAt: '2026-03-15T11:20:00Z' },
    { id: 'm_012', patientId: 'p_003', type: 'weight',         value: 94,  unit: 'kg',     recordedAt: '2026-03-15T10:00:00Z' },
    { id: 'm_013', patientId: 'p_005', type: 'blood_pressure', value: 195, unit: 'mmHg',   recordedAt: '2026-03-17T07:15:00Z' },
    { id: 'm_014', patientId: 'p_005', type: 'blood_pressure', value: 178, unit: 'mmHg',   recordedAt: '2026-03-16T07:00:00Z' },
    { id: 'm_015', patientId: 'p_007', type: 'blood_pressure', value: 142, unit: 'mmHg',   recordedAt: '2026-03-18T09:00:00Z' },
    { id: 'm_016', patientId: 'p_007', type: 'heart_rate',     value: 78,  unit: 'bpm',    recordedAt: '2026-03-18T09:00:00Z' },
];
// ─── Alerts ─────────────────────────────────────────────────
export const MOCK_ALERTS: Alert[] = [
    {
        id: 'a_001',
        patientId: 'p_001',
        patientName: 'Kodjo Agbéko',
        doctorId: 'd_001',
        type: 'blood_pressure',
        severity: 'critical',
        value: 185,
        unit: 'mmHg',
        threshold: 160,
        message: 'Urgence : tension très élevée. Rendez-vous immédiatement au CHU.',
        isRead: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
    {
        id: 'a_002',
        patientId: 'p_002',
        patientName: 'Akouvi Mensah',
        doctorId: 'd_001',
        type: 'blood_pressure',
        severity: 'critical',
        value: 195,
        unit: 'mmHg',
        threshold: 160,
        message: 'Tension artérielle très élevée : 195 mmHg',
        isRead: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
        id: 'a_003',
        patientId: 'p_008',
        patientName: 'Camille YOVODJIN',
        doctorId: 'd_001',
        type: 'heart_rate',
        severity: 'high',
        value: 112,
        unit: 'bpm',
        threshold: 100,
        message: 'Fréquence cardiaque élevée : 112 bpm',
        isRead: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'a_004',
        patientId: 'p_003',
        patientName: 'Pierre KPATCHA',
        doctorId: 'd_001',
        type: 'glucose',
        severity: 'medium',
        value: 8.4,
        unit: 'mmol/L',
        threshold: 7.0,
        message: 'Glycémie élevée : 8.4 mmol/L (seuil : 7.0)',
        isRead: true,
        isResolved: false,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
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
        resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        resolvedBy: 'u_004',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
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
        title: 'Comment prévenir l’hypertension au Togo',
        body: "Réduire le sel, éviter les cubes en excès, pratiquer une activité physique régulière...",
        authorId: 'u_003',
        authorName: 'Admin Santé Togo',
        publishedAt: '2026-03-15T10:00:00Z',
        tags: ['hypertension', 'prévention'],
        isPublished: true,
    },
    {
        id: 'c_002',
        type: 'event',
        title: 'Campagne de dépistage gratuit du diabète à Lomé',
        body: "Dépistage gratuit au CHU Sylvanus Olympio ce week-end...",
        authorId: 'u_003',
        authorName: 'Admin Santé Togo',
        publishedAt: '2026-03-10T08:00:00Z',
        tags: ['diabète', 'dépistage'],
        isPublished: true,
    },
    { id: 'c_003', type: 'news', title: "Nouveau traitement approuvé contre l'insuffisance cardiaque", body: 'La FDA a approuvé un traitement révolutionnaire...', authorId: 'u_003', authorName: 'Admin Système', publishedAt: '2026-03-12T14:30:00Z', tags: ['cardiologie', 'traitement', 'actualités'], isPublished: true, }, { id: 'c_004', type: 'advice', title: 'Gérer son stress au quotidien : techniques éprouvées', body: 'La méditation, la respiration profonde et le sport sont vos meilleurs alliés...', authorId: 'u_003', authorName: 'Admin Système', publishedAt: '2026-03-08T09:00:00Z', tags: ['stress', 'bien-être', 'mental'], isPublished: false, },
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
        fullName: 'Antoine AGBA',
        email: 'antoine.agba@gmail.com',
        phone: '+228 99 99 01 01',
        dateOfBirth: '2000-03-03',
        gender: 'male',
        patientType: 'hypertension',
        hospitalId: 'h_001',
        hospitalName: 'CHU Sylvanus Olympio',
        doctorId: 'd_001',
        healthRecordImageUrl: 'https://placehold.co/800x600/dbeafe/1d4ed8?text=Dossier+Médical',
        receiptImageUrl: 'https://placehold.co/800x400/d1fae5/065f46?text=Reçu+Consultation',
        status: 'pending',
        submittedAt: '2026-03-26T07:00:00Z',
    },
    {
        id: 'req_002',
        fullName: 'Lucie EDOH',
        email: 'lucie.edoh@gmail.com',
        phone: '+228 97 66 12 12',
        dateOfBirth: '1985-11-22',
        gender: 'female',
        patientType: 'diabetes',
        hospitalId: 'h_001',
        hospitalName: 'CHU Sylvanus Olympio',
        doctorId: 'd_001',
        healthRecordImageUrl: 'https://placehold.co/800x600/dbeafe/1d4ed8?text=Dossier+Médical',
        receiptImageUrl: 'https://placehold.co/800x400/d1fae5/065f46?text=Reçu+Consultation',
        status: 'pending',
        submittedAt: '2026-03-17T14:30:00Z',
    },
    {
        id: 'req_003',
        fullName: 'Marc AGBAGNON',
        email: 'marc.agbagnon@gmail.com',
        phone: '+228 90 44 33 22',
        dateOfBirth: '1960-03-08',
        gender: 'male',
        patientType: 'both',
        hospitalId: 'h_001',
        hospitalName: 'CHU Sylvanus Olympio',
        doctorId: 'd_001',
        healthRecordImageUrl: 'https://placehold.co/800x600/dbeafe/1d4ed8?text=Dossier+Médical',
        receiptImageUrl: 'https://placehold.co/800x400/d1fae5/065f46?text=Reçu+Consultation',
        status: 'approved',
        submittedAt: '2026-03-15T11:00:00Z',
        reviewedAt: '2026-03-16T09:00:00Z',
    },
    {
        id: 'req_004',
        fullName: 'Sylvie MEBA',
        email: 'sylvie.meba@email.com',
        phone: '+228 91 22 33 44',
        dateOfBirth: '1992-07-19',
        gender: 'female',
        patientType: 'hypertension',
        hospitalId: 'h_001',
        hospitalName: 'CHU Sylvanus Olympio',
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
    {
        id: 'presc_004',
        patientId: 'p_003',
        referenceNumber: 'ORD-2026-0210-D',
        imageUrl: 'https://placehold.co/800x600/fff7ed/c2410c?text=Ordonnance+N°ORD-2026-0210-D',
        issuedAt: '2026-02-10T00:00:00Z',
        expiresAt: '2026-05-10T00:00:00Z',
        doctorId: 'd_002',
        medications: [
            {
                id: 'med_005',
                prescriptionId: 'presc_004',
                name: 'Furosémide',
                dosage: '40mg',
                intakeTimes: ['08:00'],
                renewalDays: 30,
                startDate: '2026-02-10',
                endDate: '2026-05-10',
            },
            {
                id: 'med_006',
                prescriptionId: 'presc_004',
                name: 'Bisoprolol',
                dosage: '5mg',
                intakeTimes: ['08:00', '20:00'],
                renewalDays: 30,
                startDate: '2026-02-10',
                endDate: '2026-05-10',
            },
        ],
    },
    {
        id: 'presc_005',
        patientId: 'p_005',
        referenceNumber: 'ORD-2026-0301-E',
        imageUrl: 'https://placehold.co/800x600/fff7ed/c2410c?text=Ordonnance+N°ORD-2026-0301-E',
        issuedAt: '2026-03-01T00:00:00Z',
        expiresAt: '2026-06-01T00:00:00Z',
        doctorId: 'd_003',
        medications: [
            {
                id: 'med_007',
                prescriptionId: 'presc_005',
                name: 'Amlodipine',
                dosage: '10mg',
                intakeTimes: ['08:00'],
                renewalDays: 30,
                startDate: '2026-03-01',
                endDate: '2026-06-01',
            },
            {
                id: 'med_008',
                prescriptionId: 'presc_005',
                name: 'Losartan',
                dosage: '100mg',
                intakeTimes: ['08:00'],
                renewalDays: 30,
                startDate: '2026-03-01',
                endDate: '2026-06-01',
            },
        ],
    },
    {
        id: 'presc_006',
        patientId: 'p_007',
        referenceNumber: 'ORD-2026-0115-F',
        imageUrl: 'https://placehold.co/800x600/fff7ed/c2410c?text=Ordonnance+N°ORD-2026-0115-F',
        issuedAt: '2026-01-15T00:00:00Z',
        expiresAt: '2026-04-15T00:00:00Z',
        doctorId: 'd_001',
        medications: [
            {
                id: 'med_009',
                prescriptionId: 'presc_006',
                name: 'Périndopril',
                dosage: '5mg',
                intakeTimes: ['08:00'],
                renewalDays: 30,
                startDate: '2026-01-15',
                endDate: '2026-04-15',
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

    { id: 'ms_011', patientId: 'p_002', type: 'heart_rate', value: 112, unit: 'bpm', feeling: 'Essoufflée', takenBy: 'self', recordedAt: daysAgo(1), week: 12 },
    { id: 'ms_012', patientId: 'p_002', type: 'heart_rate', value: 98, unit: 'bpm', takenBy: 'self', recordedAt: daysAgo(3), week: 12 },
    { id: 'ms_013', patientId: 'p_002', type: 'heart_rate', value: 105, unit: 'bpm', takenBy: 'healthcare', takenByName: 'Inf.', takenBySurname: 'Laurent', takenByAge: 40, recordedAt: daysAgo(8), week: 11 },
    { id: 'ms_014', patientId: 'p_002', type: 'heart_rate', value: 88, unit: 'bpm', takenBy: 'self', recordedAt: daysAgo(10), week: 11 },

    { id: 'ms_015', patientId: 'p_007', type: 'blood_pressure', value: 142, value2: 88, unit: 'mmHg', takenBy: 'self', recordedAt: daysAgo(6), week: 11 },
    { id: 'ms_016', patientId: 'p_007', type: 'blood_pressure', value: 138, value2: 85, unit: 'mmHg', takenBy: 'self', recordedAt: daysAgo(8), week: 11 },
    { id: 'ms_017', patientId: 'p_007', type: 'blood_pressure', value: 145, value2: 90, unit: 'mmHg', takenBy: 'self', recordedAt: daysAgo(10), week: 11 },
    { id: 'ms_018', patientId: 'p_007', type: 'heart_rate', value: 78, unit: 'bpm', takenBy: 'self', recordedAt: daysAgo(10), week: 11 },

    { id: 'ms_019', patientId: 'p_004', type: 'weight', value: 94, unit: 'kg', feeling: 'Correctement', takenBy: 'self', recordedAt: daysAgo(14), week: 10 },
    { id: 'ms_020', patientId: 'p_004', type: 'weight', value: 93.5, unit: 'kg', takenBy: 'self', recordedAt: daysAgo(21), week: 9 },
    { id: 'ms_021', patientId: 'p_003', type: 'heart_rate',     value: 95,   unit: 'bpm',    feeling: 'Essoufflé', takenBy: 'self',       recordedAt: daysAgo(0), week: 12 },
    { id: 'ms_022', patientId: 'p_003', type: 'heart_rate',     value: 98,   unit: 'bpm',    takenBy: 'self',       recordedAt: daysAgo(1), week: 12 },
    { id: 'ms_023', patientId: 'p_003', type: 'glucose',        value: 8.9,  unit: 'mmol/L', feeling: 'Fatigué',   takenBy: 'self',       recordedAt: daysAgo(1), week: 12 },
    { id: 'ms_024', patientId: 'p_003', type: 'heart_rate',     value: 102,  unit: 'bpm',    takenBy: 'healthcare', takenByName: 'Inf.', takenBySurname: 'Brun', takenByAge: 38, recordedAt: daysAgo(3), week: 12 },
    { id: 'ms_025', patientId: 'p_003', type: 'glucose',        value: 9.2,  unit: 'mmol/L', takenBy: 'self',       recordedAt: daysAgo(4), week: 11 },
    { id: 'ms_026', patientId: 'p_003', type: 'weight',         value: 94,   unit: 'kg',     takenBy: 'self',       recordedAt: daysAgo(7), week: 11 },

    { id: 'ms_027', patientId: 'p_005', type: 'blood_pressure', value: 195, value2: 115, unit: 'mmHg', feeling: 'Maux de tête',  takenBy: 'self',   recordedAt: daysAgo(0), week: 12 },
    { id: 'ms_028', patientId: 'p_005', type: 'blood_pressure', value: 178, value2: 108, unit: 'mmHg', takenBy: 'self',           recordedAt: daysAgo(1), week: 12 },
    { id: 'ms_029', patientId: 'p_005', type: 'blood_pressure', value: 182, value2: 110, unit: 'mmHg', takenBy: 'family', takenByName: 'Paul', takenBySurname: 'Rousseau', takenByAge: 45, recordedAt: daysAgo(2), week: 12 },
    { id: 'ms_030', patientId: 'p_005', type: 'blood_pressure', value: 190, value2: 112, unit: 'mmHg', feeling: 'Très fatigué',  takenBy: 'self',   recordedAt: daysAgo(7), week: 11 },
    { id: 'ms_031', patientId: 'p_005', type: 'blood_pressure', value: 175, value2: 105, unit: 'mmHg', takenBy: 'self',           recordedAt: daysAgo(8), week: 11 },
    { id: 'ms_032', patientId: 'p_005', type: 'weight',         value: 82,  unit: 'kg',  takenBy: 'self',                          recordedAt: daysAgo(7), week: 11 },

    { id: 'ms_033', patientId: 'p_004', type: 'weight',         value: 93.2, unit: 'kg', feeling: 'Bien', takenBy: 'self', recordedAt: daysAgo(2), week: 12 },
    { id: 'ms_034', patientId: 'p_004', type: 'weight',         value: 93.5, unit: 'kg', takenBy: 'self',                  recordedAt: daysAgo(7), week: 11 },
    { id: 'ms_035', patientId: 'p_004', type: 'heart_rate',     value: 88,   unit: 'bpm', takenBy: 'self',                 recordedAt: daysAgo(7), week: 11 },

    { id: 'ms_036', patientId: 'p_007', type: 'blood_pressure', value: 148, value2: 92, unit: 'mmHg', feeling: 'Correct', takenBy: 'self', recordedAt: daysAgo(0), week: 12 },
    { id: 'ms_037', patientId: 'p_007', type: 'blood_pressure', value: 144, value2: 89, unit: 'mmHg', takenBy: 'self',                     recordedAt: daysAgo(1), week: 12 },
    { id: 'ms_038', patientId: 'p_007', type: 'heart_rate',     value: 76,  unit: 'bpm', takenBy: 'self',                                  recordedAt: daysAgo(1), week: 12 },

];

// ─── Medication Intake Logs ───────────────────────────────────
export let MOCK_MEDICATION_INTAKES: MedicationIntake[] = [
    { id: 'mi_001', medicationId: 'med_001', patientId: 'p_001', scheduledTime: '08:00', takenAt: daysAgo(0).slice(0, 10) + 'T08:05:00Z', missed: false, date: daysAgo(0).slice(0, 10) },
    { id: 'mi_002', medicationId: 'med_001', patientId: 'p_001', scheduledTime: '08:00', takenAt: daysAgo(1).slice(0, 10) + 'T08:12:00Z', missed: false, date: daysAgo(1).slice(0, 10) },
    { id: 'mi_003', medicationId: 'med_001', patientId: 'p_001', scheduledTime: '08:00', missed: true, date: daysAgo(2).slice(0, 10) },
    { id: 'mi_004', medicationId: 'med_001', patientId: 'p_001', scheduledTime: '08:00', takenAt: daysAgo(3).slice(0, 10) + 'T08:30:00Z', missed: false, date: daysAgo(3).slice(0, 10) },
    { id: 'mi_005', medicationId: 'med_001', patientId: 'p_001', scheduledTime: '08:00', takenAt: daysAgo(4).slice(0, 10) + 'T08:02:00Z', missed: false, date: daysAgo(4).slice(0, 10) },

    { id: 'mi_006', medicationId: 'med_002', patientId: 'p_001', scheduledTime: '08:00', takenAt: daysAgo(0).slice(0, 10) + 'T08:05:00Z', missed: false, date: daysAgo(0).slice(0, 10) },
    { id: 'mi_007', medicationId: 'med_002', patientId: 'p_001', scheduledTime: '20:00', takenAt: daysAgo(0).slice(0, 10) + 'T20:10:00Z', missed: false, date: daysAgo(0).slice(0, 10) },
    { id: 'mi_008', medicationId: 'med_002', patientId: 'p_001', scheduledTime: '08:00', missed: true, date: daysAgo(1).slice(0, 10) },
    { id: 'mi_009', medicationId: 'med_002', patientId: 'p_001', scheduledTime: '20:00', takenAt: daysAgo(1).slice(0, 10) + 'T20:05:00Z', missed: false, date: daysAgo(1).slice(0, 10) },
    { id: 'mi_010', medicationId: 'med_002', patientId: 'p_001', scheduledTime: '08:00', takenAt: daysAgo(2).slice(0, 10) + 'T08:20:00Z', missed: false, date: daysAgo(2).slice(0, 10) },
    { id: 'mi_011', medicationId: 'med_002', patientId: 'p_001', scheduledTime: '20:00', missed: true, date: daysAgo(2).slice(0, 10) },

    { id: 'mi_012', medicationId: 'med_004', patientId: 'p_002', scheduledTime: '08:00', takenAt: daysAgo(0).slice(0, 10) + 'T08:00:00Z', missed: false, date: daysAgo(0).slice(0, 10) },
    { id: 'mi_013', medicationId: 'med_004', patientId: 'p_002', scheduledTime: '20:00', missed: true, date: daysAgo(0).slice(0, 10) },
    { id: 'mi_014', medicationId: 'med_004', patientId: 'p_002', scheduledTime: '08:00', missed: true, date: daysAgo(1).slice(0, 10) },
    { id: 'mi_015', medicationId: 'med_004', patientId: 'p_002', scheduledTime: '20:00', takenAt: daysAgo(1).slice(0, 10) + 'T20:30:00Z', missed: false, date: daysAgo(1).slice(0, 10) },
    { id: 'mi_016', medicationId: 'med_005', patientId: 'p_003', scheduledTime: '08:00', takenAt: daysAgo(0).slice(0,10)+'T08:10:00Z', missed: false, date: daysAgo(0).slice(0,10) },
    { id: 'mi_017', medicationId: 'med_005', patientId: 'p_003', scheduledTime: '08:00', missed: true, date: daysAgo(1).slice(0,10) },
    { id: 'mi_018', medicationId: 'med_005', patientId: 'p_003', scheduledTime: '08:00', takenAt: daysAgo(2).slice(0,10)+'T08:20:00Z', missed: false, date: daysAgo(2).slice(0,10) },

    { id: 'mi_019', medicationId: 'med_006', patientId: 'p_003', scheduledTime: '08:00', takenAt: daysAgo(0).slice(0,10)+'T08:10:00Z', missed: false, date: daysAgo(0).slice(0,10) },
    { id: 'mi_020', medicationId: 'med_006', patientId: 'p_003', scheduledTime: '20:00', takenAt: daysAgo(0).slice(0,10)+'T20:05:00Z', missed: false, date: daysAgo(0).slice(0,10) },
    { id: 'mi_021', medicationId: 'med_006', patientId: 'p_003', scheduledTime: '08:00', missed: true, date: daysAgo(1).slice(0,10) },
    { id: 'mi_022', medicationId: 'med_006', patientId: 'p_003', scheduledTime: '20:00', takenAt: daysAgo(1).slice(0,10)+'T20:30:00Z', missed: false, date: daysAgo(1).slice(0,10) },

    { id: 'mi_023', medicationId: 'med_007', patientId: 'p_005', scheduledTime: '08:00', takenAt: daysAgo(0).slice(0,10)+'T08:00:00Z', missed: false, date: daysAgo(0).slice(0,10) },
    { id: 'mi_024', medicationId: 'med_007', patientId: 'p_005', scheduledTime: '08:00', takenAt: daysAgo(1).slice(0,10)+'T08:15:00Z', missed: false, date: daysAgo(1).slice(0,10) },
    { id: 'mi_025', medicationId: 'med_007', patientId: 'p_005', scheduledTime: '08:00', missed: true, date: daysAgo(2).slice(0,10) },

    { id: 'mi_026', medicationId: 'med_008', patientId: 'p_005', scheduledTime: '08:00', takenAt: daysAgo(0).slice(0,10)+'T08:00:00Z', missed: false, date: daysAgo(0).slice(0,10) },
    { id: 'mi_027', medicationId: 'med_008', patientId: 'p_005', scheduledTime: '08:00', missed: true, date: daysAgo(1).slice(0,10) },
    { id: 'mi_028', medicationId: 'med_008', patientId: 'p_005', scheduledTime: '08:00', takenAt: daysAgo(2).slice(0,10)+'T08:05:00Z', missed: false, date: daysAgo(2).slice(0,10) },

    { id: 'mi_029', medicationId: 'med_009', patientId: 'p_007', scheduledTime: '08:00', takenAt: daysAgo(0).slice(0,10)+'T08:02:00Z', missed: false, date: daysAgo(0).slice(0,10) },
    { id: 'mi_030', medicationId: 'med_009', patientId: 'p_007', scheduledTime: '08:00', takenAt: daysAgo(1).slice(0,10)+'T08:10:00Z', missed: false, date: daysAgo(1).slice(0,10) },
    { id: 'mi_031', medicationId: 'med_009', patientId: 'p_007', scheduledTime: '08:00', takenAt: daysAgo(2).slice(0,10)+'T08:00:00Z', missed: false, date: daysAgo(2).slice(0,10) },
];

// ─── Measurement Frequencies ──────────────────────────────────
export let MOCK_FREQUENCIES: MeasurementFrequency[] = [
    { patientId: 'p_001', timesPerWeek: 5, doctorId: 'd_001', updatedAt: '2026-03-01T00:00:00Z' },
    { patientId: 'p_002', timesPerWeek: 3, doctorId: 'd_001', updatedAt: '2026-02-15T00:00:00Z' },
    { patientId: 'p_004', timesPerWeek: 2, doctorId: 'd_001', updatedAt: '2026-03-10T00:00:00Z' },
    { patientId: 'p_007', timesPerWeek: 4, doctorId: 'd_001', updatedAt: '2026-02-20T00:00:00Z' },
];

// ─── Doctor Notifications (to patients) ──────────────────────
// Remplace MOCK_DOCTOR_NOTIFICATIONS par ceci :
export let MOCK_DOCTOR_NOTIFICATIONS: DoctorNotification[] = [
    {
        id: 'dn_001',
        doctorId: 'd_001',
        patientId: 'p_001',
        patientName: 'Kodjo Agbéko',
        message: 'Votre tension artérielle est très élevée. Veuillez prendre vos médicaments et me contacter si cela persiste.',
        sentAt: daysAgo(1),
        read: false,
    },
    {
        id: 'dn_002',
        doctorId: 'd_001',
        patientId: 'p_002',
        patientName: 'kouvi Mensah',
        message: 'Rappel: veuillez effectuer vos mesures quotidiennes conformément à la fréquence prescrite.',
        sentAt: daysAgo(3),
        read: true,
    },
    {
        id: 'dn_003',
        doctorId: 'd_001',
        patientId: 'p_007',
        patientName: 'Nicolas ABALO',
        message: 'Vos mesures de la semaine sont insuffisantes. Merci de mesurer votre tension chaque matin.',
        sentAt: daysAgo(5),
        read: true,
    },
    {
        id: 'dn_004',
        doctorId: 'd_001',
        patientId: 'p_004',
        patientName: 'ophie LAWANI',
        message: 'Bonjour Sophie, pensez à peser tous les 2 jours et à noter vos sensations dans l\'application.',
        sentAt: daysAgo(7),
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
            { id: 'alerts', label: 'Alertes', icon: 'fas fa-bell', route: '/alerts', badge: '' },
        ],
    },
    {
        section: 'Suivi',
        items: [
            { id: 'notifications', label: 'Notifications envoyées', icon: 'fas fa-paper-plane', route: '/notifications' },
            { id: 'monitoring', label: 'Suivi des patients', icon: 'fas fa-heartbeat', route: '/monitoring' },
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