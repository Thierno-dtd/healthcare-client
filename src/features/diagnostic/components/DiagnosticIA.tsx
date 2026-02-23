import React, { useState, useRef } from 'react';
import { useDiagnosticHistory, useAnalyzeImage } from '../hooks/useDiagnostic';
import type { DiagnosticRequest, ImageFormat } from '../types/diagnostic.types';

const ACCEPTED_FORMATS: ImageFormat[] = ['jpg', 'png', 'dicom'];
const ACCEPTED_MIME = '.jpg,.jpeg,.png,.dcm';

const DiagnosticIA: React.FC = () => {
  const { data: history, isLoading: historyLoading } = useDiagnosticHistory();
  const analyzeImage = useAnalyzeImage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [examType, setExamType] = useState<DiagnosticRequest['type']>('radiographie');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;
    analyzeImage.mutate(
      { imageFile: selectedFile, type: examType },
      {
        onSuccess: () => {
          setSelectedFile(null);
          setPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
      }
    );
  };

  return (
    <div className="page-content">
      <div className="content-header-app">
        <div className="header-image" style={{
          background: 'linear-gradient(rgba(42, 107, 143, 0.8), rgba(42, 107, 143, 0.9)), url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover'
        }}>
          <div className="header-overlay">
            <h1><i className="fas fa-x-ray"></i> Diagnostic IA - Radiologie</h1>
            <p>Téléchargez des images médicales pour une analyse assistée par IA</p>
          </div>
        </div>
      </div>

      <div className="content-body">
        {/* Upload & analyse */}
        <div className="content-card-app" style={{ maxWidth: '800px', margin: '0 auto 24px' }}>
          <div className="card-header">
            <div className="card-icon bg-blue-50 text-blue-600">
              <i className="fas fa-x-ray"></i>
            </div>
            <h3>Analyse de radiographie</h3>
          </div>
          <div className="card-content">
            <p style={{ marginBottom: '16px' }}>
              Téléchargez une image de radiographie pour obtenir une analyse préliminaire par IA.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: 500, display: 'block', marginBottom: '8px' }}>Type d'examen</label>
              <select
                className="form-input"
                value={examType}
                onChange={(e) => setExamType(e.target.value as DiagnosticRequest['type'])}
              >
                <option value="radiographie">Radiographie</option>
                <option value="irm">IRM</option>
                <option value="scanner">Scanner</option>
                <option value="echographie">Échographie</option>
              </select>
            </div>

            {!selectedFile ? (
              <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                <i className="fas fa-cloud-upload-alt"></i>
                <h3>Déposer une image médicale</h3>
                <p>Formats acceptés : {ACCEPTED_FORMATS.join(', ').toUpperCase()}</p>
                <button className="btn btn-primary" type="button">Parcourir les fichiers</button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_MIME}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                {preview && (
                  <img
                    src={preview}
                    alt="Aperçu"
                    style={{ maxHeight: '300px', borderRadius: '8px', marginBottom: '16px' }}
                  />
                )}
                <p style={{ marginBottom: '12px' }}>
                  <i className="fas fa-file-image"></i> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleAnalyze}
                    disabled={analyzeImage.isPending}
                  >
                    {analyzeImage.isPending ? (
                      <><i className="fas fa-spinner fa-spin"></i> Analyse en cours...</>
                    ) : (
                      <><i className="fas fa-search"></i> Lancer l'analyse</>
                    )}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => { setSelectedFile(null); setPreview(null); }}
                    disabled={analyzeImage.isPending}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Historique */}
        <div className="content-card-app" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-header">
            <div className="card-icon bg-purple-50 text-purple-600">
              <i className="fas fa-history"></i>
            </div>
            <h3>Historique des analyses</h3>
          </div>
          <div className="card-content">
            {historyLoading ? (
              <p><i className="fas fa-spinner fa-spin"></i> Chargement...</p>
            ) : !history?.length ? (
              <p style={{ color: 'var(--text-secondary)' }}>Aucune analyse effectuée.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.map((item) => (
                  <div key={item.id} className="content-card-app" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{item.patientName}</strong>
                        <span style={{ margin: '0 8px', color: 'var(--text-secondary)' }}>—</span>
                        <span>{item.type}</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.date}</span>
                    </div>
                    {item.result && (
                      <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                        <p><strong>Diagnostic :</strong> {item.result.diagnosis}</p>
                        <p><strong>Confiance :</strong> {(item.result.confidence * 100).toFixed(0)}%</p>
                        {item.result.anomalies.length > 0 && (
                          <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                            {item.result.anomalies.map((a, i) => (
                              <li key={i}>
                                {a.label} ({a.location}) — sévérité : {a.severity}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticIA;
