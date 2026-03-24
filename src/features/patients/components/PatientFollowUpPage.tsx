import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, BarChart, Bar,
} from 'recharts';
import { useAuthStore } from '@/store/auth.store';
import { useSendMessageToPatient } from '@/hook/useDoctorFeatures';
import { calculateAge, formatDate, formatRelativeTime, formatRelativeDate } from '@/core/utils';
import { PatientStatusBadge } from '@/shared/components/ui/StatusBadge';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import {
    MOCK_PATIENTS,
    MOCK_MEASUREMENTS,
    MOCK_PRESCRIPTIONS,
    MOCK_MEDICATION_INTAKES,
    MOCK_ALERTS,
    MOCK_FREQUENCIES,
} from '@/data/mocks/mock-data';
import type { Measurement, MeasurementTakenBy } from '@/data/models/measurement.model';

// ─── Design Tokens ────────────────────────────────────────────
const C = {
    primary:     '#2a6b8f',
    primaryDark: '#1a3c52',
    primaryLight:'hsl(207,55%,94%)',
    border:      'hsl(214,32%,91%)',
    muted:       'hsl(210,40%,96%)',
    textMain:    'hsl(222,47%,11%)',
    textMuted:   'hsl(215,16%,47%)',
    textDim:     '#9ca3af',
    bg:          'hsl(210,40%,98%)',
    white:       '#ffffff',
    green:       '#059669',
    greenBg:     '#d1fae5',
    red:         '#dc2626',
    redBg:       '#fee2e2',
    orange:      '#d97706',
    orangeBg:    '#fef3c7',
    purple:      '#7c3aed',
    purpleBg:    '#ede9fe',
    blue:        '#2563eb',
    blueBg:      '#dbeafe',
};

// ─── Metric config ────────────────────────────────────────────
const METRIC_CFG: Record<string, { label: string; icon: string; color: string; bg: string; unit: string }> = {
    blood_pressure: { label: 'Tension',    icon: 'fas fa-tachometer-alt', color: C.red,    bg: C.redBg,    unit: 'mmHg'   },
    heart_rate:     { label: 'Fréquence',  icon: 'fas fa-heartbeat',      color: '#ea580c', bg: '#ffedd5',  unit: 'bpm'    },
    glucose:        { label: 'Glycémie',   icon: 'fas fa-tint',           color: C.purple, bg: C.purpleBg, unit: 'mmol/L' },
    weight:         { label: 'Poids',      icon: 'fas fa-weight',         color: C.blue,   bg: C.blueBg,   unit: 'kg'     },
};

const TAKEN_BY_LABEL: Record<MeasurementTakenBy, string> = {
    self: 'Patient',
    family: 'Famille',
    healthcare: 'Soignant',
    other: 'Autre',
};

function isAlert(type: string, value: number): boolean {
    return (
        (type === 'blood_pressure' && value > 160) ||
        (type === 'glucose'        && value > 8)   ||
        (type === 'heart_rate'     && value > 100)
    );
}

// ─── Tabs ─────────────────────────────────────────────────────
type TabId = 'overview' | 'measurements' | 'prescriptions' | 'medications' | 'alerts';

const TABS: { id: TabId; label: string; icon: string }[] = [
    { id: 'overview',      label: 'Vue d\'ensemble',  icon: 'fas fa-th-large'           },
    { id: 'measurements',  label: 'Mesures',          icon: 'fas fa-chart-line'          },
    { id: 'prescriptions', label: 'Ordonnances',      icon: 'fas fa-file-prescription'   },
    { id: 'medications',   label: 'Médicaments',      icon: 'fas fa-pills'               },
    { id: 'alerts',        label: 'Alertes',          icon: 'fas fa-bell'                },
];

