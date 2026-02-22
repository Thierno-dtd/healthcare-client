import React, { useState } from 'react';

interface StockItem {
  id: number;
  nom: string;
  quantite: number;
  seuil: number;
  statut: string;
}

const GestionStock: React.FC = () => {
    const [stockItems, setStockItems] = useState<StockItem[]>([
        { id: 1, nom: 'Doliprane 1000mg', quantite: 250, seuil: 100, statut: 'ok' },
        { id: 2, nom: 'Amoxicilline 500mg', quantite: 45, seuil: 50, statut: 'faible' },
        { id: 3, nom: 'Aspirine 500mg', quantite: 15, seuil: 50, statut: 'critique' },
        { id: 4, nom: 'Ibuprofène 400mg', quantite: 180, seuil: 100, statut: 'ok' }
    ]);

    const getStatutColor = (statut: string): string => {
        switch(statut) {
            case 'ok': return 'success';
            case 'faible': return 'warning';
            case 'critique': return 'danger';
            default: return 'info';
        }
    };

    return (
        <div className="page-content">
            <div className="content-header-app">
                <div className="header-image" style={{
                    background: 'linear-gradient(rgba(139, 92, 246, 0.8), rgba(139, 92, 246, 0.9)), url(https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
                    backgroundSize: 'cover'
                }}>
                    <div className="header-overlay">
                        <h1>Gestion du Stock</h1>
                        <p>Suivez et gérez l'inventaire de votre pharmacie</p>
                    </div>
                </div>
            </div>

            <div className="content-body">
                <div className="flex justify-between items-center mb-6">
                    <h2>Inventaire des médicaments</h2>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus"></i> Ajouter un produit
                    </button>
                </div>

                <div className="content-card-app">
                    <div className="stock-table">
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th>Médicament</th>
                                <th>Quantité</th>
                                <th>Seuil d'alerte</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {stockItems.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="medicament-icon">
                                                <i className="fas fa-pills"></i>
                                            </div>
                                            <span className="font-semibold">{item.nom}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-lg font-bold">{item.quantite}</span> unités
                                    </td>
                                    <td>{item.seuil} unités</td>
                                    <td>
                      <span className={`badge badge-${getStatutColor(item.statut)}`}>
                        {item.statut === 'ok' ? 'Stock OK' :
                            item.statut === 'faible' ? 'Stock faible' :
                                'Stock critique'}
                      </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="btn btn-outline btn-sm">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="btn btn-outline btn-sm">
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Alertes stock */}
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Alertes de stock</h3>
                    <div className="grid gap-4">
                        {stockItems.filter(item => item.statut !== 'ok').map(item => (
                            <div key={item.id} className={`alert alert-${item.statut === 'critique' ? 'danger' : 'warning'}`}>
                                <i className="fas fa-exclamation-triangle"></i>
                                <span>
                  <strong>{item.nom}</strong> - Stock {item.statut} ({item.quantite} unités restantes)
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionStock;
