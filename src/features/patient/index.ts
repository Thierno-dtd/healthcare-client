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

export type {
  Exam,
  ExamStatus,
  Priorite,
  ExamContext,
  ExamResult,
} from './types/exam.types';

export type {
  PrescriptionData,
  MedicamentWithPurchase,
  PurchaseStatus,
} from './types/prescription.types';

export type {
  RendezVous as RendezVousAlt, // avoid duplicate
  CreateRendezVousDTO as CreateRendezVousDTOAlt,
  UpdateRendezVousDTO as UpdateRendezVousDTOAlt,
} from './types/rendez-vous.types';

// Services
export { etatSanteService } from './services/etat-sante.service';
export { rendezVousService } from './services/rendez-vous.service';
export { ordonnancePatientService } from './services/ordonnance-patient.service';
export { healthRecordService } from './services/healthRecord.service';
export { prescriptionService } from './services/prescription.service';
export { examService } from './services/exam.service';
export { healthCenterService } from './services/health-center.service';
export { expertMedicalService } from './services/expert-medical.service';
export { medicamentService } from './services/medicament.service';
export { gestionAccesService } from './services/gestion-acces.service';

// Hooks
export { useEtatSante, useAjouterMesure, useMarquerAlerteLue } from './hooks/useEtatSante';
export { useRendezVous, useCreerRendezVous, useModifierRendezVous, useAnnulerRendezVous } from './hooks/useRendezVous';
export { useOrdonnancesPatient, useOrdonnanceDetail, useGenererQRCode } from './hooks/useOrdonnancePatient';
export { useHealthRecord } from './hooks/useHealthRecord';
export { usePrescriptions, usePrescriptionDetail } from './hooks/usePrescriptions';
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
export { default as DisponibilitesPatient } from './components/DisponibilitesPharmacy';
export { default as HealthRecord } from './components/HealthRecord';
