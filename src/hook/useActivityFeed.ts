import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService } from '@/services/activity.service';
import { doctorNotificationService } from '@/services/doctornotification.service';

export const ACTIVITY_KEYS = {
    all: ['activities'] as const,
    feed: (doctorId: string) => ['activities', 'feed', doctorId] as const,
    weeklyStats: (doctorId: string) => ['activities', 'weekly-stats', doctorId] as const,
};

export function useActivityFeed(doctorId: string = 'd_001') {
    return useQuery({
        queryKey: ACTIVITY_KEYS.feed(doctorId),
        queryFn: () => activityService.getActivityFeed(doctorId),
        staleTime: 10 * 1000,
        refetchInterval: 15 * 1000, // Poll every 15s to simulate real-time
    });
}

export function useWeeklyStats(doctorId: string = 'd_001') {
    return useQuery({
        queryKey: ACTIVITY_KEYS.weeklyStats(doctorId),
        queryFn: () => activityService.getWeeklyStats(doctorId),
        staleTime: 60 * 1000,
    });
}

export function useInjectFakeActivity(doctorId: string = 'd_001') {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (patientId: string) => {
            activityService.injectFakeActivity(patientId);
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.feed(doctorId) });
            queryClient.invalidateQueries({ queryKey: ACTIVITY_KEYS.weeklyStats(doctorId) });
        },
    });
}

export function useSendPatientMessage() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ doctorId, patientId, patientName, message }: {
            doctorId: string; patientId: string; patientName: string; message: string;
        }) => doctorNotificationService.sendToPatient(doctorId, patientId, patientName, message),
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['doctor-notifs', 'sent', vars.doctorId] });
        },
    });
}