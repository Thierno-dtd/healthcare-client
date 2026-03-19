import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '@/services/healthContent.sevice';
import type { ContentFilters, HealthContent } from '@/data/models/healthContent.model';

export const CONTENT_KEYS = {
    all: ['content'] as const,
    list: (filters: ContentFilters) => ['content', 'list', filters] as const,
    detail: (id: string) => ['content', 'detail', id] as const,
};

export function useContent(filters: ContentFilters = {}) {
    return useQuery({
        queryKey: CONTENT_KEYS.list(filters),
        queryFn: () => contentService.getContent(filters),
        staleTime: 5 * 60 * 1000,
    });
}

export function useContentItem(id: string) {
    return useQuery({
        queryKey: CONTENT_KEYS.detail(id),
        queryFn: () => contentService.getContentById(id),
        enabled: !!id,
    });
}

export function useCreateContent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<HealthContent, 'id' | 'publishedAt'>) =>
            contentService.createContent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTENT_KEYS.all });
        },
    });
}

export function useUpdateContent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<HealthContent> }) =>
            contentService.updateContent(id, updates),
        onSuccess: (updated) => {
            queryClient.setQueryData(CONTENT_KEYS.detail(updated.id), updated);
            queryClient.invalidateQueries({ queryKey: CONTENT_KEYS.all });
        },
    });
}

export function useTogglePublish() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => contentService.togglePublish(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTENT_KEYS.all });
        },
    });
}

export function useDeleteContent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => contentService.deleteContent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTENT_KEYS.all });
        },
    });
}