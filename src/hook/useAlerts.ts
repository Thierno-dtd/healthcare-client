import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '@/services/alert.service';
import type { AlertFilters } from '@/data/models';

export const ALERT_KEYS = {
    all: ['alerts'] as const,
    list: (filters: AlertFilters) => ['alerts', 'list', filters] as const,
    unread: (doctorId: string) => ['alerts', 'unread', doctorId] as const,
};

export function useAlerts(filters: AlertFilters = {}) {
    return useQuery({
        queryKey: ALERT_KEYS.list(filters),
        queryFn: () => alertService.getAlerts(filters),
        staleTime: 60 * 1000,
    });
}

export function useMarkAlertRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => alertService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ALERT_KEYS.all });
        },
    });
}

export function useMarkAllAlertsRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (doctorId: string) => alertService.markAllAsRead(doctorId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ALERT_KEYS.all });
        },
    });
}

export function useResolveAlert() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, resolvedBy }: { id: string; resolvedBy: string }) =>
            alertService.resolveAlert(id, resolvedBy),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ALERT_KEYS.all });
        },
    });
}