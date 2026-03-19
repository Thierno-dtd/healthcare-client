import type { UserRole } from './user.types';

/** Item de menu dans la sidebar */
export interface MenuItem {
    id: string;
    label: string;
    icon: string;
    route: string;
    badge?: string;
}

/** Section de menu */
export interface MenuSection {
    section: string;
    items: MenuItem[];
}

/** Configuration de menu par rôle */
export type MenuConfig = Record<UserRole, MenuSection[]>;

/** Carte du Dashboard */
export interface DashboardCard {
    id: string;
    title: string;
    description: string;
    icon: string;
    route: string;
    color: string;
    roles?: UserRole[];
    badge?: string;
}

/** Configuration du dashboard par rôle */
export type DashboardCardsConfig = {
    common: DashboardCard[];
} & Partial<Record<UserRole, DashboardCard[]>>;

/** Réponse API paginée */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

/** Réponse API standard */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/** Paramètres de filtre */
export interface FilterParams {
    search?: string;
    status?: string;
    type?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/** État de chargement */
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}