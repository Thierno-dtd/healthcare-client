import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import type { UserRole } from '@/data/models/user.model';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
    children?: React.ReactNode;
    allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                           children,
                                                           allowedRoles = [],
                                                       }) => {
    const { isAuthenticated, user, isLoading } = useAuthStore();

    if (isLoading) {
        return <LoadingSpinner size="lg" text="Chargement..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // If used as a layout wrapper (with Outlet) or direct children
    return <>{children ?? <Outlet />}</>;
};

export default ProtectedRoute;