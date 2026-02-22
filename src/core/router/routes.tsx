import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@core/auth/auth.store';
import ProtectedRoute from '@core/auth/ProtectedRoute';

// Layout
import { MainLayout } from '@shared/components/layout';

// Features
import LandingPage from '@features/landing/components/LandingPage';
import { LoginPage } from '@features/auth';
import Dashboard from '@features/dashboard/components/Dashboard';
import DiagnosticIA from '@features/diagnostic/components/DiagnosticIA';
import ExpertMedical from '@features/expert-medical/components/ExpertMedical';
import Examens from '@features/examens/components/Examens';
import Disponibilites from '@features/disponibilites/components/Disponibilites';
import VerificationQR from '@features/verification-qr/components/VerificationQR';

// Patient
import { DossierMedical } from '@features/dossier-medical';
import EtatSante from '@features/dossier-medical/components/EtatSante';
import Medicaments from '@features/dossier-medical/components/Medicaments';

// Medecin
import DossiersPatients from '@features/dossier-medical/components/DossiersPatients';
import CasSpeciaux from '@features/dossier-medical/components/CasSpeciaux';
import Ordonnances from '@features/ordonnances/components/Ordonnances';

// Pharmacien
import ScanQR from '@features/pharmacie/components/ScanQR';
import GestionPharmacie from '@features/pharmacie/components/GestionPharmacie';
import GestionStock from '@features/pharmacie/components/GestionStock';

// Admin
import Users from '@features/admin/components/Users';
import Medecins from '@features/admin/components/Medecins';
import Pharmaciens from '@features/admin/components/Pharmaciens';
import Etablissements from '@features/admin/components/Etablissements';
import Statistiques from '@features/admin/components/Statistiques';
import Settings from '@features/admin/components/Settings';

// Error
import Unauthorized from '@features/error/components/Unauthorized';
import NotFound from '@features/error/components/NotFound';

const AppRoutes: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Common routes */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="diagnostic-ia" element={<DiagnosticIA />} />
        <Route path="expert-medical" element={<ExpertMedical />} />
        <Route path="examens" element={<Examens />} />
        <Route path="disponibilites" element={<Disponibilites />} />
        <Route path="verification-qr" element={<VerificationQR />} />

        {/* Patient routes */}
        <Route
          path="patient/dossier"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <DossierMedical />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/etat-sante"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <EtatSante />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/medicaments"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Medicaments />
            </ProtectedRoute>
          }
        />

        {/* Medecin routes */}
        <Route
          path="medecin/patients"
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <DossiersPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="medecin/cas-speciaux"
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <CasSpeciaux />
            </ProtectedRoute>
          }
        />
        <Route
          path="medecin/ordonnances"
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <Ordonnances />
            </ProtectedRoute>
          }
        />

        {/* Pharmacien routes */}
        <Route
          path="pharmacien/scan-qr"
          element={
            <ProtectedRoute allowedRoles={['pharmacien']}>
              <ScanQR />
            </ProtectedRoute>
          }
        />
        <Route
          path="pharmacien/gestion"
          element={
            <ProtectedRoute allowedRoles={['pharmacien']}>
              <GestionPharmacie />
            </ProtectedRoute>
          }
        />
        <Route
          path="pharmacien/stock"
          element={
            <ProtectedRoute allowedRoles={['pharmacien']}>
              <GestionStock />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/medecins"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Medecins />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/pharmaciens"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Pharmaciens />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/etablissements"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Etablissements />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/statistiques"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Statistiques />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Error routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
