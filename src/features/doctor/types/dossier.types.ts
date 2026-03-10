// ============================================================
// Types spécifiques au dossier médical
// ============================================================

import type { Examen, Medicament } from '@shared/types';

/** Onglet du dossier médical */
export type DossierTab = 'informations' | 'examens' | 'medicaments' | 'acces';

/** Autorisation d'accès au dossier */
export interface AccesAutorisation {
  id: string;
  medecinId: string;
  medecinNom: string;
  specialite: string;
  typeAcces: 'complet' | 'temporaire' | 'lecture';
  dateDebut: string;
  dateFin?: string;
  avatar: string;
}

/** Informations médicales du patient */
export interface InfosMedicales {
  allergies: string[];
  maladiesChroniques: string[];
  medecinTraitant: string;
  derniereConsultation: string;
}

/** Données complètes du dossier pour l'UI */
export interface DossierMedicalData {
  examens: Examen[];
  medicaments: Medicament[];
  infosMedicales: InfosMedicales;
  autorisations: AccesAutorisation[];
}
