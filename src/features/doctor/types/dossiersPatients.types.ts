export type TabId = 'total' | 'lecture' | 'refuse' | 'historique';

export interface PatientDossier {
  id: string;
  nom: string;
  prenom: string;
  age: number;
  groupeSanguin: string;
  avatar: string;
  typeAcces: 'total' | 'lecture' | 'refuse';
  specialite: string;
  dernierExamen: string;
  status: 'Stable' | 'Suivi requis' | 'Critique';
  allergies: string[];
  maladiesChroniques: string[];
  telephone: string;
}

export interface HistoriqueEntry {
  id: string;
  patientNom: string;
  action: string;
  date: string;
  details: string;
}
