import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import ProtectedRoute from './ProtectedRoute';
import { MainLayout } from '@/shared/components/layout';
import Unauthorized from '@features/error/components/Unauthorized';
import NotFound from '@features/error/components/NotFound';
import { LoadingSpinner } from '@shared/components/ui/LoadingSpinner';

// ─── Lazy-loaded pages ────────────────────────────────────────
const LoginPage               = lazy(() => import('@features/auth/components/LoginPage'));
const DashboardPage           = lazy(() => import('@features/dashboard/components/DashboardPage'));
const DoctorDashboardPage     = lazy(() => import('@features/dashboard/components/DoctorDashboardPage'));

// Patients
const PatientsPage            = lazy(() => import('@features/patients/components/PatientsPage'));
const PatientDetailPage       = lazy(() => import('@features/patients/components/PatientDetailPage'));
const PatientFollowUpPage     = lazy(() => import('@features/patients/components/PatientFollowUpPage'));
const NewPatientPage          = lazy(() => import('@features/patients/components/NewPatientPage'));

// Doctor features
const PatientRequestsPage     = lazy(() => import('@features/patientRequests/components/PatientRequestsPage'));

// Alerts
const AlertsPage              = lazy(() => import('@features/alerts/components/AlertsPage'));

// Doctors & Hospitals
const DoctorsPage             = lazy(() => import('@features/doctors/components/DoctorsPage'));
const HospitalsPage           = lazy(() => import('@features/hospitals/components/HospitalsPage'));

// Notifications (doctor sees these, not messages)
const NotificationsPage       = lazy(() => import('@features/notifications/components/NotificationsPage'));

// Health Content & Map
const ContentPage             = lazy(() => import('@features/contents/components/ContentPage'));
const MapPage                 = lazy(() => import('@features/mapVisualiser/components/MapPage'));

// Profile & Settings
const ProfilePage             = lazy(() => import('@features/profile/components/ProfilePage'));
const SettingsPage            = lazy(() => import('@features/settings/components/settingsPage'));

// ─── Page loader ─────────────────────────────────────────────
const PageLoader = () => <LoadingSpinner size="lg" text="Chargement..." />;

const AppRoutes: React.FC = () => {
    const { isAuthenticated, restoreSession, user } = useAuthStore();

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* ── Public ── */}
                <Route
                    path="/"
                    element={<Navigate to={isAuthenticated ? (user?.role === 'doctor' ? '/doctor-dashboard' : '/dashboard') : '/login'} replace />}
                />
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to={user?.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'} replace /> : <LoginPage />}
                />

                {/* ── Protected (inside MainLayout) ── */}
                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Dashboard — role-aware */}
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* Doctor Dashboard */}
                    <Route
                        path="/doctor-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['doctor']}>
                                <DoctorDashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Patient Requests — doctor only */}
                    <Route
                        path="/patient-requests"
                        element={
                            <ProtectedRoute allowedRoles={['doctor']}>
                                <PatientRequestsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Patients */}
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/patients/new" element={<NewPatientPage />} />
                    <Route path="/patients/:id" element={<PatientDetailPage />} />

                    {/* Patient Follow-Up (doctor's detailed view with measurements, prescriptions) */}
                    <Route
                        path="/patients/:id/follow-up"
                        element={
                            <ProtectedRoute allowedRoles={['doctor']}>
                                <PatientFollowUpPage />
                            </ProtectedRoute>
                        }
                    />

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

                    {/* Notifications (doctor) — no messages inbox for doctor */}
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