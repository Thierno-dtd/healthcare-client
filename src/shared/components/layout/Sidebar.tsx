import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { getMenuForRole } from '@/data/mocks/mock-data';
import { ROLE_LABELS, getAvatarGradient, getInitials } from '@/core/utils';

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

  const isActive = (route: string): boolean =>
      location.pathname === route || location.pathname.startsWith(route + '/');

  const gradient = getAvatarGradient(user.name);
  const initials = user.avatar ?? getInitials(user.name);

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
              LAMESSE<span>DAMA</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            {menuSections.map((section, idx) => (
                <div
                    key={idx}
                    className={`nav-section ${collapsedSections[idx] ? 'collapsed' : ''}`}
                >
                  <div
                      className="nav-title"
                      onClick={() => toggleSection(idx)}
                      role="button"
                      aria-expanded={!collapsedSections[idx]}
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
                              <span style={{
                                marginLeft: 'auto',
                                background: '#e63946',
                                color: 'white',
                                fontSize: 11,
                                padding: '2px 8px',
                                borderRadius: 12,
                                fontWeight: 700,
                              }}>
                                                {item.badge}
                                            </span>
                          )}
                        </a>
                    ))}
                  </div>
                </div>
            ))}
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
                {initials}
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