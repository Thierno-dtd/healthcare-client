export const C = {
  primary: '#163344',
  blue: '#3b82f6',
  blueDark: '#1d4ed8',
  blueLight: '#eff6ff',
  medical: '#10b981',
  medicalLight: '#ecfdf5',
  amber: '#f59e0b',
  amberLight: '#fffbeb',
  danger: '#ef4444',
  dangerLight: '#fef2f2',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  white: '#ffffff',
};

export const responsiveCSS = `
  .dossiers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
  @media (max-width: 760px) { .dossiers-grid { grid-template-columns: 1fr; } }
`;

export type TabItem = { id: 'total' | 'lecture' | 'refuse' | 'historique'; label: string; icon: string; color: string };

export const TABS: TabItem[] = [
  { id: 'total', label: 'Autorisation totale', icon: 'fas fa-lock-open', color: C.medical },
  { id: 'lecture', label: 'Autorisation en lecture', icon: 'fas fa-eye', color: C.blue },
  { id: 'refuse', label: 'Autorisation refusée', icon: 'fas fa-ban', color: C.danger },
  { id: 'historique', label: 'Historique', icon: 'fas fa-history', color: C.amber },
];
