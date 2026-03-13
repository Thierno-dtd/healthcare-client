// ============================================================
// Mock Data — Source unique de vérité
// Toutes les entités sont liées par IDs.
// Remplace chaque export par un appel API quand le backend est prêt.
// ============================================================

import type {
  User, Medecin, Patient, Pharmacien, Admin,
} from '@shared/types/user.types';
import type {
  Notification, PatientSummary, Etablissement,
} from '@shared/types/medical.types';
import type {
  PatientRecord, ConsultationRecord, HospitalisationRecord,
  AnalyseRecord, OrdonnanceRecord,
} from '@shared/types/patient-record.types';
import type { DashboardCard, MenuConfig, MenuSection } from '@shared/types/common.types';

/* ══════════════════════════════════════════════════════════════
   SECTION 1 — UTILISATEURS
══════════════════════════════════════════════════════════════ */

export const MOCK_USERS: Record<string, User> = {
  medecin: {
    id: 'med_001',
    nom: 'BEGNI',
    prenom: 'Touna',
    email: 'begni.touna@lamesse.com',
    role: 'medecin',
    avatar: 'BT',
    specialite: 'Cardiologie',
    telephone: '+228 91 45 38 82',
    numeroOrdre: 'ORD-12345',
  } as Medecin,
  patient: {
    id: 'pat_001',
    nom: 'BIMA',
    prenom: 'Afi',
    email: 'bima.afi@gmail.com',
    role: 'patient',
    avatar: 'BA',
    age: 35,
    dateNaissance: '1989-05-15',
    groupeSanguin: 'A+',
    numeroSecu: '1 89 05 75 123 456 78',
  } as Patient,
  pharmacien: {
    id: 'pharm_001',
    nom: 'AKOSSIWA',
    prenom: 'Mantoba',
    email: 'akossiwa.montoba@lamesse.com',
    role: 'pharmacien',
    avatar: 'AM',
    pharmacie: 'Pharmacie Centrale',
    adresse: 'B.P 2123 Tokoin, Lomé',
    numeroOrdre: 'PHARM-67890',
  } as Pharmacien,
  admin: {
    id: 'admin_001',
    nom: 'Admin',
    prenom: 'Système',
    email: 'admin@lamesse.com',
    role: 'admin',
    avatar: 'AS',
    permissions: 'all',
  } as Admin,
};

/* ══════════════════════════════════════════════════════════════
   SECTION 2 — MÉDECINS
   Chaque médecin liste les patientIds auxquels il a accès.
   C'est cette liste qui alimente le sélecteur "Mon médecin"
   dans la prise de RDV patient.
══════════════════════════════════════════════════════════════ */

export interface MedecinRecord {
  id: string;
  nom: string;           // "Dr. Jean Dupont"
  prenom: string;
  nomComplet: string;    // affiché dans les selects
  specialite: string;
  telephone?: string;
  email?: string;
  hopital?: string;
  avatar: string;
  patientIds: string[];  // patients dont il a accès au dossier
}

export const MEDECINS: MedecinRecord[] = [
  {
    id: 'med_001',
    nom: 'Dupont',
    prenom: 'Jean',
    nomComplet: 'Dr. Jean Dupont',
    specialite: 'Cardiologie',
    telephone: '+228 91 45 38 82',
    email: 'jean.dupont@hopital.com',
    hopital: 'Hôpital Général de Lomé',
    avatar: 'JD',
    patientIds: ['pat_001', 'pat_002'],
  },
  {
    id: 'med_002',
    nom: 'Laurent',
    prenom: 'Sophie',
    nomComplet: 'Dr. Sophie Laurent',
    specialite: 'Médecine générale',
    telephone: '+228 90 12 34 56',
    email: 'sophie.laurent@clinique.com',
    hopital: 'Clinique du Parc',
    avatar: 'SL',
    patientIds: ['pat_001'],
  },
  {
    id: 'med_003',
    nom: 'Martin',
    prenom: 'Claire',
    nomComplet: 'Dr. Claire Martin',
    specialite: 'Neurologie',
    telephone: '+228 92 34 56 78',
    email: 'claire.martin@chu.com',
    hopital: 'CHU Saint-Louis',
    avatar: 'CM',
    patientIds: ['pat_001'],
  },
];

/**
 * Retourne les médecins qui ont accès au dossier d'un patient.
 * Utilisé dans le sélecteur de médecin lors d'une prise de RDV.
 */
export const getMedecinsForPatient = (patientId: string): MedecinRecord[] =>
  MEDECINS.filter((m) => m.patientIds.includes(patientId));

/* ══════════════════════════════════════════════════════════════
   SECTION 3 — PATIENTS
══════════════════════════════════════════════════════════════ */

export const PATIENTS: PatientSummary[] = [
  { id: 'pat_001', nom: 'BIMA Afi',       age: 35, groupeSanguin: 'A+', dernierExamen: '2026-02-20', status: 'Stable',        avatar: 'BA' },
  { id: 'pat_002', nom: 'Bernard Pierre', age: 52, groupeSanguin: 'O+', dernierExamen: '2026-03-10', status: 'Suivi requis',   avatar: 'BP' },
  { id: 'pat_003', nom: 'Dubois Sophie',  age: 28, groupeSanguin: 'B+', dernierExamen: '2026-01-15', status: 'Stable',        avatar: 'SD' },
];

