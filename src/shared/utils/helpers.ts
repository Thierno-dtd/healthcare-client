// ============================================================
// Helpers - Fonctions utilitaires typées
// ============================================================

import { format, formatDistance, formatRelative } from 'date-fns';
import { fr } from 'date-fns/locale';

// --- Date helpers ---

export const formatDate = (date: string | Date | null, formatStr = 'dd/MM/yyyy'): string => {
  if (!date) return '';
  return format(new Date(date), formatStr, { locale: fr });
};

export const formatRelativeDate = (date: string | Date | null): string => {
  if (!date) return '';
  return formatDistance(new Date(date), new Date(), { addSuffix: true, locale: fr });
};

export const formatRelativeFull = (date: string | Date | null): string => {
  if (!date) return '';
  return formatRelative(new Date(date), new Date(), { locale: fr });
};

export const formatRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return 'Il y a quelques minutes';
  if (hours < 24) return `Il y a ${hours}h`;
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days} jours`;
  return new Date(dateStr).toLocaleDateString('fr-FR');
};

// --- Validation helpers ---

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return !!password && password.length >= 8;
};

// --- String helpers ---

export const truncateText = (text: string | null, maxLength = 50): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalize = (str: string | null): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatPhoneNumber = (phone: string | null): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
  }
  return phone;
};

// --- ID generation ---

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// --- File helpers ---

export const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

export const getFileExtension = (filename: string | null): string => {
  if (!filename) return '';
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isImageFile = (file: File | null): boolean => {
  if (!file) return false;
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  return imageTypes.includes(file.type);
};

export const isPdfFile = (file: File | null): boolean => {
  if (!file) return false;
  return file.type === 'application/pdf';
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// --- Utility functions ---

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait = 300
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    console.error('Erreur lors de la copie');
    return false;
  }
};

// --- Avatar helpers ---

const AVATAR_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'];
const AVATAR_COLORS_SECONDARY = ['#dc2626', '#d97706', '#059669', '#2563eb', '#4f46e5', '#7c3aed', '#db2777', '#0891b2'];

export const generateAvatarColor = (name: string | null): string => {
  if (!name) return '#3b82f6';
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export const getAvatarGradient = (name: string): { primary: string; secondary: string } => {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return {
    primary: AVATAR_COLORS[index],
    secondary: AVATAR_COLORS_SECONDARY[index],
  };
};

export const getInitials = (name: string | null): string => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// --- Medical helpers ---

export const calculateAge = (birthDate: string | null): number | null => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[status] || colors.default;
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    urgente: 'bg-red-100 text-red-800 border-red-200',
    haute: 'bg-orange-100 text-orange-800 border-orange-200',
    normale: 'bg-blue-100 text-blue-800 border-blue-200',
    basse: 'bg-gray-100 text-gray-800 border-gray-200',
    routine: 'bg-green-100 text-green-800 border-green-200',
  };
  return colors[priority] || colors.normale;
};

// --- Notification helpers ---

export const getNotificationIcon = (type: string): string => {
  const icons: Record<string, string> = {
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
    success: 'fas fa-check-circle',
    danger: 'fas fa-times-circle',
  };
  return icons[type] || icons.info;
};

// --- Currency ---

export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '0,00 €';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

// --- Date checks ---

export const isFutureDate = (date: string | null): boolean => {
  if (!date) return false;
  return new Date(date) > new Date();
};

export const isPastDate = (date: string | null): boolean => {
  if (!date) return false;
  return new Date(date) < new Date();
};
