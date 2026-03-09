import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@core/auth/auth.store';
import { useOrdonnancesPatient, useGenererQRCode } from '../hooks/useOrdonnancePatient';
import type { OrdonnancePatient, OrdonnanceQRStatus } from '../types/patient.types';
import type { PrescriptionStatus } from '@shared/types';
import { JOURNAL_ACHATS_PHARMACIE } from '@shared/data/mock-data';

type OrdonnanceFilter = 'toutes' | 'active' | 'utilisee' | 'expiree';

const STATUS_CONFIG: Record<PrescriptionStatus, { label: string; badge: string }> = {
  active: { label: 'Active', badge: 'badge-success' },
  utilisee: { label: 'Utilisée', badge: 'badge-info' },
  expiree: { label: 'Expirée', badge: 'badge-warning' },
  annulee: { label: 'Annulée', badge: 'badge-danger' },
};

const QR_STATUS_CONFIG: Record<OrdonnanceQRStatus, { label: string; badge: string }> = {
  valide: { label: 'QR valide', badge: 'badge-success' },
  utilisee: { label: 'QR utilisé', badge: 'badge-info' },
  expiree: { label: 'QR expiré', badge: 'badge-warning' },
};

const OrdonnancesPatient: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { data: ordonnances, isLoading } = useOrdonnancesPatient(user?.id);
  const genererQR = useGenererQRCode();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<OrdonnanceFilter>('toutes');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const view = searchParams.get('view');

  const filtered = useMemo(
    () => ordonnances?.filter((o) => filter === 'toutes' || o.status === filter) ?? [],
    [ordonnances, filter],
  );

  const activeOrdonnances = useMemo(
    () => ordonnances?.filter((o) => o.status === 'active') ?? [],
    [ordonnances],
  );

  const recentHistory = useMemo(() => {
    if (!ordonnances) return [];
    return [...ordonnances]
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
      .slice(0, 3);
  }, [ordonnances]);

  const isFullView = view === 'all';

  const latestPurchases = useMemo(() => {
    return JOURNAL_ACHATS_PHARMACIE.slice(0, 3).map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('fr-FR'),
    }));
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const openFullView = () => {
    setSearchParams({ view: 'all' });
  };

  const closeFullView = () => {
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="content-body text-center py-12">
          <i className="fas fa-spinner fa-spin text-2xl"></i>
          <p className="mt-4">Chargement de vos ordonnances...</p>
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
              'linear-gradient(to right, rgba(16, 185, 129, 0.85), rgba(20, 184, 166, 0.85)), url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="header-overlay">
            <h1>Mes ordonnances</h1>
            <p>Consultez vos prescriptions et générez vos QR codes en un clic.</p>
          </div>
        </div>
      </div>

      <div className="content-body">
        {isFullView ? (
          <>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Toutes mes ordonnances</h2>
                <p className="text-gray-500">Filtrez, consultez et gérez toutes vos prescriptions.</p>
              </div>
              <button className="btn btn-secondary" onClick={closeFullView}>
                Retour
              </button>
            </div>

            <div className="tabs-container">
              <div className="tabs">
                {(
                  [
                    { key: 'toutes', label: 'Toutes' },
                    { key: 'active', label: 'Actives' },
                    { key: 'utilisee', label: 'Utilisées' },
                    { key: 'expiree', label: 'Expirées' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    className={`tab ${filter === tab.key ? 'active' : ''}`}
                    onClick={() => setFilter(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="content-grid content-grid--2-1">
              <div>
                <div className="content-card-app">
                  <div className="card-header">
                    <div className="card-header-content">
                      <div className="card-icon">
                        <i className="fas fa-file-medical"></i>
                      </div>
                      <div>
                        <h3>Vos ordonnances</h3>
                        <p className="text-gray-500">Cliquez sur une ordonnance pour voir les détails.</p>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button
                        className="card-btn"
                        onClick={() => {
                          if (!filtered.length) return;
                          genererQR.mutate(filtered[0].id);
                        }}
                        disabled={!filtered.length || genererQR.isPending}
                      >
                        <i className={`fas ${genererQR.isPending ? 'fa-spinner fa-spin' : 'fa-qrcode'}`}></i>
                        &nbsp;Générer QR
                      </button>
                    </div>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <i className="fas fa-prescription text-2xl mb-3"></i>
                      <p>Aucune ordonnance trouvée.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filtered.map((ord) => (
                        <OrdonnanceCard
                          key={ord.id}
                          ordonnance={ord}
                          expanded={expandedId === ord.id}
                          onToggle={() => toggleExpand(ord.id)}
                          onGenererQR={() => genererQR.mutate(ord.id)}
                          isGeneratingQR={genererQR.isPending}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="content-card-app">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Historique des ordonnances</h3>
                      <p className="text-gray-500">Dernières ordonnances enregistrées.</p>
                    </div>
                    <button type="button" className="link-action" onClick={openFullView}>
                      Tout voir
                    </button>
                  </div>

                  <div className="space-y-3">
                    {recentHistory.length === 0 && <p className="text-gray-500">Aucune ordonnance récente.</p>}
                    {recentHistory.map((ord) => {
                      const statusCfg = STATUS_CONFIG[ord.status];
                      return (
                        <div key={ord.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200">
                          <div>
                            <p className="font-semibold">{ord.medecinNom}</p>
                            <p className="text-sm text-gray-500">{ord.specialite} • {new Date(ord.dateCreation).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`badge ${statusCfg.badge}`}>{statusCfg.label}</span>
                            <button type="button" className="link-action" onClick={openFullView}>
                              Détails <i className="fas fa-external-link-alt text-xs"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="content-card-app">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Journaux d'achats pharmacie</h3>
                      <p className="text-gray-500">Dernières transactions en pharmacie.</p>
                    </div>
                    <button type="button" className="link-action" onClick={() => navigate('/patient/ordonnances/journaux')}>
                      Tout voir
                    </button>
                  </div>

                  <div className="space-y-3">
                    {latestPurchases.length === 0 && <p className="text-gray-500">Aucun achat récent.</p>}
                    {latestPurchases.map((purchase) => (
                      <div key={purchase.id} className="examen-item">
                        <div className="examen-icon">
                          <i className="fas fa-store"></i>
                        </div>
                        <div className="examen-info">
                          <h4>{purchase.pharmacie}</h4>
                          <p className="text-sm text-gray-500">{purchase.date}</p>
                          <p className="text-sm text-gray-500">{purchase.note}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {purchase.items.map((item) => (
                              <span key={item} className="badge badge-info">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Ordonnances actives</h2>
                <p className="text-gray-500">Suivez vos prescriptions en cours et générez un QR code.</p>
              </div>
              <button type="button" className="link-action" onClick={openFullView}>
                Tout voir
              </button>
            </div>

            <div className="space-y-6">
              {activeOrdonnances.slice(0, 3).map((ord) => (
                <div key={ord.id} className="content-card-app">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <i className="fas fa-user-md"></i>
                      </div>
                      <div>
                        <p className="font-semibold">{ord.medecinNom}</p>
                        <p className="text-sm text-gray-500">{ord.specialite} • Délivrée le {new Date(ord.dateCreation).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => genererQR.mutate(ord.id)}
                        disabled={genererQR.isPending}
                      >
                        <i className={`fas ${genererQR.isPending ? 'fa-spinner fa-spin' : 'fa-qrcode'}`}></i>
                        &nbsp;Générer QR Code
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          // TODO: Télécharger ou ouvrir QR code si disponible
                        }}
                      >
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  </div>

                  <div className="stock-table overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th>Médicament</th>
                          <th>Posologie</th>
                          <th>Durée</th>
                          <th className="text-right">Acheté</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ord.medicaments.map((med) => (
                          <tr key={med.id}>
                            <td>
                              <div className="font-semibold">{med.nom}</div>
                              <div className="text-sm text-gray-500">{med.dosage}</div>
                            </td>
                            <td className="text-sm">{med.frequence}</td>
                            <td className="text-sm">{med.duree}</td>
                            <td className="text-right">
                              <input
                                type="checkbox"
                                checked={med.pris}
                                readOnly
                                className="h-4 w-4 text-green-600"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="content-card-app">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Historique des ordonnances</h3>
                      <p className="text-gray-500">Les 3 dernières ordonnances enregistrées.</p>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={openFullView}>
                      Tout voir
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recentHistory.length === 0 && <p className="text-gray-500">Aucune ordonnance récente.</p>}
                    {recentHistory.map((ord) => {
                      const statusCfg = STATUS_CONFIG[ord.status];
                      return (
                        <div key={ord.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-gray-200">
                          <div>
                            <p className="font-semibold">{ord.medecinNom}</p>
                            <p className="text-sm text-gray-500">{ord.specialite} • {new Date(ord.dateCreation).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`badge ${statusCfg.badge}`}>{statusCfg.label}</span>
                            <button className="btn btn-outline btn-sm" onClick={openFullView}>
                              Détails <i className="fas fa-external-link-alt text-xs"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="content-card-app">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Journaux d'achats pharmacie</h3>
                      <p className="text-gray-500">Les 3 derniers achats en pharmacie.</p>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/patient/ordonnances/journaux')}>
                      Tout voir
                    </button>
                  </div>
                  <div className="space-y-3">
                    {latestPurchases.length === 0 && <p className="text-gray-500">Aucun achat récent.</p>}
                    {latestPurchases.map((purchase) => (
                      <div key={purchase.id} className="examen-item">
                        <div className="examen-icon">
                          <i className="fas fa-store"></i>
                        </div>
                        <div className="examen-info">
                          <h4>{purchase.pharmacie}</h4>
                          <p className="text-sm text-gray-500">{purchase.date}</p>
                          <p className="text-sm text-gray-500">{purchase.note}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {purchase.items.map((item) => (
                              <span key={item} className="badge badge-info">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface OrdonnanceCardProps {
  ordonnance: OrdonnancePatient;
  expanded: boolean;
  onToggle: () => void;
  onGenererQR: () => void;
  isGeneratingQR: boolean;
}

const OrdonnanceCard: React.FC<OrdonnanceCardProps> = ({
  ordonnance: ord,
  expanded,
  onToggle,
  onGenererQR,
  isGeneratingQR,
}) => {
  const statusCfg = STATUS_CONFIG[ord.status];
  const qrCfg = QR_STATUS_CONFIG[ord.qrStatus];

  return (
    <div className="content-card-app card-interactive" onClick={onToggle}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">{ord.medecinNom}</h4>
          <p className="text-sm text-gray-500">{ord.specialite}</p>
          <div className="text-xs text-gray-500 mt-1">
            <span>
              <i className="fas fa-calendar"></i>{' '}
              {new Date(ord.dateCreation).toLocaleDateString('fr-FR')}
            </span>
            {' • '}
            <span>
              Expire le {new Date(ord.dateExpiration).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`badge ${statusCfg.badge}`}>{statusCfg.label}</span>
          <span className="badge badge-medical">{ord.medicaments.length} méd.</span>
          <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-gray-500`}></i>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`badge ${qrCfg.badge}`}>{qrCfg.label}</span>
            <span className="badge badge-medical">{ord.qrStatus}</span>
          </div>

          {ord.notes && (
            <p className="text-sm text-gray-600 mb-4">
              <i className="fas fa-sticky-note text-gray-500"></i> {ord.notes}
            </p>
          )}

          <div className="space-y-2">
            {ord.medicaments.map((med) => (
              <div
                key={med.id}
                className={`medicament-item ${med.pris ? 'medicament-item--taken' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">
                      {med.nom} - {med.dosage}
                    </h5>
                    <p className="text-sm text-gray-500">
                      {med.frequence} • {med.duree}
                    </p>
                    {med.instructions && (
                      <p className="text-xs text-gray-500 mt-1">
                        <i className="fas fa-info-circle"></i> {med.instructions}
                      </p>
                    )}
                  </div>
                  {med.pris && (
                    <span className="badge badge-success">
                      <i className="fas fa-check"></i> Pris
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {ord.status === 'active' && (
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onGenererQR();
                }}
                disabled={isGeneratingQR}
              >
                <i className={`fas ${isGeneratingQR ? 'fa-spinner fa-spin' : 'fa-qrcode'}`}></i>{' '}
                Générer QR
              </button>
              {ord.qrCode && (
                <button
                  className="btn btn-outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implémenter le téléchargement du QR si disponible
                  }}
                >
                  <i className="fas fa-download"></i> Télécharger
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdonnancesPatient;
