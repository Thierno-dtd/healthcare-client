import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VerificationResultData {
  valide: boolean;
  type: string;
  date: string;
  emetteur: string;
  details: string;
}

const VerificationQR: React.FC = () => {
    const [verificationResult, setVerificationResult] = useState<VerificationResultData | null>(null);

    const verifierQR = () => {
        setVerificationResult({
            valide: true,
            type: 'Ordonnance médicale',
            date: '15 Mars 2024',
            emetteur: 'Dr. Jean Dupont',
            details: 'Ordonnance pour traitement antibiotique'
        });
    };

    return (
        <div className="page-content">
            <div className="content-body" style={{padding: '30px'}}>
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-center mb-6">Vérification QR Code</h2>

                    {!verificationResult ? (
                        <div className="content-card-app text-center">
                            <div className="qr-scanner-placeholder mb-6">
                                <i className="fas fa-qrcode text-8xl text-gray-300 mb-4"></i>
                                <p className="text-gray-600">Scannez un QR code pour vérifier son authenticité</p>
                            </div>
                            <button className="btn btn-primary btn-lg" onClick={verifierQR}>
                                <i className="fas fa-camera"></i> Scanner un QR code
                            </button>
                        </div>
                    ) : (
                        <div className="content-card-app">
                            <div className="text-center mb-6">
                                <div className={`verification-icon ${verificationResult.valide ? 'success' : 'error'}`}>
                                    <i className={`fas fa-${verificationResult.valide ? 'check' : 'times'}-circle text-6xl`}></i>
                                </div>
                                <h3 className="text-2xl font-bold mt-4">
                                    {verificationResult.valide ? 'QR Code Valide' : 'QR Code Invalide'}
                                </h3>
                            </div>

                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="label">Type de document</span>
                                    <span className="value">{verificationResult.type}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Date d'émission</span>
                                    <span className="value">{verificationResult.date}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Émetteur</span>
                                    <span className="value">{verificationResult.emetteur}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Détails</span>
                                    <span className="value">{verificationResult.details}</span>
                                </div>
                            </div>

                            <button
                                className="btn btn-outline w-full mt-6"
                                onClick={() => setVerificationResult(null)}
                            >
                                <i className="fas fa-redo"></i> Vérifier un autre QR code
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificationQR;
