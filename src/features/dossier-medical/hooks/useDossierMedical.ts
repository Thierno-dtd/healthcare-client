// ============================================================
// useDossierMedical - Hook React Query pour le dossier médical
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dossierService } from '../services/dossier.service';
import toast from 'react-hot-toast';

/** Query keys centralisées pour le dossier */
export const dossierKeys = {
  all: ['dossier'] as const,
  detail: (patientId: string) => [...dossierKeys.all, patientId] as const,
  examens: (patientId: string) => [...dossierKeys.all, 'examens', patientId] as const,
  medicaments: (patientId: string) => [...dossierKeys.all, 'medicaments', patientId] as const,
};

/**
 * Hook pour récupérer le dossier médical complet
 */
export const useDossierMedical = (patientId: string | undefined) => {
  return useQuery({
    queryKey: dossierKeys.detail(patientId ?? ''),
    queryFn: () => dossierService.getDossier(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook pour récupérer les examens
 */
export const useExamens = (patientId: string | undefined) => {
  return useQuery({
    queryKey: dossierKeys.examens(patientId ?? ''),
    queryFn: () => dossierService.getExamens(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook pour récupérer les médicaments
 */
export const useMedicaments = (patientId: string | undefined) => {
  return useQuery({
    queryKey: dossierKeys.medicaments(patientId ?? ''),
    queryFn: () => dossierService.getMedicaments(patientId!),
    enabled: !!patientId,
  });
};

/**
 * Hook mutation pour révoquer un accès
 */
export const useRevoquerAcces = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (autorisationId: string) =>
      dossierService.revoquerAcces(autorisationId),
    onSuccess: () => {
      // Invalider le cache pour forcer un refetch
      queryClient.invalidateQueries({ queryKey: dossierKeys.detail(patientId) });
      toast.success('Accès révoqué avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la révocation');
    },
  });
};

/**
 * Hook mutation pour ajouter un accès
 */
export const useAjouterAcces = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      medecinId,
      typeAcces,
    }: {
      medecinId: string;
      typeAcces: 'complet' | 'temporaire' | 'lecture';
    }) => dossierService.ajouterAcces(patientId, medecinId, typeAcces),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dossierKeys.detail(patientId) });
      toast.success('Autorisation ajoutée avec succès');
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de l'autorisation");
    },
  });
};
