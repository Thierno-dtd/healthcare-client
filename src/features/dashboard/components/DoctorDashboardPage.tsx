import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useAuthStore } from "@/store/auth.store";
import { useSendMessageToPatient } from "@/hook/useDoctorFeatures";
import { formatRelativeTime } from "@/core/utils";
import toast from "react-hot-toast";
import {PatientCompliance} from "@/data/models/patientCompliance.model.ts";

type Period = "week" | "2weeks" | "month";
type DiseaseFilter = "all" | "hypertension" | "diabetes" | "both";

// ─── Rich mock data ────────────────────────────────────────────
const MOCK_COMPLIANCE: PatientCompliance[] = [
    { patientId: "p1",  patientName: "Afi Bima",          patientType: "hypertension", weekCompliance: 100, medicationAdherence: 95, status: "compliant",     missedMeasurements: 0, totalRequired: 5, lastActivity: new Date(Date.now() - 2*3600000).toISOString(),  criticalAlerts: 0 },
    { patientId: "p2",  patientName: "Emmanuel Koffi",     patientType: "both",         weekCompliance: 60,  medicationAdherence: 70, status: "partial",       missedMeasurements: 2, totalRequired: 5, lastActivity: new Date(Date.now() - 6*3600000).toISOString(),  criticalAlerts: 2 },
    { patientId: "p3",  patientName: "Akua Mensah",        patientType: "diabetes",     weekCompliance: 20,  medicationAdherence: 45, status: "non_compliant", missedMeasurements: 4, totalRequired: 5, lastActivity: new Date(Date.now() - 2*86400000).toISOString(), criticalAlerts: 1 },
    { patientId: "p4",  patientName: "Kofi Adjei",         patientType: "hypertension", weekCompliance: 100, medicationAdherence: 92, status: "compliant",     missedMeasurements: 0, totalRequired: 4, lastActivity: new Date(Date.now() - 1*3600000).toISOString(),  criticalAlerts: 0 },
    { patientId: "p5",  patientName: "Kofi Asante",        patientType: "both",         weekCompliance: 100, medicationAdherence: 88, status: "compliant",     missedMeasurements: 0, totalRequired: 5, lastActivity: new Date(Date.now() - 30*60000).toISOString(),   criticalAlerts: 0 },
    { patientId: "p6",  patientName: "Nana Osei",          patientType: "diabetes",     weekCompliance: 60,  medicationAdherence: 65, status: "partial",       missedMeasurements: 2, totalRequired: 5, lastActivity: new Date(Date.now() - 5*3600000).toISOString(),  criticalAlerts: 0 },
    { patientId: "p7",  patientName: "Abena Darko",        patientType: "hypertension", weekCompliance: 80,  medicationAdherence: 85, status: "compliant",     missedMeasurements: 1, totalRequired: 5, lastActivity: new Date(Date.now() - 3*3600000).toISOString(),  criticalAlerts: 0 },
    { patientId: "p8",  patientName: "Kwame Boateng",      patientType: "both",         weekCompliance: 0,   medicationAdherence: 30, status: "non_compliant", missedMeasurements: 5, totalRequired: 5, lastActivity: new Date(Date.now() - 4*86400000).toISOString(), criticalAlerts: 1 },
    { patientId: "p9",  patientName: "Yaa Asantewaa",      patientType: "diabetes",     weekCompliance: 40,  medicationAdherence: 55, status: "partial",       missedMeasurements: 3, totalRequired: 5, lastActivity: new Date(Date.now() - 1*86400000).toISOString(), criticalAlerts: 0 },
    { patientId: "p10", patientName: "Kwabena Mensah",     patientType: "hypertension", weekCompliance: 100, medicationAdherence: 98, status: "compliant",     missedMeasurements: 0, totalRequired: 3, lastActivity: new Date(Date.now() - 45*60000).toISOString(),  criticalAlerts: 0 },
];

