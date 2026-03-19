import React, { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hook/useNotifications';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';
import { formatRelativeTime, getNotificationIcon } from '@/core/utils';
import type { Notification } from '@/data/models/notification.model';

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    alert:       { label: 'Alerte',       color: '#dc2626', bg: '#fee2e2' },
    message:     { label: 'Message',      color: '#2563eb', bg: '#dbeafe' },
    system:      { label: 'Système',      color: '#059669', bg: '#d1fae5' },
    appointment: { label: 'Rendez-vous',  color: '#d97706', bg: '#fef3c7' },
};

const NotificationsPage: React.FC = () => {
    const { user } = useAuthStore();

    const { data: notifications = [], isLoading, isError, error, refetch } = useNotifications(user?.id ?? '');
    const markRead = useMarkNotificationRead();
    const markAll = useMarkAllNotificationsRead();

    const unread = notifications.filter((n) => !n.isRead).length;

    const handleMarkRead = useCallback(async (id: string) => {
        try {
            await markRead.mutateAsync(id);
        } catch {
            toast.error('Erreur lors de la mise à jour');
        }
    }, [markRead]);

    const handleMarkAll = useCallback(async () => {
        if (!user) return;
        try {
            await markAll.mutateAsync(user.id);
            toast.success('Toutes les notifications marquées comme lues');
        } catch {
            toast.error('Erreur');
        }
    }, [markAll, user]);

    const getIconClass = (type: string) => {
        const map: Record<string, string> = {
            alert: 'danger', message: 'info', system: 'success', appointment: 'warning',
        };
        return map[type] ?? 'info';
    };

    return (
        <div className="content-body">
            {/* ── Header ─────────────────────────────────────────── */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                            Notifications
                            {unread > 0 && (
                                <span style={{
                                    marginLeft: 12, fontSize: 14, fontWeight: 600,
                                    background: '#e63946', color: 'white',
                                    padding: '2px 10px', borderRadius: 20,
                                }}>
                                    {unread}
                                </span>
                            )}
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: 15 }}>
                            Restez informé de l'activité de la plateforme
                        </p>
                    </div>
                    {unread > 0 && (
                        <button
                            className="btn btn-outline"
                            onClick={handleMarkAll}
                            disabled={markAll.isPending}
                        >
                            <i className="fas fa-check-double" style={{ marginRight: 8 }} />
                            Tout marquer comme lu
                        </button>
                    )}
                </div>
            </div>

            {/* ── Content ─────────────────────────────────────────── */}
            <div className="card" style={{ padding: 0 }}>
                {isError ? (
                    <div style={{ padding: 24 }}>
                        <ErrorMessage
                            message={error instanceof Error ? error.message : 'Erreur de chargement'}
                            onRetry={() => refetch()}
                        />
                    </div>
                ) : isLoading ? (
                    <LoadingSpinner text="Chargement des notifications..." />
                ) : notifications.length === 0 ? (
                    <EmptyState
                        icon="fas fa-bell-slash"
                        title="Aucune notification"
                        description="Vous n'avez aucune notification pour le moment"
                    />
                ) : (
                    notifications.map((notif: Notification) => {
                        const typeCfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.system;
                        return (
                            <div
                                key={notif.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 16,
                                    padding: '20px 24px',
                                    borderBottom: '1px solid #f3f4f6',
                                    background: !notif.isRead ? '#fafbff' : 'transparent',
                                    transition: 'background 0.2s',
                                }}
                            >
                                {/* Icon */}
                                <div className={`notif-icon ${getIconClass(notif.type)}`} style={{ flexShrink: 0 }}>
                                    <i className={getNotificationIcon(notif.type)} />
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <p style={{ fontWeight: !notif.isRead ? 700 : 600, fontSize: 14, color: '#111827' }}>
                                            {notif.title}
                                        </p>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                                            background: typeCfg.bg, color: typeCfg.color,
                                        }}>
                                            {typeCfg.label}
                                        </span>
                                        {!notif.isRead && (
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2a6b8f', flexShrink: 0 }} />
                                        )}
                                    </div>
                                    <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 6, lineHeight: 1.5 }}>
                                        {notif.body}
                                    </p>
                                    <span style={{ fontSize: 12, color: '#9ca3af' }}>
                                        <i className="fas fa-clock" style={{ marginRight: 4 }} />
                                        {formatRelativeTime(notif.createdAt)}
                                    </span>
                                </div>

                                {/* Actions */}
                                {!notif.isRead && (
                                    <button
                                        className="btn btn-sm btn-ghost"
                                        onClick={() => handleMarkRead(notif.id)}
                                        disabled={markRead.isPending}
                                        title="Marquer comme lu"
                                        style={{ flexShrink: 0 }}
                                    >
                                        <i className="fas fa-check" />
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;