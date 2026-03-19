// ============================================================
// TopBar — Barre de navigation supérieure — LAMESSE DAMA
// ============================================================
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { formatRelativeTime, getNotificationIcon } from '@/core/utils';
import { useNotifications, useMarkAllNotificationsRead } from '@/hook/useNotifications';

interface TopBarProps {
    pageTitle: string;
    onMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ pageTitle, onMenuToggle }) => {
    const { logout, user } = useAuthStore();
    const { showNotifications, toggleNotifications, setShowNotifications } = useUIStore();
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: notifications = [], isLoading } = useNotifications(user?.id ?? '');
    const markAllRead = useMarkAllNotificationsRead();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [setShowNotifications]);

    const handleMarkAllRead = () => {
        if (user?.id) markAllRead.mutate(user.id);
    };

    const getNotifIconClass = (type: string) => {
        const map: Record<string, string> = {
            alert: 'danger', message: 'info', system: 'success', appointment: 'warning',
        };
        return map[type] ?? 'info';
    };

    return (
        <div className="top-bar">
            {/* Menu toggle */}
            <button
                className="menu-toggle"
                onClick={onMenuToggle}
                aria-label="Ouvrir le menu"
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 40, height: 40, color: '#1a3c52', fontSize: 20,
                }}
            >
                <i className="fas fa-bars" />
            </button>

            {/* Page title */}
            <div className="page-title">{pageTitle}</div>

            {/* Actions */}
            <div className="top-bar-actions">
                {/* Search */}
                <div className="search-box">
                    <i className="fas fa-search" />
                    <input type="text" placeholder="Rechercher..." aria-label="Rechercher" />
                </div>

                {/* Notifications */}
                <div className="notifications" ref={dropdownRef}>
                    <button
                        onClick={toggleNotifications}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            position: 'relative', fontSize: 20, color: '#495057',
                            padding: '8px', borderRadius: 8, transition: 'background 0.2s',
                        }}
                        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
                    >
                        <i className="fas fa-bell" />
                        {unreadCount > 0 && (
                            <span className="notification-badge" aria-live="polite">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="notifications-dropdown" role="dialog" aria-label="Notifications">
                            <div className="dropdown-header">
                                <h4>Notifications</h4>
                                {unreadCount > 0 && (
                                    <button
                                        className="btn-text"
                                        onClick={handleMarkAllRead}
                                        disabled={markAllRead.isPending}
                                    >
                                        {markAllRead.isPending ? 'En cours...' : 'Tout marquer comme lu'}
                                    </button>
                                )}
                            </div>

                            <div className="notifications-list">
                                {isLoading ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                                        <i className="fas fa-spinner icon-spin" /> Chargement...
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="no-notifications">
                                        <i className="fas fa-bell-slash" />
                                        <p>Aucune notification</p>
                                    </div>
                                ) : (
                                    notifications.slice(0, 8).map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`notification-item ${notif.isRead ? 'read' : ''}`}
                                            onClick={() => {
                                                setShowNotifications(false);
                                                navigate('/notifications');
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className={`notif-icon ${getNotifIconClass(notif.type)}`}>
                                                <i className={getNotificationIcon(notif.type)} />
                                            </div>
                                            <div className="notif-content">
                                                <h5>{notif.title}</h5>
                                                <p>{notif.body}</p>
                                                <span className="notif-time">
                                                    {formatRelativeTime(notif.createdAt)}
                                                </span>
                                            </div>
                                            {!notif.isRead && (
                                                <div style={{
                                                    width: 8, height: 8, borderRadius: '50%',
                                                    background: '#2a6b8f', flexShrink: 0, alignSelf: 'center',
                                                }} />
                                            )}
                                        </div>
                                    ))
                                )}

                                {notifications.length > 8 && (
                                    <div style={{ padding: '12px 20px', textAlign: 'center', borderTop: '1px solid #f3f4f6' }}>
                                        <button
                                            className="btn-text"
                                            onClick={() => { setShowNotifications(false); navigate('/notifications'); }}
                                        >
                                            Voir toutes les notifications ({notifications.length})
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Logout */}
                <button
                    className="btn btn-outline"
                    onClick={() => logout()}
                    id="logout-btn"
                    aria-label="Se déconnecter"
                >
                    <i className="fas fa-sign-out-alt" />
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default TopBar;