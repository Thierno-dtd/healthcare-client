// ============================================================
// ALERT MODELS
// ============================================================

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertType =
    | 'blood_pressure'
    | 'heart_rate'
    | 'glucose'
    | 'weight'
    | 'oxygen_saturation'
    | 'inactivity';

export interface Alert {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    type: AlertType;
    severity: AlertSeverity;
    value: number;
    unit: string;
    threshold: number;
    message: string;
    isRead: boolean;
    isResolved: boolean;
    resolvedAt?: string;
    resolvedBy?: string;
    createdAt: string;
}

export interface AlertFilters {
    severity?: AlertSeverity | 'all';
    isRead?: boolean;
    isResolved?: boolean;
    doctorId?: string;
    page?: number;
    pageSize?: number;
}

// ============================================================
// DASHBOARD MODELS
// ============================================================

export interface DashboardStats {
    totalPatients: number;
    activePatients: number;
    pendingPatients: number;
    totalAlerts: number;
    criticalAlerts: number;
    totalDoctors?: number;
    totalHospitals?: number;
    resolvedAlerts?: number;
}

export interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
    date?: string;
}

// ============================================================
// SHARED API MODELS
// ============================================================

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}