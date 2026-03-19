export type NotificationType = 'alert' | 'message' | 'system' | 'appointment';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    isRead: boolean;
    metadata?: Record<string, string>;
    createdAt: string;
}

export interface Message {
    id: string;
    fromId: string;
    fromName: string;
    toId: string;
    subject: string;
    body: string;
    isRead: boolean;
    sentAt: string;
}