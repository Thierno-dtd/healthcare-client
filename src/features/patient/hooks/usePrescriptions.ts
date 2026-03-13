import { useQuery } from '@tanstack/react-query';
import { prescriptionService } from '../services/prescription.service';
import type { PrescriptionData } from '../types/prescription.types';

export const prescriptionKeys = {
  all: ['prescriptions'] as const,
  list: (patientId: string) => [...prescriptionKeys.all, 'list', patientId] as const,
  detail: (id: string) => [...prescriptionKeys.all, 'detail', id] as const,
};

export const usePrescriptions = (patientId: string | undefined) => {
  return useQuery<PrescriptionData[]>({
    queryKey: prescriptionKeys.list(patientId ?? ''),
    queryFn: () => prescriptionService.getPrescriptions(patientId!),
    enabled: !!patientId,
  });
};

export const usePrescriptionDetail = (id: string | undefined) => {
  return useQuery<PrescriptionData | undefined>({
    queryKey: prescriptionKeys.detail(id ?? ''),
    queryFn: () => prescriptionService.getPrescriptionById(id!),
    enabled: !!id,
  });
};
