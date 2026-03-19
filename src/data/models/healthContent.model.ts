export type ContentType = 'advice' | 'event' | 'news';

export interface HealthContent {
    id: string;
    type: ContentType;
    title: string;
    body: string;
    imageUrl?: string;
    authorId: string;
    authorName: string;
    publishedAt: string;
    tags: string[];
    isPublished: boolean;
}

export interface ContentFilters {
    type?: ContentType | 'all';
    search?: string;
    tags?: string[];
}