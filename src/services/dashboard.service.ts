import type { DashboardStats, ChartDataPoint } from '@/data/models';
import {delay} from "@/data/mocks/mock-data.ts";

class DashboardService {
    async getDoctorDashboardStats(doctorId: string): Promise<DashboardStats> {
        await delay(400);

        const patients = (await import('@/data/mocks/mock-data')).MOCK_PATIENTS.filter(
            (p) => p.doctorId === doctorId
        );
        const alerts = (await import('@/data/mocks/mock-data')).MOCK_ALERTS.filter(
            (a) => a.doctorId === doctorId
        );

        return {
            totalPatients: patients.length,
            activePatients: patients.filter((p) => p.status === 'active').length,
            pendingPatients: patients.filter((p) => p.status === 'pending').length,
            totalAlerts: alerts.filter((a) => !a.isResolved).length,
            criticalAlerts: alerts.filter((a) => a.severity === 'critical' && !a.isResolved).length,
            resolvedAlerts: alerts.filter((a) => a.isResolved).length,
        };
    }

    async getManagerDashboardStats(hospitalId: string): Promise<DashboardStats> {
        await delay(400);
        const hospitals = (await import('@/data/mocks/mock-data')).MOCK_HOSPITALS;
        const hospital = hospitals.find((h) => h.id === hospitalId);
        const doctors = (await import('@/data/mocks/mock-data')).MOCK_DOCTORS.filter(
            (d) => d.hospitalId === hospitalId
        );
        const patients = (await import('@/data/mocks/mock-data')).MOCK_PATIENTS.filter(
            (p) => p.hospitalId === hospitalId
        );
        const alerts = (await import('@/data/mocks/mock-data')).MOCK_ALERTS.filter((a) =>
            doctors.map((d) => d.id).includes(a.doctorId)
        );

        return {
            totalPatients: hospital?.patientCount ?? patients.length,
            activePatients: patients.filter((p) => p.status === 'active').length,
            pendingPatients: patients.filter((p) => p.status === 'pending').length,
            totalAlerts: alerts.filter((a) => !a.isResolved).length,
            criticalAlerts: alerts.filter((a) => a.severity === 'critical' && !a.isResolved).length,
            totalDoctors: doctors.length,
        };
    }

    async getAdminDashboardStats(): Promise<DashboardStats> {
        await delay(400);
        const data = await import('@/data/mocks/mock-data');

        return {
            totalPatients: data.MOCK_PATIENTS.length,
            activePatients: data.MOCK_PATIENTS.filter((p) => p.status === 'active').length,
            pendingPatients: data.MOCK_PATIENTS.filter((p) => p.status === 'pending').length,
            totalAlerts: data.MOCK_ALERTS.filter((a) => !a.isResolved).length,
            criticalAlerts: data.MOCK_ALERTS.filter((a) => a.severity === 'critical' && !a.isResolved).length,
            totalDoctors: data.MOCK_DOCTORS.length,
            totalHospitals: data.MOCK_HOSPITALS.length,
        };
    }

    async getPatientActivityChart(): Promise<ChartDataPoint[]> {
        await delay(300);
        // Simulate last 7 days patient activity
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
                label: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
                value: Math.floor(Math.random() * 30) + 10,
                date: d.toISOString(),
            };
        });
    }

    async getAlertsBySeverityChart(): Promise<ChartDataPoint[]> {
        await delay(300);
        const data = await import('@/data/mocks/mock-data');
        const severities = ['critical', 'high', 'medium', 'low'] as const;
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

        return severities.map((s, i) => ({
            label: s.charAt(0).toUpperCase() + s.slice(1),
            value: data.MOCK_ALERTS.filter((a) => a.severity === s).length,
            color: colors[i],
        }));
    }
}

export const dashboardService = new DashboardService();
 