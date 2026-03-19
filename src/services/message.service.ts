import { delay, MOCK_MESSAGES } from '../data/mocks/mock-data';
import type { Message } from '../data/models/notification.model';

let messagesStore: Message[] = [...MOCK_MESSAGES];

class MessageService {
    async getMessages(userId: string): Promise<Message[]> {
        await delay(350);
        return messagesStore
            .filter((m) => m.toId === userId || m.fromId === userId)
            .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    }

    async getInbox(userId: string): Promise<Message[]> {
        await delay(300);
        return messagesStore
            .filter((m) => m.toId === userId)
            .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    }

    async getUnreadCount(userId: string): Promise<number> {
        await delay(150);
        return messagesStore.filter((m) => m.toId === userId && !m.isRead).length;
    }

    async markAsRead(id: string): Promise<void> {
        await delay(200);
        const idx = messagesStore.findIndex((m) => m.id === id);
        if (idx !== -1) messagesStore[idx] = { ...messagesStore[idx], isRead: true };
    }

    async sendMessage(data: Omit<Message, 'id' | 'sentAt' | 'isRead'>): Promise<Message> {
        await delay(400);
        const msg: Message = {
            ...data,
            id: `msg_${Date.now()}`,
            sentAt: new Date().toISOString(),
            isRead: false,
        };
        messagesStore = [msg, ...messagesStore];
        return { ...msg };
    }

    async deleteMessage(id: string): Promise<void> {
        await delay(300);
        messagesStore = messagesStore.filter((m) => m.id !== id);
    }
}

export const messageService = new MessageService();