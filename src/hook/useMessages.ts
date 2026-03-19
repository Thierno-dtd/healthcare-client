import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '@/services/message.service';
import type { Message } from '@/data/models/notification.model';

export const MESSAGE_KEYS = {
    all: ['messages'] as const,
    inbox: (userId: string) => ['messages', 'inbox', userId] as const,
    unread: (userId: string) => ['messages', 'unread', userId] as const,
};

export function useMessages(userId: string) {
    return useQuery({
        queryKey: MESSAGE_KEYS.inbox(userId),
        queryFn: () => messageService.getInbox(userId),
        enabled: !!userId,
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000,
    });
}

export function useUnreadMessageCount(userId: string) {
    return useQuery({
        queryKey: MESSAGE_KEYS.unread(userId),
        queryFn: () => messageService.getUnreadCount(userId),
        enabled: !!userId,
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000,
    });
}

export function useMarkMessageRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => messageService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.all });
        },
    });
}

export function useSendMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<Message, 'id' | 'sentAt' | 'isRead'>) =>
            messageService.sendMessage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.all });
        },
    });
}

export function useDeleteMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => messageService.deleteMessage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.all });
        },
    });
}