export const PATIENT_RECORDS: PatientRecord[] = [
  {
    id: 'pat_001',
    nom: 'BIMA',
    prenom: 'Afi',
    sexe: 'F',
    age: 35,
    dateNaissance: '1989-05-15',
    groupeSanguin: 'A+',
    telephone: '+228 91 11 22 33',
    email: 'bima.afi@gmail.com',
    adresse: 'Rue des Fleurs 12, Lomé',
    numeroDossier: 'D001-2026',
    securiteSociale: '1 89 05 75 123 456 78',
    allergies: ['Pénicilline'],
    antecedents: [
      { id: 'ant_001', titre: 'Hypertension artérielle', date: '2019', description: 'Diagnostiquée en 2019, traitée par Amlodipine.' },
      { id: 'ant_002', titre: 'Appendicectomie',         date: '2005', description: 'Chirurgie appendicite aiguë, sans complications.' },
    ],
    timeline: [
      { id: 'tl_001', date: '2024-09-12', title: 'Consultation cardiologie',       description: 'Suivi hypertension, ajustement traitement.', category: 'Consultation' },
      { id: 'tl_002', date: '2026-01-10', title: 'Hospitalisation cardiologique',  description: 'Décompensation cardiaque, 5 jours.',           category: 'Hospitalisation' },
      { id: 'tl_003', date: '2026-02-05', title: 'Bilan sanguin',                  description: 'Bilan biologique complet.',                   category: 'Analyse' },
      { id: 'tl_004', date: '2026-02-20', title: 'Consultation urgence',           description: 'Douleurs thoraciques, ECG réalisé.',           category: 'Consultation' },
      { id: 'tl_005', date: '2026-03-01', title: 'Ordonnance renouvelée',          description: 'Renouvellement Aspirine + Atorvastatine.',     category: 'Ordonnance' },
    ],
  },
  {
    id: 'pat_002',
    nom: 'Bernard',
    prenom: 'Pierre',
    sexe: 'M',
    age: 52,
    dateNaissance: '1972-02-18',
    groupeSanguin: 'O+',
    telephone: '+228 90 22 33 44',
    email: 'pierre.bernard@exemple.com',
    adresse: 'Avenue de la Santé 45, Lomé',
    numeroDossier: 'D002-2026',
    securiteSociale: '2 72 02 64 987 654 32',
    allergies: [],
    antecedents: [
      { id: 'ant_003', titre: 'Diabète de type 2', date: '2021', description: 'Suivi en cours, metformine 1g/j.' },
    ],
    timeline: [
      { id: 'tl_006', date: '2025-07-15', title: 'Contrôle glycémique', description: 'Bilan annuel diabète.',     category: 'Consultation' },
      { id: 'tl_007', date: '2026-03-10', title: 'Prise de sang',       description: 'Marqueurs métaboliques.', category: 'Analyse' },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   SECTION 4 — CONSULTATIONS
   Liées à : patientId, medecinId
   Référencées par : EXAMENS_PATIENT (consultationId), ORDONNANCES_RECORD (consultationId)
══════════════════════════════════════════════════════════════ */

export const CONSULTATIONS: ConsultationRecord[] = [
  {
    id: 'cons_001',
    patientId: 'pat_001',
    date: '2026-02-20',
    heure: '10:30',
    hopital: 'Hôpital Général de Lomé',
    medecin: 'Dr. Jean Dupont',
    medecinId: 'med_001',
    motif: 'Douleurs thoraciques',
    diagnostic: 'Angine de poitrine',
    typeArrivee: 'Urgence',
    histoireMaladie: 'Douleurs intermittentes depuis 2 jours, irradiant vers le bras gauche.',
    examenClinique: 'Tension 160/100 mmHg, rythme cardiaque irrégulier à 92 bpm.',
    resumeSyndromique: 'Douleur constrictive du thorax, dyspnée d\'effort.',
    conduiteATenir: 'Mise sous bêtabloquants, surveillance tensionnelle, bilan cardiologique complet.',
    evolution: 'Amélioration après 24h de traitement. Patient stable.',
    antecedentsPersonnels: ['Hypertension artérielle (2019)', 'Appendicectomie (2005)'],
    antecedentsFamiliaux: ['Diabète type 2 (mère)', 'Infarctus du myocarde (père, 60 ans)'],
    hypothesesDiagnostiques: ['Syndrome coronarien aigu', 'Angor stable', 'Péricardite'],
    examensParacliniques: ['ECG', 'Troponine', 'Bilan lipidique', 'Écho cardiaque'],
    traitementsHabituels: ['Amlodipine 5mg/j', 'Aspirine 75mg/j'],
  },
  {
    id: 'cons_002',
    patientId: 'pat_001',
    date: '2024-09-12',
    heure: '14:00',
    hopital: 'Clinique du Parc',
    medecin: 'Dr. Sophie Laurent',
    medecinId: 'med_002',
    motif: 'Suivi hypertension',
    diagnostic: 'Hypertension artérielle contrôlée',
    typeArrivee: 'Consultation',
    histoireMaladie: 'Suivi mensuel de l\'hypertension artérielle diagnostiquée en 2019.',
    examenClinique: 'Tension 135/85 mmHg. Fréquence cardiaque 78 bpm. Examen cardio-pulmonaire normal.',
    resumeSyndromique: 'HTA bien contrôlée sous traitement.',
    conduiteATenir: 'Maintien du traitement. Contrôle dans 3 mois.',
    evolution: 'Stable.',
    antecedentsPersonnels: ['Hypertension artérielle'],
    antecedentsFamiliaux: [],
    hypothesesDiagnostiques: ['HTA essentielle'],
    examensParacliniques: ['Ionogramme', 'Créatinine'],
    traitementsHabituels: ['Amlodipine 5mg/j'],
  },
];

/* ══════════════════════════════════════════════════════════════
   SECTION 5 — HOSPITALISATIONS
══════════════════════════════════════════════════════════════ */

export const HOSPITALISATIONS: HospitalisationRecord[] = [
  {
    id: 'hosp_001',
    patientId: 'pat_001',
    dateAdmission: '2026-01-10',
    dateSortie: '2026-01-15',
    duree: '5 jours',
    chambre: '208B',
    hopital: 'Clinique du Parc',
    service: 'Cardiologie',
    motif: 'Décompensation cardiaque',
    diagnosticFinal: 'Insuffisance cardiaque congestive',
    traitementSortie: 'Furosémide 40mg + Ramipril 5mg',
    bilanARealiser: 'Échographie cardiaque de contrôle',
    prochainRdv: '2026-02-05',
    medecins: ['Dr. Jean Dupont', 'Dr. Claire Martin'],
    medecinIds: ['med_001', 'med_003'],
  },
];

/* ══════════════════════════════════════════════════════════════
   SECTION 6 — ANALYSES (prescrites lors de consultations)
   consultationId → lie l'analyse à la consultation source
   examPatientId  → lie l'analyse à l'examen patient correspondant
══════════════════════════════════════════════════════════════ */

export const ANALYSES: AnalyseRecord[] = [
  {
    id: 'ana_001',
    patientId: 'pat_001',
    consultationId: 'cons_001',       // prescrite lors de cons_001
    examPatientId: 'exam_pat_001',    // correspond à l'examen patient exam_pat_001
    date: '2026-02-05',
    type: 'Prise de sang',
    categorie: 'Biologie',
    prescripteur: 'Dr. Jean Dupont',
    medecinId: 'med_001',
    statut: 'Normal',
    effectuee: true,
    resultats: 'Glycémie 0.95 g/L (normale). Cholestérol total 2.3 g/L (légèrement élevé). Troponine négative.',
    interpretation: 'Bilan globalement satisfaisant. Suivi du cholestérol recommandé.',
    valeursReference: 'Glycémie < 1.10 g/L | Cholestérol < 2 g/L | Troponine < 0.04 µg/L',
  },
  {
    id: 'ana_002',
    patientId: 'pat_001',
    consultationId: 'cons_001',
    examPatientId: 'exam_pat_002',
    date: '2026-03-15',
    type: 'ECG',
    categorie: 'Cardiologie',
    prescripteur: 'Dr. Jean Dupont',
    medecinId: 'med_001',
    statut: 'En attente',
    effectuee: false,
    resultats: '',
    interpretation: '',
    valeursReference: 'Rythme sinusal normal, FC 60-100 bpm',
  },
];

/* ══════════════════════════════════════════════════════════════
   SECTION 7 — EXAMENS PATIENT
   Liés à une consultation (consultationId) et à une analyse (analyseId).
   Cliquer sur un examen dans PatientExams → détail de l'examen.
   Cliquer sur "Contexte médical" dans un examen → navigation vers la consultation.
   Cliquer sur une analyse dans HealthRecord → navigation vers PatientExams.
══════════════════════════════════════════════════════════════ */

export interface ExamenPatient {
  id: string;
  patientId: string;
  consultationId: string;   // consultation qui a prescrit l'examen
  analyseId?: string;       // analyse correspondante dans ANALYSES
  type: string;
  date: string;
  statut: 'Planifié' | 'Confirmé' | 'Réalisé' | 'Reporté' | 'Non réalisé';
  medecin: string;
  medecinId: string;
  hopital: string;
  service: string;
  motif: string;
  instructions?: string;
  resultats?: string;
  fichiers?: string[];
}

export const EXAMENS_PATIENT: ExamenPatient[] = [
  {
    id: 'exam_pat_001',
    patientId: 'pat_001',
    consultationId: 'cons_001',
    analyseId: 'ana_001',
    type: 'Prise de sang — Bilan biologique',
    date: '2026-02-05',
    statut: 'Réalisé',
    medecin: 'Dr. Jean Dupont',
    medecinId: 'med_001',
    hopital: 'Hôpital Général de Lomé',
    service: 'Laboratoire',
    motif: 'Bilan post-consultation urgence — douleurs thoraciques',
    instructions: 'À jeun 12h avant le prélèvement.',
    resultats: 'Cholestérol légèrement élevé. Glycémie normale. Troponine négative.',
    fichiers: ['bilan_sanguin_20260205.pdf'],
  },
  {
    id: 'exam_pat_002',
    patientId: 'pat_001',
    consultationId: 'cons_001',
    analyseId: 'ana_002',
    type: 'ECG — Électrocardiogramme',
    date: '2026-03-15',
    statut: 'Planifié',
    medecin: 'Dr. Jean Dupont',
    medecinId: 'med_001',
    hopital: 'Clinique du Parc',
    service: 'Cardiologie',
    motif: 'Suivi post-décompensation cardiaque',
    instructions: 'Se présenter 30 min avant. Éviter la caféine 24h avant.',
    fichiers: [],
  },
  {
    id: 'exam_pat_003',
    patientId: 'pat_001',
    consultationId: 'cons_002',
    type: 'Échographie cardiaque',
    date: '2026-04-10',
    statut: 'Planifié',
    medecin: 'Dr. Claire Martin',
    medecinId: 'med_003',
    hopital: 'CHU Saint-Louis',
    service: 'Imagerie médicale',
    motif: 'Bilan à réaliser suite à hospitalisation (hosp_001)',
    fichiers: [],
  },
  {
    id: 'exam_pat_004',
    patientId: 'pat_001',
    consultationId: 'cons_002',
    type: 'Ionogramme sanguin',
    date: '2024-09-15',
    statut: 'Réalisé',
    medecin: 'Dr. Sophie Laurent',
    medecinId: 'med_002',
    hopital: 'Clinique du Parc',
    service: 'Laboratoire',
    motif: 'Contrôle bilan ionique — suivi HTA',
    resultats: 'Na 139 mmol/L, K 4.1 mmol/L — Résultats normaux.',
    fichiers: ['ionogramme_20240915.pdf'],
  },
];

/* ══════════════════════════════════════════════════════════════
   SECTION EXAMENS (compatible ExamenDetail.tsx / Examens.tsx)
   IDs : EX001...  contextId : C001 | C002 | H001
══════════════════════════════════════════════════════════════ */

export interface ExamResult {
  dateResultat: string;
  commentaireMedecin: string;
  interpretation: string;
  fichiers: { nom: string; type: 'pdf' | 'image' }[];
}

export interface Exam {
  id: string;
  patientId: string;
  nom: string;
  date: string;
  lieu: string;
  statut: 'Planifié' | 'Confirmé' | 'Reporté' | 'Réalisé' | 'Non réalisé';
  dureeEstimee: string;
  contexte: 'Consultation' | 'Hospitalisation';
  contextId: string;
  resultat?: ExamResult;
}

export const EXAMS: Exam[] = [
  {
    id: 'EX001', patientId: 'pat_001', nom: 'NFS (Numération Formule Sanguine)', date: '05/03/2026',
    lieu: 'Laboratoire BioSanté, Paris', statut: 'Réalisé', dureeEstimee: '15 min',
    contexte: 'Consultation', contextId: 'C001',
    resultat: { dateResultat: '06/03/2026', commentaireMedecin: 'Résultats dans les limites normales', interpretation: 'Pas d\'anomalie détectée. Bilan sanguin satisfaisant.', fichiers: [{ nom: 'NFS_060326.pdf', type: 'pdf' }] }
  },
  {
    id: 'EX002', patientId: 'pat_001', nom: 'Fibroscopie gastrique', date: '20/03/2026',
    lieu: 'CHU Saint-Louis, Paris', statut: 'Planifié', dureeEstimee: '30 min',
    contexte: 'Consultation', contextId: 'C001',
  },
  {
    id: 'EX003', patientId: 'pat_001', nom: 'Scanner abdominal', date: '12/06/2025',
    lieu: 'CHU Saint-Louis, Paris', statut: 'Réalisé', dureeEstimee: '45 min',
    contexte: 'Hospitalisation', contextId: 'H001',
    resultat: { dateResultat: '12/06/2025', commentaireMedecin: 'Cholécystite chronique lithiasique confirmée', interpretation: 'Vésicule biliaire lithiasique avec épaississement pariétal modéré.', fichiers: [{ nom: 'Scanner_120625.pdf', type: 'pdf' }, { nom: 'Scanner_image.jpg', type: 'image' }] }
  },
  {
    id: 'EX004', patientId: 'pat_001', nom: 'Bilan lipidique complet', date: '15/01/2026',
    lieu: 'Laboratoire Cerba, Boulogne', statut: 'Réalisé', dureeEstimee: '10 min',
    contexte: 'Consultation', contextId: 'C002',
    resultat: { dateResultat: '16/01/2026', commentaireMedecin: 'Bilan lipidique satisfaisant', interpretation: 'Tous les paramètres sont dans les normes.', fichiers: [{ nom: 'Bilan_lipidique.pdf', type: 'pdf' }] }
  },
  {
    id: 'EX005', patientId: 'pat_001', nom: 'Radio pulmonaire', date: '20/09/2025',
    lieu: 'Clinique du Parc, Paris', statut: 'Réalisé', dureeEstimee: '10 min',
    contexte: 'Consultation', contextId: 'C001',
  },
  {
    id: 'EX006', patientId: 'pat_001', nom: 'IRM cérébrale', date: '10/04/2026',
    lieu: 'Centre d\'Imagerie Médicale, Lyon', statut: 'Confirmé', dureeEstimee: '45 min',
    contexte: 'Consultation', contextId: 'C001',
  },
  {
    id: 'EX007', patientId: 'pat_001', nom: 'Bilan hépatique', date: '01/07/2025',
    lieu: 'Laboratoire BioSanté, Paris', statut: 'Reporté', dureeEstimee: '15 min',
    contexte: 'Hospitalisation', contextId: 'H001',
  },
];

/* ══════════════════════════════════════════════════════════════
   SECTION ORDONNANCES PATIENT (compatible OrdonnancePatientDetail.tsx / OrdonnancesPatient.tsx)
   IDs : ORD001...  contextId : C001 | C002 | H001
══════════════════════════════════════════════════════════════ */

export interface MedicamentPrescrit {
  nom: string;
  dosage: string;
  forme: string;
  posologie: string;
  duree: string;
  instructions: string;
  achete: boolean;
}

export interface Prescription {
  id: string;
  medecin: string;
  patientId: string;
  date: string;
  contexte: 'Consultation' | 'Hospitalisation';
  contextId: string;
  status: string;
  medicaments: MedicamentPrescrit[];
}

export const PRESCRIPTIONS: Prescription[] = [
  {
    id: 'ORD001', medecin: 'Dr. Martin Dupont', patientId: 'pat_001', date: '05/03/2026',
    contexte: 'Consultation', contextId: 'C001', status: 'Active',
    medicaments: [
      { nom: 'Oméprazole',  dosage: '20mg',  forme: 'Gélule', posologie: '1 gélule le matin à jeun',   duree: '28 jours', instructions: 'À prendre 30 min avant le petit-déjeuner', achete: true },
      { nom: 'Gaviscon',    dosage: '500mg', forme: 'Sachet', posologie: '1 sachet après les 3 repas', duree: '14 jours', instructions: 'Bien agiter avant utilisation',            achete: false },
    ],
  },
  {
    id: 'ORD002', medecin: 'Dr. Sophie Laurent', patientId: 'pat_001', date: '15/01/2026',
    contexte: 'Consultation', contextId: 'C002', status: 'Active',
    medicaments: [
      { nom: 'Amlodipine', dosage: '5mg', forme: 'Comprimé', posologie: '1 comprimé le matin', duree: '6 mois', instructions: 'Ne pas interrompre sans avis médical', achete: true },
    ],
  },
  {
    id: 'ORD003', medecin: 'Dr. Martin Dupont', patientId: 'pat_001', date: '20/09/2025',
    contexte: 'Consultation', contextId: 'C001', status: 'Active',
    medicaments: [
      { nom: 'Paracétamol',   dosage: '1g',    forme: 'Comprimé', posologie: '1 comprimé toutes les 6h si fièvre', duree: '5 jours', instructions: 'Ne pas dépasser 4g par jour', achete: true },
      { nom: 'Carbocistéine', dosage: '750mg', forme: 'Sirop',    posologie: '1 cuillère à soupe 3x/jour',         duree: '7 jours', instructions: 'À prendre après les repas',   achete: true },
    ],
  },
  {
    id: 'ORD004', medecin: 'Dr. Jean Moreau', patientId: 'pat_001', date: '16/06/2025',
    contexte: 'Hospitalisation', contextId: 'H001', status: 'Terminée',
    medicaments: [
      { nom: 'Paracétamol', dosage: '1g',   forme: 'Comprimé', posologie: '1 comprimé toutes les 6h', duree: '5 jours',  instructions: 'Si douleur', achete: false },
      { nom: 'Pantoprazole',dosage: '40mg', forme: 'Comprimé', posologie: '1 comprimé le matin',       duree: '14 jours', instructions: 'À jeun',     achete: false },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   SECTION 8.1 — PRESCRIPTIONS (vue patient)
   Basé sur ORDONNANCES_RECORD, adapté pour PrescriptionData
══════════════════════════════════════════════════════════════ */

export interface MedicamentWithPurchase {
  nom: string;
  dosage: string;
  forme: string;
  posologie: string;
  duree: string;
  instructions: string;
  achete: boolean;
}

export interface PrescriptionData {
  id: string;
  patientId: string;
  ordonnanceId: string;
  medecin: string;
  date: string;
  contexte: "Consultation" | "Hospitalisation";
  contextId: string;
  status: string;
}

export const MOCK_PRESCRIPTIONS: PrescriptionData[] = [
  {
    id: 'pres_001',
    patientId: 'pat_001',
    ordonnanceId: 'ord_001',
    medecin: 'Dr. Jean Dupont',
    date: '2026-02-20',
    contexte: 'Consultation',
    contextId: 'cons_001',
    status: 'Active',
  },
  {
    id: 'pres_002',
    patientId: 'pat_001',
    ordonnanceId: 'ord_002',
    medecin: 'Dr. Jean Dupont',
    date: '2026-03-01',
    contexte: 'Consultation',
    contextId: 'cons_001',
    status: 'Active',
  },
  {
    id: 'pres_003',
    patientId: 'pat_001',
    ordonnanceId: 'ord_003',
    medecin: 'Dr. Sophie Laurent',
    date: '2024-09-12',
    contexte: 'Consultation',
    contextId: 'cons_002',
    status: 'Terminée',
  },
];

/* ══════════════════════════════════════════════════════════════
   SECTION 9 — TRAITEMENTS (suite aux ordonnances)
   ordonnanceId → lie le traitement à l'ordonnance source
══════════════════════════════════════════════════════════════ */

export interface TraitementPatient {
  id: string;
  patientId: string;
  ordonnanceId: string;
  consultationId: string;
  medicament: string;
  dosage: string;
  forme: string;
  frequence: number;      // nb de prises par jour
  duree: string;
  dateDebut: string;
  dateFin: string;
  horaires: string[];
  statut: 'en_cours' | 'terminé' | 'arrêté';
  instructions?: string;
  prescripteur: string;
  medecinId: string;
  prises: PriseTraitement[];
}

export interface PriseTraitement {
  id: string;
  date: string;           // "12/03/2026"
  heure: string;          // "08:00"
  statut: 'pris' | 'reporté' | 'ignoré' | 'en_attente';
}

export const TRAITEMENTS_PATIENT: TraitementPatient[] = [
  {
    id: 'tr_001',
    patientId: 'pat_001',
    ordonnanceId: 'ord_001',
    consultationId: 'cons_001',
    medicament: 'Aspirine',
    dosage: '75mg',
    forme: 'Comprimé',
    frequence: 1,
    duree: '30 jours',
    dateDebut: '21/02/2026',
    dateFin: '23/03/2026',
    horaires: ['08:00'],
    statut: 'en_cours',
    instructions: '1 comprimé le matin après le repas.',
    prescripteur: 'Dr. Jean Dupont',
    medecinId: 'med_001',
    prises: [
      { id: 'p_001', date: '12/03/2026', heure: '08:00', statut: 'pris' },
      { id: 'p_002', date: '11/03/2026', heure: '08:00', statut: 'pris' },
      { id: 'p_003', date: '10/03/2026', heure: '08:00', statut: 'ignoré' },
    ],
  },
  {
    id: 'tr_002',
    patientId: 'pat_001',
    ordonnanceId: 'ord_001',
    consultationId: 'cons_001',
    medicament: 'Bisoprolol',
    dosage: '2.5mg',
    forme: 'Comprimé',
    frequence: 1,
    duree: '30 jours',
    dateDebut: '21/02/2026',
    dateFin: '23/03/2026',
    horaires: ['08:00'],
    statut: 'en_cours',
    instructions: '1 comprimé le matin. Ne jamais arrêter brutalement.',
    prescripteur: 'Dr. Jean Dupont',
    medecinId: 'med_001',
    prises: [
      { id: 'p_004', date: '12/03/2026', heure: '08:00', statut: 'pris' },
      { id: 'p_005', date: '11/03/2026', heure: '08:00', statut: 'pris' },
    ],
  },
  {
    id: 'tr_003',
    patientId: 'pat_001',
    ordonnanceId: 'ord_002',
    consultationId: 'cons_001',
    medicament: 'Furosémide',
    dosage: '40mg',
    forme: 'Comprimé',
    frequence: 1,
    duree: '60 jours',
    dateDebut: '01/03/2026',
    dateFin: '30/04/2026',
    horaires: ['08:00'],
    statut: 'en_cours',
    instructions: 'Le matin, surveiller les apports en sel.',
    prescripteur: 'Dr. Jean Dupont',
    medecinId: 'med_001',
    prises: [
      { id: 'p_006', date: '12/03/2026', heure: '08:00', statut: 'pris' },
    ],
  },
  {
    id: 'tr_004',
    patientId: 'pat_001',
    ordonnanceId: 'ord_003',
    consultationId: 'cons_002',
    medicament: 'Amlodipine',
    dosage: '5mg',
    forme: 'Comprimé',
    frequence: 1,
    duree: '90 jours',
    dateDebut: '12/09/2024',
    dateFin: '10/12/2024',
    horaires: ['20:00'],
    statut: 'terminé',
    instructions: 'Le soir, à heure fixe.',
    prescripteur: 'Dr. Sophie Laurent',
    medecinId: 'med_002',
    prises: [],
  },
];

/* ══════════════════════════════════════════════════════════════
   SECTION 10 — RENDEZ-VOUS
   medecinId → lié à MEDECINS
   patientId → lié à PATIENTS
══════════════════════════════════════════════════════════════ */

export type StatutRdv = 'planifié' | 'confirmé' | 'reporté' | 'annulé' | 'terminé';
export type TypeRdv   = 'physique' | 'teleconsultation';

export interface RendezVous {
  id: string;
  patientId: string;
  medecinId: string;
  medecin: string;        // nomComplet dénormalisé pour affichage
  specialite: string;
  date: string;           // "20/03/2026"
  heure: string;          // "10:30"
  type: TypeRdv;
  statut: StatutRdv;
  motif: string;
  hopital?: string;
  service?: string;
  lieu?: string;
  appelActif?: boolean;
  notes?: string;
}

export const RENDEZ_VOUS: RendezVous[] = [
  {
    id: 'rdv_001',
    patientId: 'pat_001',
    medecinId: 'med_001',
    medecin: 'Dr. Jean Dupont',
    specialite: 'Cardiologie',
    date: '20/03/2026',
    heure: '10:30',
    type: 'physique',
    statut: 'confirmé',
    motif: 'Suivi cardiologique post-hospitalisation',
    hopital: 'Hôpital Général de Lomé',
    service: 'Cardiologie',
    lieu: 'Bâtiment B — Salle 204',
  },
  {
    id: 'rdv_002',
    patientId: 'pat_001',
    medecinId: 'med_002',
    medecin: 'Dr. Sophie Laurent',
    specialite: 'Médecine générale',
    date: '25/03/2026',
    heure: '14:00',
    type: 'teleconsultation',
    statut: 'planifié',
    motif: 'Résultats analyses biologiques',
    appelActif: false,
  },
  {
    id: 'rdv_003',
    patientId: 'pat_001',
    medecinId: 'med_003',
    medecin: 'Dr. Claire Martin',
    specialite: 'Neurologie',
    date: '10/04/2026',
    heure: '09:00',
    type: 'physique',
    statut: 'planifié',
    motif: 'Consultation neurologique — bilan préventif',
    hopital: 'CHU Saint-Louis',
    service: 'Neurologie',
    lieu: 'Bâtiment Imagerie',
  },
  {
    id: 'rdv_004',
    patientId: 'pat_001',
    medecinId: 'med_001',
    medecin: 'Dr. Jean Dupont',
    specialite: 'Cardiologie',
    date: '20/02/2026',
    heure: '10:30',
    type: 'physique',
    statut: 'terminé',
    motif: 'Consultation urgence — douleurs thoraciques',
    hopital: 'Hôpital Général de Lomé',
    service: 'Urgences',
    notes: 'ECG réalisé, bilan sanguin prescrit. Mise sous bêtabloquants.',
  },
  {
    id: 'rdv_005',
    patientId: 'pat_001',
    medecinId: 'med_002',
    medecin: 'Dr. Sophie Laurent',
    specialite: 'Médecine générale',
    date: '12/09/2024',
    heure: '14:00',
    type: 'physique',
    statut: 'terminé',
    motif: 'Suivi hypertension artérielle',
    hopital: 'Clinique du Parc',
    service: 'Consultations',
  },
  {
    id: 'rdv_006',
    patientId: 'pat_001',
    medecinId: 'med_002',
    medecin: 'Dr. Sophie Laurent',
    specialite: 'Médecine générale',
    date: '05/02/2026',
    heure: '16:00',
    type: 'teleconsultation',
    statut: 'annulé',
    motif: 'Téléconsultation — fièvre (annulée par patient)',
  },
];

/* ══════════════════════════════════════════════════════════════
   SECTION 11 — MESURES DE SANTÉ
   Données du suivi de santé du patient
══════════════════════════════════════════════════════════════ */

export type TypeMesure =
  | 'tension'
  | 'glycemie'
  | 'poids'
  | 'temperature'
  | 'frequence_cardiaque'
  | 'saturation'
  | 'effets_secondaires';

export interface MesureSante {
  id: string;
  patientId: string;
  date: string;
  heure: string;
  type: TypeMesure;
  valeurs: Record<string, number | string>;
  commentaire?: string;
  contexte?: string;   // ex: "à jeun", "post-prandial"
}

export const MESURES_SANTE: MesureSante[] = [
  { id: 'mes_001', patientId: 'pat_001', date: '2026-03-12', heure: '08:00', type: 'tension',             valeurs: { systolique: 138, diastolique: 88 }, commentaire: 'Matin, avant médicaments' },
  { id: 'mes_002', patientId: 'pat_001', date: '2026-03-11', heure: '08:00', type: 'tension',             valeurs: { systolique: 142, diastolique: 91 }, commentaire: 'Légèrement élevée' },
  { id: 'mes_003', patientId: 'pat_001', date: '2026-03-10', heure: '08:00', type: 'tension',             valeurs: { systolique: 135, diastolique: 85 } },
  { id: 'mes_004', patientId: 'pat_001', date: '2026-03-09', heure: '08:00', type: 'tension',             valeurs: { systolique: 140, diastolique: 90 } },
  { id: 'mes_005', patientId: 'pat_001', date: '2026-03-08', heure: '08:00', type: 'tension',             valeurs: { systolique: 133, diastolique: 84 } },
  { id: 'mes_006', patientId: 'pat_001', date: '2026-03-12', heure: '07:30', type: 'glycemie',            valeurs: { valeur: 0.95 }, contexte: 'à jeun' },
  { id: 'mes_007', patientId: 'pat_001', date: '2026-03-10', heure: '13:30', type: 'glycemie',            valeurs: { valeur: 1.42 }, contexte: 'post-prandial' },
  { id: 'mes_008', patientId: 'pat_001', date: '2026-03-12', heure: '09:00', type: 'poids',               valeurs: { valeur: 68.5 } },
  { id: 'mes_009', patientId: 'pat_001', date: '2026-03-05', heure: '09:00', type: 'poids',               valeurs: { valeur: 69.0 } },
  { id: 'mes_010', patientId: 'pat_001', date: '2026-02-26', heure: '09:00', type: 'poids',               valeurs: { valeur: 69.5 } },
  { id: 'mes_011', patientId: 'pat_001', date: '2026-03-12', heure: '08:00', type: 'frequence_cardiaque', valeurs: { bpm: 74 } },
  { id: 'mes_012', patientId: 'pat_001', date: '2026-03-11', heure: '08:00', type: 'frequence_cardiaque', valeurs: { bpm: 78 } },
  { id: 'mes_013', patientId: 'pat_001', date: '2026-03-10', heure: '08:00', type: 'frequence_cardiaque', valeurs: { bpm: 76 } },
  { id: 'mes_014', patientId: 'pat_001', date: '2026-03-12', heure: '08:05', type: 'saturation',          valeurs: { pourcentage: 98 } },
  { id: 'mes_015', patientId: 'pat_001', date: '2026-03-11', heure: '08:05', type: 'saturation',          valeurs: { pourcentage: 97 } },
];


/** Ordonnances d'un patient */
export const getOrdonnancesForPatient = (patientId: string): Prescription[] =>
  PRESCRIPTIONS.filter((o) => o.patientId === patientId);

/** Examens d'un patient */
export const getExamsForPatient = (patientId: string): Exam[] =>
  EXAMS.filter((e) => e.patientId === patientId);

/** Prescriptions d'un patient */
export const getPrescriptionsForPatient = (patientId: string): PrescriptionData[] =>
  MOCK_PRESCRIPTIONS.filter((p) => p.patientId === patientId);

/** Patient record */
export const getPatientRecord = (patientId: string): PatientRecord | undefined =>
  PATIENT_RECORDS.find((p) => p.id === patientId);

/** Consultations d'un patient */
export const getConsultationsForPatient = (patientId: string): ConsultationRecord[] =>
  CONSULTATIONS.filter((c) => c.patientId === patientId);

/** Hospitalisations d'un patient */
export const getHospitalisationsForPatient = (patientId: string): HospitalisationRecord[] =>
  HOSPITALISATIONS.filter((h) => h.patientId === patientId);


/* ══════════════════════════════════════════════════════════════
   SECTION 14 — DONNÉES INCHANGÉES (conservées de l'original)
══════════════════════════════════════════════════════════════ */

export const NOTIFICATIONS: Notification[] = [
  { id: 'notif_1', type: 'info',    title: 'Résultats disponibles',  message: 'Les résultats de votre bilan sanguin sont disponibles.',   date: new Date(Date.now() - 2 * 60 * 60 * 1000),       read: false, roles: ['patient'] },
  { id: 'notif_2', type: 'warning', title: 'Rendez-vous à venir',    message: 'RDV cardiologie le 20/03/2026 à 10h30.',                   date: new Date(Date.now() - 24 * 60 * 60 * 1000),      read: false, roles: ['patient', 'medecin'] },
  { id: 'notif_3', type: 'success', title: 'Ordonnance validée',     message: 'Votre ordonnance du 01/03/2026 a été renouvelée.',         date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),  read: true,  roles: ['patient'] },
  { id: 'notif_4', type: 'info',    title: 'Examen planifié',        message: 'ECG planifié le 15/03/2026 à la Clinique du Parc.',        date: new Date(Date.now() - 5 * 60 * 60 * 1000),       read: false, roles: ['patient'] },
];

export const ETABLISSEMENTS: Etablissement[] = [
  { id: 'etab_1', nom: 'Hôpital Général de Lomé', type: 'Hôpital',   adresse: '1 Rue de l\'Hôpital, Lomé',              telephone: '+228 22 21 25 01', services: ['Urgences', 'Cardiologie', 'Neurologie', 'Radiologie'], disponibilite: 'Disponible', coordinates: { lat: 6.1375, lng: 1.2123 } },
  { id: 'etab_2', nom: 'Pharmacie Centrale',       type: 'Pharmacie', adresse: 'B.P 2123 Tokoin, Lomé',                  telephone: '+228 22 21 30 10', services: ['Médicaments', 'Garde 24h'],                            disponibilite: 'Disponible', coordinates: { lat: 6.1375, lng: 1.2200 } },
  { id: 'etab_3', nom: 'Clinique du Parc',         type: 'Clinique',  adresse: '45 Boulevard de la République, Lomé',   telephone: '+228 22 50 67 89', services: ['Consultations', 'Imagerie', 'Laboratoire'],             disponibilite: 'Disponible', coordinates: { lat: 6.1300, lng: 1.2050 } },
  { id: 'etab_4', nom: 'CHU Saint-Louis',          type: 'Hôpital',   adresse: 'Avenue des Nations, Lomé',               telephone: '+228 22 25 40 00', services: ['Urgences', 'Neurologie', 'Chirurgie', 'Imagerie'],     disponibilite: 'Complet',    coordinates: { lat: 6.1450, lng: 1.2300 } },
];

// --- Journal achats pharmacie ---
export interface JournalAchatPharmacie {
  id: string;
  patientId: string;
  pharmacie: string;
  date: string;
  note: string;
  items: string[];
}

export const JOURNAL_ACHATS_PHARMACIE: JournalAchatPharmacie[] = [
  {
    id: 'achat_001',
    patientId: 'pat_001',
    pharmacie: 'Pharmacie Centrale',
    date: '2026-03-01',
    note: 'Achat médicaments post-consultation cardiologie',
    items: ['Aspirine 75mg', 'Atorvastatine 20mg', 'Bisoprolol 2.5mg'],
  },
  {
    id: 'achat_002',
    patientId: 'pat_001',
    pharmacie: 'Pharmacie du Parc',
    date: '2026-02-15',
    note: 'Renouvellement traitement hypertension',
    items: ['Amlodipine 5mg', 'Furosémide 40mg'],
  },
  {
    id: 'achat_003',
    patientId: 'pat_001',
    pharmacie: 'Pharmacie Saint-Louis',
    date: '2026-01-20',
    note: 'Achat médicaments post-hospitalisation',
    items: ['Ramipril 5mg', 'Aspirine 75mg'],
  },
];

// --- Dashboard cards (inchangé) ---
export const DASHBOARD_CARDS: { common: DashboardCard[] } & Partial<Record<string, DashboardCard[]>> = {
  common: [
    { id: 'examens', title: 'Examens médicaux', description: "Créez, planifiez et gérez l'historique de vos examens médicaux.", icon: 'fas fa-file-medical', route: '/examens', color: 'purple', roles: ['medecin', 'patient'] },
  ],
  patient: [
    { id: 'dossier-medical',         title: 'Mon dossier médical',    description: 'Consultez votre historique médical complet.',          icon: 'fas fa-folder-open',       route: '/patient/dossier',         color: 'blue',   badge: 'Pa' },
    { id: 'rendez-vous',             title: 'Mes rendez-vous',        description: 'Gérez vos consultations et suivis médicaux.',          icon: 'fas fa-calendar-check',    route: '/patient/rendez-vous',     color: 'teal',   badge: 'Pa' },
    { id: 'medicaments',             title: 'Mes traitements',        description: 'Suivez vos traitements et rappels de prise.',          icon: 'fas fa-pills',             route: '/patient/medicaments',     color: 'green',  badge: 'Pa' },
    { id: 'ordonnances',             title: 'Mes ordonnances',        description: 'Consultez vos prescriptions.',                        icon: 'fas fa-prescription',      route: '/patient/ordonnances',     color: 'amber',  badge: 'Pa' },
    { id: 'gestion-acces',           title: 'Gestion des accès',      description: 'Contrôlez qui accède à votre dossier.',               icon: 'fas fa-shield-alt',        route: '/patient/gestion-acces',   color: 'indigo', badge: 'Pa' },
    { id: 'disponibilites',          title: 'Recherche pharmacie',    description: 'Trouvez les pharmacies disponibles près de vous.',     icon: 'fas fa-map-marker-alt',    route: '/patient/disponibilites',  color: 'orange', badge: 'Pa' },
    { id: 'expert-medical-patient',  title: 'Expert Médical IA',      description: 'Posez vos questions de santé à notre IA.',            icon: 'fas fa-robot',             route: '/patient/expert-medical',  color: 'green',  badge: 'Pa' },
    { id: 'appel-video-patient',     title: 'Appel vidéo',            description: 'Rejoignez vos téléconsultations.',                    icon: 'fas fa-video',             route: '/patient/appel-video',     color: 'teal',   badge: 'Pa' },
  ],
  medecin: [
    { id: 'diagnostic-ia',     title: 'Diagnostic IA',        description: "Analysez des images médicales avec l'IA.",    icon: 'fas fa-stethoscope',              route: '/medecin/diagnostic-ia',  color: 'blue',   badge: 'Dr' },
    { id: 'dossiers-patients', title: 'Dossiers patients',    description: 'Accédez aux dossiers de vos patients.',       icon: 'fas fa-user-injured',             route: '/medecin/patients',       color: 'blue',   badge: 'Dr' },
    { id: 'cas-speciaux',      title: 'Cas spéciaux',         description: 'Collaborez sur des cas complexes.',           icon: 'fas fa-user-friends',             route: '/medecin/cas-speciaux',   color: 'purple', badge: 'Dr' },
    { id: 'ordonnances',       title: 'Ordonnances QR',       description: 'Créez des ordonnances sécurisées.',           icon: 'fas fa-prescription',             route: '/medecin/ordonnances',    color: 'green',  badge: 'Dr' },
  ],
  pharmacien: [
    { id: 'dechiffrage-ordonnances', title: "Déchiffrage d'ordonnances", description: 'Scannez les ordonnances QR.',   icon: 'fas fa-qrcode',        route: '/pharmacien/scan-qr', color: 'blue', badge: 'Ph' },
    { id: 'gestion-pharmacie',       title: 'Gestion pharmacie',         description: 'Gérez votre stock.',            icon: 'fas fa-clinic-medical', route: '/pharmacien/gestion', color: 'green', badge: 'Ph' },
  ],
  admin: [
    { id: 'users',         title: 'Utilisateurs',  description: 'Gérez tous les utilisateurs.',         icon: 'fas fa-users',     route: '/admin/users',         color: 'blue' },
    { id: 'statistiques',  title: 'Statistiques',  description: "Statistiques d'utilisation.",           icon: 'fas fa-chart-bar', route: '/admin/statistiques',  color: 'purple' },
    { id: 'etablissements', title: 'Établissements', description: 'Gérez les établissements de santé.', icon: 'fas fa-hospital',  route: '/admin/etablissements', color: 'green' },
  ],
};

// --- Menu config (inchangé) ---
export const MENU_CONFIG: MenuConfig = {
  medecin: [
    { section: 'Général', items: [
      { id: 'dashboard', label: 'Tableau de bord',  icon: 'fas fa-tachometer-alt', route: '/dashboard' },
      { id: 'diagnostic', label: 'Diagnostic IA',   icon: 'fas fa-stethoscope',    badge: 'Dr', route: '/medecin/diagnostic-ia' },
      { id: 'expert',     label: 'Expert Médical IA', icon: 'fas fa-robot',        badge: 'Dr', route: '/medecin/expert-medical' },
    ]},
    { section: 'Dossiers & Examens', items: [
      { id: 'patients',      label: 'Dossiers patients', icon: 'fas fa-user-injured',  badge: 'Dr', route: '/medecin/patients' },
      { id: 'special-cases', label: 'Cas spéciaux',      icon: 'fas fa-user-friends',  badge: 'Dr', route: '/medecin/cas-speciaux' },
      { id: 'examens',       label: 'Examens médicaux',  icon: 'fas fa-file-medical',  route: '/examens' },
    ]},
    { section: 'Médicaments & Ordonnances', items: [
      { id: 'ordonnances', label: 'Ordonnances QR', icon: 'fas fa-prescription', route: '/medecin/ordonnances' },
    ]},
    { section: 'Santé & Disponibilités', items: [
      { id: 'appel-video', label: 'Appel vidéo', icon: 'fas fa-video', badge: 'Dr', route: '/medecin/appel-video' },
    ]},
  ],
  patient: [
    { section: 'Général', items: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
    ]},
    { section: 'Dossiers & Examens', items: [
      { id: 'dossiers',     label: 'Carnet numérique',  icon: 'fas fa-folder-open', badge: 'Pa', route: '/patient/dossier' },
      { id: 'examens',      label: 'Mes examens',       icon: 'fas fa-file-medical', route: '/examens' },
      { id: 'gestion-acces', label: 'Gestion des accès', icon: 'fas fa-shield-alt', badge: 'Pa', route: '/patient/gestion-acces' },
    ]},
    { section: 'Médicaments & Ordonnances', items: [
      { id: 'medicaments', label: 'Mes traitements', icon: 'fas fa-pills',        badge: 'Pa', route: '/patient/medicaments' },
      { id: 'ordonnances', label: 'Mes ordonnances', icon: 'fas fa-prescription', badge: 'Pa', route: '/patient/ordonnances' },
    ]},
    { section: 'Santé & Disponibilités', items: [
      { id: 'etat',          label: 'Suivi de santé',         icon: 'fas fa-heartbeat',      badge: 'Pa', route: '/patient/suivi-sante' },
      { id: 'rendez-vous',   label: 'Rendez-vous',            icon: 'fas fa-calendar-check', route: '/patient/rendez-vous' },
      { id: 'appel-video',   label: 'Appel vidéo',            icon: 'fas fa-video',          route: '/patient/appel-video' },
      { id: 'disponibilites', label: 'Recherche de pharmacies', icon: 'fas fa-map-marker-alt', route: '/patient/disponibilites' },
    ]},
  ],
  pharmacien: [
    { section: 'Général', items: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
    ]},
    { section: 'Médicaments & Ordonnances', items: [
      { id: 'ordonnances', label: "Déchiffrage d'ordonnances", icon: 'fas fa-prescription', badge: 'Ph', route: '/pharmacien/scan-qr' },
    ]},
    { section: 'Gestion', items: [
      { id: 'pharmacies', label: 'Gestion pharmacie', icon: 'fas fa-clinic-medical', badge: 'Ph', route: '/pharmacien/gestion' },
      { id: 'stock',      label: 'Gestion du stock',  icon: 'fas fa-boxes',          badge: 'Ph', route: '/pharmacien/stock' },
    ]},
  ],
  admin: [
    { section: 'Général', items: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
    ]},
    { section: 'Administration', items: [
      { id: 'users',          label: 'Utilisateurs',    icon: 'fas fa-users',                     route: '/admin/users' },
      { id: 'medecins',       label: 'Médecins',        icon: 'fas fa-user-md',                   route: '/admin/medecins' },
      { id: 'pharmaciens',    label: 'Pharmaciens',     icon: 'fas fa-prescription-bottle-alt',   route: '/admin/pharmaciens' },
      { id: 'etablissements', label: 'Établissements',  icon: 'fas fa-hospital',                  route: '/admin/etablissements' },
      { id: 'statistiques',   label: 'Statistiques',    icon: 'fas fa-chart-bar',                 route: '/admin/statistiques' },
      { id: 'settings',       label: 'Paramètres',      icon: 'fas fa-cog',                       route: '/admin/settings' },
    ]},
  ],
};

export const getMenuForRole = (role: string): MenuSection[] =>
  MENU_CONFIG[role as keyof MenuConfig] || [];

export const hasAccessToRoute = (userRole: string, route: string): boolean => {
  const menu = MENU_CONFIG[userRole as keyof MenuConfig];
  if (!menu) return false;
  return menu.some((section) => section.items.some((item) => item.route === route));
};


/** Examens prescrits lors d'une consultation spécifique */
export const getExamensForConsultation = (consultationId: string): ExamenPatient[] =>
  EXAMENS_PATIENT.filter((e) => e.consultationId === consultationId);
 
/** Ordonnances émises lors d'une consultation spécifique */
export const getOrdonnancesForConsultation = (consultationId: string): Prescription[] =>
  PRESCRIPTIONS.filter(
    (o) => o.contexte === "Consultation" && o.contextId === consultationId
  );
 
/** Retrouve un événement (consultation OU hospitalisation) par son ID */
export const getTimelineEvent = (eventId: string): {
  type: 'consultation' | 'hospitalisation';
  data: ConsultationRecord | HospitalisationRecord;
} | undefined => {
  const consultation = CONSULTATIONS.find((c) => c.id === eventId);
  if (consultation) return { type: 'consultation', data: consultation };
  const hospitalisation = HOSPITALISATIONS.find((h) => h.id === eventId);
  if (hospitalisation) return { type: 'hospitalisation', data: hospitalisation };
  return undefined;
};
 
/** Examens liés à une hospitalisation (via les médecins impliqués ou le motif) */
export const getExamensForHospitalisation = (hospitalisationId: string): ExamenPatient[] =>
  EXAMENS_PATIENT.filter((e) => e.consultationId === hospitalisationId);
 