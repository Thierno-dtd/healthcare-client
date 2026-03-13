// ============================================================
// Types pour les rendez-vous patient
// ============================================================

/** Statut d'un rendez-vous patient */
export type RendezVousStatus = 'planifie' | 'confirme' | 'en_cours' | 'termine' | 'annule';

/** Type de rendez-vous */
export type RendezVousType = 'consultation' | 'suivi' | 'urgence' | 'teleconsultation' | 'examen';

/** Rendez-vous médical côté patient */
export interface RendezVous {
  id: string;
  medecinId: string;
  medecinNom: string;
  specialite: string;
  date: string;
  heure: string;
  type: RendezVousType;
  status: RendezVousStatus;
  lieu: string;
  motif: string;
  notes?: string;
  avatar: string;
}

/** DTO création rendez-vous (envoyé au backend) */
export interface CreateRendezVousDTO {
  medecinId: string;
  date: string;
  heure: string;
  type: RendezVousType;
  motif: string;
  lieu?: string;
}

/** DTO mise à jour rendez-vous */
export interface UpdateRendezVousDTO {
  date?: string;
  heure?: string;
  motif?: string;
  status?: RendezVousStatus;
}