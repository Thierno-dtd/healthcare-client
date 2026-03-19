// src/routes/routes.tsx
import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import ProtectedRoute from './ProtectedRoute';
import { MainLayout } from '@/shared/components/layout';

// Error pages (small, no need for lazy)
import Unauthorized from '@features/error/components/Unauthorized';
import NotFound from '@features/error/components/NotFound';
import {LoadingSpinner} from "@shared/components/ui/LoadingSpinner.tsx";

// Lazy-loaded pages
const LoginPage = lazy(() => import('@features/auth/components/LoginPage'));
const DashboardPage = lazy(() => import('@features/dashboard/components/DashboardPage'));
const PatientsPage = lazy(() => import('@features/patients/components/PatientsPage'));

const PageLoader = () => (
    <LoadingSpinner size="lg" text="Chargement..." />
);

const AppRoutes: React.FC = () => {
    const { isAuthenticated, restoreSession } = useAuthStore();

    // Restore session on first load
    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
                />

                {/* Protected routes inside MainLayout */}
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/patients" element={<PatientsPage />} />
                    {/* Add more pages here as you build them */}
                </Route>

                {/* Error routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;