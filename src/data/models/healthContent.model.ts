export type ContentType = 'advice' | 'event' | 'news';

export interface HealthContent {
    id: string;
    type: ContentType;
    title: string;
    body: string;
    imageUrl?: string;
    authorId: string;
    publishedAt: string;
    tags: string[];
}