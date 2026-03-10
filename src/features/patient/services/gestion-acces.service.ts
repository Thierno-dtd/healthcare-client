// ============================================================
// Service Gestion des Accès au Dossier Patient
// ============================================================

import type { HistoriqueAcces, DemandeAcces, ReponseDemandeAccesDTO } from '../types/patient.types';
import type { AccesAutorisation } from '@features/doctor/types/dossier.types';
// import { apiGet, apiPost, apiDelete } from '@core/api';

export const gestionAccesService = {
  /**
   * Récupérer les autorisations actives
   */
  getAutorisations: async (patientId: string): Promise<AccesAutorisation[]> => {
    // TODO: return apiGet<AccesAutorisation[]>(`/patients/${patientId}/autorisations`);
    await new Promise((r) => setTimeout(r, 400));

    return [
      {
        id: 'auth_1',
        medecinId: 'med_001',
        medecinNom: 'Dr. BEGNI Touna',
        specialite: 'Cardiologue • Clinique des Roses',
        typeAcces: 'complet',
        dateDebut: '2023-05-12',
        avatar: 'BT',
      },
      {
        id: 'auth_2',
        medecinId: 'med_002',
        medecinNom: 'Dr. Prisca KANGNI',
        specialite: 'Médecine Générale • Centre Médical Horizon',
        typeAcces: 'temporaire',
        dateDebut: '2024-01-20',
        dateFin: '2024-06-01',
        avatar: 'PK',
      },
      {
        id: 'auth_3',
        medecinId: 'med_003',
        medecinNom: 'Dr. A. MBARGA',
        specialite: 'Dermatologue • Pratique privée',
        typeAcces: 'lecture',
        dateDebut: '2024-02-15',
        dateFin: '2024-04-01',
        avatar: 'AM',
      },
    ];
  },

  /**
   * Récupérer l'historique d'accès à mon dossier
   */
  getHistorique: async (patientId: string): Promise<HistoriqueAcces[]> => {
    // TODO: return apiGet<HistoriqueAcces[]>(`/patients/${patientId}/historique-acces`);
    await new Promise((r) => setTimeout(r, 300));

    return [
      {
        id: 'hist_1',
        medecinId: 'med_002',
        medecinNom: 'Dr. Prisca KANGNI',
        specialite: 'Médecine Générale',
        action: 'consultation',
        details: 'Consultation Ordonnance #OR-4452',
        date: new Date().toISOString().replace(/T.*/, 'T09:42:00Z'),
      },
      {
        id: 'hist_2',
        medecinId: 'med_001',
        medecinNom: 'Dr. BEGNI Touna',
        specialite: 'Cardiologie',
        action: 'consultation',
        details: 'Lecture du dossier patient',
        date: new Date(Date.now() - 86400000).toISOString().replace(/T.*/, 'T16:15:00Z'),
      },
      {
        id: 'hist_3',
        medecinId: 'med_001',
        medecinNom: 'Dr. BEGNI Touna',
        specialite: 'Cardiologie',
        action: 'consultation',
        details: 'Consultation bilan sanguin',
        date: '2024-02-22T10:30:00Z',
      },
      {
        id: 'hist_4',
        medecinId: 'system',
        medecinNom: 'Système',
        specialite: '',
        action: 'export',
        details: 'Révoqué : Dr. Marc Vales',
        date: '2024-02-18T14:05:00Z',
      },
    ];
  },

  /**
   * Récupérer les demandes d'accès en attente
   */
  getDemandesEnAttente: async (patientId: string): Promise<DemandeAcces[]> => {
    // TODO: return apiGet<DemandeAcces[]>(`/patients/${patientId}/demandes-acces`);
    await new Promise((r) => setTimeout(r, 300));

    return [
      {
        id: 'dem_1',
        medecinId: 'med_004',
        medecinNom: 'Dr. J. FOTSO',
        specialite: 'Pneumologie',
        typeAcces: 'temporaire',
        motif: 'Suivi post-opératoire - Besoin d\'accéder aux antécédents respiratoires',
        dateDemande: '2024-03-14T08:00:00Z',
        avatar: 'JF',
      },
    ];
  },

  /**
   * Répondre à une demande d'accès
   */
  repondreDemande: async (dto: ReponseDemandeAccesDTO): Promise<void> => {
    // TODO: return apiPost(`/demandes-acces/${dto.demandeId}/reponse`, dto);
    await new Promise((r) => setTimeout(r, 300));
  },

  /**
   * Révoquer une autorisation
   */
  revoquerAutorisation: async (autorisationId: string): Promise<void> => {
    // TODO: return apiDelete(`/autorisations/${autorisationId}`);
    await new Promise((r) => setTimeout(r, 300));
  },

  /**
   * Ajouter une nouvelle autorisation
   */
  ajouterAutorisation: async (
    patientId: string,
    medecinId: string,
    typeAcces: 'complet' | 'temporaire' | 'lecture',
    dateFin?: string
  ): Promise<AccesAutorisation> => {
    // TODO: return apiPost<AccesAutorisation>(`/patients/${patientId}/autorisations`, { medecinId, typeAcces, dateFin });
    await new Promise((r) => setTimeout(r, 300));
    return {
      id: `auth_${Date.now()}`,
      medecinId,
      medecinNom: 'Nouveau médecin',
      specialite: 'Spécialité',
      typeAcces,
      dateDebut: new Date().toISOString(),
      dateFin,
      avatar: 'NM',
    };
  },
};
