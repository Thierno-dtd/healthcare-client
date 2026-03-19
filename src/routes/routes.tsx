// src/routes/routes.tsx
import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import ProtectedRoute from './ProtectedRoute';
import { MainLayout } from '@/shared/components/layout';
import Unauthorized from '@features/error/components/Unauthorized';
import NotFound from '@features/error/components/NotFound';
import { LoadingSpinner } from '@shared/components/ui/LoadingSpinner';

// ─── Lazy-loaded pages ────────────────────────────────────────
const LoginPage          = lazy(() => import('@features/auth/components/LoginPage'));
const DashboardPage      = lazy(() => import('@features/dashboard/components/DashboardPage'));

// Patients
const PatientsPage       = lazy(() => import('@features/patients/components/PatientsPage'));
const PatientDetailPage  = lazy(() => import('@features/patients/components/PatientDetailPage'));
const NewPatientPage     = lazy(() => import('@features/patients/components/NewPatientPage'));

// Alerts
const AlertsPage         = lazy(() => import('@features/alerts/components/AlertsPage'));

// Doctors
const DoctorsPage        = lazy(() => import('@features/doctors/components/DoctorsPage'));

// Hospitals
const HospitalsPage      = lazy(() => import('@features/hospitals/components/HospitalsPage'));

// Messages & Notifications
const MessagesPage       = lazy(() => import('@features/messages/components/MessagesPage'));
const NotificationsPage  = lazy(() => import('@features/notifications/components/NotificationsPage'));

// Health Content
const ContentPage        = lazy(() => import('@features/contents/components/ContentPage'));

// Map
const MapPage            = lazy(() => import('@features/mapVisualiser/components/MapPage'));

// Profile & Settings
const ProfilePage        = lazy(() => import('@features/profile/components/ProfilePage'));
const SettingsPage       = lazy(() => import('@features/settings/components/settingsPage'));

// ─── Page loader ─────────────────────────────────────────────
const PageLoader = () => <LoadingSpinner size="lg" text="Chargement..." />;

const AppRoutes: React.FC = () => {
    const { isAuthenticated, restoreSession } = useAuthStore();

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* ── Public ── */}
                <Route
                    path="/"
                    element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
                />
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
                />

                {/* ── Protected (inside MainLayout) ── */}
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Dashboard */}
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* Patients */}
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/patients/new" element={<NewPatientPage />} />
                    <Route path="/patients/:id" element={<PatientDetailPage />} />

                    {/* Alerts */}
                    <Route path="/alerts" element={<AlertsPage />} />

                    {/* Doctors — manager & admin only */}
                    <Route
                        path="/doctors"
                        element={
                            <ProtectedRoute allowedRoles={['hospital_manager', 'admin']}>
                                <DoctorsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Hospitals — admin only */}
                    <Route
                        path="/hospitals"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <HospitalsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Map — admin only */}
                    <Route
                        path="/map"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <MapPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Health content — admin only */}
                    <Route
                        path="/content"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <ContentPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Messages & Notifications */}
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />

                    {/* Profile & Settings */}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* ── Error pages ── */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;