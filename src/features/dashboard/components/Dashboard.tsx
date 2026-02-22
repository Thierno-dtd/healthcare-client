// ============================================================
// Dashboard - Migré en TypeScript avec Zustand
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@core/auth/auth.store';
import { DASHBOARD_CARDS } from '@shared/data/mock-data';
import { ROLE_LABELS } from '@shared/utils/constants';
import type { UserRole, DashboardCard } from '@shared/types';

interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: string;
}

const getStatsForRole = (role: UserRole): StatItem[] => {
  const stats: Record<UserRole, StatItem[]> = {
    medecin: [
      { label: 'Patients suivis', value: '127', icon: 'fas fa-user-injured', color: 'blue' },
      { label: 'Consultations ce mois', value: '45', icon: 'fas fa-calendar-check', color: 'green' },
      { label: 'Examens prescrits', value: '23', icon: 'fas fa-file-medical', color: 'purple' },
      { label: 'Cas urgents', value: '3', icon: 'fas fa-exclamation-triangle', color: 'red' },
    ],
    patient: [
      { label: 'Examens à venir', value: '2', icon: 'fas fa-calendar-alt', color: 'blue' },
      { label: 'Prescriptions actives', value: '3', icon: 'fas fa-prescription', color: 'green' },
      { label: 'Documents médicaux', value: '15', icon: 'fas fa-folder-open', color: 'purple' },
      { label: 'Rendez-vous', value: '1', icon: 'fas fa-clock', color: 'orange' },
    ],
    pharmacien: [
      { label: 'Ordonnances traitées', value: '89', icon: 'fas fa-prescription-bottle', color: 'blue' },
      { label: 'Stock faible', value: '12', icon: 'fas fa-exclamation-circle', color: 'orange' },
      { label: 'Ventes du jour', value: '245 780.5 Fcfa', icon: 'fas fa-chart-line', color: 'green' },
      { label: 'Clients servis', value: '67', icon: 'fas fa-users', color: 'purple' },
    ],
    admin: [
      { label: 'Utilisateurs actifs', value: '1,234', icon: 'fas fa-users', color: 'blue' },
      { label: 'Médecins', value: '156', icon: 'fas fa-user-md', color: 'green' },
      { label: 'Établissements', value: '45', icon: 'fas fa-hospital', color: 'purple' },
      { label: 'Taux de satisfaction', value: '94%', icon: 'fas fa-smile', color: 'orange' },
    ],
  };
  return stats[role] || [];
};

const getCardColorClass = (color: string): string => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    red: 'bg-red-50 text-red-600 border-red-100',
  };
  return colors[color] || colors.blue;
};

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  if (!user) return null;

  const getCardsForUser = (): DashboardCard[] => {
    const commonCards = DASHBOARD_CARDS.common.filter(
      (card) => !card.roles || card.roles.includes(user.role)
    );
    const roleCards = DASHBOARD_CARDS[user.role] || [];
    return [...commonCards, ...roleCards];
  };

  const cards = getCardsForUser();

  return (
    <div id="dashboard-content" className="page-content">
      <div className="content-header-app">
        <div className="header-image">
          <div className="header-overlay">
            <h1>Tableau de bord LAMESSE DAMA</h1>
            <p>
              Bienvenue {user.prenom} {user.nom} - {ROLE_LABELS[user.role] || user.role}
            </p>
            <p className="subtitle">
              Plateforme sécurisée de gestion médicale. Accédez à vos fonctionnalités.
            </p>
          </div>
        </div>
      </div>

      <div className="content-body">
        <div className="stats-grid">
          {getStatsForRole(user.role).map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className={`stat-icon ${stat.color}`}>
                <i className={stat.icon}></i>
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="content-grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className="content-card-app card-interactive"
              onClick={() => navigate(card.route)}
            >
              <div className="card-header">
                <div className={`card-icon ${getCardColorClass(card.color)}`}>
                  <i className={card.icon}></i>
                </div>
                <div className="card-header-content">
                  <h3>{card.title}</h3>
                  {card.badge && <span className="badge badge-medical">{card.badge}</span>}
                </div>
              </div>
              <div className="card-content">
                <p>{card.description}</p>
              </div>
              <div className="card-actions">
                <button className="card-btn">
                  Accéder <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