const MOCK_ALERTS = [
    { id: "a1",  patientId: "p2",  patientName: "Emmanuel Koffi",  patientType: "both",         severity: "critical" as const, isRead: false, createdAt: new Date(Date.now() - 2*86400000).toISOString(), message: "Glycémie à 1.45 g/L — seuil critique dépassé" },
    { id: "a2",  patientId: "p2",  patientName: "Emmanuel Koffi",  patientType: "both",         severity: "critical" as const, isRead: false, createdAt: new Date(Date.now() - 4*86400000).toISOString(), message: "Tension à 160/98 mmHg — hypertension sévère" },
    { id: "a3",  patientId: "p3",  patientName: "Akua Mensah",     patientType: "diabetes",     severity: "high"    as const, isRead: false, createdAt: new Date(Date.now() - 1*86400000).toISOString(), message: "4 jours sans mesure — fréquence non respectée (5/sem. requise)" },
    { id: "a4",  patientId: "p8",  patientName: "Kwame Boateng",   patientType: "both",         severity: "critical" as const, isRead: true,  createdAt: new Date(Date.now() - 5*86400000).toISOString(), message: "Tension artérielle critique : 185/110 mmHg" },
    { id: "a5",  patientId: "p6",  patientName: "Nana Osei",       patientType: "diabetes",     severity: "high"    as const, isRead: false, createdAt: new Date(Date.now() - 3*3600000).toISOString(),  message: "Glycémie élevée : 8.8 mmol/L (seuil : 7.0)" },
    { id: "a6",  patientId: "p9",  patientName: "Yaa Asantewaa",   patientType: "diabetes",     severity: "high"    as const, isRead: true,  createdAt: new Date(Date.now() - 1*86400000).toISOString(), message: "3 mesures manquées cette semaine" },
    { id: "a7",  patientId: "p2",  patientName: "Emmanuel Koffi",  patientType: "both",         severity: "high"    as const, isRead: false, createdAt: new Date(Date.now() - 6*3600000).toISOString(),  message: "Fréquence cardiaque élevée : 108 bpm" },
    { id: "a8",  patientId: "p4",  patientName: "Kofi Adjei",      patientType: "hypertension", severity: "high"    as const, isRead: true,  createdAt: new Date(Date.now() - 2*3600000).toISOString(),  message: "Tension légèrement élevée : 145/90 mmHg" },
    { id: "a9",  patientId: "p8",  patientName: "Kwame Boateng",   patientType: "both",         severity: "critical" as const, isRead: false, createdAt: new Date(Date.now() - 7*3600000).toISOString(),  message: "Adhérence médicamenteuse < 30% cette semaine" },
    { id: "a10", patientId: "p3",  patientName: "Akua Mensah",     patientType: "diabetes",     severity: "high"    as const, isRead: true,  createdAt: new Date(Date.now() - 8*3600000).toISOString(),  message: "Glycémie à 9.2 mmol/L — surveillance recommandée" },
];

const AGE_MAP: Record<string, number> = {
    p1: 41, p2: 55, p3: 33, p4: 67, p5: 48, p6: 60, p7: 38, p8: 52, p9: 29, p10: 44,
};

// ─── Helpers ───────────────────────────────────────────────────
function getStats(compliance: PatientCompliance[]) {
    return {
        total:        compliance.length,
        compliant:    compliance.filter(p => p.status === "compliant").length,
        partial:      compliance.filter(p => p.status === "partial").length,
        nonCompliant: compliance.filter(p => p.status === "non_compliant").length,
        critical:     compliance.filter(p => p.status === "critical").length,
    };
}
function avgAdh(compliance: PatientCompliance[]) {
    if (!compliance.length) return 0;
    return Math.round(compliance.reduce((s, p) => s + p.medicationAdherence, 0) / compliance.length);
}

// ─── Design tokens ─────────────────────────────────────────────
const C = {
    primary:     "#2a6b8f",
    primaryDark: "#1a3c52",
    red:         "hsl(0,72%,51%)",
    border:      "hsl(214,32%,91%)",
    muted:       "hsl(210,40%,96%)",
    textMain:    "hsl(222,47%,11%)",
    textMuted:   "hsl(215,16%,47%)",
    bgPage:      "hsl(210,40%,98%)",
    white:       "#ffffff",
};
const card: React.CSSProperties = {
    background: C.white,
    borderRadius: 12,
    border: `1px solid ${C.border}`,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
};

// ─── Icons ─────────────────────────────────────────────────────
const IUsers = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ICheck = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IClock = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IBell  = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const ISend  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IArrow = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const ISteth = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>;
const IActiv = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const ISearch= () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

