import React, { useState } from 'react';

interface PharmacienData {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pharmacie: string;
  adresse: string;
  numeroOrdre: string;
  statut: string;
  ordonnances: number;
  stockGere: number;
  dateInscription: string;
  dernierAcces: string;
  avatar: string;
}

interface PharmacienFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pharmacie: string;
  adresse: string;
  numeroOrdre: string;
  statut: string;
}

const Pharmaciens: React.FC = () => {
    const [pharmaciens, setPharmaciens] = useState<PharmacienData[]>([
        {
            id: 1,
            nom: 'AKOSSIWA',
            prenom: 'Mantoba',
            email: 'akossiwa.montoba@lamesse.com',
            telephone: '+228 91 45 48 82',
            pharmacie: 'Pharmacie Centrale',
            adresse: 'B.P 2123 Tokoin, Lomé',
            numeroOrdre: 'PHARM-67890',
            statut: 'actif',
            ordonnances: 156,
            stockGere: 450,
            dateInscription: '2023-10-15',
            dernierAcces: '2024-03-15 16:20',
            avatar: 'AM'
        },
        {
            id: 2,
            nom: 'DOSSEH',
            prenom: 'Koffi',
            email: 'koffi.dosseh@lamesse.com',
            telephone: '+228 90 23 45 67',
            pharmacie: 'Pharmacie du Rond-Point',
            adresse: 'Av. de la Libération, Lomé',
            numeroOrdre: 'PHARM-67891',
            statut: 'actif',
            ordonnances: 203,
            stockGere: 580,
            dateInscription: '2024-01-20',
            dernierAcces: '2024-03-15 14:45',
            avatar: 'DK'
        },
        {
            id: 3,
            nom: 'MENSAH',
            prenom: 'Ama',
            email: 'ama.mensah@lamesse.com',
            telephone: '+228 98 76 54 32',
            pharmacie: 'Pharmacie Amitié',
            adresse: 'Quartier Amitié, Lomé',
            numeroOrdre: 'PHARM-67892',
            statut: 'suspendu',
            ordonnances: 89,
            stockGere: 320,
            dateInscription: '2023-08-12',
            dernierAcces: '2024-03-08 11:30',
            avatar: 'MA'
        }
    ]);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
    const [selectedPharmacien, setSelectedPharmacien] = useState<PharmacienData | null>(null);
    const [filterStatut, setFilterStatut] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [formData, setFormData] = useState<PharmacienFormData>({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        pharmacie: '',
        adresse: '',
        numeroOrdre: '',
        statut: 'actif'
    });

    const filteredPharmaciens = pharmaciens.filter(pharmacien => {
        const matchesSearch =
            pharmacien.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacien.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacien.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacien.pharmacie.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pharmacien.numeroOrdre.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatut = filterStatut === 'all' || pharmacien.statut === filterStatut;

        return matchesSearch && matchesStatut;
    });

    const handleOpenModal = (pharmacien: PharmacienData | null = null) => {
        if (pharmacien) {
            setFormData(pharmacien);
            setSelectedPharmacien(pharmacien);
        } else {
            setFormData({
                nom: '',
                prenom: '',
                email: '',
                telephone: '',
                pharmacie: '',
                adresse: '',
                numeroOrdre: '',
                statut: 'actif'
            });
            setSelectedPharmacien(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPharmacien(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedPharmacien) {
            setPharmaciens(pharmaciens.map(p =>
                p.id === selectedPharmacien.id ? { ...p, ...formData } : p
            ));
        } else {
            const newPharmacien: PharmacienData = {
                ...formData,
                id: pharmaciens.length + 1,
                ordonnances: 0,
                stockGere: 0,
                dateInscription: new Date().toISOString().split('T')[0],
                dernierAcces: '-',
                avatar: `${formData.nom[0]}${formData.prenom[0]}`
            };
            setPharmaciens([...pharmaciens, newPharmacien]);
        }

        handleCloseModal();
    };

    const handleViewDetails = (pharmacien: PharmacienData) => {
        setSelectedPharmacien(pharmacien);
        setShowDetailsModal(true);
    };

    const handleDeletePharmacien = (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce pharmacien ?')) {
            setPharmaciens(pharmaciens.filter(p => p.id !== id));
        }
    };

    const handleToggleStatut = (pharmacien: PharmacienData) => {
        const newStatut = pharmacien.statut === 'actif' ? 'suspendu' : 'actif';
        setPharmaciens(pharmaciens.map(p =>
            p.id === pharmacien.id ? { ...p, statut: newStatut } : p
        ));
    };

    const getStatutBadge = (statut: string): string => {
        return statut === 'actif' ? 'badge-success' : 'badge-warning';
    };

    const stats = {
        total: pharmaciens.length,
        actifs: pharmaciens.filter(p => p.statut === 'actif').length,
        suspendus: pharmaciens.filter(p => p.statut === 'suspendu').length,
        totalOrdonnances: pharmaciens.reduce((sum, p) => sum + p.ordonnances, 0)
    };

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.9)), url(https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Gestion des Pharmaciens</h1>
                        <p>Administrez et suivez les comptes des pharmaciens</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                {/* Statistiques */}
                <div className="stats-grid mb-6">
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <i className="fas fa-prescription-bottle-alt"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.total}</h3>
                            <p>Pharmaciens inscrits</p>
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
                            <i className="fas fa-prescription"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.totalOrdonnances}</h3>
                            <p>Ordonnances traitées</p>
                        </div>
                    </div>
                </div>

                {/* Actions et filtres */}
                <div className="content-card-app mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="card-title">Liste des pharmaciens</h3>
                        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                            <i className="fas fa-plus"></i> Nouveau pharmacien
                        </button>
                    </div>

                    <div className="flex gap-4 mb-4 flex-wrap">
                        <div className="search-box flex-1 min-w-[250px]">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Rechercher un pharmacien..."
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
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th>Pharmacien</th>
                                <th>Pharmacie</th>
                                <th>Contact</th>
                                <th>N° Ordre</th>
                                <th>Ordonnances</th>
                                <th>Stock géré</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredPharmaciens.map(pharmacien => (
                                <tr key={pharmacien.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">{pharmacien.avatar}</div>
                                            <div>
                                                <div className="font-semibold">{pharmacien.prenom} {pharmacien.nom}</div>
                                                <div className="text-sm text-gray-600">Inscrit le {pharmacien.dateInscription}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            <div className="font-semibold">{pharmacien.pharmacie}</div>
                                            <div className="text-gray-600">{pharmacien.adresse}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            <div>{pharmacien.email}</div>
                                            <div className="text-gray-600">{pharmacien.telephone}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="font-mono text-sm">{pharmacien.numeroOrdre}</span>
                                    </td>
                                    <td className="text-center">
                                        <span className="font-semibold text-blue-600">{pharmacien.ordonnances}</span>
                                    </td>
                                    <td className="text-center">
                                        <span className="font-semibold text-green-600">{pharmacien.stockGere}</span>
                                    </td>
                                    <td>
                      <span className={`badge ${getStatutBadge(pharmacien.statut)}`}>
                        {pharmacien.statut === 'actif' ? 'Actif' : 'Suspendu'}
                      </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleViewDetails(pharmacien)}
                                                title="Voir les détails"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => handleOpenModal(pharmacien)}
                                                title="Modifier"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className={`btn btn-outline btn-sm ${pharmacien.statut === 'actif' ? 'btn-warning' : 'btn-success'}`}
                                                onClick={() => handleToggleStatut(pharmacien)}
                                                title={pharmacien.statut === 'actif' ? 'Suspendre' : 'Activer'}
                                            >
                                                <i className={`fas fa-${pharmacien.statut === 'actif' ? 'pause' : 'play'}`}></i>
                                            </button>
                                            <button
                                                className="btn btn-outline btn-sm btn-danger"
                                                onClick={() => handleDeletePharmacien(pharmacien.id)}
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

                    {filteredPharmaciens.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <i className="fas fa-prescription-bottle-alt text-6xl mb-4 opacity-30"></i>
                            <p>Aucun pharmacien trouvé</p>
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
                                <i className="fas fa-prescription-bottle-alt"></i>
                                {selectedPharmacien ? 'Modifier le pharmacien' : 'Nouveau pharmacien'}
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
                                        <label>Pharmacie *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.pharmacie}
                                            onChange={(e) => setFormData({...formData, pharmacie: e.target.value})}
                                            placeholder="Nom de la pharmacie"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Numéro d'ordre *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.numeroOrdre}
                                            onChange={(e) => setFormData({...formData, numeroOrdre: e.target.value})}
                                            placeholder="PHARM-XXXXX"
                                            required
                                        />
                                    </div>
                                    <div className="form-group col-span-2">
                                        <label>Adresse *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.adresse}
                                            onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                                            placeholder="Adresse complète de la pharmacie"
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
                                    {selectedPharmacien ? 'Enregistrer' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Détails */}
            {showDetailsModal && selectedPharmacien && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-prescription-bottle-alt"></i>
                                Détails du pharmacien
                            </h3>
                            <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                    {selectedPharmacien.avatar}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedPharmacien.prenom} {selectedPharmacien.nom}</h2>
                                    <p className="text-gray-600">{selectedPharmacien.pharmacie}</p>
                                    <span className={`badge ${getStatutBadge(selectedPharmacien.statut)} mt-2`}>
                    {selectedPharmacien.statut === 'actif' ? 'Compte actif' : 'Compte suspendu'}
                  </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="info-card">
                                    <h4>Contact</h4>
                                    <p><i className="fas fa-envelope mr-2"></i>{selectedPharmacien.email}</p>
                                    <p><i className="fas fa-phone mr-2"></i>{selectedPharmacien.telephone}</p>
                                </div>
                                <div className="info-card">
                                    <h4>Numéro d'ordre</h4>
                                    <p className="font-mono text-lg">{selectedPharmacien.numeroOrdre}</p>
                                </div>
                                <div className="info-card col-span-2">
                                    <h4>Adresse</h4>
                                    <p><i className="fas fa-map-marker-alt mr-2"></i>{selectedPharmacien.adresse}</p>
                                </div>
                                <div className="info-card">
                                    <h4>Ordonnances traitées</h4>
                                    <p className="text-2xl font-bold text-blue-600">{selectedPharmacien.ordonnances}</p>
                                </div>
                                <div className="info-card">
                                    <h4>Articles en stock</h4>
                                    <p className="text-2xl font-bold text-green-600">{selectedPharmacien.stockGere}</p>
                                </div>
                                <div className="info-card">
                                    <h4>Date d'inscription</h4>
                                    <p>{selectedPharmacien.dateInscription}</p>
                                </div>
                                <div className="info-card">
                                    <h4>Dernier accès</h4>
                                    <p>{selectedPharmacien.dernierAcces}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowDetailsModal(false)}>
                                Fermer
                            </button>
                            <button className="btn btn-primary" onClick={() => {
                                setShowDetailsModal(false);
                                handleOpenModal(selectedPharmacien);
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

export default Pharmaciens;
