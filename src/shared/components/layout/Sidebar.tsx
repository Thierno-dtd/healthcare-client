// ============================================================
// Sidebar - Navigation latérale typée
// ============================================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@core/auth/auth.store';
import { useUIStore } from '@core/stores/ui.store';
import { getMenuForRole } from '@shared/data/mock-data';
import { ROLE_LABELS } from '@shared/utils/constants';
import { getAvatarGradient } from '@shared/utils/helpers';

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

  const menuSections = getMenuForRole(user.role);

  const handleNavigate = (route: string) => {
    navigate(route);
    onClose();
  };

  const isActive = (route: string): boolean => {
    return location.pathname === route;
  };

  const gradient = getAvatarGradient(user.nom);

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      ></div>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="app-logo">
            <i className="fas fa-heartbeat"></i>
            LAMESSE<span>DAMA</span>
          </div>
        </div>

        <div className="sidebar-nav">
          {menuSections.map((section, idx) => (
            <div
              className={`nav-section ${collapsedSections[idx] ? 'collapsed' : ''}`}
              key={idx}
            >
              <div className="nav-title" onClick={() => toggleSection(idx)}>
                <span>{section.section}</span>
                <i className="fas fa-chevron-down toggle-icon"></i>
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
                  >
                    <i className={item.icon}></i>
                    {item.label}
                    {item.badge && <span className="badge">{item.badge}</span>}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div
              className="user-avatar"
              style={{
                background: `linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 100%)`,
              }}
            >
              {user.avatar}
            </div>
            <div className="user-info">
              <h4>
                {user.nom} {user.prenom}
              </h4>
              <p>{ROLE_LABELS[user.role] || user.role}</p>
            </div>
            <div className="user-menu" onClick={logout} title="Déconnexion">
              <i className="fas fa-sign-out-alt"></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
