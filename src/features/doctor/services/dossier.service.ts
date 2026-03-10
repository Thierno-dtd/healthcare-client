// ============================================================
// Dossier Medical Service - Accès aux données médicales
// ============================================================

import type { Examen, Medicament } from '@shared/types';
import type { DossierMedicalData, AccesAutorisation } from '../types/dossier.types';
import { EXAMENS, MEDICAMENTS } from '@shared/data/mock-data';
// import { apiGet, apiPost, apiDelete } from '@core/api';

/**
 * Service dossier médical
 * Actuellement utilise les mock data
 * Prêt pour être branché sur une vraie API
 */
export const dossierService = {
  /**
   * Récupérer le dossier médical complet
   */
  getDossier: async (patientId: string): Promise<DossierMedicalData> => {
    // TODO: Remplacer par : return apiGet<DossierMedicalData>(`/patients/${patientId}/dossier`);
    
    // Simulation d'un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      examens: EXAMENS,
      medicaments: MEDICAMENTS,
      infosMedicales: {
        allergies: ['Pénicilline', 'Pollen'],
        maladiesChroniques: [],
        medecinTraitant: 'Dr. BEGNI Touna',
        derniereConsultation: '15 Mars 2024',
      },
      autorisations: [
        {
          id: 'auth_1',
          medecinId: 'med_001',
          medecinNom: 'Dr. BEGNI Touna',
          specialite: 'Cardiologue - Médecin traitant',
          typeAcces: 'complet',
          dateDebut: '2023-01-01',
          avatar: 'JD',
        },
        {
          id: 'auth_2',
          medecinId: 'med_002',
          medecinNom: 'Dr. Prisca KANGNI',
          specialite: 'Généraliste',
          typeAcces: 'temporaire',
          dateDebut: '2024-02-01',
          dateFin: '2024-06-01',
          avatar: 'ML',
        },
      ],
    };
  },

  /**
   * Récupérer les examens d'un patient
   */
  getExamens: async (patientId: string): Promise<Examen[]> => {
    // TODO: return apiGet<Examen[]>(`/patients/${patientId}/examens`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return EXAMENS;
  },

  /**
   * Récupérer les médicaments d'un patient
   */
  getMedicaments: async (patientId: string): Promise<Medicament[]> => {
    // TODO: return apiGet<Medicament[]>(`/patients/${patientId}/medicaments`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MEDICAMENTS;
  },

  /**
   * Révoquer l'accès d'un médecin
   */
  revoquerAcces: async (autorisationId: string): Promise<void> => {
    // TODO: return apiDelete<void>(`/autorisations/${autorisationId}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
  },

  /**
   * Ajouter une autorisation d'accès
   */
  ajouterAcces: async (
    patientId: string,
    medecinId: string,
    typeAcces: 'complet' | 'temporaire' | 'lecture'
  ): Promise<AccesAutorisation> => {
    // TODO: return apiPost<AccesAutorisation>(`/patients/${patientId}/autorisations`, { medecinId, typeAcces });
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      id: `auth_${Date.now()}`,
      medecinId,
      medecinNom: 'Nouveau médecin',
      specialite: 'Spécialité',
      typeAcces,
      dateDebut: new Date().toISOString(),
      avatar: 'NM',
    };
  },
};
