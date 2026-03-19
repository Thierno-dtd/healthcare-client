// ============================================================
// usePatients HOOK — Patient business logic
// ============================================================
// All component-level state, filtering, and service calls
// live here. Components stay clean and focused on rendering.

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../services/patient.service';
import {Patient, PatientFilters, PatientStatus} from "@/data/models/patient.model.ts";


// ─── Query Keys (centralized for cache invalidation) ─────────
export const PATIENT_KEYS = {
    all: ['patients'] as const,
    list: (filters: PatientFilters) => ['patients', 'list', filters] as const,
    detail: (id: string) => ['patients', 'detail', id] as const,
    metrics: (id: string, type?: string) => ['patients', 'metrics', id, type] as const,
    stats: (filters: object) => ['patients', 'stats', filters] as const,
};

// ─── List hook ────────────────────────────────────────────────
export function usePatients(initialFilters: PatientFilters = {}) {
    const [filters, setFilters] = useState<PatientFilters>({
        page: 1,
        pageSize: 10,
        status: 'all',
        ...initialFilters,
    });

    const query = useQuery({
        queryKey: PATIENT_KEYS.list(filters),
        queryFn: () => patientService.getPatients(filters),
        staleTime: 2 * 60 * 1000,
        placeholderData: (prev) => prev, // Keep previous data while loading
    });

    const setSearch = useCallback((search: string) => {
        setFilters((f) => ({ ...f, search, page: 1 }));
    }, []);

    const setStatus = useCallback((status: PatientStatus | 'all') => {
        setFilters((f) => ({ ...f, status, page: 1 }));
    }, []);

    const setPage = useCallback((page: number) => {
        setFilters((f) => ({ ...f, page }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({ page: 1, pageSize: 10, status: 'all' });
    }, []);

    return {
        ...query,
        filters,
        setSearch,
        setStatus,
        setPage,
        resetFilters,
    };
}

// ─── Single patient hook ──────────────────────────────────────
export function usePatient(id: string) {
    return useQuery({
        queryKey: PATIENT_KEYS.detail(id),
        queryFn: () => patientService.getPatientById(id),
        enabled: !!id,
    });
}

// ─── Patient metrics hook ─────────────────────────────────────
export function usePatientMetrics(patientId: string, type?: string, limit = 7) {
    return useQuery({
        queryKey: PATIENT_KEYS.metrics(patientId, type),
        queryFn: () => patientService.getPatientMetrics(patientId, type, limit),
        enabled: !!patientId,
    });
}

// ─── Patient stats hook ───────────────────────────────────────
export function usePatientStats(filters: { doctorId?: string; hospitalId?: string } = {}) {
    return useQuery({
        queryKey: PATIENT_KEYS.stats(filters),
        queryFn: () => patientService.getPatientStats(filters),
        staleTime: 5 * 60 * 1000,
    });
}

// ─── Mutation: update status ──────────────────────────────────
export function useUpdatePatientStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: PatientStatus }) =>
            patientService.updatePatientStatus(id, status),
        onSuccess: (updatedPatient) => {
            // Update detail cache
            queryClient.setQueryData(PATIENT_KEYS.detail(updatedPatient.id), updatedPatient);
            // Invalidate list queries
            queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.all });
        },
    });
}

// ─── Mutation: create patient ─────────────────────────────────
export function useCreatePatient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<Patient, 'id' | 'createdAt' | 'lastActivity'>) =>
            patientService.createPatient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.all });
        },
    });
}

// ─── Mutation: update patient ─────────────────────────────────
export function useUpdatePatient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Patient> }) =>
            patientService.updatePatient(id, updates),
        onSuccess: (updatedPatient) => {
            queryClient.setQueryData(PATIENT_KEYS.detail(updatedPatient.id), updatedPatient);
            queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.all });
        },
    });
}

// ─── Mutation: delete patient ─────────────────────────────────
export function useDeletePatient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => patientService.deletePatient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.all });
        },
    });
}