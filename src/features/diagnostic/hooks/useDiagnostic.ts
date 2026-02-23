// ============================================================
// Hooks Diagnostic IA — React Query
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { diagnosticService } from '../services/diagnostic.service';
import type { DiagnosticRequest } from '../types/diagnostic.types';

// --- Query keys factory ---

export const diagnosticKeys = {
  all: ['diagnostic'] as const,
  history: () => [...diagnosticKeys.all, 'history'] as const,
  detail: (id: string) => [...diagnosticKeys.all, 'detail', id] as const,
};

// --- Hooks ---

export const useDiagnosticHistory = () => {
  return useQuery({
    queryKey: diagnosticKeys.history(),
    queryFn: () => diagnosticService.getHistory(),
  });
};

export const useDiagnosticDetail = (id: string) => {
  return useQuery({
    queryKey: diagnosticKeys.detail(id),
    queryFn: () => diagnosticService.getById(id),
    enabled: !!id,
  });
};

export const useAnalyzeImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DiagnosticRequest) => diagnosticService.analyzeImage(request),
    onSuccess: () => {
      toast.success('Analyse terminée avec succès');
      queryClient.invalidateQueries({ queryKey: diagnosticKeys.history() });
    },
    onError: () => {
      toast.error("Erreur lors de l'analyse de l'image");
    },
  });
};
