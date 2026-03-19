// ============================================================
// SHARED UTILITIES
// ============================================================

import { format, formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { AlertSeverity } from '@/data/models';
import {PatientStatus} from "@/data/models/patient.model.ts";
import {DoctorStatus} from "@/data/models/doctor.model.ts";
import {HospitalStatus} from "@/data/models/hospital.model.ts";

// ─── Date helpers ─────────────────────────────────────────────
export const formatDate = (date: string | Date | null, fmt = 'dd/MM/yyyy'): string => {
    if (!date) return '–';
    return format(new Date(date), fmt, { locale: fr });
};

export const formatRelativeDate = (date: string | null): string => {
    if (!date) return '–';
    return formatDistance(new Date(date), new Date(), { addSuffix: true, locale: fr });
};

export const formatRelativeTime = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days}j`;
    return formatDate(dateStr);
};

// ─── Avatar helpers ───────────────────────────────────────────
const PALETTE = [
    { bg: '#dbeafe', text: '#1d4ed8' },
    { bg: '#d1fae5', text: '#065f46' },
    { bg: '#fce7f3', text: '#be185d' },
    { bg: '#e0e7ff', text: '#4338ca' },
    { bg: '#fff7ed', text: '#c2410c' },
    { bg: '#f3e8ff', text: '#7c3aed' },
    { bg: '#ecfdf5', text: '#047857' },
    { bg: '#fef3c7', text: '#b45309' },
];

export const getAvatarColors = (name: string) => {
    const idx = name.charCodeAt(0) % PALETTE.length;
    return PALETTE[idx];
};

export const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

export const calculateAge = (dob: string | null): number | null => {
    if (!dob) return null;
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    if (
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    ) age--;
    return age;
};

// ─── Status labels + colors ───────────────────────────────────
export const PATIENT_STATUS_CONFIG: Record<PatientStatus, { label: string; className: string }> = {
    active:    { label: 'Actif',    className: 'badge-success' },
    pending:   { label: 'En attente', className: 'badge-warning' },
    suspended: { label: 'Suspendu', className: 'badge-danger' },
};

export const ALERT_SEVERITY_CONFIG: Record<AlertSeverity, { label: string; className: string; icon: string }> = {
    critical: { label: 'Critique', className: 'bg-red-100 text-red-800 border-red-200', icon: 'fas fa-exclamation-circle' },
    high:     { label: 'Élevé',   className: 'bg-orange-100 text-orange-800 border-orange-200', icon: 'fas fa-exclamation-triangle' },
    medium:   { label: 'Moyen',   className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: 'fas fa-info-circle' },
    low:      { label: 'Faible',  className: 'bg-green-100 text-green-800 border-green-200', icon: 'fas fa-check-circle' },
};

export const DOCTOR_STATUS_CONFIG: Record<DoctorStatus, { label: string; className: string }> = {
    active:  { label: 'Actif',    className: 'badge-success' },
    pending: { label: 'En attente', className: 'badge-warning' },
    inactive: { label: 'Inactif', className: 'badge-danger' },
};

export const HOSPITAL_STATUS_CONFIG: Record<HospitalStatus, { label: string; className: string }> = {
    active:   { label: 'Actif',   className: 'badge-success' },
    inactive: { label: 'Inactif', className: 'badge-danger' },
};

export const ROLE_LABELS: Record<string, string> = {
    doctor: 'Médecin',
    hospital_manager: 'Gestionnaire',
    admin: 'Administrateur',
};

// ─── Metric helpers ───────────────────────────────────────────
export const METRIC_LABELS: Record<string, string> = {
    blood_pressure: 'Tension artérielle',
    heart_rate: 'Fréquence cardiaque',
    glucose: 'Glycémie',
    weight: 'Poids',
    steps: 'Pas',
    sleep: 'Sommeil',
    oxygen_saturation: 'SpO₂',
};

export const METRIC_ICONS: Record<string, string> = {
    blood_pressure: 'fas fa-tachometer-alt',
    heart_rate: 'fas fa-heartbeat',
    glucose: 'fas fa-tint',
    weight: 'fas fa-weight',
    steps: 'fas fa-walking',
    sleep: 'fas fa-bed',
    oxygen_saturation: 'fas fa-lungs',
};

// ─── String helpers ───────────────────────────────────────────
export const truncate = (str: string, max = 60) =>
    str.length <= max ? str : str.substring(0, max) + '…';

export const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

// ─── Pagination helper ────────────────────────────────────────
export const getPageNumbers = (currentPage: number, totalPages: number): number[] => {
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
        range.push(i);
    }
    return range;
};

// ─── Notification icon ────────────────────────────────────────
export const getNotificationIcon = (type: string): string => {
    const icons: Record<string, string> = {
        alert: 'fas fa-bell',
        message: 'fas fa-envelope',
        system: 'fas fa-cog',
        appointment: 'fas fa-calendar-check',
    };
    return icons[type] ?? 'fas fa-info-circle';
};

const GRADIENTS = [
    { primary: '#2a6b8f', secondary: '#4a9d7c' },
    { primary: '#7c3aed', secondary: '#a855f7' },
    { primary: '#059669', secondary: '#14b8a6' },
    { primary: '#d97706', secondary: '#f59e0b' },
    { primary: '#dc2626', secondary: '#ef4444' },
    { primary: '#2563eb', secondary: '#3b82f6' },
];

export const getAvatarGradient = (name: string = '') => {
    const idx = (name.charCodeAt(0) || 0) % GRADIENTS.length;
    return GRADIENTS[idx];
};