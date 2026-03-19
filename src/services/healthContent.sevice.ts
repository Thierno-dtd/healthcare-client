import {delay, MOCK_CONTENT } from "../data/mocks/mock-data";
import {ContentFilters, HealthContent} from "../data/models/healthContent.model.ts";

let contentStore: HealthContent[] = [...MOCK_CONTENT];

class ContentService {
    async getContent(filters: ContentFilters = {}): Promise<HealthContent[]> {
        await delay(350);
        let result = [...contentStore];

        if (filters.type && filters.type !== 'all') {
            result = result.filter((c) => c.type === filters.type);
        }
        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.title.toLowerCase().includes(q) ||
                    c.body.toLowerCase().includes(q) ||
                    c.tags.some((t) => t.toLowerCase().includes(q))
            );
        }
        if (filters.tags?.length) {
            result = result.filter((c) => filters.tags!.some((t) => c.tags.includes(t)));
        }

        return result.sort(
            (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }

    async getContentById(id: string): Promise<HealthContent> {
        await delay(250);
        const c = contentStore.find((c) => c.id === id);
        if (!c) throw new Error('Content not found');
        return { ...c };
    }

    async createContent(data: Omit<HealthContent, 'id' | 'publishedAt'>): Promise<HealthContent> {
        await delay(500);
        const newC: HealthContent = {
            ...data,
            id: `c_${Date.now()}`,
            publishedAt: new Date().toISOString(),
        };
        contentStore = [newC, ...contentStore];
        return { ...newC };
    }

    async updateContent(id: string, updates: Partial<HealthContent>): Promise<HealthContent> {
        await delay(400);
        const idx = contentStore.findIndex((c) => c.id === id);
        if (idx === -1) throw new Error('Content not found');
        contentStore[idx] = { ...contentStore[idx], ...updates };
        return { ...contentStore[idx] };
    }

    async deleteContent(id: string): Promise<void> {
        await delay(300);
        contentStore = contentStore.filter((c) => c.id !== id);
    }

    async togglePublish(id: string): Promise<HealthContent> {
        await delay(300);
        const idx = contentStore.findIndex((c) => c.id === id);
        if (idx === -1) throw new Error('Content not found');
        contentStore[idx] = { ...contentStore[idx], isPublished: !contentStore[idx].isPublished };
        return { ...contentStore[idx] };
    }
}

export const contentService = new ContentService();
