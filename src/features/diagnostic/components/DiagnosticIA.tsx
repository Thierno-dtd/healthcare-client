import React from 'react';
import { useAuthStore } from '@core/auth/auth.store';

const DiagnosticIA: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="page-content">
      <div className="content-header-app">
        <div className="header-image" style={{
          background: 'linear-gradient(rgba(42, 107, 143, 0.8), rgba(42, 107, 143, 0.9)), url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover'
        }}>
          <div className="header-overlay">
            <h1>Diagnostic IA - Radiologie</h1>
            <p>Téléchargez des images médicales pour une analyse assistée par IA</p>
          </div>
        </div>
      </div>
      <div className="content-body">
        <div className="content-card-app" style={{maxWidth: '800px', margin: '0 auto'}}>
          <div className="card-header">
            <div className="card-icon bg-blue-50 text-blue-600">
              <i className="fas fa-x-ray"></i>
            </div>
            <h3>Analyse de radiographie</h3>
          </div>
          <div className="card-content">
            {user?.role === 'medecin' ? (
              <>
                <p style={{marginBottom: '20px'}}>
                  Téléchargez une image de radiographie pour obtenir une analyse préliminaire par IA.
                </p>
                <div className="upload-area">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <h3>Déposer une image médicale</h3>
                  <p>Formats acceptés : JPG, PNG, DICOM</p>
                  <button className="btn btn-primary">Parcourir les fichiers</button>
                </div>
              </>
            ) : (
              <p>En mode patient, vous pouvez visualiser les résultats d'analyses effectuées par votre médecin.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticIA;
