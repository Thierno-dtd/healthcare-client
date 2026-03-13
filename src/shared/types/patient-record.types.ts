// ============================================================
// Types pour le dossier patient (médecin)
// ============================================================

export type Gender = 'M' | 'F';

export type PatientRecordTabId =
  | 'overview'
  | 'consultations'
  | 'hospitalisations'
  | 'analyses'
  | 'ordonnances'
  | 'antecedents'
  | 'timeline';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
}

export interface PatientAntecedent {
  id: string;
  titre: string;
  date: string;
  description: string;
}

export interface PatientRecord {
  id: string;
  nom: string;
  prenom: string;
  sexe: Gender;
  age: number;
  dateNaissance: string;
  groupeSanguin: string;
  telephone: string;
  email: string;
  adresse: string;
  numeroDossier: string;
  securiteSociale: string;
  allergies: string[];
  antecedents: PatientAntecedent[];
  timeline: TimelineEvent[];
}

export type ConsultationType = 'Urgence' | 'Consultation' | 'Suivi';

export interface ConsultationRecord {
  id: string;
  patientId: string;
  date: string;
  heure: string;
  hopital: string;
  medecin: string;
  medecinId: string;
  motif: string;
  diagnostic: string;
  typeArrivee: ConsultationType;
  histoireMaladie: string;
  examenClinique: string;
  resumeSyndromique: string;
  conduiteATenir: string;
  evolution: string;
  antecedentsPersonnels: string[];
  antecedentsFamiliaux: string[];
  hypothesesDiagnostiques: string[];
  examensParacliniques: string[];
  traitementsHabituels: string[];
}

export interface HospitalisationRecord {
  id: string;
  patientId: string;
  dateAdmission: string;
  dateSortie?: string;
  duree: string;
  chambre: string;
  hopital: string;
  service: string;
  motif: string;
  diagnosticFinal: string;
  traitementSortie: string;
  bilanARealiser: string;
  prochainRdv: string;
  medecins: string[];
  medecinIds: string[];
}

export type AnalyseStatus = 'Normal' | 'Anormal' | 'En attente';

export interface AnalyseRecord {
  id: string;
  patientId: string;
  consultationId: string;
  examPatientId: string;
  date: string;
  type: string;
  categorie: string;
  prescripteur: string;
  medecinId: string;
  statut: AnalyseStatus;
  effectuee: boolean;
  resultats: string;
  interpretation: string;
  valeursReference: string;
  documentUrl?: string;
  downloadUrl?: string;
}

export type OrdonnanceStatut = 'Active' | 'Terminée';

export interface OrdonnanceMedicamentRecord {
  nom: string;
  dosage: string;
  forme: string;
  posologie: string;
  duree: string;
}

export interface OrdonnanceRecord {
  id: string;
  patientId: string;
  consultationId?: string; // ← lien vers CONSULTATIONS
  medecinId?: string;      // ← lien vers MEDECINS
  medecin: string;         // nom dénormalisé
  date: string;
  statut: OrdonnanceStatut;
  medicaments: OrdonnanceMedicamentRecord[];
  instructions?: string;
  documentUrl?: string;
}
