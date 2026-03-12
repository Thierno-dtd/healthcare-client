// ============================================================
// Patient Feature - Barrel Export
// ============================================================

// Types
export type {
  RendezVous,
  RendezVousStatus,
  RendezVousType,
  CreateRendezVousDTO,
  UpdateRendezVousDTO,
  OrdonnancePatient,
  OrdonnanceQRStatus,
  OrdonnanceMedicamentPatient,
  EtatSanteData,
  MesureSante,
  IndicateurSante,
  ScoreSante,
  AlerteSante,
  CentreSante,
  CentreSanteFilter,
  TypeEtablissement,
  DisponibiliteStatus,
  ConversationMessage,
  Conversation,
  SendMessageDTO,
  ExpertResponse,
  MessageRole,
  TypeAcces,
  HistoriqueAcces,
  DemandeAcces,
  ReponseDemandeAccesDTO,
  AppelVideo,
  AppelVideoStatus,
  WebRTCConfig,
  MedicamentSuivi,
  RappelMedicament,
} from './types/patient.types';

// Services
export { etatSanteService } from './services/etat-sante.service';
export { rendezVousService } from './services/rendez-vous.service';
export { ordonnancePatientService } from './services/ordonnance-patient.service';
export { healthCenterService } from './services/health-center.service';
export { expertMedicalService } from './services/expert-medical.service';
export { medicamentService } from './services/medicament.service';
export { gestionAccesService } from './services/gestion-acces.service';

// Hooks
export { useEtatSante, useAjouterMesure, useMarquerAlerteLue } from './hooks/useEtatSante';
export { useRendezVous, useCreerRendezVous, useModifierRendezVous, useAnnulerRendezVous } from './hooks/useRendezVous';
export { useOrdonnancesPatient, useOrdonnanceDetail, useGenererQRCode } from './hooks/useOrdonnancePatient';
export { useHealthCenters, useHealthCenter } from './hooks/useHealthCenters';
export { useConversations, useSendMessage, useCreerConversation } from './hooks/useExpertMedical';
export { useMedicamentsSuivi, useRappelsMedicaments, useMarquerPrise } from './hooks/useMedicamentsSuivi';
export {
  useAutorisations,
  useHistoriqueAcces,
  useDemandesAcces,
  useRepondreDemande,
  useRevoquerAutorisation,
  useAjouterAutorisation,
} from './hooks/useGestionAcces';

// Components
export { default as GestionAcces } from './components/GestionAcces';
export { default as ExpertMedicalPatient } from './components/ExpertMedicalPatient';
export { default as RendezVousPatient } from './components/PatientAppointments';
export { default as OrdonnancesPatient } from './components/OrdonnancesPatient';
export { default as DisponibilitesPatient } from './components/DisponibilitesPatient';
