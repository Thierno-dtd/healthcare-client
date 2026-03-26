import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import {
    useActivityFeed,
    useWeeklyStats,
    useInjectFakeActivity,
    useSendPatientMessage,
} from '@/hook/useActivityFeed';
import { formatRelativeTime } from '@/core/utils';
import toast from 'react-hot-toast';
import type { ActivityEntry } from '@/services/activity.service';

// ─── Design Tokens — aligned with app design system ──────────
// Same palette as DoctorDashboardPage / DashboardPage
const C = {
    bg: 'hsl(210,40%,98%)',       // --background
    surface: '#ffffff',            // card background
    surfaceHover: 'hsl(210,40%,96%)', // --muted on hover
    border: 'hsl(214,32%,91%)',   // --border
    borderLight: 'hsl(214,20%,94%)',
    primary: '#2a6b8f',           // brand primary (same across all pages)
    primaryGlow: 'rgba(42,107,143,0.08)',
    green: '#059669',             // badge-success color
    greenBg: '#d1fae5',           // badge-success bg
    red: '#dc2626',               // badge-danger color
    redBg: '#fee2e2',             // badge-danger bg
    orange: '#d97706',            // badge-warning color
    orangeBg: '#fef3c7',          // badge-warning bg
    blue: '#2563eb',              // badge-info color
    blueBg: '#dbeafe',            // badge-info bg
    purple: '#7c3aed',
    purpleBg: '#ede9fe',
    text: '#111827',              // main text
    textMuted: '#6b7280',         // secondary text
    textDim: '#9ca3af',           // tertiary / dim text
    white: '#ffffff',
};

// ─── Inline styles helpers ────────────────────────────────────
const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    ...extra,
});

// ─── Metric type config ───────────────────────────────────────
const METRIC_CFG: Record<string, { label: string; icon: string; color: string; bg: string; unit: string }> = {
    blood_pressure: { label: 'Tension', icon: 'fas fa-tachometer-alt', color: C.red, bg: C.redBg, unit: 'mmHg' },
    heart_rate: { label: 'Fréquence', icon: 'fas fa-heartbeat', color: '#e05d44', bg: 'rgba(224,93,68,0.1)', unit: 'bpm' },
    glucose: { label: 'Glycémie', icon: 'fas fa-tint', color: C.purple, bg: C.purpleBg, unit: 'mmol/L' },
    weight: { label: 'Poids', icon: 'fas fa-weight', color: C.blue, bg: C.blueBg, unit: 'kg' },
};

const TAKEN_BY_LABEL: Record<string, string> = {
    self: 'patient',
    family: 'famille',
    healthcare: 'soignant',
    other: 'autre',
};

// ─── Threshold checks ─────────────────────────────────────────
function isAboveThreshold(type: string, value: number): boolean {
    return (
        (type === 'blood_pressure' && value > 160) ||
        (type === 'glucose' && value > 8) ||
        (type === 'heart_rate' && value > 100)
    );
}

// ─── Sub-components ───────────────────────────────────────────
const PulsingDot = ({ color }: { color: string }) => (
    <span style={{
        display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
        background: color, flexShrink: 0,
        boxShadow: `0 0 0 0 ${color}`,
        animation: 'pingDot 1.5s ease-out infinite',
    }} />
);

