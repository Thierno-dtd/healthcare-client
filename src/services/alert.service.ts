import type { Alert, AlertFilters, PaginatedResult } from '../data/models';
import { MOCK_ALERTS, MOCK_MEASUREMENTS, MOCK_PATIENTS, delay } from '../data/mocks/mock-data';

// ─── Seuils par type ──────────────────────────────────────────
const THRESHOLDS: Record<string, {
    threshold: number;
    unit: string;
    severity: (v: number) => Alert['severity'];
}> = {
    blood_pressure: {
        threshold: 160,
        unit: 'mmHg',
        severity: (v) => v >= 180 ? 'critical' : v >= 160 ? 'high' : 'medium',
    },
    glucose: {
        threshold: 7.0,
        unit: 'mmol/L',
        severity: (v) => v >= 10 ? 'critical' : v >= 8 ? 'high' : 'medium',
    },
    heart_rate: {
        threshold: 100,
        unit: 'bpm',
        severity: (v) => v >= 120 ? 'critical' : v >= 110 ? 'high' : 'medium',
    },
};

const METRIC_LABELS: Record<string, string> = {
    blood_pressure: 'Tension artérielle',
    heart_rate: 'Fréquence cardiaque',
    glucose: 'Glycémie',
};

// ─── Génère des alertes depuis MOCK_MEASUREMENTS ─────────────
function generateAlertsFromMeasurements(): Alert[] {
    const generated: Alert[] = [];

    for (const m of MOCK_MEASUREMENTS) {
        const cfg = THRESHOLDS[m.type];
        if (!cfg) continue;
        if (m.value <= cfg.threshold) continue;

        const patient = MOCK_PATIENTS.find(p => p.id === m.patientId);
        if (!patient) continue;

        const label = METRIC_LABELS[m.type] ?? m.type;
        const sev = cfg.severity(m.value);

        generated.push({
            id: `auto_${m.id}`,
            patientId: m.patientId,
            patientName: patient.name,
            doctorId: patient.doctorId,
            type: m.type as Alert['type'],
            severity: sev,
            value: m.value,
            unit: m.unit,
            threshold: cfg.threshold,
            message: `${label} élevée : ${m.value} ${m.unit} (seuil : ${cfg.threshold} ${m.unit})`,
            isRead: false,
            isResolved: false,
            createdAt: m.recordedAt,
        });
    }

    return generated;
}

// ─── Fusionne alertes manuelles + alertes auto ────────────────
function buildInitialStore(): Alert[] {
    const autoAlerts = generateAlertsFromMeasurements();

    // Déduplique : si une alerte manuelle couvre déjà ce patient+type+date → skip auto
    const manualKeys = new Set(
        MOCK_ALERTS.map(a => `${a.patientId}_${a.type}_${a.createdAt.slice(0, 10)}`)
    );

    const filtered = autoAlerts.filter(a => {
        const key = `${a.patientId}_${a.type}_${a.createdAt.slice(0, 10)}`;
        return !manualKeys.has(key);
    });

    return [...MOCK_ALERTS, ...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

// ─── Helper semaine courante (lundi → dimanche) ───────────────
export function isThisWeek(dateStr: string): boolean {
    const date = new Date(dateStr);
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const start = new Date(now);
    start.setDate(now.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return date >= start && date <= end;
}

let alertsStore: Alert[] = buildInitialStore();

class AlertService {
    async getAlerts(filters: AlertFilters = {}): Promise<PaginatedResult<Alert>> {
        await delay(350);
        let result = [...alertsStore];

        if (filters.severity && filters.severity !== 'all') {
            result = result.filter(a => a.severity === filters.severity);
        }
        if (filters.isRead !== undefined) {
            result = result.filter(a => a.isRead === filters.isRead);
        }
        if (filters.isResolved !== undefined) {
            result = result.filter(a => a.isResolved === filters.isResolved);
        }
        if (filters.doctorId) {
            result = result.filter(a => a.doctorId === filters.doctorId);
        }

        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? 200;
        const total = result.length;
        const totalPages = Math.ceil(total / pageSize);
        const data = result.slice((page - 1) * pageSize, page * pageSize);

        return { data, total, page, pageSize, totalPages };
    }

    async markAsRead(id: string): Promise<Alert> {
        await delay(200);
        const idx = alertsStore.findIndex(a => a.id === id);
        if (idx === -1) throw new Error('Alert not found');
        alertsStore[idx] = { ...alertsStore[idx], isRead: true };
        return { ...alertsStore[idx] };
    }

    async markAllAsRead(doctorId: string): Promise<void> {
        await delay(300);
        alertsStore = alertsStore.map(a =>
            a.doctorId === doctorId ? { ...a, isRead: true } : a
        );
    }

    async resolveAlert(id: string, resolvedBy: string): Promise<Alert> {
        await delay(300);
        const idx = alertsStore.findIndex(a => a.id === id);
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
        return alertsStore.filter(a => a.doctorId === doctorId && !a.isRead).length;
    }
}

export const alertService = new AlertService();