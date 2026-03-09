import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@core/auth/auth.store';
import { useRendezVous, useCreerRendezVous, useAnnulerRendezVous } from '../hooks/useRendezVous';
import type { RendezVousStatus, RendezVousType, CreateRendezVousDTO } from '../types/patient.types';

type FilterTab = 'tous' | 'a_venir' | 'passes';

const STATUS_CONFIG: Record<RendezVousStatus, { label: string; badge: string; icon: string }> = {
  planifie: { label: 'Planifié', badge: 'badge-info', icon: 'fas fa-clock' },
  confirme: { label: 'Confirmé', badge: 'badge-success', icon: 'fas fa-check-circle' },
  en_cours: { label: 'En cours', badge: 'badge-primary', icon: 'fas fa-spinner' },
  termine: { label: 'Terminé', badge: 'badge-secondary', icon: 'fas fa-check-double' },
  annule: { label: 'Annulé', badge: 'badge-danger', icon: 'fas fa-times-circle' },
};

const TYPE_LABELS: Record<RendezVousType, string> = {
  consultation: 'Consultation',
  suivi: 'Suivi',
  urgence: 'Urgence',
  teleconsultation: 'Téléconsultation',
  examen: 'Examen',
};

const RendezVousPatient: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const patientId = user?.id ?? '';
  const { data: rendezVous, isLoading } = useRendezVous(user?.id);
  const creer = useCreerRendezVous(patientId);
  const annuler = useAnnulerRendezVous(patientId);

  const [filter, setFilter] = useState<FilterTab>('a_venir');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateRendezVousDTO>({
    medecinId: '',
    date: '',
    heure: '',
    type: 'consultation',
    motif: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const filtered = useMemo(() => {
    if (!rendezVous) return [];
    switch (filter) {
      case 'a_venir':
        return rendezVous.filter((r) => r.date >= today && r.status !== 'annule' && r.status !== 'termine');
      case 'passes':
        return rendezVous.filter((r) => r.date < today || r.status === 'termine');
      default:
        return rendezVous;
    }
  }, [rendezVous, filter, today]);

  const recentHistory = useMemo(() => {
    if (!rendezVous) return [];
    return [...rendezVous]
      .filter((r) => r.status === 'termine' || r.status === 'annule')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2);
  }, [rendezVous]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await creer.mutateAsync(formData);
    setShowForm(false);
    setFormData({ medecinId: '', date: '', heure: '', type: 'consultation', motif: '' });
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="content-body text-center py-12">
          <i className="fas fa-spinner fa-spin text-3xl text-primary"></i>
          <p className="mt-4">Chargement de vos rendez-vous...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="content-header-app">
        <div
          className="header-image"
          style={{
            background:
              'linear-gradient(rgba(20, 184, 166, 0.8), rgba(20, 184, 166, 0.9)), url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
          }}
        >
          <div className="header-overlay">
            <h1>Mes Rendez-vous</h1>
            <p>Gérez vos consultations et suivis médicaux</p>
          </div>
        </div>
      </div>

      <div className="content-body">

        {/* Actions + Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="tabs">
            {(
              [
                { key: 'a_venir', label: 'À venir' },
                { key: 'passes', label: 'Passés' },
                { key: 'tous', label: 'Tous' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key + tab.label}
                className={`tab ${filter === tab.key ? 'active' : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
            {showForm ? ' Fermer' : ' Prendre un rendez-vous'}
          </button>
        </div>

        {showForm && (
          <div className="content-card-app mb-6">
            <h3 className="card-title">
              <i className="fas fa-calendar-plus"></i> Prendre un rendez-vous
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  min={today}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Heure</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.heure}
                  onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Type</label>
                <select
                  className="form-control"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as RendezVousType })
                  }
                >
                  {Object.entries(TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Motif</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Motif de la consultation..."
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={creer.isPending}>
                  {creer.isPending ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-check"></i>
                  )}{' '}
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des rendez-vous */}
        <div className="content-card-app mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              <i className="fas fa-list-ul mr-2 text-teal-500"></i>
              Liste des rendez-vous prévus
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filtered.map((rdv) => {
              const config = STATUS_CONFIG[rdv.status];
              const isPast = rdv.status === 'termine' || rdv.status === 'annule';
              const date = new Date(rdv.date);
              const month = date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
              const day = String(date.getDate()).padStart(2, '0');

              return (
                <div
                  key={rdv.id}
                  className={`rendezvous-card ${isPast ? 'opacity-70' : ''}`}
                >
                  <div className="rendezvous-date">
                    <div className="rendezvous-date-month">{month}</div>
                    <div className="rendezvous-date-day">{day}</div>
                  </div>

                  <div className="rendezvous-info">
                    <h4 className="font-semibold">{rdv.medecinNom}</h4>
                    <p className="text-sm text-gray-500">{rdv.specialite}</p>
                    <div className="rendezvous-meta">
                      <span>
                        <i className="fas fa-clock mr-1"></i>
                        {rdv.heure}
                      </span>
                      <span>
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {rdv.lieu}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{rdv.motif}</p>
                  </div>

                  <div className="rendezvous-actions">
                    <span className={`badge ${config.badge}`}>
                      <i className={`${config.icon} mr-1`}></i>
                      {config.label}
                    </span>

                    <button className="btn btn-outline btn-sm">
                      <i className="fas fa-pen"></i>
                    </button>
                    <button className="btn btn-outline btn-sm">
                      Détails
                    </button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="content-card-app text-center py-8 text-gray-400">
                <i className="fas fa-calendar-times text-4xl mb-3"></i>
                <p>Aucun rendez-vous trouvé</p>
              </div>
            )}
          </div>
        </div>

        {/* Historique récent */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <i className="fas fa-history text-teal-500"></i>
              Historique récent
            </h3>
            <button className="link-action" onClick={() => setFilter('passes')}>Voir tout l'historique</button>
          </div>
          <div className="stock-table">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Spécialiste</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentHistory.map((rdv) => (
                  <tr key={rdv.id}>
                    <td>{new Date(rdv.date).toLocaleDateString('fr-FR')}</td>
                    <td>{rdv.medecinNom}</td>
                    <td>{TYPE_LABELS[rdv.type]}</td>
                    <td>
                      <span className={`badge ${STATUS_CONFIG[rdv.status].badge}`}>
                        {STATUS_CONFIG[rdv.status].label}
                      </span>
                    </td>
                    <td className="text-right">
                      <button className="link-action">Détails</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RendezVousPatient;