const StatRing = ({ done, total, color, label, sublabel }: {
    done: number; total: number; color: string; label: string; sublabel?: string;
}) => {
    const pct = total ? Math.round((done / total) * 100) : 0;
    const r = 28;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ position: 'relative', width: 72, height: 72 }}>
                <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="36" cy="36" r={r} fill="none" stroke={C.borderLight} strokeWidth="5" />
                    <circle
                        cx="36" cy="36" r={r} fill="none"
                        stroke={color} strokeWidth="5"
                        strokeDasharray={`${dash} ${circ}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.6s ease' }}
                    />
                </svg>
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{pct}%</span>
                </div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.text, margin: 0 }}>{label}</p>
                <p style={{ fontSize: 10, color: C.textMuted, margin: 0 }}>{done}/{total} {sublabel}</p>
            </div>
        </div>
    );
};

const PatientMiniRow = ({ stat }: {
    stat: { patientName: string; measurementsDone: number; measurementsExpected: number; missedMedications: number; missedMeasurements: number };
}) => {
    const measPct = stat.measurementsExpected
        ? Math.round((stat.measurementsDone / stat.measurementsExpected) * 100)
        : 100;
    const color = measPct >= 80 ? C.green : measPct >= 50 ? C.orange : C.red;
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
            borderBottom: `1px solid ${C.borderLight}`,
        }}>
            <div style={{
                width: 28, height: 28, borderRadius: '50%', background: C.primaryGlow,
                color: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, flexShrink: 0,
            }}>
                {stat.patientName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: C.text, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {stat.patientName}
                </p>
                <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                    {stat.missedMeasurements > 0 && (
                        <span style={{ fontSize: 9, color: C.red, background: C.redBg, padding: '1px 6px', borderRadius: 4 }}>
                            {stat.missedMeasurements} mesure{stat.missedMeasurements > 1 ? 's' : ''} manquée{stat.missedMeasurements > 1 ? 's' : ''}
                        </span>
                    )}
                    {stat.missedMedications > 0 && (
                        <span style={{ fontSize: 9, color: C.orange, background: C.orangeBg, padding: '1px 6px', borderRadius: 4 }}>
                            {stat.missedMedications} med. manqué{stat.missedMedications > 1 ? 's' : ''}
                        </span>
                    )}
                    {stat.missedMeasurements === 0 && stat.missedMedications === 0 && (
                        <span style={{ fontSize: 9, color: C.green, background: C.greenBg, padding: '1px 6px', borderRadius: 4 }}>✓ Conforme</span>
                    )}
                </div>
            </div>
            <div style={{
                width: 36, height: 4, borderRadius: 2, background: C.borderLight, overflow: 'hidden', flexShrink: 0,
            }}>
                <div style={{ height: '100%', width: `${measPct}%`, background: color, borderRadius: 2, transition: 'width 0.5s' }} />
            </div>
        </div>
    );
};

// ─── Activity Row ─────────────────────────────────────────────
const ActivityRow = ({
                         entry,
                         onMessage,
                         onView,
                     }: {
    entry: ActivityEntry;
    onMessage: (entry: ActivityEntry) => void;
    onView: (patientId: string) => void;
}) => {
    const [hovered, setHovered] = useState(false);

    const isAlert = entry.type === 'alert';
    const isMeasAlert = entry.type === 'measurement' && entry.measurement
        && isAboveThreshold(entry.measurement.type, entry.measurement.value);
    const isHighlighted = isAlert || isMeasAlert;
    const isMissedMed = entry.type === 'medication' && entry.intake?.missed;

    const borderColor = isAlert ? C.red : isMeasAlert ? C.orange : isMissedMed ? C.orange : C.border;
    const accentBg = isAlert ? 'rgba(248,81,73,0.04)' : isMeasAlert ? 'rgba(210,153,34,0.04)' : 'transparent';

    return (
        <motion.div
            initial={entry.isNew ? { opacity: 0, y: -12, scale: 0.98 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '14px 20px',
                borderBottom: `1px solid ${C.borderLight}`,
                borderLeft: `3px solid ${isHighlighted || isMissedMed ? borderColor : 'transparent'}`,
                background: hovered ? C.surfaceHover : accentBg,
                transition: 'background 0.15s',
                cursor: 'default',
            }}
        >
            {/* Icon */}
            <ActivityIcon entry={entry} isHighlighted={isHighlighted ?? false} isMissedMed={isMissedMed ?? false} />

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{entry.patientName}</span>
                    <ActivityTypeBadge entry={entry} isHighlighted={isHighlighted ?? false} isMissedMed={isMissedMed ?? false} />
                    {entry.isNew && (
                        <span style={{
                            fontSize: 9, fontWeight: 700, color: C.green,
                            background: C.greenBg, padding: '1px 7px', borderRadius: 4,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                        }}>NOUVEAU</span>
                    )}
                </div>
                <ActivityDescription entry={entry} />
                <div style={{ marginTop: 5, fontSize: 11, color: C.textMuted }}>
                    <i className="fas fa-clock" style={{ marginRight: 4, opacity: 0.5 }} />
                    {formatRelativeTime(entry.timestamp)}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0, opacity: hovered ? 1 : 0.4, transition: 'opacity 0.15s' }}>
                <button
                    onClick={() => onView(entry.patientId)}
                    title="Voir le dossier patient"
                    style={{
                        background: C.primaryGlow, border: `1px solid ${C.primary}40`,
                        color: C.blue, padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                        fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `rgba(88,166,255,0.15)`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.primaryGlow; }}
                >
                    <i className="fas fa-external-link-alt" style={{ fontSize: 10 }} /> Voir +
                </button>
                <button
                    onClick={() => onMessage(entry)}
                    title="Envoyer un message"
                    style={{
                        background: 'transparent', border: `1px solid ${C.border}`,
                        color: C.textMuted, padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                        fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = C.green;
                        el.style.color = C.green;
                    }}
                    onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = C.border;
                        el.style.color = C.textMuted;
                    }}
                >
                    <i className="fas fa-paper-plane" style={{ fontSize: 10 }} /> Message
                </button>
            </div>
        </motion.div>
    );
};

const ActivityIcon = ({ entry, isHighlighted, isMissedMed }: {
    entry: ActivityEntry; isHighlighted: boolean; isMissedMed: boolean;
}) => {
    let bg = C.primaryGlow; let color = C.blue; let icon = 'fas fa-info-circle';
    if (entry.type === 'measurement' && entry.measurement) {
        const cfg = METRIC_CFG[entry.measurement.type];
        bg = cfg?.bg ?? C.blueBg; color = cfg?.color ?? C.blue;
        icon = cfg?.icon ?? 'fas fa-chart-line';
        if (isHighlighted) { bg = C.orangeBg; color = C.orange; }
    } else if (entry.type === 'medication') {
        bg = isMissedMed ? C.redBg : C.greenBg;
        color = isMissedMed ? C.red : C.green;
        icon = isMissedMed ? 'fas fa-times-circle' : 'fas fa-pills';
    } else if (entry.type === 'alert') {
        bg = C.redBg; color = C.red; icon = 'fas fa-exclamation-triangle';
    }
    return (
        <div style={{
            width: 40, height: 40, borderRadius: 10, background: bg, color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0,
        }}>
            <i className={icon} />
        </div>
    );
};

const ActivityTypeBadge = ({ entry, isHighlighted, isMissedMed }: {
    entry: ActivityEntry; isHighlighted: boolean; isMissedMed: boolean;
}) => {
    if (entry.type === 'alert') {
        return (
            <span style={{
                fontSize: 10, fontWeight: 700, color: C.red, background: C.redBg,
                padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>⚡ ALERTE</span>
        );
    }
    if (entry.type === 'measurement') {
        if (isHighlighted) {
            return (
                <span style={{
                    fontSize: 10, fontWeight: 700, color: C.orange, background: C.orangeBg,
                    padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase',
                }}>⚠ Seuil dépassé</span>
            );
        }
        const cfg = METRIC_CFG[entry.measurement?.type ?? ''];
        return (
            <span style={{
                fontSize: 10, fontWeight: 600, color: cfg?.color ?? C.blue, background: cfg?.bg ?? C.blueBg,
                padding: '2px 8px', borderRadius: 4,
            }}>Mesure</span>
        );
    }
    if (entry.type === 'medication') {
        return isMissedMed ? (
            <span style={{
                fontSize: 10, fontWeight: 700, color: C.orange, background: C.orangeBg,
                padding: '2px 8px', borderRadius: 4,
            }}>Médicament manqué</span>
        ) : (
            <span style={{
                fontSize: 10, fontWeight: 600, color: C.green, background: C.greenBg,
                padding: '2px 8px', borderRadius: 4,
            }}>✓ Médicament pris</span>
        );
    }
    return null;
};

const ActivityDescription = ({ entry }: { entry: ActivityEntry }) => {
    if (entry.type === 'alert' && entry.alert) {
        const a = entry.alert;
        return (
            <p style={{ fontSize: 12, color: C.textMuted, margin: 0, lineHeight: 1.5 }}>
                <span style={{ color: C.red, fontWeight: 600 }}>{a.message}</span>
                <span style={{ marginLeft: 6, color: C.textDim }}>·</span>
                <span style={{ marginLeft: 6 }}>Valeur : <strong style={{ color: C.text }}>{a.value} {a.unit}</strong></span>
                <span style={{ marginLeft: 6, color: C.textDim }}>·</span>
                <span style={{ marginLeft: 6 }}>Seuil : {a.threshold} {a.unit}</span>
            </p>
        );
    }
    if (entry.type === 'measurement' && entry.measurement) {
        const m = entry.measurement;
        const cfg = METRIC_CFG[m.type];
        const isOver = isAboveThreshold(m.type, m.value);
        return (
            <div style={{ margin: 0 }}>
                <p style={{ fontSize: 12, color: C.textMuted, margin: 0, lineHeight: 1.6 }}>
                    <span style={{ color: cfg?.color ?? C.text, fontWeight: 700, fontSize: 14 }}>
                        {m.value}{m.value2 ? `/${m.value2}` : ''} <span style={{ fontSize: 11, fontWeight: 400 }}>{m.unit}</span>
                    </span>
                    {isOver && <span style={{ marginLeft: 8, fontSize: 11, color: C.orange }}>⚠ Valeur élevée</span>}
                    {m.takenBy !== 'self' && m.takenByName && (
                        <span style={{ marginLeft: 8, color: C.textDim, fontSize: 11 }}>
                            par {m.takenByName} {m.takenBySurname ?? ''} ({TAKEN_BY_LABEL[m.takenBy]})
                        </span>
                    )}
                </p>
                {m.feeling && (
                    <p style={{ fontSize: 11, color: C.textDim, margin: '2px 0 0', fontStyle: 'italic' }}>
                        "{m.feeling}"
                    </p>
                )}
            </div>
        );
    }
    if (entry.type === 'medication' && entry.intake) {
        const i = entry.intake;
        return (
            <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>
                <strong style={{ color: C.text }}>{i.medicationName}</strong>
                {i.dosage && <span style={{ marginLeft: 6, color: C.purple }}>{i.dosage}</span>}
                <span style={{ marginLeft: 6, color: C.textDim }}>·</span>
                <span style={{ marginLeft: 6 }}>{i.missed ? 'Prise manquée' : `Pris à ${i.scheduledTime}`}</span>
                {i.prescriptionRef && (
                    <span style={{ marginLeft: 6, fontSize: 10, color: C.textDim }}>· Ord. {i.prescriptionRef}</span>
                )}
            </p>
        );
    }
    return null;
};

// ─── Message Modal ────────────────────────────────────────────
const MessageModal = ({
                          entry,
                          onClose,
                          onSend,
                          isSending,
                      }: {
    entry: ActivityEntry;
    onClose: () => void;
    onSend: (msg: string) => void;
    isSending: boolean;
}) => {
    const [msg, setMsg] = useState('');

    return (
        <div
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
            }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
                    padding: 28, width: '100%', maxWidth: 460,
                    boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>
                            Notification au patient
                        </h3>
                        <p style={{ fontSize: 12, color: C.textMuted, margin: '4px 0 0' }}>
                            À : <strong style={{ color: C.text }}>{entry.patientName}</strong>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: C.borderLight, border: 'none', color: C.textMuted,
                            width: 28, height: 28, borderRadius: 6, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <i className="fas fa-times" style={{ fontSize: 12 }} />
                    </button>
                </div>

                {/* Context summary */}
                {(entry.type === 'alert' || (entry.type === 'measurement' && isAboveThreshold(entry.measurement?.type ?? '', entry.measurement?.value ?? 0))) && (
                    <div style={{
                        padding: '10px 14px', background: C.redBg, border: `1px solid ${C.red}30`,
                        borderRadius: 8, marginBottom: 16, fontSize: 12, color: C.red,
                        display: 'flex', gap: 8, alignItems: 'center',
                    }}>
                        <i className="fas fa-exclamation-triangle" style={{ flexShrink: 0 }} />
                        <span>
                            {entry.type === 'alert' ? entry.alert?.message :
                                `${METRIC_CFG[entry.measurement?.type ?? '']?.label} élevée : ${entry.measurement?.value} ${entry.measurement?.unit}`}
                        </span>
                    </div>
                )}

                <textarea
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    rows={4}
                    placeholder="Rédigez votre message pour le patient..."
                    style={{
                        width: '100%', padding: '12px 14px', fontSize: 13,
                        background: C.bg, border: `1px solid ${C.border}`,
                        borderRadius: 10, outline: 'none', resize: 'vertical',
                        color: C.text, boxSizing: 'border-box', minHeight: 100,
                        fontFamily: 'inherit',
                    }}
                    onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = C.primary; }}
                    onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = C.border; }}
                    autoFocus
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px', fontSize: 13, background: 'none',
                            border: `1px solid ${C.border}`, borderRadius: 7, cursor: 'pointer',
                            color: C.textMuted,
                        }}
                    >
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
                        <i className="fas fa-paper-plane" />
                        {isSending ? 'Envoi...' : 'Envoyer'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// ─── Filter Bar ───────────────────────────────────────────────
type FilterType = 'all' | 'measurement' | 'medication' | 'alert';

// ─── MAIN PAGE ────────────────────────────────────────────────
const MonitoringPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const doctorId = 'd_001';

    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [msgTarget, setMsgTarget] = useState<ActivityEntry | null>(null);
    const [liveCount, setLiveCount] = useState(0);
    const feedRef = useRef<HTMLDivElement>(null);

    const { data: activities = [], isLoading, isRefetching } = useActivityFeed(doctorId);
    const { data: weeklyStats } = useWeeklyStats(doctorId);
    const injectFake = useInjectFakeActivity(doctorId);
    const sendMsg = useSendPatientMessage();

    // Simulate live activity injection every 30s
    /*useEffect(() => {
        const patientIds = ['p_001', 'p_002', 'p_007'];
        const interval = setInterval(() => {
            const pid = patientIds[Math.floor(Math.random() * patientIds.length)];
            injectFake.mutate(pid);
            setLiveCount(c => c + 1);
        }, 30000);
        return () => clearInterval(interval);
    }, []);*/

    const filteredActivities = activities.filter(e => {
        const matchFilter = filter === 'all' || e.type === filter;
        const matchSearch = !searchQuery ||
            e.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (e.measurement?.type ?? '').includes(searchQuery.toLowerCase()) ||
            (e.intake?.medicationName ?? '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchFilter && matchSearch;
    });

    // Counts
    const alertCount = activities.filter(e => e.type === 'alert').length;
    const aboveThresholdCount = activities.filter(e =>
        e.type === 'measurement' && e.measurement && isAboveThreshold(e.measurement.type, e.measurement.value)
    ).length;
    const totalWarnings = alertCount + aboveThresholdCount;

    const handleSendMessage = useCallback(async (msg: string) => {
        if (!msgTarget || !user) return;
        try {
            await sendMsg.mutateAsync({
                doctorId: user.id,
                patientId: msgTarget.patientId,
                patientName: msgTarget.patientName,
                message: msg,
            });
            toast.success(`Message envoyé à ${msgTarget.patientName}`);
            setMsgTarget(null);
        } catch {
            toast.error("Erreur lors de l'envoi");
        }
    }, [msgTarget, user, sendMsg]);

    return (
        <div style={{ padding: 24, background: C.bg, minHeight: '100%', fontFamily: 'inherit' }}>

            {/* Keyframes */}
            <style>{`
                @keyframes pingDot {
                    0% { box-shadow: 0 0 0 0 currentColor; }
                    70% { box-shadow: 0 0 0 6px transparent; }
                    100% { box-shadow: 0 0 0 0 transparent; }
                }
                @keyframes liveFlash {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>

            {/* ── Header ─────────────────────────────────────── */}
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>
                            Suivi des patients
                        </h1>
                        {/* Live indicator */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: C.greenBg, border: `1px solid ${C.green}30`,
                            padding: '3px 10px', borderRadius: 20,
                        }}>
                            <span style={{
                                width: 7, height: 7, borderRadius: '50%', background: C.green,
                                animation: 'liveFlash 1.8s ease-in-out infinite',
                                flexShrink: 0,
                            }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                En direct
                            </span>
                        </div>
                        {isRefetching && (
                            <i className="fas fa-sync-alt icon-spin" style={{ fontSize: 13, color: C.textMuted }} />
                        )}
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 13, margin: 0 }}>
                        Flux d'activité global · {activities.length} événements · Mis à jour toutes les 15 secondes
                    </p>
                </div>

                {totalWarnings > 0 && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                        background: C.redBg, border: `1px solid ${C.red}30`, borderRadius: 10,
                    }}>
                        <PulsingDot color={C.red} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.red }}>
                            {totalWarnings} alerte{totalWarnings > 1 ? 's' : ''} active{totalWarnings > 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Main grid: Feed + Sidebar ───────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

                {/* ── LEFT: Activity Feed ─────────────────────── */}
                <div>
                    {/* Filter + Search toolbar */}
                    <div style={{
                        ...card({ padding: '14px 16px', marginBottom: 16 }),
                        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
                    }}>
                        {/* Search */}
                        <div style={{ position: 'relative', flex: '1 1 180px', minWidth: 160 }}>
                            <i className="fas fa-search" style={{
                                position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
                                color: C.textDim, fontSize: 12,
                            }} />
                            <input
                                type="text"
                                placeholder="Rechercher patient, mesure..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%', padding: '7px 10px 7px 32px',
                                    fontSize: 12, background: C.bg,
                                    border: `1px solid ${C.border}`, borderRadius: 8,
                                    color: C.text, outline: 'none', boxSizing: 'border-box',
                                    fontFamily: 'inherit',
                                }}
                                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = C.primary; }}
                                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = C.border; }}
                            />
                        </div>

                        {/* Filter chips */}
                        <div style={{ display: 'flex', gap: 6 }}>
                            {([
                                ['all', 'Tout', 'fas fa-layer-group'],
                                ['measurement', 'Mesures', 'fas fa-chart-line'],
                                ['medication', 'Médicaments', 'fas fa-pills'],
                                ['alert', 'Alertes', 'fas fa-bell'],
                            ] as [FilterType, string, string][]).map(([k, l, icon]) => {
                                const isActive = filter === k;
                                const count = k === 'all' ? activities.length
                                    : activities.filter(e => e.type === k).length;
                                return (
                                    <button
                                        key={k}
                                        onClick={() => setFilter(k)}
                                        style={{
                                            padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                            cursor: 'pointer', border: `1px solid`,
                                            borderColor: isActive ? C.primary : C.border,
                                            background: isActive ? C.primaryGlow : 'transparent',
                                            color: isActive ? C.blue : C.textMuted,
                                            display: 'flex', alignItems: 'center', gap: 5,
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <i className={icon} style={{ fontSize: 10 }} /> {l}
                                        {count > 0 && (
                                            <span style={{
                                                fontSize: 10, background: isActive ? C.primary : C.borderLight,
                                                color: isActive ? C.white : C.textMuted,
                                                padding: '0 5px', borderRadius: 8, minWidth: 16, textAlign: 'center',
                                            }}>{count}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Feed */}
                    <div ref={feedRef} style={card({ overflow: 'hidden', padding: 0 })}>
                        {/* Feed header */}
                        <div style={{
                            padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                                {filteredActivities.length} activité{filteredActivities.length !== 1 ? 's' : ''}
                            </span>
                            <span style={{ fontSize: 11, color: C.textMuted }}>
                                Plus récent en premier
                            </span>
                        </div>

                        {isLoading ? (
                            <div style={{ padding: '48px 20px', textAlign: 'center', color: C.textMuted }}>
                                <i className="fas fa-spinner icon-spin" style={{ fontSize: 24, marginBottom: 12, display: 'block' }} />
                                <p style={{ fontSize: 13 }}>Chargement du flux...</p>
                            </div>
                        ) : filteredActivities.length === 0 ? (
                            <div style={{ padding: '48px 20px', textAlign: 'center', color: C.textMuted }}>
                                <i className="fas fa-inbox" style={{ fontSize: 32, marginBottom: 12, display: 'block', opacity: 0.3 }} />
                                <p style={{ fontSize: 13 }}>Aucune activité trouvée</p>
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {filteredActivities.map(entry => (
                                    <ActivityRow
                                        key={entry.id}
                                        entry={entry}
                                        onMessage={setMsgTarget}
                                        onView={patientId => navigate(`/patients/${patientId}/follow-up`)}
                                    />
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* ── RIGHT SIDEBAR ────────────────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 20 }}>

                    {/* Weekly Stats Card */}
                    <div style={card({ padding: 20 })}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Semaine en cours</span>
                            <span style={{
                                fontSize: 10, color: C.textMuted, background: C.borderLight,
                                padding: '2px 7px', borderRadius: 8,
                            }}>S{getISOWeekDisplay()}</span>
                        </div>

                        {weeklyStats ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
                                    <StatRing
                                        done={weeklyStats.measurementsDone}
                                        total={weeklyStats.measurementsExpected}
                                        color={C.blue}
                                        label="Mesures"
                                        sublabel="effectuées"
                                    />
                                    <StatRing
                                        done={weeklyStats.medicationsTaken}
                                        total={weeklyStats.medicationsExpected}
                                        color={C.green}
                                        label="Médicaments"
                                        sublabel="pris"
                                    />
                                </div>

                                {/* Quick stats */}
                                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                                    {[
                                        { label: 'Mesures manquées', value: weeklyStats.measurementsExpected - weeklyStats.measurementsDone, color: C.red },
                                        { label: 'Médic. manqués', value: weeklyStats.medicationsExpected - weeklyStats.medicationsTaken, color: C.orange },
                                    ].map(s => (
                                        <div key={s.label} style={{
                                            flex: 1, padding: '10px 12px', borderRadius: 8,
                                            background: C.bg, border: `1px solid ${C.borderLight}`,
                                            textAlign: 'center',
                                        }}>
                                            <p style={{ fontSize: 20, fontWeight: 700, color: s.value > 0 ? s.color : C.green, margin: 0 }}>
                                                {Math.max(0, s.value)}
                                            </p>
                                            <p style={{ fontSize: 9, color: C.textMuted, margin: '2px 0 0', lineHeight: 1.3 }}>{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Per-patient breakdown */}
                                <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 12 }}>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                                        Par patient
                                    </p>
                                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                                        {weeklyStats.patientStats.map(ps => (
                                            <PatientMiniRow key={ps.patientId} stat={ps} />
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px 0', color: C.textMuted }}>
                                <i className="fas fa-spinner icon-spin" />
                            </div>
                        )}
                    </div>

                    {/* Alert Summary Card */}
                    {totalWarnings > 0 && (
                        <div style={card({ padding: 16 })}>
                            <p style={{
                                fontSize: 11, fontWeight: 700, color: C.red,
                                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12,
                                display: 'flex', alignItems: 'center', gap: 6,
                            }}>
                                <i className="fas fa-exclamation-triangle" />
                                {totalWarnings} alerte{totalWarnings > 1 ? 's' : ''} active{totalWarnings > 1 ? 's' : ''}
                            </p>
                            {activities.filter(e => e.type === 'alert' || (e.type === 'measurement' && e.measurement && isAboveThreshold(e.measurement.type, e.measurement.value))).slice(0, 4).map(e => (
                                <div
                                    key={e.id}
                                    onClick={() => navigate(`/patients/${e.patientId}/follow-up`)}
                                    style={{
                                        padding: '8px 10px', borderRadius: 8, background: C.redBg,
                                        border: `1px solid ${C.red}20`, marginBottom: 8, cursor: 'pointer',
                                        transition: 'border-color 0.15s',
                                    }}
                                    onMouseEnter={ev => { (ev.currentTarget as HTMLElement).style.borderColor = `${C.red}50`; }}
                                    onMouseLeave={ev => { (ev.currentTarget as HTMLElement).style.borderColor = `${C.red}20`; }}
                                >
                                    <p style={{ fontSize: 12, fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{e.patientName}</p>
                                    <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>
                                        {e.type === 'alert' ? e.alert?.message
                                            : `${METRIC_CFG[e.measurement?.type ?? '']?.label} élevée`}
                                    </p>
                                </div>
                            ))}
                            <button
                                onClick={() => navigate('/alerts')}
                                style={{
                                    width: '100%', padding: '7px', fontSize: 11, fontWeight: 600,
                                    background: 'transparent', border: `1px solid ${C.border}`,
                                    borderRadius: 7, color: C.textMuted, cursor: 'pointer',
                                    marginTop: 4,
                                }}
                            >
                                Voir toutes les alertes →
                            </button>
                        </div>
                    )}

                    {/* Quick nav */}
                    <div style={card({ padding: 16 })}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                            Accès rapide
                        </p>
                        {[
                            { label: 'Liste des patients', icon: 'fas fa-users', route: '/patients' },
                            { label: 'Alertes actives', icon: 'fas fa-bell', route: '/alerts', badge: alertCount > 0 ? alertCount : undefined },
                            { label: 'Demandes de suivi', icon: 'fas fa-user-plus', route: '/patient-requests' },
                            { label: 'Tableau de bord', icon: 'fas fa-th-large', route: '/doctor-dashboard' },
                        ].map(item => (
                            <button
                                key={item.route}
                                onClick={() => navigate(item.route)}
                                style={{
                                    width: '100%', padding: '9px 12px', textAlign: 'left',
                                    background: 'transparent', border: `1px solid ${C.borderLight}`,
                                    borderRadius: 8, color: C.textMuted, cursor: 'pointer',
                                    fontSize: 12, fontWeight: 500, marginBottom: 6,
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.background = C.primaryGlow;
                                    el.style.borderColor = `${C.primary}50`;
                                    el.style.color = C.blue;
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.background = 'transparent';
                                    el.style.borderColor = C.borderLight;
                                    el.style.color = C.textMuted;
                                }}
                            >
                                <i className={item.icon} style={{ width: 14, textAlign: 'center' }} />
                                <span style={{ flex: 1 }}>{item.label}</span>
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span style={{
                                        background: C.red, color: C.white, fontSize: 10,
                                        fontWeight: 700, padding: '1px 6px', borderRadius: 8,
                                    }}>{item.badge}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Message Modal ─────────────────────────────────── */}
            <AnimatePresence>
                {msgTarget && (
                    <MessageModal
                        entry={msgTarget}
                        onClose={() => setMsgTarget(null)}
                        onSend={handleSendMessage}
                        isSending={sendMsg.isPending}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

function getISOWeekDisplay(): number {
    const d = new Date();
    const day = d.getDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export default MonitoringPage;