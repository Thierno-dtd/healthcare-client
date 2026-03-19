import type { Alert, AlertFilters, PaginatedResult } from '../data/models';
import { MOCK_ALERTS, delay } from '../data/mocks/mock-data';

let alertsStore: Alert[] = [...MOCK_ALERTS];

class AlertService {
    async getAlerts(filters: AlertFilters = {}): Promise<PaginatedResult<Alert>> {
        await delay(350);
        let result = [...alertsStore];

        if (filters.severity && filters.severity !== 'all') {
            result = result.filter((a) => a.severity === filters.severity);
        }
        if (filters.isRead !== undefined) {
            result = result.filter((a) => a.isRead === filters.isRead);
        }
        if (filters.isResolved !== undefined) {
            result = result.filter((a) => a.isResolved === filters.isResolved);
        }
        if (filters.doctorId) {
            result = result.filter((a) => a.doctorId === filters.doctorId);
        }

        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? 20;
        const total = result.length;
        const totalPages = Math.ceil(total / pageSize);
        const data = result.slice((page - 1) * pageSize, page * pageSize);

        return { data, total, page, pageSize, totalPages };
    }

    async markAsRead(id: string): Promise<Alert> {
        await delay(200);
        const idx = alertsStore.findIndex((a) => a.id === id);
        if (idx === -1) throw new Error('Alert not found');
        alertsStore[idx] = { ...alertsStore[idx], isRead: true };
        return { ...alertsStore[idx] };
    }

    async markAllAsRead(doctorId: string): Promise<void> {
        await delay(300);
        alertsStore = alertsStore.map((a) =>
            a.doctorId === doctorId ? { ...a, isRead: true } : a
        );
    }

    async resolveAlert(id: string, resolvedBy: string): Promise<Alert> {
        await delay(300);
        const idx = alertsStore.findIndex((a) => a.id === id);
        if (idx === -1) throw new Error('Alert not found');
        alertsStore[idx] = {
            ...alertsStore[idx],
            isResolved: true,
            resolvedAt: new Date().toISOString(),
            resolvedBy,
        };
        return { ...alertsStore[idx] };
    }

    async getUnreadCount(doctorId: string): Promise<number> {
        await delay(150);
        return alertsStore.filter((a) => a.doctorId === doctorId && !a.isRead).length;
    }
}

export const alertService = new AlertService();