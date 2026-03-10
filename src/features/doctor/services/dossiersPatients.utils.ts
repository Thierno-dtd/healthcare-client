import type { CSSProperties } from 'react';
import type { PatientDossier } from '../types/dossiersPatients.types';
import { C } from './dossiersPatients.constants';

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR');

export const getStatusStyle = (status: string): CSSProperties => {
  if (status === 'Stable') return { background: C.medicalLight, color: '#065f46', border: `1px solid ${C.medical}30` };
  if (status === 'Suivi requis') return { background: C.amberLight, color: '#92400e', border: `1px solid ${C.amber}30` };
  return { background: C.dangerLight, color: '#991b1b', border: `1px solid ${C.danger}30` };
};

export const getAccesBadge = (type: PatientDossier['typeAcces']) => {
  if (type === 'total') return { bg: C.medicalLight, color: '#065f46', label: 'Accès total', icon: 'fas fa-lock-open' };
  if (type === 'lecture') return { bg: C.blueLight, color: C.blueDark, label: 'Lecture seule', icon: 'fas fa-eye' };
  return { bg: C.dangerLight, color: '#991b1b', label: 'Refusé', icon: 'fas fa-ban' };
};
