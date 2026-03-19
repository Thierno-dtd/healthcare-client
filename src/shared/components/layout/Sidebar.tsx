// ============================================================
// Sidebar — Navigation latérale typée et corrigée
// ============================================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { getAvatarGradient, ROLE_LABELS } from '@/core/utils';
import type { UserRole } from '@/data/models/user.model';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: string;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

// ─── Menu config per role ─────────────────────────────────────
const MENU_BY_ROLE: Record<UserRole, MenuSection[]> = {
  doctor: [
    {
      section: 'Principal',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
        { id: 'patients', label: 'Mes patients', icon: 'fas fa-users', route: '/patients' },
        { id: 'alerts', label: 'Alertes', icon: 'fas fa-bell', route: '/alerts', badge: '3' },
      ],
    },
    {
      section: 'Communication',
      items: [
        { id: 'messages', label: 'Messages', icon: 'fas fa-envelope', route: '/messages' },
        { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell-o', route: '/notifications' },
      ],
    },
    {
      section: 'Paramètres',
      items: [
        { id: 'profile', label: 'Profil', icon: 'fas fa-user-circle', route: '/profile' },
        { id: 'settings', label: 'Paramètres', icon: 'fas fa-cog', route: '/settings' },
      ],
    },
  ],

  hospital_manager: [
    {
      section: 'Principal',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
        { id: 'patients', label: 'Patients', icon: 'fas fa-users', route: '/patients' },
        { id: 'doctors', label: 'Médecins', icon: 'fas fa-user-md', route: '/doctors' },
      ],
    },
    {
      section: 'Alertes',
      items: [
        { id: 'alerts', label: 'Alertes', icon: 'fas fa-bell', route: '/alerts' },
        { id: 'notifications', label: 'Notifications', icon: 'fas fa-envelope', route: '/notifications' },
      ],
    },
    {
      section: 'Paramètres',
      items: [
        { id: 'profile', label: 'Profil', icon: 'fas fa-user-circle', route: '/profile' },
        { id: 'settings', label: 'Paramètres', icon: 'fas fa-cog', route: '/settings' },
      ],
    },
  ],

  admin: [
    {
      section: 'Administration',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
        { id: 'hospitals', label: 'Établissements', icon: 'fas fa-hospital', route: '/hospitals' },
        { id: 'doctors', label: 'Médecins', icon: 'fas fa-user-md', route: '/doctors' },
        { id: 'patients', label: 'Patients', icon: 'fas fa-users', route: '/patients' },
      ],
    },
    {
      section: 'Contenu & Carte',
      items: [
        { id: 'content', label: 'Contenu santé', icon: 'fas fa-newspaper', route: '/content' },
        { id: 'map', label: 'Carte des établissements', icon: 'fas fa-map-marker-alt', route: '/map' },
      ],
    },
    {
      section: 'Système',
      items: [
        { id: 'alerts', label: 'Alertes', icon: 'fas fa-bell', route: '/alerts' },
        { id: 'notifications', label: 'Notifications', icon: 'fas fa-envelope', route: '/notifications' },
        { id: 'profile', label: 'Profil', icon: 'fas fa-user-circle', route: '/profile' },
        { id: 'settings', label: 'Paramètres', icon: 'fas fa-cog', route: '/settings' },
      ],
    },
  ],
};

// ─── Props ────────────────────────────────────────────────────
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();
  const { collapsedSections, toggleSection } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const menuSections = MENU_BY_ROLE[user.role] ?? [];

  const handleNavigate = (route: string) => {
    navigate(route);
    onClose();
  };

  const isActive = (route: string): boolean =>
      location.pathname === route || location.pathname.startsWith(route + '/');

  // Avatar gradient based on user name
  const gradient = getAvatarGradient(user.name);

  // Initials from name
  const initials = user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
      <>
        {/* Overlay */}
        <div
            className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
            onClick={onClose}
            aria-hidden="true"
        />

        {/* Sidebar */}
        <aside className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation">
          {/* Header */}
          <div className="sidebar-header">
            <div className="app-logo">
              <i className="fas fa-heartbeat" style={{ color: '#4a9d7c' }} />
              <span>Medi</span>
              <span style={{ color: '#4a9d7c' }}>Connect</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            {menuSections.map((section, idx) => {
              const isCollapsed = !!collapsedSections[idx];
              return (
                  <div
                      key={section.section}
                      className={`nav-section ${isCollapsed ? 'collapsed' : ''}`}
                  >
                    <div
                        className="nav-title"
                        onClick={() => toggleSection(idx)}
                        role="button"
                        aria-expanded={!isCollapsed}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && toggleSection(idx)}
                    >
                      <span>{section.section}</span>
                      <i className="fas fa-chevron-down toggle-icon" />
                    </div>

                    <div className="nav-links-app">
                      {section.items.map((item) => (
                          <a
                              key={item.id}
                              href="#"
                              className={`nav-link-app ${isActive(item.route) ? 'active' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavigate(item.route);
                              }}
                              aria-current={isActive(item.route) ? 'page' : undefined}
                          >
                            <i className={item.icon} />
                            <span>{item.label}</span>
                            {item.badge && (
                                <span
                                    style={{
                                      marginLeft: 'auto',
                                      background: '#e63946',
                                      color: 'white',
                                      fontSize: 11,
                                      padding: '2px 8px',
                                      borderRadius: 12,
                                      fontWeight: 700,
                                    }}
                                >
                          {item.badge}
                        </span>
                            )}
                          </a>
                      ))}
                    </div>
                  </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="sidebar-footer">
            <div className="user-profile">
              <div
                  className="user-avatar"
                  style={{
                    background: `linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
              >
                {user.avatar ?? initials}
              </div>
              <div className="user-info">
                <h4 title={user.name}>{user.name}</h4>
                <p>{ROLE_LABELS[user.role] ?? user.role}</p>
              </div>
              <button
                  className="user-menu"
                  onClick={() => logout()}
                  title="Déconnexion"
                  aria-label="Se déconnecter"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 18,
                    padding: '8px',
                    borderRadius: 6,
                    transition: 'color 0.2s',
                  }}
              >
                <i className="fas fa-sign-out-alt" />
              </button>
            </div>
          </div>
        </aside>
      </>
  );
};

export default Sidebar;