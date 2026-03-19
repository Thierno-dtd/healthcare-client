import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService } from '@/services/doctor.service';
import type { Doctor, DoctorFilters } from '@/data/models/doctor.model';

export const DOCTOR_KEYS = {
    all: ['doctors'] as const,
    list: (filters: DoctorFilters) => ['doctors', 'list', filters] as const,
    detail: (id: string) => ['doctors', 'detail', id] as const,
};

export function useDoctors(filters: DoctorFilters = {}) {
    return useQuery({
        queryKey: DOCTOR_KEYS.list(filters),
        queryFn: () => doctorService.getDoctors(filters),
        staleTime: 2 * 60 * 1000,
    });
}

export function useDoctor(id: string) {
    return useQuery({
        queryKey: DOCTOR_KEYS.detail(id),
        queryFn: () => doctorService.getDoctorById(id),
        enabled: !!id,
    });
}

export function useUpdateDoctorStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: Doctor['status'] }) =>
            doctorService.updateDoctorStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.all });
        },
    });
}

export function useCreateDoctor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<Doctor, 'id' | 'joinedAt' | 'patientCount' | 'alertCount'>) =>
            doctorService.createDoctor(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.all });
        },
    });
}