// ============================================================
// Service Diagnostic IA
// ============================================================

// import { apiPost, apiGet } from '@core/api';
import type { DiagnosticRequest, DiagnosticResult, DiagnosticHistory } from '../types/diagnostic.types';

// TODO: Remplacer par de vrais appels API quand le backend est prêt

const MOCK_HISTORY: DiagnosticHistory[] = [
  {
    id: 'diag_1',
    patientName: 'Martin Marie',
    type: 'Radiographie thoracique',
    date: '2024-03-15',
    status: 'completed',
    result: {
      id: 'res_1',
      imageId: 'img_1',
      diagnosis: 'Aucune anomalie détectée',
      confidence: 0.95,
      anomalies: [],
      recommendations: ['Contrôle dans 12 mois'],
      analyzedAt: new Date('2024-03-15T10:30:00'),
    },
  },
  {
    id: 'diag_2',
    patientName: 'Bernard Pierre',
    type: 'Radiographie pulmonaire',
    date: '2024-03-10',
    status: 'completed',
    result: {
      id: 'res_2',
      imageId: 'img_2',
      diagnosis: 'Opacité détectée – investigation recommandée',
      confidence: 0.78,
      anomalies: [
        { label: 'Opacité pulmonaire', confidence: 0.78, location: 'Lobe inférieur droit', severity: 'medium' },
      ],
      recommendations: ['Scanner thoracique recommandé', 'Consultation pneumologue'],
      analyzedAt: new Date('2024-03-10T14:15:00'),
    },
  },
];

export const diagnosticService = {
  /**
   * Envoyer une image pour analyse IA
   */
  async analyzeImage(_request: DiagnosticRequest): Promise<DiagnosticResult> {
    // TODO: apiPost('/diagnostic/analyze', formData)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `res_${Date.now()}`,
          imageId: `img_${Date.now()}`,
          diagnosis: 'Analyse mock : aucune anomalie détectée',
          confidence: 0.92,
          anomalies: [],
          recommendations: ['Contrôle dans 6 mois'],
          analyzedAt: new Date(),
        });
      }, 2000);
    });
  },

  /**
   * Récupérer l'historique des diagnostics
   */
  async getHistory(): Promise<DiagnosticHistory[]> {
    // TODO: apiGet('/diagnostic/history')
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_HISTORY), 500);
    });
  },

  /**
   * Récupérer un diagnostic par ID
   */
  async getById(id: string): Promise<DiagnosticHistory | undefined> {
    // TODO: apiGet(`/diagnostic/${id}`)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_HISTORY.find((d) => d.id === id));
      }, 300);
    });
  },
};
