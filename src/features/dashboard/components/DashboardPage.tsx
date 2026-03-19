import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import {useAuthStore} from "@/store/auth.store.ts";
import {LoadingSpinner} from "@shared/components/ui/LoadingSpinner.tsx";
import {StatCard} from "@shared/components/ui/StatCard.tsx";
import {useActivityChart, useAlerts, useAlertsChart, useDashboardStats} from "@/hook";
import {formatRelativeDate, ROLE_LABELS} from "@core/utils";
import {Avatar} from "@shared/components/ui/Avatar.tsx";
import {AlertSeverityBadge} from "@shared/components/ui/AlertBadge.tsx";


const DashboardPage: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const { data: stats, isLoading: statsLoading } = useDashboardStats(
        user!.role,
        user!.id,
        user!.hospitalId
    );

    const { data: activityData } = useActivityChart();
    const { data: alertsChartData } = useAlertsChart();
    const { data: alertsResult } = useAlerts({
        doctorId: user?.role === 'doctor' ? 'd_001' : undefined,
        isResolved: false,
        pageSize: 5,
    });

    const recentAlerts = alertsResult?.data ?? [];

    if (statsLoading) {
        return <LoadingSpinner size="lg" text="Chargement du tableau de bord..." />;
    }

    return (
        <div className="content-body">

            {/* ── Welcome banner ─────────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(135deg, #1a3c52 0%, #2a6b8f 100%)',
                borderRadius: 16, padding: '28px 32px', marginBottom: 28,
                color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 16,
            }}>
                <div>
                    <p style={{ opacity: 0.75, fontSize: 13, marginBottom: 6 }}>
                        {ROLE_LABELS[user!.role]} · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 6 }}>
                        Bonjour, {user!.name.split(' ')[0]} 👋
                    </h1>
                    <p style={{ opacity: 0.8, fontSize: 14 }}>
                        Voici un aperçu de votre activité aujourd'hui.
                    </p>
                </div>
                <div style={{ opacity: 0.15, fontSize: 80 }}>
                    <i className="fas fa-heartbeat"></i>
                </div>
            </div>

            {/* ── Stats ─────────────────────────────────────────── */}
            {stats && (
                <div className="stats-grid" style={{ marginBottom: 28 }}>
                    <StatCard icon="fas fa-users" iconColor="blue" label="Total patients" value={stats.totalPatients} />
                    <StatCard icon="fas fa-user-check" iconColor="green" label="Patients actifs" value={stats.activePatients} />
                    <StatCard icon="fas fa-bell" iconColor="orange" label="Alertes actives" value={stats.totalAlerts} />
                    <StatCard icon="fas fa-exclamation-circle" iconColor="red" label="Alertes critiques" value={stats.criticalAlerts} />
                    {stats.totalDoctors !== undefined && (
                        <StatCard icon="fas fa-user-md" iconColor="purple" label="Médecins" value={stats.totalDoctors} />
                    )}
                    {stats.totalHospitals !== undefined && (
                        <StatCard icon="fas fa-hospital" iconColor="blue" label="Établissements" value={stats.totalHospitals} />
                    )}
                </div>
            )}

            {/* ── Charts row ────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 28 }}>

                {/* Activity chart */}
                {activityData && (
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                            Activité des 7 derniers jours
                        </h3>
                        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Nombre de patients connectés</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={activityData}>
                                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
                                />
                                <Bar dataKey="value" fill="#2a6b8f" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Alerts severity pie */}
                {alertsChartData && (
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                            Alertes par sévérité
                        </h3>
                        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Répartition des alertes actives</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={alertsChartData}
                                    dataKey="value"
                                    nameKey="label"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={75}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    labelLine={false}
                                >
                                    {alertsChartData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* ── Recent alerts ─────────────────────────────────── */}
            {recentAlerts.length > 0 && (
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Alertes récentes</h3>
                            <p style={{ fontSize: 13, color: '#6b7280' }}>Patients nécessitant une attention</p>
                        </div>
                        <button className="btn btn-sm btn-ghost" onClick={() => navigate('/alerts')}>
                            Voir tout <i className="fas fa-arrow-right" style={{ marginLeft: 6 }}></i>
                        </button>
                    </div>

                    <div style={{ padding: '0 4px' }}>
                        {recentAlerts.map((alert) => (
                            <div key={alert.id} style={{
                                display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                                borderBottom: '1px solid #f9fafb',
                                background: !alert.isRead ? '#fffbeb' : 'transparent',
                            }}>
                                <Avatar name={alert.patientName} size="md" />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 2 }}>
                                        {alert.patientName}
                                    </p>
                                    <p style={{ fontSize: 13, color: '#6b7280' }}>{alert.message}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                                    <AlertSeverityBadge severity={alert.severity} />
                                    <span style={{ fontSize: 12, color: '#9ca3af' }}>
                    {formatRelativeDate(alert.createdAt)}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;