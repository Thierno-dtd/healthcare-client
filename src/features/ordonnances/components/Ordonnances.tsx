import React, { useState } from 'react';
import { PATIENTS } from '@shared/data/mock-data';

interface MedicamentForm {
  nom: string;
  dosage: string;
  frequence: string;
  duree: string;
}

interface OrdonnanceData {
  patient: string;
  medicaments: MedicamentForm[];
  instructions: string;
}

const Ordonnances: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [ordonnanceData, setOrdonnanceData] = useState<OrdonnanceData>({
        patient: '',
        medicaments: [],
        instructions: ''
    });

    const ajouterMedicament = () => {
        setOrdonnanceData({
            ...ordonnanceData,
            medicaments: [...ordonnanceData.medicaments, {
                nom: '',
                dosage: '',
                frequence: '',
                duree: ''
            }]
        });
    };

    const genererQR = () => {
        alert('QR Code généré ! (Fonction simulée)');
    };

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(16, 185, 129, 0.8), rgba(16, 185, 129, 0.9)), url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Créer une Ordonnance QR</h1>
                        <p>Générez des ordonnances sécurisées avec code QR</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                <div className="max-w-4xl mx-auto">
                    {/* Stepper */}
                    <div className="stepper mb-6">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-number">1</div>
                            <span>Patient</span>
                        </div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-number">2</div>
                            <span>Médicaments</span>
                        </div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>
                            <div className="step-number">3</div>
                            <span>Génération QR</span>
                        </div>
                    </div>

                    <div className="content-card-app">
                        {step === 1 && (
                            <div>
                                <h3 className="card-title">Sélectionner le patient</h3>
                                <select className="form-control mb-4">
                                    <option>Sélectionnez un patient...</option>
                                    {PATIENTS.map(p => (
                                        <option key={p.id} value={p.id}>{p.nom}</option>
                                    ))}
                                </select>
                                <button className="btn btn-primary" onClick={() => setStep(2)}>
                                    Suivant <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <h3 className="card-title">Prescrire les médicaments</h3>
                                <div className="space-y-4">
                                    {ordonnanceData.medicaments.map((med, idx) => (
                                        <div key={idx} className="medicament-form p-4 border rounded">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Nom du médicament"
                                                    className="form-control"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Dosage"
                                                    className="form-control"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Fréquence"
                                                    className="form-control"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Durée"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-outline mt-4" onClick={ajouterMedicament}>
                                    <i className="fas fa-plus"></i> Ajouter un médicament
                                </button>
                                <div className="flex gap-3 mt-6">
                                    <button className="btn btn-outline" onClick={() => setStep(1)}>
                                        <i className="fas fa-arrow-left"></i> Retour
                                    </button>
                                    <button className="btn btn-primary" onClick={() => setStep(3)}>
                                        Suivant <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center">
                                <h3 className="card-title">Ordonnance QR</h3>
                                <div className="qr-preview">
                                    <div className="qr-placeholder">
                                        <i className="fas fa-qrcode text-6xl text-gray-400"></i>
                                        <p className="mt-4 text-gray-600">QR Code de l'ordonnance</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-center mt-6">
                                    <button className="btn btn-outline" onClick={() => setStep(2)}>
                                        <i className="fas fa-arrow-left"></i> Retour
                                    </button>
                                    <button className="btn btn-primary" onClick={genererQR}>
                                        <i className="fas fa-download"></i> Télécharger
                                    </button>
                                    <button className="btn btn-secondary">
                                        <i className="fas fa-print"></i> Imprimer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ordonnances;
