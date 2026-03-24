import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Avatar } from '@/shared/components/ui/Avatar';
import { MOCK_DOCTOR_NOTIFICATIONS } from '@/data/mocks/mock-data';
import { MOCK_ALERTS } from '@/data/mocks/mock-data';

type Tab = 'messages' | 'alertes';

function formatTime(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

const SEV_CONFIG = {
    critical: { label: 'Critique', color: '#dc2626', bg: '#fee2e2', icon: 'fas fa-exclamation-circle' },
    high:     { label: 'Élevé',    color: '#ea580c', bg: '#ffedd5', icon: 'fas fa-exclamation-triangle' },
    medium:   { label: 'Moyen',    color: '#ca8a04', bg: '#fef9c3', icon: 'fas fa-info-circle' },
    low:      { label: 'Faible',   color: '#16a34a', bg: '#dcfce7', icon: 'fas fa-check-circle' },
};

const METRIC_LABELS: Record<string, string> = {
    blood_pressure: 'Tension artérielle',
    heart_rate: 'Fréquence cardiaque',
    glucose: 'Glycémie',
    weight: 'Poids',
    oxygen_saturation: 'SpO₂',
    inactivity: 'Inactivité',
};

const NotificationsPage: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('messages');
    const [search, setSearch] = useState('');

    const doctorId = 'd_001';

    const sentMessages = useMemo(() =>
            MOCK_DOCTOR_NOTIFICATIONS
                .filter(n => n.doctorId === doctorId)
                .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()),
        [doctorId]
    );

    const alertHistory = useMemo(() =>
            MOCK_ALERTS
                .filter(a => a.doctorId === doctorId)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        [doctorId]
    );

    const filteredMessages = useMemo(() => {
        if (!search.trim()) return sentMessages;
        const q = search.toLowerCase();
        return sentMessages.filter(m =>
            m.patientName.toLowerCase().includes(q) ||
            m.message.toLowerCase().includes(q)
        );
    }, [sentMessages, search]);

    const filteredAlerts = useMemo(() => {
        if (!search.trim()) return alertHistory;
        const q = search.toLowerCase();
        return alertHistory.filter(a =>
            a.patientName.toLowerCase().includes(q) ||
            a.message.toLowerCase().includes(q)
        );
    }, [alertHistory, search]);

    const msgCount = sentMessages.length;
    const alertCount = alertHistory.length;

    const tabs: { id: Tab; label: string; icon: string; count: number }[] = [
        { id: 'messages', label: 'Messages envoyés', icon: 'fas fa-paper-plane', count: msgCount },
        { id: 'alertes',  label: 'Historique alertes', icon: 'fas fa-bell', count: alertCount },
    ];

    return (
        <div className="content-body">
            {/* ── Header ──────────────────────────────────────── */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                    Notifications
                </h1>
                <p style={{ color: '#6b7280', fontSize: 14 }}>
                    Historique de vos messages aux patients et des alertes reçues
                </p>
            </div>

            {/* ── Tabs ────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #f3f4f6', marginBottom: 24 }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setSearch(''); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '12px 22px', border: 'none', background: 'transparent', cursor: 'pointer',
                            fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500,
                            color: activeTab === tab.id ? '#1a3c52' : '#6b7280',
                            borderBottom: activeTab === tab.id ? '2px solid #1a3c52' : '2px solid transparent',
                            marginBottom: -2, transition: 'all 0.15s',
                        }}
                    >
                        <i className={tab.icon} style={{ fontSize: 12 }} />
                        {tab.label}
                        <span style={{
                            padding: '1px 7px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                            background: activeTab === tab.id ? '#1a3c52' : '#f3f4f6',
                            color: activeTab === tab.id ? 'white' : '#6b7280',
                        }}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Search ──────────────────────────────────────── */}
            <div style={{ position: 'relative', marginBottom: 16, maxWidth: 380 }}>
                <i className="fas fa-search" style={{
                    position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                    color: '#9ca3af', fontSize: 13,
                }} />
                <input
                    type="text"
                    placeholder={activeTab === 'messages' ? 'Rechercher un message...' : 'Rechercher une alerte...'}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="form-control"
                    style={{ paddingLeft: 36, fontSize: 13 }}
                />
            </div>

            {/* ══ TAB: MESSAGES ENVOYÉS ══════════════════════════ */}
            {activeTab === 'messages' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filteredMessages.length === 0 ? (
                        <div className="card">
                            <EmptyState
                                icon="fas fa-paper-plane"
                                title="Aucun message"
                                description={search ? `Aucun résultat pour "${search}"` : 'Aucun message envoyé à vos patients'}
                            />
                        </div>
                    ) : (
                        filteredMessages.map(notif => (
                            <div
                                key={notif.id}
                                style={{
                                    background: notif.read ? 'white' : '#f0f7ff', borderRadius: 12,
                                    border: '1px solid #f3f4f6',
                                    borderLeft: `4px solid ${notif.read ? '#e5e7eb' : '#2a6b8f'}`,
                                    padding: '16px 20px',
                                    display: 'flex', alignItems: 'flex-start', gap: 14,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                    background: notif.read ? '#f3f4f6' : '#dbeafe',
                                    color: notif.read ? '#9ca3af' : '#2563eb',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                                }}>
                                    <i className="fas fa-paper-plane" />
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
                                            À : {notif.patientName}
                                        </span>
                                        {!notif.read && (
                                            <span style={{
                                                fontSize: 10, fontWeight: 700, color: '#2563eb',
                                                background: '#dbeafe', padding: '1px 7px', borderRadius: 6,
                                            }}>
                                                Récent
                                            </span>
                                        )}
                                    </div>
                                    <p style={{
                                        fontSize: 13, color: '#374151', lineHeight: 1.5,
                                        marginBottom: 6,
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                                        overflow: 'hidden',
                                    }}>
                                        {notif.message}
                                    </p>
                                    <span style={{ fontSize: 12, color: '#9ca3af' }}>
                                        <i className="fas fa-clock" style={{ marginRight: 4 }} />
                                        {formatTime(notif.sentAt)}
                                    </span>
                                </div>

                                {/* See patient */}
                                <button
                                    onClick={() => navigate(`/patients/${notif.patientId}/follow-up`)}
                                    style={{
                                        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                                        padding: '7px 13px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                                        background: 'transparent', color: '#2a6b8f',
                                        border: '1px solid #bfdbfe', cursor: 'pointer', whiteSpace: 'nowrap',
                                    }}
                                >
                                    <i className="fas fa-user" style={{ fontSize: 11 }} />
                                    Voir patient
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ══ TAB: HISTORIQUE ALERTES ════════════════════════ */}
            {activeTab === 'alertes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filteredAlerts.length === 0 ? (
                        <div className="card">
                            <EmptyState
                                icon="fas fa-bell-slash"
                                title="Aucune alerte"
                                description={search ? `Aucun résultat pour "${search}"` : 'Aucune alerte dans l\'historique'}
                            />
                        </div>
                    ) : (
                        filteredAlerts.map(alert => {
                            const cfg = SEV_CONFIG[alert.severity];
                            return (
                                <div
                                    key={alert.id}
                                    style={{
                                        background: 'white', borderRadius: 12,
                                        border: '1px solid #f3f4f6',
                                        borderLeft: `4px solid ${cfg.color}`,
                                        padding: '14px 20px',
                                        display: 'flex', alignItems: 'center', gap: 14,
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                        opacity: alert.isResolved ? 0.7 : 1,
                                    }}
                                >
                                    {/* Severity icon */}
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                        background: cfg.bg, color: cfg.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                                    }}>
                                        <i className={cfg.icon} />
                                    </div>

                                    {/* Avatar */}
                                    <Avatar name={alert.patientName} size="sm" />

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
                                                {alert.patientName}
                                            </span>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                                                background: cfg.bg, color: cfg.color, textTransform: 'uppercase',
                                            }}>
                                                {cfg.label}
                                            </span>
                                            {alert.isResolved && (
                                                <span style={{
                                                    padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                                                    background: '#d1fae5', color: '#065f46',
                                                }}>
                                                    ✓ Résolue
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>{alert.message}</p>
                                        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#9ca3af', flexWrap: 'wrap' }}>
                                            <span>
                                                <i className="fas fa-chart-line" style={{ marginRight: 4 }} />
                                                {METRIC_LABELS[alert.type] ?? alert.type}
                                            </span>
                                            <span style={{ fontWeight: 600, color: cfg.color }}>
                                                {alert.value} {alert.unit}
                                            </span>
                                            <span>
                                                <i className="fas fa-clock" style={{ marginRight: 4 }} />
                                                {formatTime(alert.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* See patient */}
                                    <button
                                        onClick={() => navigate(`/patients/${alert.patientId}/follow-up`)}
                                        style={{
                                            flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                                            padding: '7px 13px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                                            background: 'transparent', color: '#2a6b8f',
                                            border: '1px solid #bfdbfe', cursor: 'pointer', whiteSpace: 'nowrap',
                                        }}
                                    >
                                        <i className="fas fa-user" style={{ fontSize: 11 }} />
                                        Voir patient
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;