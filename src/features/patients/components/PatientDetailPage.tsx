import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { usePatient, usePatientMetrics } from '@/hook/usePatients';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';
import { Avatar } from '@/shared/components/ui/Avatar';
import { PatientStatusBadge } from '@/shared/components/ui/StatusBadge';
import { calculateAge, formatDate, formatRelativeDate, METRIC_LABELS, METRIC_ICONS } from '@/core/utils';
import type { MetricType } from '@/data/models/patient.model';

const METRIC_COLOR: Record<string, string> = {
    blood_pressure: '#dc2626',
    heart_rate: '#e97316',
    glucose: '#7c3aed',
    weight: '#2563eb',
    steps: '#059669',
    sleep: '#0891b2',
    oxygen_saturation: '#be185d',
};

const AVAILABLE_METRICS: MetricType[] = ['blood_pressure', 'heart_rate', 'glucose', 'weight'];

const PatientDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedMetric, setSelectedMetric] = useState<MetricType>('blood_pressure');

    const { data: patient, isLoading, isError, error, refetch } = usePatient(id ?? '');
    const { data: metrics = [], isLoading: metricsLoading } = usePatientMetrics(
        id ?? '',
        selectedMetric,
        14
    );

    if (isLoading) return <LoadingSpinner size="lg" text="Chargement du dossier patient..." />;
    if (isError) return (
        <div className="content-body">
            <ErrorMessage
                message={error instanceof Error ? error.message : 'Patient introuvable'}
                onRetry={() => refetch()}
            />
        </div>
    );
    if (!patient) return null;

    const age = calculateAge(patient.dateOfBirth);

    // Prepare chart data (reverse so oldest first)
    const chartData = [...metrics].reverse().map((m) => ({
        date: new Date(m.recordedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        value: m.value,
        unit: m.unit,
    }));

    return (
        <div className="content-body">
            {/* ── Back button ─────────────────────────────────────── */}
            <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/patients')}
                style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}
            >
                <i className="fas fa-arrow-left" />
                Retour aux patients
            </button>

            {/* ── Patient header ──────────────────────────────────── */}
            <div className="card" style={{
                padding: '28px 32px',
                marginBottom: 24,
                background: 'linear-gradient(135deg, #1a3c52 0%, #2a6b8f 100%)',
                color: 'white',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{
                        width: 80, height: 80,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, fontWeight: 700, color: 'white',
                        flexShrink: 0,
                    }}>
                        {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: 0 }}>
                                {patient.name}
                            </h1>
                            <PatientStatusBadge status={patient.status} />
                        </div>
                        <p style={{ opacity: 0.8, fontSize: 14, margin: 0 }}>
                            {age !== null ? `${age} ans` : '–'} ·{' '}
                            {patient.gender === 'male' ? 'Homme' : patient.gender === 'female' ? 'Femme' : 'Autre'} ·{' '}
                            Inscrit le {formatDate(patient.createdAt)}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                            <i className="fas fa-envelope" style={{ marginRight: 8 }} />
                            Envoyer message
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>

                {/* ── Info panel ─────────────────────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Contact */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
                            <i className="fas fa-address-card" style={{ marginRight: 8, color: '#6b7280' }} />
                            Coordonnées
                        </h3>
                        {[
                            { icon: 'fas fa-envelope', label: patient.email },
                            { icon: 'fas fa-phone', label: patient.phone },
                            { icon: 'fas fa-calendar', label: `Né(e) le ${formatDate(patient.dateOfBirth)}` },
                        ].map(({ icon, label }) => (
                            <div key={label} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#374151', marginBottom: 10 }}>
                                <i className={icon} style={{ color: '#9ca3af', width: 16, marginTop: 1 }} />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Pathologies */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
                            <i className="fas fa-stethoscope" style={{ marginRight: 8, color: '#6b7280' }} />
                            Pathologies
                        </h3>
                        {patient.conditions.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {patient.conditions.map((c) => (
                                    <span key={c} style={{
                                        padding: '6px 12px', background: '#eff6ff', color: '#1d4ed8',
                                        borderRadius: 12, fontSize: 13, fontWeight: 500,
                                    }}>
                                        {c}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#9ca3af', fontSize: 13 }}>Aucune pathologie enregistrée</p>
                        )}
                    </div>

                    {/* Last activity */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                            <i className="fas fa-clock" style={{ marginRight: 8, color: '#6b7280' }} />
                            Activité
                        </h3>
                        <p style={{ fontSize: 13, color: '#6b7280' }}>
                            Dernière activité : <strong>{formatRelativeDate(patient.lastActivity)}</strong>
                        </p>
                    </div>
                </div>

                {/* ── Metrics panel ──────────────────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Metric selector */}
                    <div className="card" style={{ padding: 20 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
                            <i className="fas fa-chart-line" style={{ marginRight: 8, color: '#6b7280' }} />
                            Métriques de santé
                        </h3>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                            {AVAILABLE_METRICS.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedMetric(type)}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: 20,
                                        border: '1px solid',
                                        cursor: 'pointer',
                                        fontSize: 13,
                                        fontWeight: 500,
                                        transition: 'all 0.2s',
                                        borderColor: selectedMetric === type ? METRIC_COLOR[type] : '#e5e7eb',
                                        background: selectedMetric === type ? `${METRIC_COLOR[type]}15` : 'white',
                                        color: selectedMetric === type ? METRIC_COLOR[type] : '#6b7280',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                    }}
                                >
                                    <i className={METRIC_ICONS[type]} style={{ fontSize: 11 }} />
                                    {METRIC_LABELS[type]}
                                </button>
                            ))}
                        </div>

                        {metricsLoading ? (
                            <LoadingSpinner size="sm" text="Chargement des métriques..." />
                        ) : chartData.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                                <i className="fas fa-chart-area" style={{ fontSize: 32, marginBottom: 12, display: 'block' }} />
                                <p>Aucune donnée disponible pour cette métrique</p>
                            </div>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
                                            formatter={(val: number) => [
                                                `${val} ${chartData[0]?.unit ?? ''}`,
                                                METRIC_LABELS[selectedMetric],
                                            ]}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke={METRIC_COLOR[selectedMetric]}
                                            strokeWidth={2.5}
                                            dot={{ r: 4, fill: METRIC_COLOR[selectedMetric] }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>

                                {/* Latest value highlight */}
                                {chartData.length > 0 && (
                                    <div style={{
                                        marginTop: 16,
                                        padding: '12px 16px',
                                        background: `${METRIC_COLOR[selectedMetric]}10`,
                                        borderRadius: 10,
                                        border: `1px solid ${METRIC_COLOR[selectedMetric]}30`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                    }}>
                                        <i className={METRIC_ICONS[selectedMetric]} style={{ color: METRIC_COLOR[selectedMetric], fontSize: 20 }} />
                                        <div>
                                            <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Dernière valeur</p>
                                            <p style={{ fontSize: 20, fontWeight: 700, color: METRIC_COLOR[selectedMetric] }}>
                                                {chartData[chartData.length - 1]?.value} {chartData[0]?.unit}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailPage;