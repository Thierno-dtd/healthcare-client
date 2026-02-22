// ============================================================
// Constantes applicatives typées
// ============================================================

import type { MenuConfig, DashboardCardsConfig } from '@shared/types';

// --- Routes ---
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  DIAGNOSTIC_IA: '/diagnostic-ia',
  EXPERT_MEDICAL: '/expert-medical',
  EXAMENS: '/examens',
  DISPONIBILITES: '/disponibilites',
  VERIFICATION_QR: '/verification-qr',
  UNAUTHORIZED: '/unauthorized',
  PATIENT: {
    DOSSIER: '/patient/dossier',
    ETAT_SANTE: '/patient/etat-sante',
    MEDICAMENTS: '/patient/medicaments',
  },
  MEDECIN: {
    PATIENTS: '/medecin/patients',
    CAS_SPECIAUX: '/medecin/cas-speciaux',
    ORDONNANCES: '/medecin/ordonnances',
  },
  PHARMACIEN: {
    SCAN_QR: '/pharmacien/scan-qr',
    GESTION: '/pharmacien/gestion',
    STOCK: '/pharmacien/stock',
  },
  ADMIN: {
    USERS: '/admin/users',
    MEDECINS: '/admin/medecins',
    PHARMACIENS: '/admin/pharmaciens',
    ETABLISSEMENTS: '/admin/etablissements',
    STATISTIQUES: '/admin/statistiques',
    SETTINGS: '/admin/settings',
  },
} as const;

// --- Types d'examens ---
export const TYPES_EXAMENS = [
  'Radiographie', 'Scanner', 'IRM', 'Échographie', 'Électrocardiogramme (ECG)',
  'Endoscopie', 'Mammographie', 'Échographie Doppler', 'PET Scan', 'Biopsie',
] as const;

// --- Spécialités ---
export const SPECIALITES = [
  'Cardiologie', 'Dermatologie', 'Neurologie', 'Pédiatrie', 'Chirurgie générale',
  'Orthopédie', 'Ophtalmologie', 'Psychiatrie', 'Gynécologie', 'Urologie',
  'ORL', 'Médecine générale', 'Radiologie', 'Anesthésiologie', 'Gastro-entérologie',
  'Pneumologie', 'Rhumatologie', 'Endocrinologie', 'Oncologie', 'Néphrologie',
] as const;

// --- Groupes sanguins ---
export const GROUPES_SANGUINS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

// --- Messages d'erreur ---
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Email invalide',
  INVALID_PASSWORD: 'Le mot de passe doit contenir au moins 8 caractères',
  PASSWORDS_NOT_MATCH: 'Les mots de passe ne correspondent pas',
  LOGIN_FAILED: 'Email ou mot de passe incorrect',
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  FILE_TOO_LARGE: 'Le fichier est trop volumineux',
  INVALID_FILE_TYPE: 'Type de fichier non autorisé',
  UPLOAD_FAILED: "Échec de l'upload du fichier",
} as const;

// --- Messages de succès ---
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  REGISTER_SUCCESS: 'Inscription réussie',
  UPDATE_SUCCESS: 'Mise à jour réussie',
  DELETE_SUCCESS: 'Suppression réussie',
  UPLOAD_SUCCESS: 'Fichier uploadé avec succès',
  SAVE_SUCCESS: 'Enregistrement réussi',
} as const;

// --- Pagination ---
export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  MAX_PAGES_DISPLAYED: 5,
} as const;

// --- Upload ---
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'] as const,
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'] as const,
} as const;

// --- Role labels ---
export const ROLE_LABELS: Record<string, string> = {
  medecin: 'Médecin',
  patient: 'Patient',
  pharmacien: 'Pharmacien',
  admin: 'Administrateur',
};

// --- Page titles mapping ---
export const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Tableau de bord',
  'diagnostic-ia': 'Diagnostic IA',
  'expert-medical': 'Expert Médical',
  examens: 'Examens médicaux',
  disponibilites: 'Disponibilités des centres',
  'verification-qr': 'Vérification QR',
  'patient/dossier': 'Mon dossier médical',
  'patient/etat-sante': 'Mon état de santé',
  'patient/medicaments': 'Mes médicaments',
  'medecin/patients': 'Dossiers patients',
  'medecin/cas-speciaux': 'Cas spéciaux',
  'medecin/ordonnances': 'Ordonnances',
  'pharmacien/scan-qr': 'Scanner ordonnance',
  'pharmacien/gestion': 'Gestion pharmacie',
  'pharmacien/stock': 'Gestion du stock',
  'admin/users': 'Utilisateurs',
  'admin/medecins': 'Médecins',
  'admin/pharmaciens': 'Pharmaciens',
  'admin/etablissements': 'Établissements',
  'admin/statistiques': 'Statistiques',
  'admin/settings': 'Paramètres',
};
