import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@core/auth/auth.store';

interface PatientInfo {
  id: string;
  nom: string;
  avatar: string;
  telephone: string;
}

interface MedecinInfo {
  id: string;
  nom: string;
  specialite: string;
}

interface RendezVous {
  id: string;
  patient: PatientInfo;
  medecin: MedecinInfo;
  date: string;
  heure: string;
  duree: number;
  type: string;
  motif: string;
  statut: string;
  lieu: string;
  notes: string;
  rappelEnvoye: boolean;
  creeLe: string;
}

interface FormDataState {
  patient: string;
  motif: string;
  dateRdv: string;
  heureRdv: string;
  duree: string;
  type: string;
  lieu: string;
  notes: string;
  rappel: boolean;
}

interface BadgeInfo {
  class: string;
  icon?: string;
  text: string;
}

const Examens: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const [rendezvous, setRendezvous] = useState<RendezVous[]>([]);
    const [filteredRdv, setFilteredRdv] = useState<RendezVous[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedRdv, setSelectedRdv] = useState<RendezVous | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

    // Form state
    const [formData, setFormData] = useState<FormDataState>({
        patient: '',
        motif: '',
        dateRdv: '',
        heureRdv: '09:00',
        duree: '30',
        type: 'consultation',
        lieu: 'cabinet',
        notes: '',
        rappel: true
    });

    // Mock data - à remplacer par API
    const mockRdv: RendezVous[] = [
        {
            id: 'RDV-001',
            patient: {
                id: 'pat_001',
                nom: 'BIMA Afi',
                avatar: 'BA',
                telephone: '+228 90 12 34 56'
            },
            medecin: {
                id: 'med_001',
                nom: 'Dr. BEGNI Touna',
                specialite: 'Cardiologie'
            },
            date: '2024-12-16',
            heure: '09:00',
            duree: 30,
            type: 'consultation',
            motif: 'Suivi cardiologique de routine',
            statut: 'confirme',
            lieu: 'Cabinet médical',
            notes: 'Apporter les derniers résultats d\'analyses',
            rappelEnvoye: true,
            creeLe: '2024-12-10'
        },
        {
            id: 'RDV-002',
            patient: {
                id: 'pat_002',
                nom: 'Rebecca AZIALE',
                avatar: 'RA',
                telephone: '+228 91 23 45 67'
            },
            medecin: {
                id: 'med_001',
                nom: 'Dr. BEGNI Touna',
                specialite: 'Cardiologie'
            },
            date: '2024-12-14',
            heure: '14:30',
            duree: 45,
            type: 'controle',
            motif: 'Contrôle post-opératoire',
            statut: 'en_attente',
            lieu: 'Cabinet médical',
            notes: '',
            rappelEnvoye: false,
            creeLe: '2024-12-12'
        },
        {
            id: 'RDV-003',
            patient: {
                id: 'pat_003',
                nom: 'Martin KOFFI',
                avatar: 'MK',
                telephone: '+228 92 34 56 78'
            },
            medecin: {
                id: 'med_001',
                nom: 'Dr. BEGNI Touna',
                specialite: 'Cardiologie'
            },
            date: '2024-12-18',
            heure: '10:30',
            duree: 60,
            type: 'urgence',
            motif: 'Douleurs thoraciques persistantes',
            statut: 'urgent',
            lieu: 'Clinique',
            notes: 'Patient à examiner en priorité',
            rappelEnvoye: true,
            creeLe: '2024-12-13'
        }
    ];

    const mockPatients: PatientInfo[] = [
        { id: 'pat_001', nom: 'BIMA Afi', avatar: 'BA', telephone: '+228 90 12 34 56' },
        { id: 'pat_002', nom: 'Rebecca AZIALE', avatar: 'RA', telephone: '+228 91 23 45 67' },
        { id: 'pat_003', nom: 'Martin KOFFI', avatar: 'MK', telephone: '+228 92 34 56 78' }
    ];

    const creneauxDisponibles: string[] = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    useEffect(() => {
        setRendezvous(mockRdv);
        setFilteredRdv(mockRdv);
    }, []);

    // Filtrage
    useEffect(() => {
        let filtered = rendezvous;

        if (activeFilter !== 'all') {
            filtered = filtered.filter(rdv => rdv.statut === activeFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(rdv =>
                rdv.patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rdv.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rdv.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredRdv(filtered);
    }, [activeFilter, searchTerm, rendezvous]);

    const stats = {
        total: rendezvous.length,
        confirme: rendezvous.filter(r => r.statut === 'confirme').length,
        en_attente: rendezvous.filter(r => r.statut === 'en_attente').length,
        urgent: rendezvous.filter(r => r.statut === 'urgent').length
    };

    const getStatutBadge = (statut: string): BadgeInfo => {
        const badges: Record<string, BadgeInfo> = {
            confirme: { class: 'badge-success', icon: 'fa-check-circle', text: 'Confirmé' },
            en_attente: { class: 'badge-warning', icon: 'fa-clock', text: 'En attente' },
            urgent: { class: 'badge-danger', icon: 'fa-exclamation-circle', text: 'Urgent' },
            annule: { class: 'badge-danger', icon: 'fa-times-circle', text: 'Annulé' },
            termine: { class: 'badge-info', icon: 'fa-check', text: 'Terminé' }
        };
        return badges[statut] || badges.en_attente;
    };

    const getTypeBadge = (type: string): BadgeInfo => {
        const badges: Record<string, BadgeInfo> = {
            consultation: { class: 'badge-info', text: 'Consultation' },
            controle: { class: 'badge-medical', text: 'Contrôle' },
            urgence: { class: 'badge-danger', text: 'Urgence' },
            suivi: { class: 'badge-warning', text: 'Suivi' }
        };
        return badges[type] || badges.consultation;
    };

    const handleOpenModal = (rdv: RendezVous | null = null) => {
        if (rdv) {
            setFormData({
                patient: rdv.patient.id,
                motif: rdv.motif,
                dateRdv: rdv.date,
                heureRdv: rdv.heure,
                duree: rdv.duree.toString(),
                type: rdv.type,
                lieu: rdv.lieu,
                notes: rdv.notes,
                rappel: rdv.rappelEnvoye
            });
            setSelectedRdv(rdv);
        } else {
            setFormData({
                patient: '',
                motif: '',
                dateRdv: '',
                heureRdv: '09:00',
                duree: '30',
                type: 'consultation',
                lieu: 'cabinet',
                notes: '',
                rappel: true
            });
            setSelectedRdv(null);
        }
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const patientData = mockPatients.find(p => p.id === formData.patient);

        const newRdv: RendezVous = {
            id: `RDV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            patient: patientData!,
            medecin: {
                id: user?.id || '',
                nom: `Dr. ${(user as any)?.nom} ${(user as any)?.prenom}`,
                specialite: (user as any)?.specialite || ''
            },
            date: formData.dateRdv,
            heure: formData.heureRdv,
            duree: parseInt(formData.duree),
            type: formData.type,
            motif: formData.motif,
            statut: 'en_attente',
            lieu: formData.lieu,
            notes: formData.notes,
            rappelEnvoye: false,
            creeLe: new Date().toISOString().split('T')[0]
        };

        if (selectedRdv) {
            setRendezvous(rendezvous.map(r => r.id === selectedRdv.id ? { ...r, ...newRdv } : r));
        } else {
            setRendezvous([newRdv, ...rendezvous]);
        }

        setShowModal(false);
        alert('Rendez-vous ' + (selectedRdv ? 'modifié' : 'créé') + ' avec succès !');
    };

    const handleConfirmer = (id: string) => {
        setRendezvous(rendezvous.map(r =>
            r.id === id ? { ...r, statut: 'confirme' } : r
        ));
    };

    const handleAnnuler = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
            setRendezvous(rendezvous.map(r =>
                r.id === id ? { ...r, statut: 'annule' } : r
            ));
        }
    };

    const handleViewDetails = (rdv: RendezVous) => {
        setSelectedRdv(rdv);
        setShowDetailsModal(true);
    };

    return (
        <div className="page-content">
            {/* Header */}
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(41, 128, 185, 0.8), rgba(41, 128, 185, 0.9)), url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>
                            {user?.role === 'medecin' ? 'Mes Rendez-vous Médicaux' : 'Mes Rendez-vous'}
                        </h1>
                        <p>
                            {user?.role === 'medecin'
                                ? 'Gérez vos consultations et suivez vos patients'
                                : 'Consultez vos rendez-vous médicaux'
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                {/* Statistiques */}
                <div className="stats-grid mb-6">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <i className="fas fa-calendar-alt"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.total}</h3>
                            <p>Total rendez-vous</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.confirme}</h3>
                            <p>Confirmés</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <i className="fas fa-clock"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.en_attente}</h3>
                            <p>En attente</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon red">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.urgent}</h3>
                            <p>Urgents</p>
                        </div>
                    </div>
                </div>

                {/* Actions et filtres */}
                <div className="content-card-app mb-6">
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                        <h3 className="card-title">Liste des rendez-vous</h3>
                        {user?.role === 'medecin' && (
                            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                                <i className="fas fa-plus"></i> Nouveau rendez-vous
                            </button>
                        )}
                    </div>

                    <div className="flex gap-4 mb-4 flex-wrap">
                        <div className="search-box flex-1 min-w-[250px]">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveFilter('all')}
                            >
                                Tous
                            </button>
                            <button
                                className={`btn ${activeFilter === 'confirme' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveFilter('confirme')}
                            >
                                Confirmés
                            </button>
                            <button
                                className={`btn ${activeFilter === 'en_attente' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveFilter('en_attente')}
                            >
                                En attente
                            </button>
                        </div>
                    </div>

                    {/* Liste des rendez-vous */}
                    <div className="space-y-4">
                        {filteredRdv.map(rdv => {
                            const statutBadge = getStatutBadge(rdv.statut);
                            const typeBadge = getTypeBadge(rdv.type);

                            return (
                                <div key={rdv.id} className="content-card-app card-interactive">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Avatar */}
                                            <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                                                {user?.role === 'medecin' ? rdv.patient.avatar : rdv.medecin.nom.split(' ')[1][0] + rdv.medecin.nom.split(' ')[2][0]}
                                            </div>

                                            {/* Infos */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="text-lg font-bold">
                                                        {user?.role === 'medecin' ? rdv.patient.nom : rdv.medecin.nom}
                                                    </h4>
                                                    <span className={`badge ${statutBadge.class}`}>
                                                        <i className={`fas ${statutBadge.icon}`}></i> {statutBadge.text}
                                                    </span>
                                                    <span className={`badge ${typeBadge.class}`}>
                                                        {typeBadge.text}
                                                    </span>
                                                </div>

                                                <p className="text-gray-600 mb-3">{rdv.motif}</p>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <i className="fas fa-calendar text-blue-600 mr-2"></i>
                                                        <strong>Date:</strong> {new Date(rdv.date).toLocaleDateString('fr-FR')}
                                                    </div>
                                                    <div>
                                                        <i className="fas fa-clock text-green-600 mr-2"></i>
                                                        <strong>Heure:</strong> {rdv.heure}
                                                    </div>
                                                    <div>
                                                        <i className="fas fa-hourglass-half text-orange-600 mr-2"></i>
                                                        <strong>Durée:</strong> {rdv.duree} min
                                                    </div>
                                                    <div>
                                                        <i className="fas fa-map-marker-alt text-red-600 mr-2"></i>
                                                        <strong>Lieu:</strong> {rdv.lieu}
                                                    </div>
                                                </div>

                                                {rdv.notes && (
                                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                        <strong className="text-sm">Notes:</strong>
                                                        <p className="text-sm text-gray-600 mt-1">{rdv.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleViewDetails(rdv)}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>

                                            {user?.role === 'medecin' && (
                                                <>
                                                    <button
                                                        className="btn btn-outline btn-sm"
                                                        onClick={() => handleOpenModal(rdv)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>

                                                    {rdv.statut === 'en_attente' && (
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleConfirmer(rdv.id)}
                                                        >
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                    )}

                                                    {rdv.statut !== 'annule' && (
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleAnnuler(rdv.id)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredRdv.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <i className="fas fa-calendar-times text-6xl mb-4 opacity-30"></i>
                                <p>Aucun rendez-vous trouvé</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Nouveau/Modifier RDV */}
            {showModal && user?.role === 'medecin' && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-calendar-plus"></i>
                                {selectedRdv ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
                            </h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group col-span-2">
                                        <label>Patient *</label>
                                        <select
                                            className="form-control"
                                            value={formData.patient}
                                            onChange={(e) => setFormData({...formData, patient: e.target.value})}
                                            required
                                        >
                                            <option value="">Sélectionner un patient</option>
                                            {mockPatients.map(p => (
                                                <option key={p.id} value={p.id}>{p.nom}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Type de rendez-vous *</label>
                                        <select
                                            className="form-control"
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            required
                                        >
                                            <option value="consultation">Consultation</option>
                                            <option value="controle">Contrôle</option>
                                            <option value="suivi">Suivi</option>
                                            <option value="urgence">Urgence</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Durée (minutes) *</label>
                                        <select
                                            className="form-control"
                                            value={formData.duree}
                                            onChange={(e) => setFormData({...formData, duree: e.target.value})}
                                            required
                                        >
                                            <option value="15">15 min</option>
                                            <option value="30">30 min</option>
                                            <option value="45">45 min</option>
                                            <option value="60">1 heure</option>
                                        </select>
                                    </div>

                                    <div className="form-group col-span-2">
                                        <label>Motif de consultation *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.motif}
                                            onChange={(e) => setFormData({...formData, motif: e.target.value})}
                                            placeholder="Ex: Suivi cardiologique"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Date *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={formData.dateRdv}
                                            onChange={(e) => setFormData({...formData, dateRdv: e.target.value})}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Heure *</label>
                                        <select
                                            className="form-control"
                                            value={formData.heureRdv}
                                            onChange={(e) => setFormData({...formData, heureRdv: e.target.value})}
                                            required
                                        >
                                            {creneauxDisponibles.map(creneau => (
                                                <option key={creneau} value={creneau}>{creneau}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group col-span-2">
                                        <label>Lieu</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.lieu}
                                            onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                                            placeholder="Cabinet médical"
                                        />
                                    </div>

                                    <div className="form-group col-span-2">
                                        <label>Notes</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={formData.notes}
                                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                            placeholder="Notes pour le patient..."
                                        />
                                    </div>

                                    <div className="form-group col-span-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.rappel}
                                                onChange={(e) => setFormData({...formData, rappel: e.target.checked})}
                                            />
                                            <span>Envoyer un rappel au patient</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save"></i>
                                    {selectedRdv ? 'Modifier' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Détails */}
            {showDetailsModal && selectedRdv && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-calendar-alt"></i>
                                Détails du rendez-vous
                            </h3>
                            <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                    {user?.role === 'medecin' ? selectedRdv.patient.avatar : 'Dr'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {user?.role === 'medecin' ? selectedRdv.patient.nom : selectedRdv.medecin.nom}
                                    </h2>
                                    <p className="text-gray-600">
                                        {user?.role === 'medecin'
                                            ? `Tél: ${selectedRdv.patient.telephone}`
                                            : selectedRdv.medecin.specialite
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="info-card col-span-2">
                                    <h4>Informations</h4>
                                    <p><strong>ID:</strong> {selectedRdv.id}</p>
                                    <p><strong>Type:</strong> {getTypeBadge(selectedRdv.type).text}</p>
                                    <p><strong>Motif:</strong> {selectedRdv.motif}</p>
                                    <p><strong>Statut:</strong> <span className={`badge ${getStatutBadge(selectedRdv.statut).class}`}>
                                        {getStatutBadge(selectedRdv.statut).text}
                                    </span></p>
                                </div>

                                <div className="info-card">
                                    <h4>Date et heure</h4>
                                    <p><i className="fas fa-calendar mr-2"></i>{new Date(selectedRdv.date).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</p>
                                    <p><i className="fas fa-clock mr-2"></i>{selectedRdv.heure}</p>
                                    <p><i className="fas fa-hourglass-half mr-2"></i>{selectedRdv.duree} minutes</p>
                                </div>

                                <div className="info-card">
                                    <h4>Lieu</h4>
                                    <p><i className="fas fa-map-marker-alt mr-2"></i>{selectedRdv.lieu}</p>
                                </div>

                                {selectedRdv.notes && (
                                    <div className="info-card col-span-2">
                                        <h4>Notes</h4>
                                        <p>{selectedRdv.notes}</p>
                                    </div>
                                )}

                                <div className="info-card col-span-2">
                                    <h4>Informations complémentaires</h4>
                                    <div className="grid grid-cols-2 gap-4 mt-3">
                                        <div>
                                            <span className="text-sm text-gray-600">Date de création:</span>
                                            <p className="font-semibold">{selectedRdv.creeLe}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Rappel envoyé:</span>
                                            <p className="font-semibold">
                                                {selectedRdv.rappelEnvoye ? (
                                                    <span className="text-green-600">
                                                        <i className="fas fa-check-circle"></i> Oui
                                                    </span>
                                                ) : (
                                                    <span className="text-orange-600">
                                                        <i className="fas fa-clock"></i> Non
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-outline"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                Fermer
                            </button>
                            {user?.role === 'medecin' && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        handleOpenModal(selectedRdv);
                                    }}
                                >
                                    <i className="fas fa-edit"></i> Modifier
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Examens;
