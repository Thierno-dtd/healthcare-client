import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hospitalService } from '@/services/hospital.service';
import type { Hospital, HospitalFilters } from '@/data/models/hospital.model';

export const HOSPITAL_KEYS = {
    all: ['hospitals'] as const,
    list: (filters: HospitalFilters) => ['hospitals', 'list', filters] as const,
    detail: (id: string) => ['hospitals', 'detail', id] as const,
    stats: () => ['hospitals', 'stats'] as const,
};

export function useHospitals(filters: HospitalFilters = {}) {
    return useQuery({
        queryKey: HOSPITAL_KEYS.list(filters),
        queryFn: () => hospitalService.getHospitals(filters),
        staleTime: 5 * 60 * 1000,
    });
}

export function useHospital(id: string) {
    return useQuery({
        queryKey: HOSPITAL_KEYS.detail(id),
        queryFn: () => hospitalService.getHospitalById(id),
        enabled: !!id,
    });
}

export function useHospitalStats() {
    return useQuery({
        queryKey: HOSPITAL_KEYS.stats(),
        queryFn: () => hospitalService.getGlobalStats(),
        staleTime: 5 * 60 * 1000,
    });
}

export function useUpdateHospital() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Hospital> }) =>
            hospitalService.updateHospital(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: HOSPITAL_KEYS.all });
        },
    });
}

export function useCreateHospital() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<Hospital, 'id' | 'createdAt' | 'doctorCount' | 'patientCount'>) =>
            hospitalService.createHospital(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: HOSPITAL_KEYS.all });
        },
    });
}