import React, { useState } from 'react';

interface MedecinData {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  numeroOrdre: string;
  statut: string;
  patients: number;
  consultations: number;
  dateInscription: string;
  dernierAcces: string;
  avatar: string;
}

interface MedecinFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  numeroOrdre: string;
  statut: string;
}

const Medecins: React.FC = () => {
    const [medecins, setMedecins] = useState<MedecinData[]>([
        {
            id: 1,
            nom: 'BEGNI',
            prenom: 'Touna',
            email: 'begni.touna@lamesse.com',
            telephone: '+228 91 45 38 82',
            specialite: 'Cardiologie',
            numeroOrdre: 'ORD-12345',
            statut: 'actif',
            patients: 127,
            consultations: 450,
            dateInscription: '2023-11-20',
            dernierAcces: '2024-03-15 14:30',
            avatar: 'BT'
        },
        {
            id: 2,
            nom: 'GAVON',
            prenom: 'Hector',
            email: 'gavon.hector@lamesse.com',
            telephone: '+228 90 12 34 56',
            specialite: 'Médecine générale',
            numeroOrdre: 'ORD-12346',
            statut: 'actif',
            patients: 89,
            consultations: 320,
            dateInscription: '2024-01-10',
            dernierAcces: '2024-03-15 10:15',
            avatar: 'GH'
        },
        {
            id: 3,
            nom: 'KANGNI',
            prenom: 'Prisca',
            email: 'prisca.kangni@lamesse.com',
            telephone: '+228 99 87 65 43',
            specialite: 'Pédiatrie',
            numeroOrdre: 'ORD-12347',
            statut: 'suspendu',
            patients: 156,
            consultations: 680,
            dateInscription: '2023-09-05',
            dernierAcces: '2024-03-10 16:45',
            avatar: 'KP'
        }
    ]);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
    const [selectedMedecin, setSelectedMedecin] = useState<MedecinData | null>(null);
    const [filterStatut, setFilterStatut] = useState<string>('all');
    const [filterSpecialite, setFilterSpecialite] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [formData, setFormData] = useState<MedecinFormData>({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        specialite: '',
        numeroOrdre: '',
        statut: 'actif'
    });

    const specialites: string[] = [
        'Cardiologie',
        'Dermatologie',
        'Neurologie',
        'Pédiatrie',
        'Chirurgie générale',
        'Orthopédie',
        'Ophtalmologie',
        'Psychiatrie',
        'Gynécologie',
        'Médecine générale'
    ];

    const filteredMedecins = medecins.filter(medecin => {
        const matchesSearch =
            medecin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medecin.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medecin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medecin.numeroOrdre.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatut = filterStatut === 'all' || medecin.statut === filterStatut;
        const matchesSpecialite = filterSpecialite === 'all' || medecin.specialite === filterSpecialite;

        return matchesSearch && matchesStatut && matchesSpecialite;
    });

    const handleOpenModal = (medecin: MedecinData | null = null) => {
        if (medecin) {
            setFormData(medecin);
            setSelectedMedecin(medecin);
        } else {
            setFormData({
                nom: '',
                prenom: '',
                email: '',
                telephone: '',
                specialite: '',
                numeroOrdre: '',
                statut: 'actif'
            });
            setSelectedMedecin(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMedecin(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedMedecin) {
            setMedecins(medecins.map(m =>
                m.id === selectedMedecin.id ? { ...m, ...formData } : m
            ));
        } else {
            const newMedecin: MedecinData = {
                ...formData,
                id: medecins.length + 1,
                patients: 0,
                consultations: 0,
                dateInscription: new Date().toISOString().split('T')[0],
                dernierAcces: '-',
                avatar: `${formData.nom[0]}${formData.prenom[0]}`
            };
            setMedecins([...medecins, newMedecin]);
        }

        handleCloseModal();
    };

    const handleViewDetails = (medecin: MedecinData) => {
        setSelectedMedecin(medecin);
        setShowDetailsModal(true);
    };

    const handleDeleteMedecin = (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médecin ?')) {
            setMedecins(medecins.filter(m => m.id !== id));
        }
    };

    const handleToggleStatut = (medecin: MedecinData) => {
        const newStatut = medecin.statut === 'actif' ? 'suspendu' : 'actif';
        setMedecins(medecins.map(m =>
            m.id === medecin.id ? { ...m, statut: newStatut } : m
        ));
    };

    const getStatutBadge = (statut: string): string => {
        return statut === 'actif' ? 'badge-success' : 'badge-warning';
    };

    const stats = {
        total: medecins.length,
        actifs: medecins.filter(m => m.statut === 'actif').length,
        suspendus: medecins.filter(m => m.statut === 'suspendu').length,
        totalPatients: medecins.reduce((sum, m) => sum + m.patients, 0)
    };

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(16, 185, 129, 0.8), rgba(16, 185, 129, 0.9)), url(https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Gestion des Médecins</h1>
                        <p>Administrez et suivez les comptes des médecins</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                {/* Statistiques */}
                <div className="stats-grid mb-6">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <i className="fas fa-user-md"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.total}</h3>
                            <p>Médecins inscrits</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.actifs}</h3>
                            <p>Comptes actifs</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <i className="fas fa-pause-circle"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.suspendus}</h3>
                            <p>Comptes suspendus</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <i className="fas fa-user-injured"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.totalPatients}</h3>
                            <p>Patients suivis</p>
                        </div>
                    </div>
                </div>

                {/* Actions et filtres */}
                <div className="content-card-app mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="card-title">Liste des médecins</h3>
                        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                            <i className="fas fa-plus"></i> Nouveau médecin
                        </button>
                    </div>

                    <div className="flex gap-4 mb-4 flex-wrap">
                        <div className="search-box flex-1 min-w-[250px]">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Rechercher un médecin..."
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="form-control w-48"
                            value={filterStatut}
                            onChange={(e) => setFilterStatut(e.target.value)}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="actif">Actifs</option>
                            <option value="suspendu">Suspendus</option>
                        </select>
                        <select
                            className="form-control w-48"
                            value={filterSpecialite}
                            onChange={(e) => setFilterSpecialite(e.target.value)}
                        >
                            <option value="all">Toutes les spécialités</option>
                            {specialites.map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th>Médecin</th>
                                <th>Contact</th>
                                <th>Spécialité</th>
                                <th>N° Ordre</th>
                                <th>Patients</th>
                                <th>Consultations</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredMedecins.map(medecin => (
                                <tr key={medecin.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">{medecin.avatar}</div>
                                            <div>
                                                <div className="font-semibold">Dr. {medecin.prenom} {medecin.nom}</div>
                                                <div className="text-sm text-gray-600">Inscrit le {medecin.dateInscription}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            <div>{medecin.email}</div>
                                            <div className="text-gray-600">{medecin.telephone}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-medical">{medecin.specialite}</span>
                                    </td>
                                    <td>
                                        <span className="font-mono text-sm">{medecin.numeroOrdre}</span>
                                    </td>
                                    <td className="text-center">
                                        <span className="font-semibold">{medecin.patients}</span>
                                    </td>
                                    <td className="text-center">
                                        <span className="font-semibold">{medecin.consultations}</span>
                                    </td>
                                    <td>
                      <span className={`badge ${getStatutBadge(medecin.statut)}`}>
                        {medecin.statut === 'actif' ? 'Actif' : 'Suspendu'}
                      </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleViewDetails(medecin)}
                                                title="Voir les détails"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleOpenModal(medecin)}
                                                title="Modifier"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className={`btn btn-outline btn-sm ${medecin.statut === 'actif' ? 'btn-warning' : 'btn-success'}`}
                                                onClick={() => handleToggleStatut(medecin)}
                                                title={medecin.statut === 'actif' ? 'Suspendre' : 'Activer'}
                                            >
                                                <i className={`fas fa-${medecin.statut === 'actif' ? 'pause' : 'play'}`}></i>
                                            </button>
                                            <button
                                                className="btn btn-outline btn-sm btn-danger"
                                                onClick={() => handleDeleteMedecin(medecin.id)}
                                                title="Supprimer"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredMedecins.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <i className="fas fa-user-md text-6xl mb-4 opacity-30"></i>
                            <p>Aucun médecin trouvé</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Ajout/Modification */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-user-md"></i>
                                {selectedMedecin ? 'Modifier le médecin' : 'Nouveau médecin'}
                            </h3>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label>Nom *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.nom}
                                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Prénom *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.prenom}
                                            onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Téléphone *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={formData.telephone}
                                            onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Spécialité *</label>
                                        <select
                                            className="form-control"
                                            value={formData.specialite}
                                            onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                                            required
                                        >
                                            <option value="">Sélectionner...</option>
                                            {specialites.map(spec => (
                                                <option key={spec} value={spec}>{spec}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Numéro d'ordre *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.numeroOrdre}
                                            onChange={(e) => setFormData({...formData, numeroOrdre: e.target.value})}
                                            placeholder="ORD-XXXXX"
                                            required
                                        />
                                    </div>
                                    <div className="form-group col-span-2">
                                        <label>Statut</label>
                                        <select
                                            className="form-control"
                                            value={formData.statut}
                                            onChange={(e) => setFormData({...formData, statut: e.target.value})}
                                        >
                                            <option value="actif">Actif</option>
                                            <option value="suspendu">Suspendu</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save"></i>
                                    {selectedMedecin ? 'Enregistrer' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Détails */}
            {showDetailsModal && selectedMedecin && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-user-md"></i>
                                Détails du médecin
                            </h3>
                            <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                    {selectedMedecin.avatar}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Dr. {selectedMedecin.prenom} {selectedMedecin.nom}</h2>
                                    <p className="text-gray-600">{selectedMedecin.specialite}</p>
                                    <span className={`badge ${getStatutBadge(selectedMedecin.statut)} mt-2`}>
                    {selectedMedecin.statut === 'actif' ? 'Compte actif' : 'Compte suspendu'}
                  </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="info-card">
                                    <h4>Contact</h4>
                                    <p><i className="fas fa-envelope mr-2"></i>{selectedMedecin.email}</p>
                                    <p><i className="fas fa-phone mr-2"></i>{selectedMedecin.telephone}</p>
                                </div>
                                <div className="info-card">
                                    <h4>Numéro d'ordre</h4>
                                    <p className="font-mono text-lg">{selectedMedecin.numeroOrdre}</p>
                                </div>
                                <div className="info-card">
                                    <h4>Patients suivis</h4>
                                    <p className="text-2xl font-bold text-blue-600">{selectedMedecin.patients}</p>
                                </div>
                                <div className="info-card">
                                    <h4>Consultations</h4>
                                    <p className="text-2xl font-bold text-green-600">{selectedMedecin.consultations}</p>
                                </div>
                                <div className="info-card">
                                    <h4>Date d'inscription</h4>
                                    <p>{selectedMedecin.dateInscription}</p>
                                </div>
                                <div className="info-card">
                                    <h4>Dernier accès</h4>
                                    <p>{selectedMedecin.dernierAcces}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowDetailsModal(false)}>
                                Fermer
                            </button>
                            <button className="btn btn-primary" onClick={() => {
                                setShowDetailsModal(false);
                                handleOpenModal(selectedMedecin);
                            }}>
                                <i className="fas fa-edit"></i> Modifier
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Medecins;
