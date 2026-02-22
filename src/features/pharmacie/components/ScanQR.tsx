import React, { useState } from 'react';

interface ScannedMedicament {
  nom: string;
  dosage: string;
  duree: string;
}

interface ScannedDataType {
  patient: string;
  medecin: string;
  date: string;
  medicaments: ScannedMedicament[];
  valide: boolean;
}

const ScanQR: React.FC = () => {
    const [scanning, setScanning] = useState<boolean>(false);
    const [scannedData, setScannedData] = useState<ScannedDataType | null>(null);

    const startScan = () => {
        setScanning(true);
        // Simulation du scan
        setTimeout(() => {
            setScannedData({
                patient: 'Marie Martin',
                medecin: 'Dr. Jean Dupont',
                date: '15 Mars 2024',
                medicaments: [
                    { nom: 'Doliprane 1000mg', dosage: '3x/jour', duree: '7 jours' },
                    { nom: 'Amoxicilline 500mg', dosage: '2x/jour', duree: '10 jours' }
                ],
                valide: true
            });
            setScanning(false);
        }, 2000);
    };

    const validerOrdonnance = () => {
        alert('Ordonnance validée et délivrée !');
        setScannedData(null);
    };

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.9)), url(https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Scanner Ordonnance QR</h1>
                        <p>Scannez et déchiffrez les ordonnances sécurisées</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                <div className="max-w-3xl mx-auto">
                    {!scannedData ? (
                        <div className="content-card-app text-center">
                            <h3 className="card-title">Scanner une ordonnance</h3>
                            <div className="scan-area">
                                {scanning ? (
                                    <div className="scanning-animation">
                                        <div className="spinner-large"></div>
                                        <p className="mt-4">Scan en cours...</p>
                                    </div>
                                ) : (
                                    <div className="qr-scanner-placeholder">
                                        <i className="fas fa-qrcode text-8xl text-gray-300 mb-4"></i>
                                        <p className="text-gray-600 mb-6">
                                            Placez le QR code de l'ordonnance devant la caméra
                                        </p>
                                        <button className="btn btn-primary btn-lg" onClick={startScan}>
                                            <i className="fas fa-camera"></i> Démarrer le scan
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h4 className="text-blue-900 font-semibold mb-2">
                                    <i className="fas fa-info-circle"></i> Instructions
                                </h4>
                                <ul className="text-left text-sm text-blue-800">
                                    <li>• Assurez-vous que le QR code est bien visible</li>
                                    <li>• Maintenez l'ordonnance stable</li>
                                    <li>• Vérifiez l'éclairage</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="content-card-app">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="card-title">
                                    <i className="fas fa-check-circle text-green-500"></i> Ordonnance scannée
                                </h3>
                                {scannedData.valide ? (
                                    <span className="badge badge-success">Valide</span>
                                ) : (
                                    <span className="badge badge-danger">Invalide</span>
                                )}
                            </div>

                            {/* Informations patient */}
                            <div className="info-section mb-6">
                                <h4 className="font-semibold mb-3">Informations patient</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="info-item">
                                        <span className="label">Patient</span>
                                        <span className="value">{scannedData.patient}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Médecin prescripteur</span>
                                        <span className="value">{scannedData.medecin}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Date de prescription</span>
                                        <span className="value">{scannedData.date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Médicaments prescrits */}
                            <div className="medicaments-section mb-6">
                                <h4 className="font-semibold mb-3">Médicaments prescrits</h4>
                                <div className="space-y-3">
                                    {scannedData.medicaments.map((med, idx) => (
                                        <div key={idx} className="medicament-prescribed">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="medicament-icon">
                                                        <i className="fas fa-pills"></i>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold">{med.nom}</h5>
                                                        <p className="text-sm text-gray-600">
                                                            {med.dosage} pendant {med.duree}
                                                        </p>
                                                    </div>
                                                </div>
                                                <input type="checkbox" className="w-5 h-5" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    className="btn btn-outline flex-1"
                                    onClick={() => setScannedData(null)}
                                >
                                    <i className="fas fa-times"></i> Annuler
                                </button>
                                <button
                                    className="btn btn-primary flex-1"
                                    onClick={validerOrdonnance}
                                >
                                    <i className="fas fa-check"></i> Valider et délivrer
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScanQR;
