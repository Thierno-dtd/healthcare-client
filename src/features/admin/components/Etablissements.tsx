import React, { useState } from 'react';

interface EtablissementData {
  id: number;
  nom: string;
  type: string;
  adresse: string;
  telephone: string;
  email: string;
  services: string[];
  capacite: number | null;
  disponibilite: string;
  certifications: string[];
  statut: string;
  latitude: number | string;
  longitude: number | string;
  dateCreation: string;
}

interface EtablissementFormData {
  nom: string;
  type: string;
  adresse: string;
  telephone: string;
  email: string;
  services: string[];
  capacite: number | string;
  disponibilite: string;
  certifications: string[];
  statut: string;
  latitude: number | string;
  longitude: number | string;
}

const Etablissements: React.FC = () => {
    const [etablissements, setEtablissements] = useState<EtablissementData[]>([
        {
            id: 1,
            nom: 'CHU Campus',
            type: 'Hôpital',
            adresse: 'Boulevard Gnassingbé Eyadema, Lomé',
            telephone: '+228 22 21 25 01',
            email: 'contact@chucampus.tg',
            services: ['Urgences', 'Cardiologie', 'Neurologie', 'Chirurgie', 'Maternité', 'Pédiatrie'],
            capacite: 500,
            disponibilite: 'Disponible',
            certifications: ['ISO 9001', 'JCI'],
            statut: 'actif',
            latitude: 6.1256,
            longitude: 1.2226,
            dateCreation: '2020-01-15'
        },
        {
            id: 2,
            nom: 'Clinique Biasa',
            type: 'Clinique',
            adresse: 'Rue 1081, Tokoin, Lomé',
            telephone: '+228 22 21 65 43',
            email: 'info@cliniquebiasa.tg',
            services: ['Consultations', 'Imagerie', 'Laboratoire', 'Chirurgie ambulatoire'],
            capacite: 80,
            disponibilite: 'Disponible',
            certifications: ['ISO 9001'],
            statut: 'actif',
            latitude: 6.1385,
            longitude: 1.2195,
            dateCreation: '2021-06-10'
        },
        {
            id: 3,
            nom: 'Pharmacie Centrale',
            type: 'Pharmacie',
            adresse: 'B.P 2123 Tokoin, Lomé',
            telephone: '+228 91 45 48 82',
            email: 'contact@pharmaciecentrale.tg',
            services: ['Médicaments', 'Garde 24h', 'Conseil pharmaceutique'],
            capacite: null,
            disponibilite: 'Ouvert',
            certifications: ['BPF'],
            statut: 'actif',
            latitude: 6.1345,
            longitude: 1.2178,
            dateCreation: '2019-03-20'
        },
        {
            id: 4,
            nom: 'Centre Médical Espoir',
            type: 'Centre de santé',
            adresse: 'Agoe-Assiyéyé, Lomé',
            telephone: '+228 90 12 34 56',
            email: 'espoir@gmail.com',
            services: ['Consultations générales', 'Vaccinations', 'Soins infirmiers'],
            capacite: 30,
            disponibilite: 'Complet',
            certifications: [],
            statut: 'suspendu',
            latitude: 6.1756,
            longitude: 1.1934,
            dateCreation: '2022-09-05'
        }
    ]);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
    const [selectedEtablissement, setSelectedEtablissement] = useState<EtablissementData | null>(null);
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatut, setFilterStatut] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [formData, setFormData] = useState<EtablissementFormData>({
        nom: '',
        type: 'Hôpital',
        adresse: '',
        telephone: '',
        email: '',
        services: [],
        capacite: '',
        disponibilite: 'Disponible',
        certifications: [],
        statut: 'actif',
        latitude: '',
        longitude: ''
    });

    const typesEtablissement: string[] = ['Hôpital', 'Clinique', 'Pharmacie', 'Centre de santé', 'Laboratoire'];

    const servicesDisponibles: Record<string, string[]> = {
        'Hôpital': ['Urgences', 'Cardiologie', 'Neurologie', 'Chirurgie', 'Maternité', 'Pédiatrie', 'Radiologie', 'Oncologie'],
        'Clinique': ['Consultations', 'Imagerie', 'Laboratoire', 'Chirurgie ambulatoire', 'Médecine générale'],
        'Pharmacie': ['Médicaments', 'Garde 24h', 'Conseil pharmaceutique', 'Orthopédie'],
        'Centre de santé': ['Consultations générales', 'Vaccinations', 'Soins infirmiers', 'Planning familial'],
        'Laboratoire': ['Analyses sanguines', 'Bactériologie', 'Biochimie', 'Imagerie']
    };

    const certificationsDisponibles: string[] = ['ISO 9001', 'JCI', 'BPF', 'NABH', 'HACCP'];

    const filteredEtablissements = etablissements.filter(etab => {
        const matchesSearch =
            etab.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            etab.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
            etab.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'all' || etab.type === filterType;
        const matchesStatut = filterStatut === 'all' || etab.statut === filterStatut;

        return matchesSearch && matchesType && matchesStatut;
    });

    const handleOpenModal = (etablissement: EtablissementData | null = null) => {
        if (etablissement) {
            setFormData({
                nom: etablissement.nom,
                type: etablissement.type,
                adresse: etablissement.adresse,
                telephone: etablissement.telephone,
                email: etablissement.email,
                services: etablissement.services,
                capacite: etablissement.capacite ?? '',
                disponibilite: etablissement.disponibilite,
                certifications: etablissement.certifications,
                statut: etablissement.statut,
                latitude: etablissement.latitude,
                longitude: etablissement.longitude,
            });
            setSelectedEtablissement(etablissement);
        } else {
            setFormData({
                nom: '',
                type: 'Hôpital',
                adresse: '',
                telephone: '',
                email: '',
                services: [],
                capacite: '',
                disponibilite: 'Disponible',
                certifications: [],
                statut: 'actif',
                latitude: '',
                longitude: ''
            });
            setSelectedEtablissement(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEtablissement(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedEtablissement) {
            setEtablissements(etablissements.map(etab =>
                etab.id === selectedEtablissement.id ? { ...etab, ...formData } as EtablissementData : etab
            ));
        } else {
            const newEtablissement: EtablissementData = {
                ...(formData as unknown as EtablissementData),
                id: etablissements.length + 1,
                dateCreation: new Date().toISOString().split('T')[0]
            };
            setEtablissements([...etablissements, newEtablissement]);
        }

        handleCloseModal();
    };

    const handleViewDetails = (etablissement: EtablissementData) => {
        setSelectedEtablissement(etablissement);
        setShowDetailsModal(true);
    };

    const handleDeleteEtablissement = (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet établissement ?')) {
            setEtablissements(etablissements.filter(etab => etab.id !== id));
        }
    };

    const handleToggleStatut = (etablissement: EtablissementData) => {
        const newStatut = etablissement.statut === 'actif' ? 'suspendu' : 'actif';
        setEtablissements(etablissements.map(etab =>
            etab.id === etablissement.id ? { ...etab, statut: newStatut } : etab
        ));
    };

    const handleServiceToggle = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    const handleCertificationToggle = (cert: string) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.includes(cert)
                ? prev.certifications.filter(c => c !== cert)
                : [...prev.certifications, cert]
        }));
    };

    const getTypeBadgeClass = (type: string): string => {
        const classes: Record<string, string> = {
            'Hôpital': 'badge-danger',
            'Clinique': 'badge-info',
            'Pharmacie': 'badge-success',
            'Centre de santé': 'badge-warning',
            'Laboratoire': 'badge-medical'
        };
        return classes[type] || 'badge-info';
    };

    const getStatutBadge = (statut: string): string => {
        return statut === 'actif' ? 'badge-success' : 'badge-warning';
    };

    const getDisponibiliteBadge = (dispo: string): string => {
        const badges: Record<string, string> = {
            'Disponible': 'badge-success',
            'Ouvert': 'badge-success',
            'Complet': 'badge-danger',
            'Fermé': 'badge-warning'
        };
        return badges[dispo] || 'badge-info';
    };

    const stats = {
        total: etablissements.length,
        hopitaux: etablissements.filter(e => e.type === 'Hôpital').length,
        cliniques: etablissements.filter(e => e.type === 'Clinique').length,
        pharmacies: etablissements.filter(e => e.type === 'Pharmacie').length,
        actifs: etablissements.filter(e => e.statut === 'actif').length
    };

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(139, 92, 246, 0.8), rgba(139, 92, 246, 0.9)), url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Gestion des Établissements</h1>
                        <p>Administrez les hôpitaux, cliniques et pharmacies</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                {/* Statistiques */}
                <div className="stats-grid mb-6">
                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <i className="fas fa-hospital"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.total}</h3>
                            <p>Établissements</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon red">
                            <i className="fas fa-h-square"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.hopitaux}</h3>
                            <p>Hôpitaux</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <i className="fas fa-clinic-medical"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.cliniques}</h3>
                            <p>Cliniques</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <i className="fas fa-prescription-bottle"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.pharmacies}</h3>
                            <p>Pharmacies</p>
                        </div>
                    </div>
                </div>

                {/* Actions et filtres */}
                <div className="content-card-app mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="card-title">Liste des établissements</h3>
                        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                            <i className="fas fa-plus"></i> Nouvel établissement
                        </button>
                    </div>

                    <div className="flex gap-4 mb-4 flex-wrap">
                        <div className="search-box flex-1 min-w-[250px]">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Rechercher un établissement..."
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="form-control w-48"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">Tous les types</option>
                            {typesEtablissement.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
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

                    {/* Grille */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEtablissements.map(etab => (
                            <div key={etab.id} className="content-card-app card-interactive">
                                <div className="flex justify-between items-start mb-3">
                  <span className={`badge ${getTypeBadgeClass(etab.type)}`}>
                    {etab.type}
                  </span>
                                    <span className={`badge ${getDisponibiliteBadge(etab.disponibilite)}`}>
                    {etab.disponibilite}
                  </span>
                                </div>

                                <h4 className="text-lg font-bold mb-2">{etab.nom}</h4>

                                <div className="space-y-2 mb-4 text-sm text-gray-600">
                                    <p className="flex items-center gap-2">
                                        <i className="fas fa-map-marker-alt"></i>
                                        {etab.adresse}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <i className="fas fa-phone"></i>
                                        {etab.telephone}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <i className="fas fa-envelope"></i>
                                        {etab.email}
                                    </p>
                                    {etab.capacite && (
                                        <p className="flex items-center gap-2">
                                            <i className="fas fa-bed"></i>
                                            Capacité: {etab.capacite} lits
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-semibold mb-2">Services:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {etab.services.slice(0, 3).map((service, idx) => (
                                            <span key={idx} className="badge badge-medical text-xs">
                        {service}
                      </span>
                                        ))}
                                        {etab.services.length > 3 && (
                                            <span className="badge badge-medical text-xs">
                        +{etab.services.length - 3}
                      </span>
                                        )}
                                    </div>
                                </div>

                                {etab.certifications.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold mb-2">Certifications:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {etab.certifications.map((cert, idx) => (
                                                <span key={idx} className="badge badge-info text-xs">
                          {cert}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 mt-4 pt-4 border-t">
                                    <button
                                        className="btn btn-outline btn-sm flex-1"
                                        onClick={() => handleViewDetails(etab)}
                                    >
                                        <i className="fas fa-eye"></i> Détails
                                    </button>
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => handleOpenModal(etab)}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        className={`btn btn-outline btn-sm ${etab.statut === 'actif' ? 'btn-warning' : 'btn-success'}`}
                                        onClick={() => handleToggleStatut(etab)}
                                    >
                                        <i className={`fas fa-${etab.statut === 'actif' ? 'pause' : 'play'}`}></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredEtablissements.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <i className="fas fa-hospital text-6xl mb-4 opacity-30"></i>
                            <p>Aucun établissement trouvé</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Ajout/Modification */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container modal-xl">
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-hospital"></i>
                                {selectedEtablissement ? 'Modifier l\'établissement' : 'Nouvel établissement'}
                            </h3>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label>Nom de l'établissement *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.nom}
                                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Type *</label>
                                        <select
                                            className="form-control"
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value, services: []})}
                                            required
                                        >
                                            {typesEtablissement.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group col-span-2">
                                        <label>Adresse *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.adresse}
                                            onChange={(e) => setFormData({...formData, adresse: e.target.value})}
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
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    {formData.type !== 'Pharmacie' && (
                                        <div className="form-group">
                                            <label>Capacité (lits)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={formData.capacite}
                                                onChange={(e) => setFormData({...formData, capacite: e.target.value})}
                                            />
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label>Disponibilité</label>
                                        <select
                                            className="form-control"
                                            value={formData.disponibilite}
                                            onChange={(e) => setFormData({...formData, disponibilite: e.target.value})}
                                        >
                                            <option value="Disponible">Disponible</option>
                                            <option value="Ouvert">Ouvert</option>
                                            <option value="Complet">Complet</option>
                                            <option value="Fermé">Fermé</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-span-2">
                                        <label>Services proposés</label>
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {servicesDisponibles[formData.type]?.map(service => (
                                                <label key={service} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.services.includes(service)}
                                                        onChange={() => handleServiceToggle(service)}
                                                    />
                                                    <span className="text-sm">{service}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group col-span-2">
                                        <label>Certifications</label>
                                        <div className="flex gap-4 mt-2">
                                            {certificationsDisponibles.map(cert => (
                                                <label key={cert} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.certifications.includes(cert)}
                                                        onChange={() => handleCertificationToggle(cert)}
                                                    />
                                                    <span className="text-sm">{cert}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Latitude</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            className="form-control"
                                            value={formData.latitude}
                                            onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Longitude</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            className="form-control"
                                            value={formData.longitude}
                                            onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-save"></i>
                                    {selectedEtablissement ? 'Enregistrer' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Détails */}
            {showDetailsModal && selectedEtablissement && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-container modal-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <i className="fas fa-hospital"></i>
                                Détails de l'établissement
                            </h3>
                            <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-hospital text-purple-600 text-4xl"></i>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold">{selectedEtablissement.nom}</h2>
                                    <div className="flex gap-2 mt-2">
                    <span className={`badge ${getTypeBadgeClass(selectedEtablissement.type)}`}>
                      {selectedEtablissement.type}
                    </span>
                                        <span className={`badge ${getDisponibiliteBadge(selectedEtablissement.disponibilite)}`}>
                      {selectedEtablissement.disponibilite}
                    </span>
                                        <span className={`badge ${getStatutBadge(selectedEtablissement.statut)}`}>
                      {selectedEtablissement.statut === 'actif' ? 'Actif' : 'Suspendu'}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="info-card col-span-2">
                                    <h4>Contact</h4>
                                    <p><i className="fas fa-map-marker-alt mr-2"></i>{selectedEtablissement.adresse}</p>
                                    <p><i className="fas fa-phone mr-2"></i>{selectedEtablissement.telephone}</p>
                                    <p><i className="fas fa-envelope mr-2"></i>{selectedEtablissement.email}</p>
                                </div>

                                {selectedEtablissement.capacite && (
                                    <div className="info-card">
                                        <h4>Capacité</h4>
                                        <p className="text-2xl font-bold text-purple-600">{selectedEtablissement.capacite} lits</p>
                                    </div>
                                )}

                                <div className="info-card">
                                    <h4>Date de création</h4>
                                    <p>{selectedEtablissement.dateCreation}</p>
                                </div>

                                <div className="info-card col-span-2">
                                    <h4>Services proposés</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedEtablissement.services.map((service, idx) => (
                                            <span key={idx} className="badge badge-medical">
                        {service}
                      </span>
                                        ))}
                                    </div>
                                </div>

                                {selectedEtablissement.certifications.length > 0 && (
                                    <div className="info-card col-span-2">
                                        <h4>Certifications</h4>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedEtablissement.certifications.map((cert, idx) => (
                                                <span key={idx} className="badge badge-info">
                          {cert}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedEtablissement.latitude && selectedEtablissement.longitude && (
                                    <div className="info-card col-span-2">
                                        <h4>Localisation</h4>
                                        <p>Latitude: {selectedEtablissement.latitude}</p>
                                        <p>Longitude: {selectedEtablissement.longitude}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowDetailsModal(false)}>
                                Fermer
                            </button>
                            <button className="btn btn-primary" onClick={() => {
                                setShowDetailsModal(false);
                                handleOpenModal(selectedEtablissement);
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

export default Etablissements;
