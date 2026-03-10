import type { PatientDossier, HistoriqueEntry } from '../types/dossiersPatients.types';

export const MOCK_PATIENTS: PatientDossier[] = [
  { id: 'pat_001', nom: 'BIMA', prenom: 'Afi', age: 35, groupeSanguin: 'A+', avatar: 'BA', typeAcces: 'total', specialite: 'Cardiologie', dernierExamen: '2026-02-10', status: 'Stable', allergies: ['Pénicilline'], maladiesChroniques: [], telephone: '+228 91 00 11 22' },
  { id: 'pat_002', nom: 'KOFFI', prenom: 'Mensah', age: 52, groupeSanguin: 'O+', avatar: 'KM', typeAcces: 'total', specialite: 'Diabétologie', dernierExamen: '2026-02-15', status: 'Suivi requis', allergies: [], maladiesChroniques: ['Diabète type 2'], telephone: '+228 90 22 33 44' },
  { id: 'pat_003', nom: 'ADJO', prenom: 'Sophie', age: 28, groupeSanguin: 'B+', avatar: 'AS', typeAcces: 'lecture', specialite: 'Dermatologie', dernierExamen: '2026-01-22', status: 'Stable', allergies: ['Pollen'], maladiesChroniques: [], telephone: '+228 93 44 55 66' },
  { id: 'pat_004', nom: 'AMEGAH', prenom: 'Koku', age: 45, groupeSanguin: 'AB-', avatar: 'AK', typeAcces: 'lecture', specialite: 'Neurologie', dernierExamen: '2026-02-01', status: 'Stable', allergies: [], maladiesChroniques: ['Hypertension'], telephone: '+228 97 66 77 88' },
  { id: 'pat_005', nom: 'DZIFA', prenom: 'Ama', age: 60, groupeSanguin: 'O-', avatar: 'DA', typeAcces: 'refuse', specialite: 'Consultation générale', dernierExamen: '2026-01-10', status: 'Critique', allergies: ['Aspirine', 'Latex'], maladiesChroniques: ['Asthme'], telephone: '+228 96 88 99 00' },
];

export const MOCK_HISTORIQUE: HistoriqueEntry[] = [
  { id: 'h1', patientNom: 'BIMA Afi', action: 'Consultation du dossier', date: '2026-02-20', details: 'Consulté les résultats de l\'ECG' },
  { id: 'h2', patientNom: 'KOFFI Mensah', action: 'Modification du traitement', date: '2026-02-18', details: 'Ajout de Metformine 500mg' },
  { id: 'h3', patientNom: 'ADJO Sophie', action: 'Lecture du dossier', date: '2026-02-15', details: 'Consultation des antécédents' },
  { id: 'h4', patientNom: 'BIMA Afi', action: 'Prescription ajoutée', date: '2026-02-12', details: 'Ordonnance cardiologie renouvelée' },
  { id: 'h5', patientNom: 'AMEGAH Koku', action: 'Lecture du dossier', date: '2026-02-08', details: 'Vérification des résultats IRM' },
];