// ─── Sub-components ────────────────────────────────────────────
const StatCard = ({ iconBg, iconColor, iconPath, label, value, delay = 0 }: {
    iconBg: string; iconColor: string; iconPath: React.ReactNode; label: string; value: number; delay?: number;
}) => (
    <div style={{ ...card, padding: "20px", display: "flex", alignItems: "center", gap: 16, animation: `fadeUp 0.4s ease both ${delay}s` }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {iconPath}
        </div>
        <div>
            <p style={{ fontSize: 24, fontWeight: 700, color: C.textMain, lineHeight: 1, marginBottom: 4 }}>{value}</p>
            <p style={{ fontSize: 14, color: C.textMuted }}>{label}</p>
        </div>
    </div>
);

const ComplianceBadge = ({ status }: { status: PatientCompliance["status"] }) => {
    const m = {
        compliant:     { label: "Conforme",     bg: "hsl(152,55%,90%)", color: "hsl(152,55%,25%)" },
        partial:       { label: "Partiel",       bg: "hsl(30,90%,92%)",  color: "hsl(30,90%,30%)"  },
        non_compliant: { label: "Non conforme", bg: "hsl(0,72%,94%)",   color: "hsl(0,72%,35%)"   },
        critical:      { label: "Critique",      bg: "hsl(0,72%,94%)",   color: "hsl(0,72%,35%)"   },
    }[status];
    return <span style={{ padding: "2px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 600, background: m.bg, color: m.color, whiteSpace: "nowrap" }}>{m.label}</span>;
};

const TypeBadge = ({ type }: { type: string }) => {
    const m: Record<string, { label: string; bg: string; color: string }> = {
        hypertension: { label: "HTA",          bg: "#dbeafe", color: "#1e40af" },
        diabetes:     { label: "Diabète",      bg: "#fef3c7", color: "#92400e" },
        both:         { label: "HTA + Diabète",bg: "#ede9fe", color: "#5b21b6" },
    };
    const cfg = m[type] ?? { label: type, bg: "#f3f4f6", color: "#374151" };
    return <span style={{ padding: "1px 10px", borderRadius: 9999, fontSize: 10, fontWeight: 700, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
};

// ─── SCROLL AREA — styled scrollbar ────────────────────────────
const SCROLL_HEIGHT = 420;
const scrollAreaStyle: React.CSSProperties = {
    maxHeight: SCROLL_HEIGHT,
    overflowY: "auto",
    overflowX: "hidden",
};

// ─── Main ──────────────────────────────────────────────────────
const DoctorDashboardPage = () => {
    const { user } = useAuthStore();
    const navigate  = useNavigate();
    const sendMsg   = useSendMessageToPatient();

    const [period, setPeriod]         = useState<Period>("week");
    const [msgPatient, setMsgPatient] = useState<string | null>(null);
    const [msgText, setMsgText]       = useState("");

    // Alerts filters
    const [alertSearch, setAlertSearch]     = useState("");
    const [alertDisease, setAlertDisease]   = useState<DiseaseFilter>("all");

    // Patient search
    const [patientSearch, setPatientSearch] = useState("");

    const stats = getStats(MOCK_COMPLIANCE);
    const adh   = avgAdh(MOCK_COMPLIANCE);
    const unread = MOCK_ALERTS.filter(a => !a.isRead);

    // Filtered alerts
    const filteredAlerts = useMemo(() => {
        return MOCK_ALERTS.filter(a => {
            const matchSearch  = alertSearch === "" ||
                a.patientName.toLowerCase().includes(alertSearch.toLowerCase()) ||
                a.message.toLowerCase().includes(alertSearch.toLowerCase());
            const matchDisease = alertDisease === "all" || a.patientType === alertDisease;
            return matchSearch && matchDisease;
        });
    }, [alertSearch, alertDisease]);

    // Filtered patients
    const filteredPatients = useMemo(() => {
        if (!patientSearch) return MOCK_COMPLIANCE;
        return MOCK_COMPLIANCE.filter(p =>
            p.patientName.toLowerCase().includes(patientSearch.toLowerCase())
        );
    }, [patientSearch]);

    const pieData = [
        { name: "Conformes",     value: stats.compliant,    color: "hsl(152,55%,42%)" },
        { name: "Partiels",      value: stats.partial,      color: "hsl(30,90%,55%)"  },
        { name: "Non conformes", value: stats.nonCompliant, color: "hsl(0,72%,51%)"   },
    ].filter(d => d.value > 0);

    const weeklyData = [
        { day: "Lun", mesures: 32, attendues: 40 },
        { day: "Mar", mesures: 28, attendues: 40 },
        { day: "Mer", mesures: 35, attendues: 40 },
        { day: "Jeu", mesures: 22, attendues: 40 },
        { day: "Ven", mesures: 38, attendues: 40 },
        { day: "Sam", mesures: 15, attendues: 40 },
        { day: "Dim", mesures: 18, attendues: 40 },
    ];

    const periodLabel = { week: "cette semaine", "2weeks": "les 2 dernières semaines", month: "ce mois" }[period];

    const handleSend = async () => {
        if (!msgPatient || !msgText.trim() || !user) return;
        const p = MOCK_COMPLIANCE.find(c => c.patientId === msgPatient);
        if (!p) return;
        try {
            await sendMsg.mutateAsync({ doctorId: user.id, patientId: p.patientId, patientName: p.patientName, message: msgText });
            toast.success(`Message envoyé à ${p.patientName}`);
            setMsgText(""); setMsgPatient(null);
        } catch { toast.error("Erreur lors de l'envoi"); }
    };

    return (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24, background: C.bgPage, minHeight: "100%" }}>

            {/* ── HERO ───────────────────────────────────────── */}
            <div style={{ background: `linear-gradient(135deg, ${C.primaryDark} 0%, ${C.primary} 100%)`, borderRadius: 16, padding: "24px 28px", color: C.white, animation: "fadeUp 0.35s ease both" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <h2 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: 0, marginBottom: 6 }}>Tableau de bord analytique</h2>
                        <p style={{ opacity: 0.9, fontSize: 14, margin: 0 }}>Bienvenue Dr. {user?.name?.split(" ").slice(-1)[0] ?? "Martin Dupont"} — Suivi hebdomadaire de vos patients</p>
                    </div>
                    <div style={{ display: "flex", background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: 4, gap: 2 }}>
                        {([ ["week","Semaine"], ["2weeks","2 Sem."], ["month","Mois"] ] as [Period,string][]).map(([k,l]) => (
                            <button key={k} onClick={() => setPeriod(k)} style={{ padding: "6px 14px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: period === k ? "rgba(255,255,255,0.22)" : "transparent", color: period === k ? C.white : "rgba(255,255,255,0.65)", transition: "all 0.18s" }}>{l}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── STAT CARDS ─────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <StatCard iconBg="#dbeafe" iconColor="#1d4ed8" iconPath={<IUsers/>} label="Patients suivis"      value={stats.total}      delay={0}    />
                <StatCard iconBg="#d1fae5" iconColor="#065f46" iconPath={<ICheck/>} label="Conformes"            value={stats.compliant}  delay={0.05} />
                <StatCard iconBg="#fef3c7" iconColor="#92400e" iconPath={<IClock/>} label="Conformité partielle" value={stats.partial}    delay={0.10} />
                <StatCard iconBg="#fee2e2" iconColor="#991b1b" iconPath={<IBell/>}  label="Alertes non lues"     value={unread.length}    delay={0.15} />
            </div>

            {/* ── CHARTS ─────────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ ...card, padding: 24, animation: "fadeUp 0.4s ease both 0.2s" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: C.textMain, margin: 0, marginBottom: 4 }}>Mesures reçues vs attendues</h3>
                    <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Données de {periodLabel}</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(210,15%,50%)" />
                            <YAxis tick={{ fontSize: 12 }} stroke="hsl(210,15%,50%)" />
                            <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12 }} />
                            <Bar dataKey="attendues" fill="hsl(210,20%,90%)" radius={[4,4,0,0]} name="Attendues" />
                            <Bar dataKey="mesures"   fill="hsl(207,55%,36%)" radius={[4,4,0,0]} name="Reçues"    />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ ...card, padding: 24, animation: "fadeUp 0.4s ease both 0.25s" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: C.textMain, margin: 0, marginBottom: 4 }}>Conformité des patients</h3>
                    <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>Adhérence médicamenteuse : {adh}%</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                                {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                            </Pie>
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── ALERTS + PATIENTS — scroll sur les deux ────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, alignItems: "start" }}>

                {/* ── ALERTES ── */}
                <div style={{ ...card, padding: 0, animation: "fadeUp 0.4s ease both 0.3s", display: "flex", flexDirection: "column" }}>

                    {/* Header */}
                    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, color: C.textMain, display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                            <span style={{ color: C.red }}><IBell /></span>
                            Alertes récentes
                        </h3>
                        <span style={{ padding: "2px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 700, background: "hsl(0,72%,94%)", color: "hsl(0,72%,35%)" }}>
              {unread.length} non lues
            </span>
                    </div>

                    {/* Search + filter toolbar */}
                    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                        {/* Search input */}
                        <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textMuted, display: "flex", alignItems: "center" }}>
                <ISearch />
              </span>
                            <input
                                type="text"
                                placeholder="Rechercher une alerte..."
                                value={alertSearch}
                                onChange={e => setAlertSearch(e.target.value)}
                                style={{
                                    width: "100%", padding: "7px 10px 7px 30px",
                                    fontSize: 12, border: `1px solid ${C.border}`, borderRadius: 8,
                                    background: C.muted, color: C.textMain, outline: "none", boxSizing: "border-box",
                                }}
                            />
                        </div>
                        {/* Disease filter chips */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {([
                                ["all",          "Toutes"         ],
                                ["hypertension", "HTA"            ],
                                ["diabetes",     "Diabète"        ],
                                ["both",         "HTA + Diabète"  ],
                            ] as [DiseaseFilter, string][]).map(([k, l]) => (
                                <button key={k} onClick={() => setAlertDisease(k)} style={{
                                    padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 600,
                                    cursor: "pointer", border: "1.5px solid",
                                    borderColor: alertDisease === k ? C.primary : C.border,
                                    background:  alertDisease === k ? C.primary : C.white,
                                    color:       alertDisease === k ? C.white    : C.textMuted,
                                    transition: "all 0.15s",
                                }}>{l}</button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="dd-scroll" style={{ ...scrollAreaStyle }}>
                        {filteredAlerts.length === 0 && (
                            <p style={{ padding: 24, color: C.textMuted, fontSize: 13, textAlign: "center" }}>Aucune alerte trouvée</p>
                        )}
                        {filteredAlerts.map(alert => (
                            <div key={alert.id} style={{
                                padding: "12px 16px", borderBottom: `1px solid ${C.border}`,
                                background: !alert.isRead ? "hsl(0,72%,98%)" : "transparent",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                      padding: "2px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 600,
                      background: alert.severity === "critical" ? "hsl(0,72%,94%)" : "hsl(30,90%,92%)",
                      color:      alert.severity === "critical" ? "hsl(0,72%,35%)" : "hsl(30,90%,30%)",
                  }}>
                    {alert.severity === "critical" ? "Critique" : "Attention"}
                  </span>
                                    <span style={{ fontSize: 11, color: C.textMuted }}>{formatRelativeTime(alert.createdAt)}</span>
                                    {!alert.isRead && <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.red, flexShrink: 0 }} />}
                                </div>
                                <p style={{ fontSize: 12, fontWeight: 600, color: C.textMain, margin: "0 0 2px" }}>{alert.patientName}</p>
                                <p style={{ fontSize: 11, color: C.textMuted, margin: 0, lineHeight: 1.4 }}>{alert.message}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── PATIENTS ── */}
                <div style={{ ...card, padding: 0, animation: "fadeUp 0.4s ease both 0.35s", display: "flex", flexDirection: "column" }}>

                    {/* Header */}
                    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, color: C.textMain, display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                            <span style={{ color: C.primary }}><IUsers /></span>
                            Patients suivis
                        </h3>
                        <button onClick={() => navigate("/patients")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: C.primary, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                            Voir tout <IArrow />
                        </button>
                    </div>

                    {/* Patient search */}
                    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                        <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textMuted, display: "flex", alignItems: "center" }}>
                <ISearch />
              </span>
                            <input
                                type="text"
                                placeholder="Rechercher un patient..."
                                value={patientSearch}
                                onChange={e => setPatientSearch(e.target.value)}
                                style={{
                                    width: "100%", padding: "7px 10px 7px 30px",
                                    fontSize: 12, border: `1px solid ${C.border}`, borderRadius: 8,
                                    background: C.muted, color: C.textMain, outline: "none", boxSizing: "border-box",
                                }}
                            />
                        </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="dd-scroll" style={{ ...scrollAreaStyle }}>
                        {filteredPatients.length === 0 && (
                            <p style={{ padding: 24, color: C.textMuted, fontSize: 13, textAlign: "center" }}>Aucun patient trouvé</p>
                        )}
                        {filteredPatients.map(p => (
                            <div key={p.patientId} style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "12px 20px", borderBottom: `1px solid ${C.border}`,
                            }}
                                 onMouseEnter={e => (e.currentTarget.style.background = C.muted)}
                                 onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                                {/* Avatar + info */}
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                                        background: "hsl(207,55%,92%)", color: C.primary,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 12, fontWeight: 700,
                                    }}>
                                        {p.patientName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: C.textMain, margin: "0 0 4px" }}>{p.patientName}</p>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ fontSize: 12, color: C.textMuted }}>{AGE_MAP[p.patientId] ?? "—"} ans</span>
                                            <TypeBadge type={p.patientType} />
                                        </div>
                                    </div>
                                </div>
                                {/* Right */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <ComplianceBadge status={p.status} />
                                    <Link to={`/patients/${p.patientId}/follow-up`} style={{ fontSize: 12, color: C.primary, fontWeight: 600, textDecoration: "none" }}>
                                        Suivi
                                    </Link>
                                    <button onClick={() => { setMsgPatient(p.patientId); setMsgText(""); }} style={{
                                        background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 4, lineHeight: 1, display: "flex", alignItems: "center", transition: "color 0.15s",
                                    }}
                                            onMouseEnter={e => (e.currentTarget.style.color = C.primary)}
                                            onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
                                            title="Envoyer un message"
                                    >
                                        <ISend />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── QUICK ACTIONS ──────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                    { icon: <IUsers />, title: "Demandes de patients",  desc: "Validez ou rejetez les nouvelles demandes de suivi.",              link: "/patient-requests" },
                    { icon: <ISteth />, title: "Nouvelle consultation", desc: "Créez une nouvelle consultation et remplissez la fiche médecin.",  link: "/patients"         },
                    { icon: <IActiv />, title: "Suivi des patients",    desc: "Consultez les mesures quotidiennes et les prises de médicaments.", link: "/patients"         },
                ].map((a, i) => (
                    <button key={a.title} onClick={() => navigate(a.link)} style={{
                        ...card, padding: 20, textAlign: "left", cursor: "pointer", width: "100%",
                        display: "flex", flexDirection: "column",
                        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                        animation: `fadeUp 0.4s ease both ${0.4 + i * 0.05}s`,
                    }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 8px 24px rgba(42,107,143,0.14)"; el.style.borderColor = C.primary; }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; el.style.borderColor = C.border; }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: "hsl(207,55%,92%)", color: C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {a.icon}
                            </div>
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: C.textMain, margin: 0 }}>{a.title}</h3>
                        </div>
                        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16, lineHeight: 1.55, flex: 1 }}>{a.desc}</p>
                        <span style={{ fontSize: 13, color: C.primary, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
              Accéder <IArrow />
            </span>
                    </button>
                ))}
            </div>

            {/* ── SEND MESSAGE MODAL ─────────────────────────── */}
            {msgPatient && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setMsgPatient(null)}>
                    <div style={{ background: C.white, borderRadius: 16, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", animation: "zoomIn 0.2s ease" }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: C.textMain, marginBottom: 4 }}>Envoyer une notification</h3>
                        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 18 }}>
                            À : <strong>{MOCK_COMPLIANCE.find(p => p.patientId === msgPatient)?.patientName}</strong>
                        </p>
                        <textarea value={msgText} onChange={e => setMsgText(e.target.value)} rows={4} placeholder="Votre message au patient..."
                                  style={{ width: "100%", padding: "10px 14px", fontSize: 13, background: C.muted, border: `1px solid ${C.border}`, borderRadius: 10, outline: "none", resize: "vertical", color: C.textMain, boxSizing: "border-box", minHeight: 100 }}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                            <button onClick={() => setMsgPatient(null)} style={{ padding: "8px 16px", fontSize: 13, background: "none", border: "none", cursor: "pointer", color: C.textMuted }}>Annuler</button>
                            <button onClick={handleSend} disabled={!msgText.trim() || sendMsg.isPending} style={{ padding: "8px 20px", background: C.primary, color: C.white, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, opacity: (!msgText.trim() || sendMsg.isPending) ? 0.5 : 1 }}>
                                <ISend /> Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Keyframes + custom scrollbar */}
            <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes zoomIn { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }

        /* Scrollbar styling — visible, thin, colored */
        .dd-scroll::-webkit-scrollbar { width: 6px; }
        .dd-scroll::-webkit-scrollbar-track { background: hsl(214,32%,96%); border-radius: 3px; }
        .dd-scroll::-webkit-scrollbar-thumb { background: hsl(207,35%,72%); border-radius: 3px; }
        .dd-scroll::-webkit-scrollbar-thumb:hover { background: hsl(207,55%,50%); }
      `}</style>
        </div>
    );
};

export default DoctorDashboardPage;