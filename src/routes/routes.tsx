import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@core/auth/auth.store';
import ProtectedRoute from './ProtectedRoute';

// Layout
import { MainLayout } from '@shared/components/layout';


import Unauthorized from '@features/error/components/Unauthorized';
import NotFound from '@features/error/components/NotFound';

const AppRoutes: React.FC = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <Routes>
            {/* Public routes */}

            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
            />



            {/* Error routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;