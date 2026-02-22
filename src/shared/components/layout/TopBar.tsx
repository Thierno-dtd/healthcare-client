// ============================================================
// TopBar - Barre supérieure typée
// ============================================================

import React from 'react';
import { useAuthStore } from '@core/auth/auth.store';
import { useUIStore } from '@core/stores/ui.store';
import { NOTIFICATIONS } from '@shared/data/mock-data';
import { getNotificationIcon, formatRelativeTime } from '@shared/utils/helpers';

interface TopBarProps {
  pageTitle: string;
  onMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ pageTitle, onMenuToggle }) => {
  const { logout, user } = useAuthStore();
  const { showNotifications, toggleNotifications } = useUIStore();

  // Filter notifications by user role
  const userNotifications = NOTIFICATIONS.filter(
    (notif) => !notif.roles || notif.roles.includes(user?.role ?? '')
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <div className="top-bar">
      <button
        className="menu-toggle md:hidden"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <i className="fas fa-bars"></i>
      </button>

      <div className="page-title">{pageTitle}</div>

      <div className="top-bar-actions">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Rechercher..." />
        </div>

        <div className="notifications" onClick={toggleNotifications}>
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && (
            <div className="notification-badge">{unreadCount}</div>
          )}

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <button className="btn-text">Tout marquer comme lu</button>
              </div>
              <div className="notifications-list">
                {userNotifications.length > 0 ? (
                  userNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item ${notif.read ? 'read' : ''}`}
                    >
                      <div className={`notif-icon ${notif.type}`}>
                        <i className={getNotificationIcon(notif.type)}></i>
                      </div>
                      <div className="notif-content">
                        <h5>{notif.title}</h5>
                        <p>{notif.message}</p>
                        <span className="notif-time">
                          {formatRelativeTime(notif.date.toISOString())}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    <i className="fas fa-bell-slash"></i>
                    <p>Aucune notification</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button className="btn btn-outline" onClick={logout} id="logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
