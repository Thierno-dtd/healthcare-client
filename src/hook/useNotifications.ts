import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';

export const NOTIFICATION_KEYS = {
    all: ['notifications'] as const,
    list: (userId: string) => ['notifications', 'list', userId] as const,
    unread: (userId: string) => ['notifications', 'unread', userId] as const,
};

export function useNotifications(userId: string) {
    return useQuery({
        queryKey: NOTIFICATION_KEYS.list(userId),
        queryFn: () => notificationService.getNotifications(userId),
        enabled: !!userId,
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 60 * 1000, // poll every 60s
    });
}

export function useUnreadCount(userId: string) {
    return useQuery({
        queryKey: NOTIFICATION_KEYS.unread(userId),
        queryFn: () => notificationService.getUnreadCount(userId),
        enabled: !!userId,
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000,
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
        },
    });
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => notificationService.markAllAsRead(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
        },
    });
}