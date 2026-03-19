import {delay, MOCK_NOTIFICATIONS} from "@/data/mocks/mock-data.ts";
import {Notification} from "@/data/models/notification.model.ts";

let notificationsStore: Notification[] = [...MOCK_NOTIFICATIONS];

class NotificationService {
    async getNotifications(userId: string): Promise<Notification[]> {
        await delay(300);
        return notificationsStore
            .filter((n) => n.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    async getUnreadCount(userId: string): Promise<number> {
        await delay(150);
        return notificationsStore.filter((n) => n.userId === userId && !n.isRead).length;
    }

    async markAsRead(id: string): Promise<void> {
        await delay(200);
        const idx = notificationsStore.findIndex((n) => n.id === id);
        if (idx !== -1) notificationsStore[idx] = { ...notificationsStore[idx], isRead: true };
    }

    async markAllAsRead(userId: string): Promise<void> {
        await delay(300);
        notificationsStore = notificationsStore.map((n) =>
            n.userId === userId ? { ...n, isRead: true } : n
        );
    }

    async createNotification(data: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
        await delay(200);
        const n: Notification = {
            ...data,
            id: `n_${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        notificationsStore = [n, ...notificationsStore];
        return { ...n };
    }
}

export const notificationService = new NotificationService();