// ─── Sub: Measurement Row ─────────────────────────────────────
const MeasurementRow: React.FC<{ m: Measurement }> = ({ m }) => {
    const cfg = METRIC_CFG[m.type];
    const alert = cfg && isAlert(m.type, m.value);
    return (
        <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
            background: alert ? '#fff8f8' : 'transparent',
            borderLeft: alert ? `3px solid ${C.red}` : '3px solid transparent',
        }}>
            <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: cfg?.bg ?? C.muted, color: cfg?.color ?? C.textMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>
                <i className={cfg?.icon ?? 'fas fa-chart-line'} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted }}>{cfg?.label ?? m.type}</span>
                    {alert && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: C.red, background: C.redBg, padding: '1px 7px', borderRadius: 6 }}>
                            ⚠ Élevé
                        </span>
                    )}
                </div>
                <p style={{ fontSize: 20, fontWeight: 800, color: cfg?.color ?? C.textMain, margin: '0 0 4px' }}>
                    {m.value}{m.value2 ? `/${m.value2}` : ''}{' '}
                    <span style={{ fontSize: 12, fontWeight: 400, color: C.textDim }}>{m.unit}</span>
                </p>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: C.textDim, flexWrap: 'wrap' }}>
                    <span><i className="fas fa-clock" style={{ marginRight: 4 }} />{formatRelativeTime(m.recordedAt)}</span>
                    <span>
                        <i className="fas fa-user" style={{ marginRight: 4 }} />
                        {TAKEN_BY_LABEL[m.takenBy]}
                        {m.takenBy !== 'self' && m.takenByName && ` — ${m.takenByName} ${m.takenBySurname ?? ''}`}
                    </span>
                    {m.feeling && <span style={{ fontStyle: 'italic' }}>"{m.feeling}"</span>}
                </div>
            </div>
        </div>
    );
};

