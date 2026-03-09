import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { JOURNAL_ACHATS_PHARMACIE } from '@shared/data/mock-data';

type SortOrder = 'latest' | 'oldest';

const JournalAchatPharmacie: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const base = [...JOURNAL_ACHATS_PHARMACIE].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return sortOrder === 'latest' ? bTime - aTime : aTime - bTime;
    });

    if (!query) return base;

    return base.filter((item) => {
      const name = item.pharmacie.toLowerCase();
      const note = item.note.toLowerCase();
      const medications = item.items.join(' ').toLowerCase();
      return name.includes(query) || note.includes(query) || medications.includes(query);
    });
  }, [search, sortOrder]);

  return (
    <div className="page-content">
      <div className="content-header-app">
        <div
          className="header-image"
          style={{
            background:
              'linear-gradient(to right, rgba(37, 99, 235, 0.85), rgba(59, 130, 246, 0.85)), url(https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="header-overlay">
            <h1>Journaux d'achats pharmacie</h1>
            <p>Consultez l'historique complet de vos achats en pharmacie.</p>
          </div>
        </div>
      </div>

      <div className="content-body">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Journaux d'achats</h2>
            <p className="text-gray-500">Recherchez, triez et retrouvez rapidement vos achats.</p>
          </div>
          <Link to="/patient/ordonnances" className="btn btn-secondary">
            Retour aux ordonnances
          </Link>
        </div>

        <div className="content-card-app">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex-1 min-w-[220px]">
              <label className="form-label" htmlFor="search-journal">
                Rechercher
              </label>
              <input
                id="search-journal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom de pharmacie, médicament..."
                className="form-input"
              />
            </div>
            <div className="min-w-[200px]">
              <label className="form-label" htmlFor="sort-order">
                Trier par
              </label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="form-input"
              >
                <option value="latest">Plus récent</option>
                <option value="oldest">Plus ancien</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-receipt text-2xl mb-3"></i>
              <p>Aucun achat trouvé.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item) => (
                <div key={item.id} className="examen-item">
                  <div className="examen-icon">
                    <i className="fas fa-store"></i>
                  </div>
                  <div className="examen-info">
                    <div className="flex items-center justify-between gap-2">
                      <h4>{item.pharmacie}</h4>
                      <span className="text-xs text-gray-400">{new Date(item.date).toLocaleString('fr-FR')}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{item.note}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.items.map((med) => (
                        <span key={med} className="badge badge-info">
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalAchatPharmacie;
