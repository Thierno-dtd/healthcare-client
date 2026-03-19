export interface DashboardStats {
    totalPatients: number;
    activePatients: number;
    pendingPatients: number;
    totalAlerts: number;
    criticalAlerts: number;
    totalDoctors?: number;
    totalHospitals?: number;
}

export interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
}

// ─── Pagination ─────────────────────────────────────────────

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface QueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ─── API Response wrapper ────────────────────────────────────

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}
