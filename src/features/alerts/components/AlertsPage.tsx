import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { useAlerts, useMarkAlertRead, useResolveAlert, useMarkAllAlertsRead } from '@/hook/useAlerts';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';
import { Avatar } from '@/shared/components/ui/Avatar';
import { isThisWeek } from '@/services/alert.service';
import type { AlertSeverity } from '@/data/models';

const METRIC_LABELS: Record<string, string> = {
    blood_pressure: 'Tension artérielle',
    heart_rate: 'Fréquence cardiaque',
    glucose: 'Glycémie',
    weight: 'Poids',
    oxygen_saturation: 'SpO₂',
    inactivity: 'Inactivité',
};

const METRIC_ICONS: Record<string, string> = {
    blood_pressure: 'fas fa-tachometer-alt',
    heart_rate: 'fas fa-heartbeat',
    glucose: 'fas fa-tint',
    weight: 'fas fa-weight',
    oxygen_saturation: 'fas fa-lungs',
    inactivity: 'fas fa-bed',
};

const SEV_CONFIG = {
    critical: { label: 'Critique', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
    high:     { label: 'Élevé',    color: '#ea580c', bg: '#ffedd5', border: '#fdba74' },
    medium:   { label: 'Moyen',    color: '#ca8a04', bg: '#fef9c3', border: '#fde047' },
    low:      { label: 'Faible',   color: '#16a34a', bg: '#dcfce7', border: '#86efac' },
    all:      { label: 'Toutes',   color: '#2a6b8f', bg: '#dbeafe', border: '#93c5fd' },
};

function formatDateTime(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
        return `Aujourd'hui ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
        + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function getWeekRange(): { start: Date; end: Date } {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const start = new Date(now);
    start.setDate(now.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
}

const AlertsPage: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'all'>('all');

    const { data: alertsResult, isLoading, isError, error, refetch } = useAlerts({
        doctorId: user?.role === 'doctor' ? 'd_001' : undefined,
        isResolved: false,
        pageSize: 200,
    });

    const markRead    = useMarkAlertRead();
    const resolveAlert = useResolveAlert();
    const markAllRead  = useMarkAllAlertsRead();

    const allAlerts  = alertsResult?.data ?? [];
    const weekAlerts = allAlerts.filter(a => isThisWeek(a.createdAt));
    const filtered   = filterSeverity === 'all'
        ? weekAlerts
        : weekAlerts.filter(a => a.severity === filterSeverity);

    const unread    = weekAlerts.filter(a => !a.isRead).length;
    const critCount = weekAlerts.filter(a => a.severity === 'critical').length;
    const highCount = weekAlerts.filter(a => a.severity === 'high').length;
    const medCount  = weekAlerts.filter(a => a.severity === 'medium').length;
    const lowCount  = weekAlerts.filter(a => a.severity === 'low').length;

    const handleMarkRead = useCallback(async (id: string) => {
        try { await markRead.mutateAsync(id); } catch { toast.error('Erreur'); }
    }, [markRead]);

    const handleResolve = useCallback(async (id: string) => {
        try {
            await resolveAlert.mutateAsync({ id, resolvedBy: user?.id ?? '' });
            toast.success('Alerte résolue');
        } catch { toast.error('Erreur lors de la résolution'); }
    }, [resolveAlert, user]);

    const handleMarkAllRead = useCallback(async () => {
        if (!user) return;
        try {
            await markAllRead.mutateAsync('d_001');
            toast.success('Toutes les alertes marquées comme lues');
        } catch { toast.error('Erreur'); }
    }, [markAllRead, user]);

    const { start, end } = getWeekRange();
    const weekLabel = `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} – ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    const today = new Date();

    const dayLabel = today.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="content-body">
            {/* ── Header ──────────────────────────────────────── */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                            Alertes de la journée
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: 14 }}>
                            <i className="fas fa-calendar-week" style={{ marginRight: 6, color: '#9ca3af' }} />
                            {dayLabel}
                        </p>
                    </div>
                    {unread > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={markAllRead.isPending}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                background: 'transparent', color: '#374151',
                                border: '1px solid #e5e7eb', cursor: 'pointer',
                            }}
                        >
                            <i className="fas fa-check-double" />
                            Tout marquer lu ({unread})
                        </button>
                    )}
                </div>
            </div>

            {/* ── Summary cards ───────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {([
                    { label: 'Critiques', count: critCount, sev: 'critical' as AlertSeverity },
                    { label: 'Élevés',    count: highCount, sev: 'high'     as AlertSeverity },
                    { label: 'Moyens',    count: medCount,  sev: 'medium'   as AlertSeverity },
                    { label: 'Faibles',   count: lowCount,  sev: 'low'      as AlertSeverity },
                ]).map(({ label, count, sev }) => {
                    const cfg = SEV_CONFIG[sev];
                    const active = filterSeverity === sev;
                    return (
                        <button
                            key={sev}
                            onClick={() => setFilterSeverity(active ? 'all' : sev)}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                                padding: '16px 18px', borderRadius: 10, cursor: 'pointer',
                                background: active ? cfg.bg : 'white',
                                border: `1.5px solid ${active ? cfg.color : '#f3f4f6'}`,
                                boxShadow: active ? `0 0 0 3px ${cfg.bg}` : '0 1px 3px rgba(0,0,0,0.06)',
                                transition: 'all 0.15s',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, width: '100%', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {label}
                                </span>
                                {active && <i className="fas fa-check" style={{ fontSize: 10, color: cfg.color }} />}
                            </div>
                            <span style={{ fontSize: 28, fontWeight: 800, color: count > 0 ? cfg.color : '#9ca3af', lineHeight: 1 }}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ── Liste des alertes ────────────────────────────── */}
            {isError ? (
                <div className="card" style={{ padding: 24 }}>
                    <ErrorMessage
                        message={error instanceof Error ? error.message : 'Erreur de chargement'}
                        onRetry={() => refetch()}
                    />
                </div>
            ) : isLoading ? (
                <LoadingSpinner text="Chargement des alertes..." />
            ) : filtered.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <EmptyState
                        icon={filterSeverity !== 'all' ? 'fas fa-filter' : 'fas fa-shield-alt'}
                        title={filterSeverity !== 'all'
                            ? `Aucune alerte "${SEV_CONFIG[filterSeverity].label}" cette semaine`
                            : 'Aucune alerte cette semaine'}
                        description={filterSeverity !== 'all' ? 'Essayez un autre filtre' : 'Tous vos patients sont stables'}
                    />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filtered.map((alert) => {
                        const cfg = SEV_CONFIG[alert.severity];
                        const metricIcon  = METRIC_ICONS[alert.type]  ?? 'fas fa-exclamation-triangle';
                        const metricLabel = METRIC_LABELS[alert.type] ?? alert.type;
                        return (
                            <div
                                key={alert.id}
                                style={{
                                    borderRadius: 12,
                                    border: `1px solid ${!alert.isRead ? cfg.border : '#f3f4f6'}`,
                                    borderLeft: `4px solid ${cfg.color}`,
                                    padding: '16px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    background: !alert.isRead ? `${cfg.bg}60` : 'white',
                                    boxShadow: !alert.isRead
                                        ? '0 2px 8px rgba(0,0,0,0.06)'
                                        : '0 1px 3px rgba(0,0,0,0.04)',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {/* Icône métrique */}
                                <div style={{
                                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                                    background: cfg.bg, color: cfg.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                                }}>
                                    <i className={metricIcon} />
                                </div>

                                {/* Avatar */}
                                <Avatar name={alert.patientName} size="sm" />

                                {/* Infos */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                                        <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
                                            {alert.patientName}
                                        </span>
                                        {!alert.isRead && (
                                            <span style={{
                                                width: 7, height: 7, borderRadius: '50%',
                                                background: cfg.color, flexShrink: 0, display: 'inline-block',
                                            }} />
                                        )}
                                        <span style={{
                                            padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                                            background: cfg.bg, color: cfg.color, textTransform: 'uppercase',
                                        }}>
                                            {cfg.label}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>
                                        {alert.message}
                                    </p>
                                    <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#9ca3af', flexWrap: 'wrap' }}>
                                        <span>
                                            <i className="fas fa-chart-line" style={{ marginRight: 4 }} />
                                            {metricLabel}
                                        </span>
                                        <span>
                                            <i className="fas fa-clock" style={{ marginRight: 4 }} />
                                            {formatDateTime(alert.createdAt)}
                                        </span>
                                        <span style={{ fontWeight: 600, color: cfg.color }}>
                                            {alert.value} {alert.unit}
                                            <span style={{ color: '#9ca3af', fontWeight: 400 }}>
                                                {' '}· seuil {alert.threshold} {alert.unit}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, alignItems: 'flex-end' }}>
                                    <button
                                        onClick={() => navigate(`/patients/${alert.patientId}/follow-up`)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                                            background: '#1a3c52', color: 'white',
                                            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                                        }}
                                    >
                                        <i className="fas fa-user" style={{ fontSize: 11 }} />
                                        Voir patient
                                    </button>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        {!alert.isRead && (
                                            <button
                                                onClick={() => handleMarkRead(alert.id)}
                                                disabled={markRead.isPending}
                                                title="Marquer comme lu"
                                                style={{
                                                    padding: '5px 10px', borderRadius: 6, fontSize: 11,
                                                    background: 'transparent', color: '#6b7280',
                                                    border: '1px solid #e5e7eb', cursor: 'pointer',
                                                }}
                                            >
                                                <i className="fas fa-check" />
                                            </button>
                                        )}
                                        {!alert.isResolved && (
                                            <button
                                                onClick={() => handleResolve(alert.id)}
                                                disabled={resolveAlert.isPending}
                                                title="Résoudre"
                                                style={{
                                                    padding: '5px 10px', borderRadius: 6, fontSize: 11,
                                                    background: '#d1fae5', color: '#065f46',
                                                    border: '1px solid #a7f3d0', cursor: 'pointer',
                                                }}
                                            >
                                                <i className="fas fa-check-double" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Footer ──────────────────────────────────────── */}
            {!isLoading && !isError && weekAlerts.length > 0 && (
                <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 20 }}>
                    {weekAlerts.length} alerte{weekAlerts.length > 1 ? 's' : ''} cette semaine
                    {' · '}{unread} non lue{unread > 1 ? 's' : ''}
                    {filterSeverity !== 'all' && ` · filtre : ${SEV_CONFIG[filterSeverity].label}`}
                </p>
            )}
        </div>
    );
};

export default AlertsPage;