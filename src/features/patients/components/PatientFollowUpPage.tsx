import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { usePatient } from '@/hook/usePatients';
import { useAuthStore } from '@/store/auth.store';
import {
    useMeasurements,
    usePrescriptions,
    usePatientIntakes,
    useMedicationAdherence,
    useWeeklyCompliance,
    useMeasurementFrequency,
    useSetFrequency,
    useSendMessageToPatient,
    useMeasurementTrend,
} from '@/hook/useDoctorFeatures';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';
import { Avatar } from '@/shared/components/ui/Avatar';
import { PatientStatusBadge } from '@/shared/components/ui/StatusBadge';
import { calculateAge, formatDate, formatRelativeTime } from '@/core/utils';
import toast from 'react-hot-toast';
import {Measurement, MeasurementTakenBy} from "@/data/models/measurement.model.ts";

const METRIC_COLOR: Record<string, string> = {
    blood_pressure: '#dc2626',
    heart_rate: '#ea580c',
    glucose: '#7c3aed',
    weight: '#2563eb',
};

const METRIC_LABEL: Record<string, string> = {
    blood_pressure: 'Tension artérielle',
    heart_rate: 'Fréquence cardiaque',
    glucose: 'Glycémie',
    weight: 'Poids',
};

const TAKEN_BY_LABEL: Record<MeasurementTakenBy, string> = {
    self: 'Patient',
    family: 'Famille',
    healthcare: 'Soignant',
    other: 'Autre',
};

const MeasurementCard: React.FC<{ m: Measurement }> = ({ m }) => {
    const color = METRIC_COLOR[m.type] ?? '#6b7280';
    const isAlert = (m.type === 'blood_pressure' && m.value > 160) ||
        (m.type === 'glucose' && m.value > 8) ||
        (m.type === 'heart_rate' && m.value > 100);

    return (
        <div style={{
            padding: '16px 20px', border: `1.5px solid ${isAlert ? '#fecaca' : '#f3f4f6'}`,
            borderRadius: 12, background: isAlert ? '#fff5f5' : 'white',
            display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'all 0.2s',
        }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                <i className={m.type === 'blood_pressure' ? 'fas fa-tachometer-alt' : m.type === 'heart_rate' ? 'fas fa-heartbeat' : m.type === 'glucose' ? 'fas fa-tint' : 'fas fa-weight'} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>{METRIC_LABEL[m.type]}</span>
                    {isAlert && <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '1px 8px', borderRadius: 8 }}>⚠ Élevé</span>}
                </div>
                <p style={{ fontSize: 20, fontWeight: 800, color, marginBottom: 4 }}>
                    {m.value}{m.value2 ? `/${m.value2}` : ''} <span style={{ fontSize: 13, fontWeight: 400, color: '#9ca3af' }}>{m.unit}</span>
                </p>
                <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#9ca3af', flexWrap: 'wrap' }}>
                    <span><i className="fas fa-clock" style={{ marginRight: 4 }} />{formatRelativeTime(m.recordedAt)}</span>
                    <span><i className="fas fa-user" style={{ marginRight: 4 }} />{TAKEN_BY_LABEL[m.takenBy]}
                        {m.takenByName && m.takenBy !== 'self' && ` — ${m.takenByName} ${m.takenBySurname ?? ''} ${m.takenByAge ? `(${m.takenByAge} ans)` : ''}`}
          </span>
                    {m.feeling && <span><i className="fas fa-comment" style={{ marginRight: 4 }} />"{m.feeling}"</span>}
                </div>
            </div>
        </div>
    );
};

const PatientFollowUpPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'overview' | 'measurements' | 'prescriptions' | 'medications'>('overview');
    const [showFreqModal, setShowFreqModal] = useState(false);
    const [newFreq, setNewFreq] = useState(3);
    const [showMsgModal, setShowMsgModal] = useState(false);
    const [msgText, setMsgText] = useState('');
    const [expandedPresc, setExpandedPresc] = useState<string | null>(null);

    const { data: patient, isLoading, isError, error, refetch } = usePatient(id ?? '');
    const { data: measurements = [] } = useMeasurements(id ?? '', 14);
    const { data: prescriptions = [] } = usePrescriptions(id ?? '');
    const { data: intakes = [] } = usePatientIntakes(id ?? '', 7);
    const { data: adherence } = useMedicationAdherence(id ?? '');
    const { data: weekCompliance } = useWeeklyCompliance(id ?? '');
    const { data: frequency } = useMeasurementFrequency(id ?? '');
    const { data: trend = [] } = useMeasurementTrend(id ?? '');
    const setFrequency = useSetFrequency();
    const sendMessage = useSendMessageToPatient();

    const handleSetFreq = useCallback(async () => {
        if (!id) return;
        try {
            await setFrequency.mutateAsync({ patientId: id, doctorId: 'd_001', timesPerWeek: newFreq });
            toast.success('Fréquence mise à jour');
            setShowFreqModal(false);
        } catch {
            toast.error('Erreur');
        }
    }, [id, newFreq, setFrequency]);

    const handleSendMsg = useCallback(async () => {
        if (!patient || !user || !msgText.trim()) return;
        try {
            await sendMessage.mutateAsync({ doctorId: user.id, patientId: patient.id, patientName: patient.name, message: msgText });
            toast.success('Message envoyé');
            setShowMsgModal(false);
            setMsgText('');
        } catch {
            toast.error("Erreur lors de l'envoi");
        }
    }, [patient, user, msgText, sendMessage]);

    if (isLoading) return <LoadingSpinner size="lg" text="Chargement du dossier..." />;
    if (isError) return <div className="content-body"><ErrorMessage message={error instanceof Error ? error.message : 'Erreur'} onRetry={refetch} /></div>;
    if (!patient) return null;

    const age = calculateAge(patient.dateOfBirth);
    const allMedications = prescriptions.flatMap(p => p.medications);
    const trendChartData = trend.map(t => ({ semaine: `S${t.week}`, effectuées: t.measured, requises: t.required }));

    const TABS = [
        { id: 'overview', label: 'Vue d\'ensemble', icon: 'fas fa-th-large' },
        { id: 'measurements', label: 'Mesures', icon: 'fas fa-chart-line' },
        { id: 'prescriptions', label: 'Ordonnances', icon: 'fas fa-file-prescription' },
        { id: 'medications', label: 'Médicaments', icon: 'fas fa-pills' },
    ] as const;

    return (
        <div className="content-body">
            {/* Back */}
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/doctor-dashboard')} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-arrow-left" />Retour au tableau de bord
            </button>

            {/* Header */}
            <div className="card" style={{ padding: '24px 28px', marginBottom: 24, background: 'linear-gradient(135deg, #1a3c52 0%, #2a6b8f 100%)', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                        {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>{patient.name}</h1>
                            <PatientStatusBadge status={patient.status} />
                        </div>
                        <p style={{ opacity: 0.8, fontSize: 13, margin: 0 }}>
                            {age} ans · {patient.gender === 'male' ? 'Homme' : 'Femme'} · Depuis le {formatDate(patient.createdAt)}
                        </p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                            {patient.conditions.map(c => (
                                <span key={c} style={{ padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: 'white' }}>{c}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }} onClick={() => setShowFreqModal(true)}>
                            <i className="fas fa-calendar-check" style={{ marginRight: 6 }} />Fréquence ({frequency?.timesPerWeek ?? '—'}/sem)
                        </button>
                        <button className="btn btn-sm" style={{ background: 'rgba(74,157,124,0.8)', color: 'white', border: 'none' }} onClick={() => setShowMsgModal(true)}>
                            <i className="fas fa-paper-plane" style={{ marginRight: 6 }} />Envoyer message
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid #f3f4f6', overflowX: 'auto' }}>
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                        padding: '12px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                        fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 500,
                        color: activeTab === tab.id ? '#2a6b8f' : '#6b7280',
                        borderBottom: activeTab === tab.id ? '3px solid #2a6b8f' : '3px solid transparent',
                        transition: 'all 0.2s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                        <i className={tab.icon} />{tab.label}
                    </button>
                ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                    {/* Compliance Widget */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Conformité cette semaine</h3>
                        {weekCompliance ? (
                            <>
                                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                    <p style={{ fontSize: 48, fontWeight: 800, color: weekCompliance.percent >= 80 ? '#059669' : weekCompliance.percent >= 50 ? '#d97706' : '#dc2626', marginBottom: 4 }}>
                                        {weekCompliance.percent}%
                                    </p>
                                    <p style={{ fontSize: 14, color: '#6b7280' }}>{weekCompliance.measured} / {weekCompliance.required} mesures</p>
                                </div>
                                <div style={{ height: 8, borderRadius: 4, background: '#f3f4f6', overflow: 'hidden', marginBottom: 12 }}>
                                    <div style={{ height: '100%', borderRadius: 4, background: weekCompliance.percent >= 80 ? '#059669' : weekCompliance.percent >= 50 ? '#d97706' : '#dc2626', width: `${weekCompliance.percent}%`, transition: 'width 0.8s ease' }} />
                                </div>
                                <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>Fréquence prescrite: {frequency?.timesPerWeek ?? '—'} fois/semaine</p>
                            </>
                        ) : <LoadingSpinner size="sm" />}
                    </div>

                    {/* Medication Adherence */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Adhérence médicamenteuse</h3>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <p style={{ fontSize: 48, fontWeight: 800, color: (adherence ?? 0) >= 80 ? '#4a9d7c' : '#d97706', marginBottom: 4 }}>
                                {adherence ?? '—'}%
                            </p>
                            <p style={{ fontSize: 14, color: '#6b7280' }}>médicaments pris</p>
                        </div>
                        <div style={{ height: 8, borderRadius: 4, background: '#f3f4f6', overflow: 'hidden', marginBottom: 12 }}>
                            <div style={{ height: '100%', borderRadius: 4, background: '#4a9d7c', width: `${adherence ?? 0}%`, transition: 'width 0.8s ease' }} />
                        </div>
                        <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>{prescriptions.length} ordonnance(s) active(s)</p>
                    </div>

                    {/* Weekly Trend Chart */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Tendance hebdomadaire</h3>
                        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>Mesures effectuées vs requises</p>
                        <ResponsiveContainer width="100%" height={160}>
                            <LineChart data={trendChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="semaine" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                                <Line type="monotone" dataKey="requises" name="Requises" stroke="#e5e7eb" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                                <Line type="monotone" dataKey="effectuées" name="Effectuées" stroke="#2a6b8f" strokeWidth={2.5} dot={{ r: 4, fill: '#2a6b8f' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recent Measurements */}
                    <div className="card" style={{ padding: 24, gridColumn: 'span 2' }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Mesures récentes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {measurements.slice(0, 4).map(m => <MeasurementCard key={m.id} m={m} />)}
                            {measurements.length === 0 && <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>Aucune mesure récente</p>}
                        </div>
                    </div>

                    {/* Recent Intakes */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Prises médicamenteuses (7j)</h3>
                        {intakes.slice(0, 6).map(intake => {
                            const med = allMedications.find(m => m.id === intake.medicationId);
                            return (
                                <div key={intake.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: intake.missed ? '#fee2e2' : '#d1fae5', color: intake.missed ? '#dc2626' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <i className={intake.missed ? 'fas fa-times' : 'fas fa-check'} style={{ fontSize: 13 }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 1 }}>{med?.name ?? 'Médicament'} {med?.dosage}</p>
                                        <p style={{ fontSize: 11, color: '#9ca3af' }}>{intake.scheduledTime} · {intake.date}</p>
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: intake.missed ? '#dc2626' : '#059669', background: intake.missed ? '#fee2e2' : '#d1fae5', padding: '2px 8px', borderRadius: 8 }}>
                    {intake.missed ? 'Manqué' : 'Pris'}
                  </span>
                                </div>
                            );
                        })}
                        {intakes.length === 0 && <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center' }}>Aucun log récent</p>}
                    </div>
                </div>
            )}

            {/* Tab: Measurements */}
            {activeTab === 'measurements' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {measurements.length === 0 ? (
                        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
                            <i className="fas fa-chart-line" style={{ fontSize: 48, color: '#d1d5db', display: 'block', marginBottom: 16 }} />
                            <p style={{ color: '#6b7280', fontSize: 15 }}>Aucune mesure disponible</p>
                        </div>
                    ) : measurements.map(m => <MeasurementCard key={m.id} m={m} />)}
                </div>
            )}

            {/* Tab: Prescriptions */}
            {activeTab === 'prescriptions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {prescriptions.length === 0 ? (
                        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
                            <i className="fas fa-file-prescription" style={{ fontSize: 48, color: '#d1d5db', display: 'block', marginBottom: 16 }} />
                            <p style={{ color: '#6b7280' }}>Aucune ordonnance</p>
                        </div>
                    ) : prescriptions.map(p => (
                        <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div
                                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: expandedPresc === p.id ? '#f0f7ff' : 'white' }}
                                onClick={() => setExpandedPresc(expandedPresc === p.id ? null : p.id)}
                            >
                                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fff7ed', color: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                                    <i className="fas fa-file-prescription" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 2 }}>Ref: {p.referenceNumber}</p>
                                    <p style={{ fontSize: 12, color: '#9ca3af' }}>Émise le {formatDate(p.issuedAt)} · Expire le {formatDate(p.expiresAt)}</p>
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 600, color: new Date(p.expiresAt) > new Date() ? '#059669' : '#dc2626', background: new Date(p.expiresAt) > new Date() ? '#d1fae5' : '#fee2e2', padding: '3px 10px', borderRadius: 10 }}>
                  {new Date(p.expiresAt) > new Date() ? 'Active' : 'Expirée'}
                </span>
                                <i className={`fas fa-chevron-${expandedPresc === p.id ? 'up' : 'down'}`} style={{ color: '#9ca3af', fontSize: 12 }} />
                            </div>
                            {expandedPresc === p.id && (
                                <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f3f4f6' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, paddingTop: 20 }}>
                                        {/* Image */}
                                        <div>
                                            <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Image de l'ordonnance</p>
                                            <img src={p.imageUrl} alt={`Ordonnance ${p.referenceNumber}`} style={{ width: '100%', borderRadius: 10, border: '1px solid #e5e7eb', cursor: 'zoom-in' }} />
                                        </div>
                                        {/* Medications */}
                                        <div>
                                            <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Médicaments ({p.medications.length})</p>
                                            {p.medications.map(med => (
                                                <div key={med.id} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #e5e7eb', marginBottom: 10, background: '#fafafa' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                        <p style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{med.name}</p>
                                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', background: '#ede9fe', padding: '2px 10px', borderRadius: 8 }}>{med.dosage}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 12, color: '#6b7280' }}>
                                                        <span><i className="fas fa-clock" style={{ marginRight: 4 }} />{med.intakeTimes.join(', ')}</span>
                                                        <span><i className="fas fa-redo" style={{ marginRight: 4 }} />Renouvellement: {med.renewalDays}j</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Tab: Medications */}
            {activeTab === 'medications' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
                        {allMedications.map(med => {
                            const medIntakes = intakes.filter(i => i.medicationId === med.id);
                            const taken = medIntakes.filter(i => !i.missed).length;
                            const adh = medIntakes.length ? Math.round((taken / medIntakes.length) * 100) : 100;
                            return (
                                <div key={med.id} className="card" style={{ padding: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 2 }}>{med.name}</p>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: '#7c3aed', background: '#ede9fe', padding: '2px 10px', borderRadius: 8 }}>{med.dosage}</span>
                                        </div>
                                        <span style={{ fontSize: 20, fontWeight: 800, color: adh >= 80 ? '#059669' : '#d97706' }}>{adh}%</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#6b7280', marginBottom: 12, flexWrap: 'wrap' }}>
                                        <span><i className="fas fa-clock" style={{ marginRight: 4 }} />{med.intakeTimes.join(', ')}</span>
                                        <span><i className="fas fa-redo" style={{ marginRight: 4 }} />{med.renewalDays}j</span>
                                    </div>
                                    <div style={{ height: 6, borderRadius: 3, background: '#f3f4f6', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', borderRadius: 3, background: adh >= 80 ? '#4a9d7c' : '#d97706', width: `${adh}%`, transition: 'width 0.5s' }} />
                                    </div>
                                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {medIntakes.slice(0, 5).map(intake => (
                                            <div key={intake.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                                                <i className={`fas fa-${intake.missed ? 'times-circle' : 'check-circle'}`} style={{ color: intake.missed ? '#dc2626' : '#059669', fontSize: 14, flexShrink: 0 }} />
                                                <span style={{ color: '#374151' }}>{intake.date} — {intake.scheduledTime}</span>
                                                {intake.takenAt && <span style={{ color: '#9ca3af', marginLeft: 'auto' }}>Pris à {intake.takenAt.slice(11, 16)}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        {allMedications.length === 0 && (
                            <div className="card" style={{ padding: 40, textAlign: 'center', gridColumn: '1 / -1' }}>
                                <i className="fas fa-pills" style={{ fontSize: 48, color: '#d1d5db', display: 'block', marginBottom: 16 }} />
                                <p style={{ color: '#6b7280' }}>Aucun médicament prescrit</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Frequency Modal */}
            {showFreqModal && (
                <div className="modal-overlay" onClick={() => setShowFreqModal(false)}>
                    <div className="modal-container" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><i className="fas fa-calendar-check" style={{ marginRight: 10, color: '#2a6b8f' }} />Fréquence de mesures</h3>
                            <button className="modal-close" onClick={() => setShowFreqModal(false)}><i className="fas fa-times" /></button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
                                Définissez combien de fois par semaine <strong>{patient.name}</strong> doit effectuer ses mesures.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center', padding: '20px 0' }}>
                                <button onClick={() => setNewFreq(Math.max(1, newFreq - 1))} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: 48, fontWeight: 800, color: '#2a6b8f', lineHeight: 1 }}>{newFreq}</p>
                                    <p style={{ fontSize: 13, color: '#6b7280' }}>fois / semaine</p>
                                </div>
                                <button onClick={() => setNewFreq(Math.min(7, newFreq + 1))} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>Fréquence actuelle: {frequency?.timesPerWeek ?? 'non définie'} fois/semaine</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowFreqModal(false)}>Annuler</button>
                            <button className="btn btn-primary" onClick={handleSetFreq} disabled={setFrequency.isPending}>
                                {setFrequency.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Modal */}
            {showMsgModal && (
                <div className="modal-overlay" onClick={() => setShowMsgModal(false)}>
                    <div className="modal-container" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><i className="fas fa-paper-plane" style={{ marginRight: 10, color: '#2a6b8f' }} />Message à {patient.name}</h3>
                            <button className="modal-close" onClick={() => setShowMsgModal(false)}><i className="fas fa-times" /></button>
                        </div>
                        <div className="modal-body">
                            <textarea className="form-control" rows={4} placeholder="Votre message..." value={msgText} onChange={e => setMsgText(e.target.value)} style={{ resize: 'vertical' }} />
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowMsgModal(false)}>Annuler</button>
                            <button className="btn btn-primary" onClick={handleSendMsg} disabled={!msgText.trim() || sendMessage.isPending}>
                                <i className="fas fa-paper-plane" style={{ marginRight: 8 }} />Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientFollowUpPage;