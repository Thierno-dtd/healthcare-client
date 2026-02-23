// ============================================================
// Types Diagnostic IA
// ============================================================

export type ImageFormat = 'jpg' | 'png' | 'dicom';

export type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'completed' | 'error';

export interface DiagnosticImage {
  id: string;
  file: File;
  preview: string;
  format: ImageFormat;
  uploadedAt: Date;
}

export interface DiagnosticResult {
  id: string;
  imageId: string;
  diagnosis: string;
  confidence: number;
  anomalies: Anomaly[];
  recommendations: string[];
  analyzedAt: Date;
}

export interface Anomaly {
  label: string;
  confidence: number;
  location?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface DiagnosticRequest {
  imageFile: File;
  type: 'radiographie' | 'irm' | 'scanner' | 'echographie';
  notes?: string;
  patientId?: string;
}

export interface DiagnosticHistory {
  id: string;
  patientName: string;
  type: string;
  date: string;
  status: AnalysisStatus;
  result?: DiagnosticResult;
}
