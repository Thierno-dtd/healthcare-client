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
import Examens from '@features/examens/components/Examens';

// Patient
import { DossierMedical } from '@features/doctor';
import EtatSante from '@features/doctor/components/EtatSante';
import Medicaments from '@features/doctor/components/Medicaments';
import {
  GestionAcces,
  RendezVousPatient,
  OrdonnancesPatient,
  ExpertMedicalPatient,
  DisponibilitesPatient,
} from '@features/patient';
import AppelVideoPatient from '@features/patient/components/AppelVideoPatient';
import JournalAchatPharmacie from '@features/patient/components/JournalAchatPharmacie';

// Medecin
import DossiersPatients from '@features/doctor/components/DossiersPatients';
import PatientRecordPage from '@features/doctor/components/PatientRecord/PatientRecordPage';
import CasSpeciaux from '@features/doctor/components/CasSpeciaux';
import Ordonnances from '@features/ordonnances/components/Ordonnances';
import { DiagnosticIA } from '@features/diagnostic';
import AppelVideoMedecin from '@features/doctor/components/AppelVideoMedecin';
import  NouvelleConsultation  from '@features/doctor/components/NewConsultation';

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
        <Route path="examens" element={<Examens />} />

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
        <Route
          path="patient/disponibilites"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <DisponibilitesPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/gestion-acces"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <GestionAcces />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/rendez-vous"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <RendezVousPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/ordonnances"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <OrdonnancesPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/ordonnances/journaux"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <JournalAchatPharmacie />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/expert-medical"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <ExpertMedicalPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/appel-video"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <AppelVideoPatient />
            </ProtectedRoute>
          }
        />

        {/* Medecin routes */}
        <Route
          path="medecin/expert-medical"
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <ExpertMedicalPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="medecin/diagnostic-ia"
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <DiagnosticIA />
            </ProtectedRoute>
          }
        />
        <Route
          path="medecin/patients"
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <DossiersPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="medecin/patients/:patientId/*"
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <PatientRecordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="medecin/nouvelle-consultation"
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <NouvelleConsultation />
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
        <Route
          path="medecin/appel-video"
          element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <AppelVideoMedecin />
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
