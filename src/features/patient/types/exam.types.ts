// ============================================================
// Types pour les examens médicaux
// ============================================================

/** Statuts d'examen */
export type ExamStatus = 'planifie' | 'effectue' | 'annule' | 'en_attente';

/** Priorités médicales */
export type Priorite = 'urgente' | 'haute' | 'normale' | 'basse' | 'routine';

/** Examen médical */
export interface Exam {
  id: string;
  patientId: string;
  type: string;
  date: string;
  status: ExamStatus;
  medecin: string;
  description: string;
  resultat: string | null;
  fichiers: string[];
}

/** Contexte d'examen */
export interface ExamContext {
  consultationId: string;
  patientId: string;
  medecinId: string;
  motif: string;
}

/** Résultat d'examen */
export interface ExamResult {
  id: string;
  examId: string;
  date: string;
  resultats: string;
  interpretation: string;
  fichiers: string[];
}