// ============================================================
// Types médicaux - Examens, Dossiers, Ordonnances
// ============================================================

/** Statuts d'examen */
export type ExamenStatus = 'planifie' | 'effectue' | 'annule' | 'en_attente';

/** Priorités médicales */
export type Priorite = 'urgente' | 'haute' | 'normale' | 'basse' | 'routine';

/** Statuts de consultation */
export type ConsultationStatus = 'planifiee' | 'en_cours' | 'terminee' | 'annulee';

/** Statuts de prescription */
export type PrescriptionStatus = 'active' | 'utilisee' | 'expiree' | 'annulee';

/** Types de notification */
export type NotificationType = 'info' | 'warning' | 'success' | 'danger';

/** Examen médical */
export interface Examen {
  id: string;
  type: string;
  date: string;
  status: ExamenStatus;
  medecin: string;
  description: string;
  resultat: string | null;
  fichiers: string[];
}

/** Médicament */
export interface Medicament {
  id: string;
  nom: string;
  dosage: string;
  frequence: string;
  duree: string;
  debut: string;
  fin: string;
  prescripteur: string;
  instructions: string;
}

/** Patient résumé (pour les listes médecin) */
export interface PatientSummary {
  id: string;
  nom: string;
  age: number;
  groupeSanguin: string;
  dernierExamen: string;
  status: string;
  avatar: string;
}

/** Notification */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  roles?: string[];
}

/** Ordonnance */
export interface Ordonnance {
  id: string;
  patientId: string;
  medecinId: string;
  medicaments: OrdonnanceMedicament[];
  dateCreation: string;
  dateExpiration: string;
  status: PrescriptionStatus;
  qrCode?: string;
}

/** Médicament dans une ordonnance */
export interface OrdonnanceMedicament {
  nom: string;
  dosage: string;
  frequence: string;
  duree: string;
  instructions?: string;
}

/** Établissement de santé */
export interface Etablissement {
  id: string;
  nom: string;
  type: 'Hôpital' | 'Pharmacie' | 'Clinique';
  adresse: string;
  telephone: string;
  services: string[];
  disponibilite: 'Disponible' | 'Complet';
  coordinates: {
    lat: number;
    lng: number;
  };
}

/** Dossier médical complet */
export interface DossierMedical {
  patientId: string;
  informationsPersonnelles: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    groupeSanguin: string;
    allergies: string[];
    antecedents: string[];
  };
  examens: Examen[];
  medicaments: Medicament[];
  ordonnances: Ordonnance[];
}
