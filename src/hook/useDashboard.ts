import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import type { UserRole } from '@/data/models/user.model';

export const DASHBOARD_KEYS = {
    stats: (role: UserRole, userId: string, hospitalId?: string) =>
        ['dashboard', 'stats', role, userId, hospitalId] as const,
    activity: () => ['dashboard', 'activity'] as const,
    alertsChart: () => ['dashboard', 'alerts-chart'] as const,
};

export function useDashboardStats(
    role: UserRole,
    userId: string,
    hospitalId?: string
) {
    return useQuery({
        queryKey: DASHBOARD_KEYS.stats(role, userId, hospitalId),
        queryFn: async () => {
            if (role === 'doctor') {
                // Map user id to doctor id — in a real app this would come from the user object
                const doctorId = 'd_001';
                return dashboardService.getDoctorDashboardStats(doctorId);
            }
            if (role === 'hospital_manager' && hospitalId) {
                return dashboardService.getManagerDashboardStats(hospitalId);
            }
            return dashboardService.getAdminDashboardStats();
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useActivityChart() {
    return useQuery({
        queryKey: DASHBOARD_KEYS.activity(),
        queryFn: () => dashboardService.getPatientActivityChart(),
        staleTime: 5 * 60 * 1000,
    });
}

export function useAlertsChart() {
    return useQuery({
        queryKey: DASHBOARD_KEYS.alertsChart(),
        queryFn: () => dashboardService.getAlertsBySeverityChart(),
        staleTime: 5 * 60 * 1000,
    });
}