// ─── Sub: Send Message Modal ──────────────────────────────────
const MessageModal: React.FC<{
    patientName: string;
    onClose: () => void;
    onSend: (msg: string) => void;
    isSending: boolean;
}> = ({ patientName, onClose, onSend, isSending }) => {
    const [msg, setMsg] = useState('');
    return (
        <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.40)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            onClick={onClose}
        >
            <div
                style={{ background: C.white, borderRadius: 16, padding: 28, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.20)', animation: 'zoomInMsg 0.2s ease' }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.textMain, margin: 0 }}>
                            <i className="fas fa-paper-plane" style={{ marginRight: 8, color: C.primary }} />
                            Envoyer une notification
                        </h3>
                        <p style={{ fontSize: 13, color: C.textMuted, margin: '4px 0 0' }}>
                            À : <strong style={{ color: C.textMain }}>{patientName}</strong>
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: C.muted, border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted }}>
                        <i className="fas fa-times" style={{ fontSize: 13 }} />
                    </button>
                </div>
                <textarea
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    rows={4}
                    placeholder="Rédigez votre message pour le patient..."
                    autoFocus
                    style={{
                        width: '100%', padding: '12px 14px', fontSize: 13,
                        background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
                        outline: 'none', resize: 'vertical', color: C.textMain,
                        boxSizing: 'border-box', minHeight: 110, fontFamily: 'inherit',
                    }}
                    onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = C.primary; }}
                    onBlur={e  => { (e.target as HTMLTextAreaElement).style.borderColor = C.border; }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                    <button onClick={onClose} style={{ padding: '8px 16px', fontSize: 13, background: 'none', border: `1px solid ${C.border}`, borderRadius: 7, cursor: 'pointer', color: C.textMuted }}>
                        Annuler
                    </button>
                    <button
                        onClick={() => onSend(msg)}
                        disabled={!msg.trim() || isSending}
                        style={{
                            padding: '8px 20px', background: C.primary, color: C.white,
                            border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                            opacity: (!msg.trim() || isSending) ? 0.5 : 1,
                        }}
                    >
                        <i className="fas fa-paper-plane" style={{ fontSize: 12 }} />
                        {isSending ? 'Envoi...' : 'Envoyer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────
const PatientFollowUpPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const sendMessage = useSendMessageToPatient();

    const [activeTab, setActiveTab]       = useState<TabId>('overview');
    const [showMsg, setShowMsg]           = useState(false);
    const [expandedPresc, setExpandedPresc] = useState<string | null>(null);

    // Search states per tab
    const [measureSearch, setMeasureSearch]   = useState('');
    const [measureTypeFilter, setMeasureTypeFilter] = useState<string>('all');
    const [prescSearch, setPrescSearch]       = useState('');
    const [medSearch, setMedSearch]           = useState('');
    const [alertSearch, setAlertSearch]       = useState('');

    // ── Data from mock ──────────────────────────────────────────
    const patient = useMemo(() => MOCK_PATIENTS.find(p => p.id === id) ?? null, [id]);

    const measurements = useMemo(() =>
            MOCK_MEASUREMENTS
                .filter(m => m.patientId === id)
                .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()),
        [id]);

    const prescriptions = useMemo(() =>
            MOCK_PRESCRIPTIONS
                .filter(p => p.patientId === id)
                .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()),
        [id]);

    const allMedications = useMemo(() => prescriptions.flatMap(p => p.medications), [prescriptions]);

    const intakes = useMemo(() =>
            MOCK_MEDICATION_INTAKES
                .filter(i => i.patientId === id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [id]);

    const patientAlerts = useMemo(() =>
            MOCK_ALERTS
                .filter(a => a.patientId === id)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        [id]);

    const frequency = useMemo(() => MOCK_FREQUENCIES.find(f => f.patientId === id), [id]);

    // ── Computed stats ──────────────────────────────────────────
    const adherence = useMemo(() => {
        if (!intakes.length) return 100;
        return Math.round((intakes.filter(i => !i.missed).length / intakes.length) * 100);
    }, [intakes]);

    const criticalAlertsCount = patientAlerts.filter(a => a.severity === 'critical' && !a.isResolved).length;

    // ── Filtered lists ──────────────────────────────────────────
    const filteredMeasurements = useMemo(() => {
        let list = measurements;
        if (measureTypeFilter !== 'all') list = list.filter(m => m.type === measureTypeFilter);
        if (measureSearch) {
            const q = measureSearch.toLowerCase();
            list = list.filter(m =>
                METRIC_CFG[m.type]?.label.toLowerCase().includes(q) ||
                m.feeling?.toLowerCase().includes(q) ||
                TAKEN_BY_LABEL[m.takenBy].toLowerCase().includes(q)
            );
        }
        return list;
    }, [measurements, measureTypeFilter, measureSearch]);

    const filteredPrescriptions = useMemo(() => {
        if (!prescSearch) return prescriptions;
        const q = prescSearch.toLowerCase();
        return prescriptions.filter(p =>
            p.referenceNumber.toLowerCase().includes(q) ||
            p.medications.some(m => m.name.toLowerCase().includes(q))
        );
    }, [prescriptions, prescSearch]);

    const filteredMedications = useMemo(() => {
        if (!medSearch) return allMedications;
        const q = medSearch.toLowerCase();
        return allMedications.filter(m =>
            m.name.toLowerCase().includes(q) || m.dosage.toLowerCase().includes(q)
        );
    }, [allMedications, medSearch]);

    const filteredAlerts = useMemo(() => {
        if (!alertSearch) return patientAlerts;
        const q = alertSearch.toLowerCase();
        return patientAlerts.filter(a =>
            a.message.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)
        );
    }, [patientAlerts, alertSearch]);

    // ── Chart data ──────────────────────────────────────────────
    const chartData = useMemo(() => {
        const bpData = measurements
            .filter(m => m.type === 'blood_pressure')
            .slice(0, 10).reverse()
            .map(m => ({ date: formatDate(m.recordedAt, 'dd/MM'), value: m.value, value2: m.value2 }));

        const glucoseData = measurements
            .filter(m => m.type === 'glucose')
            .slice(0, 10).reverse()
            .map(m => ({ date: formatDate(m.recordedAt, 'dd/MM'), value: m.value }));

        return { bpData, glucoseData };
    }, [measurements]);

    const handleSend = useCallback(async (msg: string) => {
        if (!patient || !user) return;
        try {
            await sendMessage.mutateAsync({ doctorId: user.id, patientId: patient.id, patientName: patient.name, message: msg });
            toast.success(`Message envoyé à ${patient.name}`);
            setShowMsg(false);
        } catch {
            toast.error("Erreur lors de l'envoi");
        }
    }, [patient, user, sendMessage]);

    if (!patient) {
        return (
            <div className="content-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                <i className="fas fa-user-slash" style={{ fontSize: 48, color: C.textDim, marginBottom: 16 }} />
                <p style={{ color: C.textMuted, fontSize: 15 }}>Patient introuvable</p>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/patients')} style={{ marginTop: 16 }}>
                    <i className="fas fa-arrow-left" style={{ marginRight: 8 }} />Retour
                </button>
            </div>
        );
    }

    const age = calculateAge(patient.dateOfBirth);

    return (
        <div className="content-body">
            <style>{`
                @keyframes zoomInMsg { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
                @keyframes fadeSlide { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
                .tab-pane { animation: fadeSlide 0.25s ease; }
                .measure-row:hover { background: ${C.muted} !important; }
            `}</style>

            {/* ── Back ─────────────────────────────────────────── */}
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/patients')}
                    style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-arrow-left" /> Retour aux patients
            </button>

            {/* ── Header card ──────────────────────────────────── */}
            <div style={{
                background: `linear-gradient(135deg, ${C.primaryDark} 0%, ${C.primary} 100%)`,
                borderRadius: 16, padding: '28px 32px', marginBottom: 24, color: C.white,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    {/* Avatar */}
                    <div style={{
                        width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, fontWeight: 700, color: C.white,
                    }}>
                        {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.white, margin: 0 }}>{patient.name}</h1>
                            <PatientStatusBadge status={patient.status} />
                        </div>
                        <p style={{ opacity: 0.8, fontSize: 13, margin: '0 0 8px' }}>
                            {age} ans · {patient.gender === 'male' ? 'Homme' : 'Femme'} · Depuis le {formatDate(patient.createdAt)}
                        </p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {patient.conditions.map(c => (
                                <span key={c} style={{ padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: C.white }}>{c}</span>
                            ))}
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {[
                            { label: 'Mesures', value: measurements.length, color: C.blueBg, text: C.blue },
                            { label: 'Ordonnances', value: prescriptions.length, color: C.orangeBg, text: C.orange },
                            { label: 'Alertes actives', value: criticalAlertsCount, color: C.redBg, text: C.red },
                            { label: 'Adhérence', value: `${adherence}%`, color: C.greenBg, text: C.green },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 16px', textAlign: 'center', minWidth: 80,
                            }}>
                                <p style={{ fontSize: 20, fontWeight: 800, color: C.white, margin: 0 }}>{s.value}</p>
                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <button
                        onClick={() => setShowMsg(true)}
                        style={{ padding: '10px 18px', background: 'rgba(74,157,124,0.85)', color: C.white, border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        <i className="fas fa-paper-plane" /> Envoyer message
                    </button>
                </div>
            </div>

            {/* ── Contact row ──────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    { icon: 'fas fa-envelope', val: patient.email },
                    { icon: 'fas fa-phone', val: patient.phone },
                    { icon: 'fas fa-calendar', val: `Né(e) le ${formatDate(patient.dateOfBirth)}` },
                    ...(frequency ? [{ icon: 'fas fa-redo', val: `Fréquence prescrite : ${frequency.timesPerWeek}×/sem` }] : []),
                ].map(item => (
                    <div key={item.val} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.textMuted, background: C.white, padding: '8px 14px', borderRadius: 8, border: `1px solid ${C.border}` }}>
                        <i className={item.icon} style={{ color: C.textDim, fontSize: 12 }} />
                        {item.val}
                    </div>
                ))}
            </div>

            {/* ── Tabs ─────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: `2px solid ${C.border}`, overflowX: 'auto' }}>
                {TABS.map(tab => {
                    const count = tab.id === 'measurements' ? measurements.length
                        : tab.id === 'prescriptions' ? prescriptions.length
                            : tab.id === 'medications' ? allMedications.length
                                : tab.id === 'alerts' ? patientAlerts.length : null;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                            padding: '12px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                            fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500,
                            color: activeTab === tab.id ? C.primary : C.textMuted,
                            borderBottom: activeTab === tab.id ? `3px solid ${C.primary}` : '3px solid transparent',
                            transition: 'all 0.2s', whiteSpace: 'nowrap',
                            display: 'flex', alignItems: 'center', gap: 7,
                        }}>
                            <i className={tab.icon} style={{ fontSize: 12 }} />
                            {tab.label}
                            {count !== null && count > 0 && (
                                <span style={{ background: activeTab === tab.id ? C.primary : C.muted, color: activeTab === tab.id ? C.white : C.textMuted, fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 8, minWidth: 18, textAlign: 'center' }}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ══════════════════════════════════════════════════ */}
            {/* TAB: OVERVIEW */}
            {/* ══════════════════════════════════════════════════ */}
            {activeTab === 'overview' && (
                <div className="tab-pane" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

                    {/* Adherence card */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textMain, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <i className="fas fa-pills" style={{ color: C.green }} /> Adhérence médicamenteuse
                        </h3>
                        <div style={{ textAlign: 'center', marginBottom: 16 }}>
                            <p style={{ fontSize: 52, fontWeight: 800, color: adherence >= 80 ? C.green : C.orange, margin: 0, lineHeight: 1 }}>{adherence}%</p>
                            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 6 }}>médicaments pris</p>
                        </div>
                        <div style={{ height: 8, borderRadius: 4, background: C.muted, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 4, background: adherence >= 80 ? C.green : C.orange, width: `${adherence}%`, transition: 'width 0.8s ease' }} />
                        </div>
                        <p style={{ fontSize: 12, color: C.textDim, textAlign: 'center', marginTop: 8 }}>
                            {intakes.filter(i => !i.missed).length} pris / {intakes.length} attendus
                        </p>
                    </div>

                    {/* Active alerts */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textMain, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <i className="fas fa-bell" style={{ color: C.red }} /> Alertes actives
                        </h3>
                        {patientAlerts.filter(a => !a.isResolved).length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px 0', color: C.textDim }}>
                                <i className="fas fa-check-circle" style={{ fontSize: 32, color: C.green, display: 'block', marginBottom: 8 }} />
                                <p style={{ fontSize: 13 }}>Aucune alerte active</p>
                            </div>
                        ) : (
                            patientAlerts.filter(a => !a.isResolved).slice(0, 3).map(a => (
                                <div key={a.id} style={{ padding: '10px 12px', borderRadius: 8, background: a.severity === 'critical' ? C.redBg : C.orangeBg, marginBottom: 8, border: `1px solid ${a.severity === 'critical' ? C.red : C.orange}20` }}>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: a.severity === 'critical' ? C.red : C.orange, margin: '0 0 2px' }}>
                                        {a.severity === 'critical' ? '🔴 Critique' : '🟡 Attention'}
                                    </p>
                                    <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>{a.message}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* BP chart */}
                    {chartData.bpData.length > 0 && (
                        <div className="card" style={{ padding: 24 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textMain, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <i className="fas fa-tachometer-alt" style={{ color: C.red }} /> Tension artérielle
                            </h3>
                            <p style={{ fontSize: 12, color: C.textDim, marginBottom: 16 }}>Évolution récente</p>
                            <ResponsiveContainer width="100%" height={160}>
                                <LineChart data={chartData.bpData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.textDim }} />
                                    <YAxis tick={{ fontSize: 11, fill: C.textDim }} domain={['auto', 'auto']} />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12 }} />
                                    <Line type="monotone" dataKey="value" name="Systolique" stroke={C.red} strokeWidth={2} dot={{ r: 3 }} />
                                    {chartData.bpData[0]?.value2 && (
                                        <Line type="monotone" dataKey="value2" name="Diastolique" stroke="#ea580c" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Glucose chart */}
                    {chartData.glucoseData.length > 0 && (
                        <div className="card" style={{ padding: 24 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textMain, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <i className="fas fa-tint" style={{ color: C.purple }} /> Glycémie
                            </h3>
                            <p style={{ fontSize: 12, color: C.textDim, marginBottom: 16 }}>Évolution récente</p>
                            <ResponsiveContainer width="100%" height={160}>
                                <BarChart data={chartData.glucoseData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.textDim }} />
                                    <YAxis tick={{ fontSize: 11, fill: C.textDim }} domain={[0, 12]} />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12 }} />
                                    <Bar dataKey="value" name="mmol/L" fill={C.purple} radius={[4,4,0,0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Recent measures */}
                    <div className="card" style={{ padding: 0, gridColumn: 'span 2' }}>
                        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textMain, margin: 0 }}>
                                <i className="fas fa-chart-line" style={{ marginRight: 8, color: C.textDim }} />
                                Mesures récentes
                            </h3>
                        </div>
                        {measurements.slice(0, 5).length === 0 ? (
                            <p style={{ padding: '24px', color: C.textDim, textAlign: 'center', fontSize: 13 }}>Aucune mesure</p>
                        ) : (
                            measurements.slice(0, 5).map(m => <MeasurementRow key={m.id} m={m} />)
                        )}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════ */}
            {/* TAB: MEASUREMENTS */}
            {/* ══════════════════════════════════════════════════ */}
            {activeTab === 'measurements' && (
                <div className="tab-pane">
                    {/* Toolbar */}
                    <div className="card" style={{ padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
                            <i className="fas fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textDim, fontSize: 12 }} />
                            <input
                                type="text"
                                placeholder="Rechercher par type, ressenti..."
                                value={measureSearch}
                                onChange={e => setMeasureSearch(e.target.value)}
                                className="form-control"
                                style={{ paddingLeft: 34, fontSize: 13 }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {['all', 'blood_pressure', 'heart_rate', 'glucose', 'weight'].map(t => (
                                <button key={t} onClick={() => setMeasureTypeFilter(t)} style={{
                                    padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                    border: `1px solid ${measureTypeFilter === t ? C.primary : C.border}`,
                                    background: measureTypeFilter === t ? C.primary : C.white,
                                    color: measureTypeFilter === t ? C.white : C.textMuted,
                                    transition: 'all 0.15s',
                                }}>
                                    {t === 'all' ? 'Toutes' : METRIC_CFG[t]?.label ?? t}
                                </button>
                            ))}
                        </div>
                        <span style={{ fontSize: 12, color: C.textDim, marginLeft: 'auto' }}>
                            {filteredMeasurements.length} résultat{filteredMeasurements.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="card" style={{ padding: 0 }}>
                        {filteredMeasurements.length === 0 ? (
                            <div style={{ padding: '48px 24px', textAlign: 'center', color: C.textDim }}>
                                <i className="fas fa-chart-line" style={{ fontSize: 40, display: 'block', marginBottom: 12, opacity: 0.3 }} />
                                <p style={{ fontSize: 13 }}>Aucune mesure trouvée</p>
                            </div>
                        ) : (
                            filteredMeasurements.map(m => <MeasurementRow key={m.id} m={m} />)
                        )}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════ */}
            {/* TAB: PRESCRIPTIONS */}
            {/* ══════════════════════════════════════════════════ */}
            {activeTab === 'prescriptions' && (
                <div className="tab-pane">
                    {/* Search */}
                    <div className="card" style={{ padding: '14px 16px', marginBottom: 16 }}>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textDim, fontSize: 12 }} />
                            <input
                                type="text"
                                placeholder="Rechercher par référence ou médicament..."
                                value={prescSearch}
                                onChange={e => setPrescSearch(e.target.value)}
                                className="form-control"
                                style={{ paddingLeft: 34, fontSize: 13 }}
                            />
                        </div>
                    </div>

                    {filteredPrescriptions.length === 0 ? (
                        <div className="card" style={{ padding: '48px 24px', textAlign: 'center', color: C.textDim }}>
                            <i className="fas fa-file-prescription" style={{ fontSize: 40, display: 'block', marginBottom: 12, opacity: 0.3 }} />
                            <p style={{ fontSize: 13 }}>Aucune ordonnance</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {filteredPrescriptions.map(p => {
                                const isExpired = new Date(p.expiresAt) < new Date();
                                const isOpen = expandedPresc === p.id;
                                return (
                                    <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                        {/* Header row */}
                                        <div
                                            onClick={() => setExpandedPresc(isOpen ? null : p.id)}
                                            style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: isOpen ? C.primaryLight : C.white, transition: 'background 0.15s' }}
                                        >
                                            <div style={{ width: 44, height: 44, borderRadius: 10, background: C.orangeBg, color: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                                                <i className="fas fa-file-prescription" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 700, fontSize: 14, color: C.textMain, margin: '0 0 3px' }}>
                                                    {p.referenceNumber}
                                                </p>
                                                <p style={{ fontSize: 12, color: C.textDim, margin: 0 }}>
                                                    Émise le {formatDate(p.issuedAt)} · Expire le {formatDate(p.expiresAt)} · {p.medications.length} médicament{p.medications.length > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <span style={{ padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: isExpired ? C.redBg : C.greenBg, color: isExpired ? C.red : C.green }}>
                                                {isExpired ? 'Expirée' : 'Active'}
                                            </span>
                                            <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ color: C.textDim, fontSize: 12 }} />
                                        </div>

                                        {/* Expanded details */}
                                        {isOpen && (
                                            <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${C.border}` }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, paddingTop: 20 }}>
                                                    <div>
                                                        <p style={{ fontSize: 11, fontWeight: 700, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                                                            Image de l'ordonnance
                                                        </p>
                                                        <img src={p.imageUrl} alt={p.referenceNumber} style={{ width: '100%', borderRadius: 10, border: `1px solid ${C.border}` }} />
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: 11, fontWeight: 700, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                                                            Médicaments ({p.medications.length})
                                                        </p>
                                                        {p.medications.map(med => (
                                                            <div key={med.id} style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 10, background: C.muted }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                                                    <p style={{ fontWeight: 700, fontSize: 14, color: C.textMain, margin: 0 }}>{med.name}</p>
                                                                    <span style={{ fontSize: 12, fontWeight: 700, color: C.purple, background: C.purpleBg, padding: '2px 8px', borderRadius: 6 }}>{med.dosage}</span>
                                                                </div>
                                                                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: C.textDim, flexWrap: 'wrap' }}>
                                                                    <span><i className="fas fa-clock" style={{ marginRight: 4 }} />{med.intakeTimes.join(', ')}</span>
                                                                    <span><i className="fas fa-redo" style={{ marginRight: 4 }} />{med.renewalDays}j</span>
                                                                    <span><i className="fas fa-calendar" style={{ marginRight: 4 }} />{formatDate(med.startDate)} → {formatDate(med.endDate)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════════════ */}
            {/* TAB: MEDICATIONS */}
            {/* ══════════════════════════════════════════════════ */}
            {activeTab === 'medications' && (
                <div className="tab-pane">
                    {/* Search */}
                    <div className="card" style={{ padding: '14px 16px', marginBottom: 16 }}>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textDim, fontSize: 12 }} />
                            <input
                                type="text"
                                placeholder="Rechercher un médicament..."
                                value={medSearch}
                                onChange={e => setMedSearch(e.target.value)}
                                className="form-control"
                                style={{ paddingLeft: 34, fontSize: 13 }}
                            />
                        </div>
                    </div>

                    {filteredMedications.length === 0 ? (
                        <div className="card" style={{ padding: '48px 24px', textAlign: 'center', color: C.textDim }}>
                            <i className="fas fa-pills" style={{ fontSize: 40, display: 'block', marginBottom: 12, opacity: 0.3 }} />
                            <p style={{ fontSize: 13 }}>Aucun médicament</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                            {filteredMedications.map(med => {
                                const medIntakes = intakes.filter(i => i.medicationId === med.id);
                                const taken = medIntakes.filter(i => !i.missed).length;
                                const adh = medIntakes.length ? Math.round((taken / medIntakes.length) * 100) : 100;
                                const color = adh >= 80 ? C.green : C.orange;
                                return (
                                    <div key={med.id} className="card" style={{ padding: 20 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: 15, color: C.textMain, margin: '0 0 4px' }}>{med.name}</p>
                                                <span style={{ fontSize: 12, fontWeight: 700, color: C.purple, background: C.purpleBg, padding: '2px 8px', borderRadius: 6 }}>{med.dosage}</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: 22, fontWeight: 800, color, margin: 0 }}>{adh}%</p>
                                                <p style={{ fontSize: 10, color: C.textDim, margin: 0 }}>adhérence</p>
                                            </div>
                                        </div>

                                        <div style={{ height: 6, borderRadius: 3, background: C.muted, overflow: 'hidden', marginBottom: 12 }}>
                                            <div style={{ height: '100%', borderRadius: 3, background: color, width: `${adh}%`, transition: 'width 0.5s' }} />
                                        </div>

                                        <div style={{ display: 'flex', gap: 10, fontSize: 12, color: C.textDim, marginBottom: 12, flexWrap: 'wrap' }}>
                                            <span><i className="fas fa-clock" style={{ marginRight: 4 }} />{med.intakeTimes.join(', ')}</span>
                                            <span><i className="fas fa-redo" style={{ marginRight: 4 }} />{med.renewalDays}j</span>
                                        </div>

                                        {/* Last 5 intakes */}
                                        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                                            <p style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Prises récentes</p>
                                            {medIntakes.slice(0, 5).map(intake => (
                                                <div key={intake.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginBottom: 6 }}>
                                                    <i className={`fas fa-${intake.missed ? 'times-circle' : 'check-circle'}`} style={{ color: intake.missed ? C.red : C.green, fontSize: 14, flexShrink: 0 }} />
                                                    <span style={{ color: C.textMuted }}>{intake.date} — {intake.scheduledTime}</span>
                                                    {intake.takenAt && <span style={{ color: C.textDim, marginLeft: 'auto' }}>✓ {intake.takenAt.slice(11, 16)}</span>}
                                                </div>
                                            ))}
                                            {medIntakes.length === 0 && <p style={{ fontSize: 12, color: C.textDim }}>Aucun historique</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════════════ */}
            {/* TAB: ALERTS */}
            {/* ══════════════════════════════════════════════════ */}
            {activeTab === 'alerts' && (
                <div className="tab-pane">
                    {/* Search */}
                    <div className="card" style={{ padding: '14px 16px', marginBottom: 16 }}>
                        <div style={{ position: 'relative' }}>
                            <i className="fas fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textDim, fontSize: 12 }} />
                            <input
                                type="text"
                                placeholder="Rechercher dans les alertes..."
                                value={alertSearch}
                                onChange={e => setAlertSearch(e.target.value)}
                                className="form-control"
                                style={{ paddingLeft: 34, fontSize: 13 }}
                            />
                        </div>
                    </div>

                    <div className="card" style={{ padding: 0 }}>
                        {filteredAlerts.length === 0 ? (
                            <div style={{ padding: '48px 24px', textAlign: 'center', color: C.textDim }}>
                                <i className="fas fa-bell-slash" style={{ fontSize: 40, display: 'block', marginBottom: 12, opacity: 0.3 }} />
                                <p style={{ fontSize: 13 }}>Aucune alerte</p>
                            </div>
                        ) : (
                            filteredAlerts.map(a => {
                                const sevColor = a.severity === 'critical' ? C.red : a.severity === 'high' ? C.orange : a.severity === 'medium' ? '#ca8a04' : C.green;
                                const sevBg    = a.severity === 'critical' ? C.redBg : a.severity === 'high' ? C.orangeBg : a.severity === 'medium' ? '#fef9c3' : C.greenBg;
                                return (
                                    <div key={a.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 14,
                                        padding: '16px 20px', borderBottom: `1px solid ${C.border}`,
                                        background: !a.isRead ? `${sevBg}50` : 'transparent',
                                    }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 10, background: sevBg, color: sevColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                                            <i className="fas fa-exclamation-triangle" />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                                                <span style={{ padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: sevBg, color: sevColor, textTransform: 'uppercase' }}>
                                                    {a.severity}
                                                </span>
                                                {a.isResolved && <span style={{ padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: C.greenBg, color: C.green }}>✓ Résolue</span>}
                                                {!a.isRead && <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.primary, flexShrink: 0, display: 'inline-block' }} />}
                                            </div>
                                            <p style={{ fontSize: 13, color: C.textMain, margin: '0 0 3px', fontWeight: 500 }}>{a.message}</p>
                                            <p style={{ fontSize: 12, color: C.textDim, margin: 0 }}>
                                                <i className="fas fa-clock" style={{ marginRight: 4 }} />{formatRelativeDate(a.createdAt)}
                                                {' · '}{a.value} {a.unit} (seuil: {a.threshold} {a.unit})
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* ── Message Modal ─────────────────────────────────── */}
            {showMsg && (
                <MessageModal
                    patientName={patient.name}
                    onClose={() => setShowMsg(false)}
                    onSend={handleSend}
                    isSending={sendMessage.isPending}
                />
            )}
        </div>
    );
};

export default PatientFollowUpPage;