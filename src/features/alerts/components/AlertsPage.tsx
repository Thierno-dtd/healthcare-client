import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { useAlerts, useMarkAlertRead, useResolveAlert, useMarkAllAlertsRead } from '@/hook/useAlerts';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';
import { Avatar } from '@/shared/components/ui/Avatar';
import { AlertSeverityBadge } from '@/shared/components/ui/AlertBadge';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatRelativeDate } from '@/core/utils';
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

const AlertsPage: React.FC = () => {
    const { user } = useAuthStore();
    const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'all'>('all');
    const [filterResolved, setFilterResolved] = useState<boolean | undefined>(false);
    const [page, setPage] = useState(1);

    const { data: alertsResult, isLoading, isError, error, refetch } = useAlerts({
        doctorId: user?.role === 'doctor' ? 'd_001' : undefined,
        severity: filterSeverity !== 'all' ? filterSeverity : undefined,
        isResolved: filterResolved,
        page,
        pageSize: 10,
    });

    const markRead = useMarkAlertRead();
    const resolveAlert = useResolveAlert();
    const markAllRead = useMarkAllAlertsRead();

    const alerts = alertsResult?.data ?? [];
    const total = alertsResult?.total ?? 0;
    const totalPages = alertsResult?.totalPages ?? 1;
    const unread = alerts.filter((a) => !a.isRead).length;

    const handleMarkRead = useCallback(async (id: string) => {
        try {
            await markRead.mutateAsync(id);
        } catch {
            toast.error('Erreur lors de la mise à jour');
        }
    }, [markRead]);

    const handleResolve = useCallback(async (id: string) => {
        try {
            await resolveAlert.mutateAsync({ id, resolvedBy: user?.id ?? '' });
            toast.success('Alerte résolue');
        } catch {
            toast.error('Erreur lors de la résolution');
        }
    }, [resolveAlert, user]);

    const handleMarkAllRead = useCallback(async () => {
        if (!user) return;
        try {
            await markAllRead.mutateAsync('d_001');
            toast.success('Toutes les alertes marquées comme lues');
        } catch {
            toast.error('Erreur');
        }
    }, [markAllRead, user]);

    return (
        <div className="content-body">
            {/* ── Header ─────────────────────────────────────────── */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                            Alertes
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: 15 }}>
                            Surveillez les anomalies de vos patients en temps réel
                        </p>
                    </div>
                    {unread > 0 && (
                        <button
                            className="btn btn-outline"
                            onClick={handleMarkAllRead}
                            disabled={markAllRead.isPending}
                        >
                            <i className="fas fa-check-double" style={{ marginRight: 8 }} />
                            Tout marquer comme lu ({unread})
                        </button>
                    )}
                </div>
            </div>

            {/* ── Filters ─────────────────────────────────────────── */}
            <div className="card" style={{ padding: '16px 24px', marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Severity filter */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        {(['all', 'critical', 'high', 'medium', 'low'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => { setFilterSeverity(s); setPage(1); }}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 20,
                                    border: '1px solid',
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    transition: 'all 0.2s',
                                    borderColor: filterSeverity === s ? getSeverityColor(s) : '#e5e7eb',
                                    background: filterSeverity === s ? getSeverityBg(s) : 'white',
                                    color: filterSeverity === s ? getSeverityColor(s) : '#6b7280',
                                }}
                            >
                                {s === 'all' ? 'Toutes' : s === 'critical' ? 'Critique' : s === 'high' ? 'Élevé' : s === 'medium' ? 'Moyen' : 'Faible'}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                        <button
                            onClick={() => { setFilterResolved(false); setPage(1); }}
                            className={`btn btn-sm ${filterResolved === false ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            Actives
                        </button>
                        <button
                            onClick={() => { setFilterResolved(true); setPage(1); }}
                            className={`btn btn-sm ${filterResolved === true ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            Résolues
                        </button>
                        <button
                            onClick={() => { setFilterResolved(undefined); setPage(1); }}
                            className={`btn btn-sm ${filterResolved === undefined ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            Toutes
                        </button>
                    </div>
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
                    <LoadingSpinner text="Chargement des alertes..." />
                ) : alerts.length === 0 ? (
                    <EmptyState
                        icon="fas fa-bell-slash"
                        title="Aucune alerte"
                        description={filterResolved === false ? 'Aucune alerte active' : 'Aucune alerte dans cette catégorie'}
                    />
                ) : (
                    <>
                        <div style={{ padding: '0 4px' }}>
                            {alerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 16,
                                        padding: '20px 24px',
                                        borderBottom: '1px solid #f9fafb',
                                        background: !alert.isRead ? `${getSeverityBg(alert.severity)}40` : 'transparent',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    {/* Icon */}
                                    <div
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 12,
                                            background: getSeverityBg(alert.severity),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            color: getSeverityColor(alert.severity),
                                            fontSize: 20,
                                        }}
                                    >
                                        <i className={METRIC_ICONS[alert.type] ?? 'fas fa-exclamation-triangle'} />
                                    </div>

                                    {/* Avatar */}
                                    <Avatar name={alert.patientName} size="sm" />

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <p style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>
                                                {alert.patientName}
                                            </p>
                                            {!alert.isRead && (
                                                <span
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        background: '#2a6b8f',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <p style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>
                                            {alert.message}
                                        </p>
                                        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#9ca3af' }}>
                      <span>
                        <i className="fas fa-chart-line" style={{ marginRight: 4 }} />
                          {METRIC_LABELS[alert.type] ?? alert.type}
                      </span>
                                            <span>
                        <i className="fas fa-clock" style={{ marginRight: 4 }} />
                                                {formatRelativeDate(alert.createdAt)}
                      </span>
                                            {alert.isResolved && (
                                                <span style={{ color: '#059669' }}>
                          <i className="fas fa-check-circle" style={{ marginRight: 4 }} />
                          Résolue
                        </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Badge + Actions */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                        <AlertSeverityBadge severity={alert.severity} />
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {!alert.isRead && (
                                                <button
                                                    className="btn btn-sm btn-ghost"
                                                    onClick={() => handleMarkRead(alert.id)}
                                                    title="Marquer comme lu"
                                                    disabled={markRead.isPending}
                                                >
                                                    <i className="fas fa-check" />
                                                </button>
                                            )}
                                            {!alert.isResolved && (
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleResolve(alert.id)}
                                                    disabled={resolveAlert.isPending}
                                                    title="Résoudre l'alerte"
                                                    style={{ fontSize: 12 }}
                                                >
                                                    <i className="fas fa-check-double" style={{ marginRight: 4 }} />
                                                    Résoudre
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div style={{ padding: '0 24px' }}>
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                total={total}
                                pageSize={10}
                                onPageChange={setPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// ─── Helpers ─────────────────────────────────────────────────
function getSeverityColor(s: string): string {
    const map: Record<string, string> = {
        critical: '#dc2626',
        high: '#ea580c',
        medium: '#ca8a04',
        low: '#16a34a',
        all: '#2a6b8f',
    };
    return map[s] ?? '#6b7280';
}

function getSeverityBg(s: string): string {
    const map: Record<string, string> = {
        critical: '#fee2e2',
        high: '#ffedd5',
        medium: '#fef9c3',
        low: '#dcfce7',
        all: '#dbeafe',
    };
    return map[s] ?? '#f3f4f6';
}

export default AlertsPage;