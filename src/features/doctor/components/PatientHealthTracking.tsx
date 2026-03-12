import { useState } from "react";
import {
  Heart, Activity, Thermometer, Weight, Droplets, Wind, Plus, Bell,
  TrendingUp, TrendingDown, Minus, Clock, AlertTriangle, X, BarChart2, History, Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

/* ─── Local types ─── */
interface MesureSante {
  id: string;
  type: string;
  valeur: string;
  valeur2?: string;
  unite: string;
  date: string;
  heure: string;
  commentaire?: string;
}

interface RappelProfil { type: string; heure: string; }

interface ProfilSuivi {
  id: string;
  nom: string;
  actif: boolean;
  mesures: string[];
  rappels: RappelProfil[];
}

/* ─── Local mock data ─── */
const MESURES_INIT: MesureSante[] = [
  { id: "m1",  type: "tension",             valeur: "135", valeur2: "85",  unite: "mmHg", date: "05/03", heure: "07:30", commentaire: "Après repos" },
  { id: "m2",  type: "tension",             valeur: "128", valeur2: "82",  unite: "mmHg", date: "04/03", heure: "08:00" },
  { id: "m3",  type: "tension",             valeur: "140", valeur2: "90",  unite: "mmHg", date: "03/03", heure: "07:45", commentaire: "Stress" },
  { id: "m4",  type: "tension",             valeur: "132", valeur2: "84",  unite: "mmHg", date: "02/03", heure: "07:30" },
  { id: "m5",  type: "tension",             valeur: "127", valeur2: "80",  unite: "mmHg", date: "01/03", heure: "08:10" },
  { id: "m6",  type: "tension",             valeur: "138", valeur2: "88",  unite: "mmHg", date: "28/02", heure: "07:20" },
  { id: "m7",  type: "tension",             valeur: "130", valeur2: "83",  unite: "mmHg", date: "27/02", heure: "07:55" },
  { id: "m8",  type: "glycemie",            valeur: "0.95", unite: "g/L",  date: "05/03", heure: "07:00", commentaire: "À jeun" },
  { id: "m9",  type: "glycemie",            valeur: "1.45", unite: "g/L",  date: "04/03", heure: "13:30", commentaire: "Post-prandial" },
  { id: "m10", type: "glycemie",            valeur: "0.92", unite: "g/L",  date: "03/03", heure: "07:10" },
  { id: "m11", type: "poids",               valeur: "72.5", unite: "kg",   date: "05/03", heure: "08:00" },
  { id: "m12", type: "poids",               valeur: "72.8", unite: "kg",   date: "01/03", heure: "08:00" },
  { id: "m13", type: "poids",               valeur: "73.1", unite: "kg",   date: "22/02", heure: "08:00" },
  { id: "m14", type: "poids",               valeur: "73.4", unite: "kg",   date: "15/02", heure: "08:00" },
  { id: "m15", type: "temperature",         valeur: "37.2", unite: "°C",   date: "05/03", heure: "09:00" },
  { id: "m16", type: "temperature",         valeur: "37.8", unite: "°C",   date: "03/03", heure: "18:30", commentaire: "Légère fièvre" },
  { id: "m17", type: "frequence_cardiaque", valeur: "72",   unite: "bpm",  date: "05/03", heure: "07:30" },
  { id: "m18", type: "frequence_cardiaque", valeur: "78",   unite: "bpm",  date: "04/03", heure: "07:45" },
  { id: "m19", type: "frequence_cardiaque", valeur: "68",   unite: "bpm",  date: "03/03", heure: "07:30", commentaire: "Après sport" },
  { id: "m20", type: "frequence_cardiaque", valeur: "75",   unite: "bpm",  date: "02/03", heure: "07:30" },
  { id: "m21", type: "saturation",          valeur: "98",   unite: "%",    date: "05/03", heure: "07:30" },
  { id: "m22", type: "saturation",          valeur: "97",   unite: "%",    date: "03/03", heure: "09:00" },
];

const PROFILS_INIT: ProfilSuivi[] = [
  {
    id: "prof_1", nom: "Suivi Hypertension", actif: true,
    mesures: ["tension", "frequence_cardiaque"],
    rappels: [{ type: "tension", heure: "07:30" }, { type: "tension", heure: "20:00" }],
  },
  {
    id: "prof_2", nom: "Suivi Diabète", actif: false,
    mesures: ["glycemie", "poids"],
    rappels: [{ type: "glycemie", heure: "07:00" }, { type: "glycemie", heure: "13:00" }, { type: "glycemie", heure: "19:00" }],
  },
  {
    id: "prof_3", nom: "Suivi Post-opératoire", actif: false,
    mesures: ["temperature", "saturation", "frequence_cardiaque"],
    rappels: [{ type: "temperature", heure: "08:00" }, { type: "temperature", heure: "20:00" }, { type: "saturation", heure: "12:00" }],
  },
];

/* ─── Types ─── */
type MesureType = "tension" | "glycemie" | "poids" | "temperature" | "frequence_cardiaque" | "saturation" | "effets_secondaires";
type TabKey = "graphiques" | "historique" | "profils";

/* ─── Measure config ─── */
const MESURE_CFG: Record<MesureType, { label: string; icon: React.ReactNode; color: string; bg: string; textColor: string }> = {
  tension:              { label: "Tension artérielle",  icon: <Heart size={18} />,         color: "#ef4444", bg: "#fef2f2", textColor: "#dc2626" },
  glycemie:             { label: "Glycémie",            icon: <Droplets size={18} />,      color: "#163344", bg: "#eff6ff", textColor: "#163344" },
  poids:                { label: "Poids",               icon: <Weight size={18} />,        color: "#10b981", bg: "#ecfdf5", textColor: "#059669" },
  temperature:          { label: "Température",         icon: <Thermometer size={18} />,   color: "#f59e0b", bg: "#fffbeb", textColor: "#d97706" },
  frequence_cardiaque:  { label: "Fréquence cardiaque", icon: <Activity size={18} />,      color: "#ef4444", bg: "#fef2f2", textColor: "#dc2626" },
  saturation:           { label: "Saturation O₂",       icon: <Wind size={18} />,          color: "#163344", bg: "#eff6ff", textColor: "#163344" },
  effets_secondaires:   { label: "Effets secondaires",  icon: <AlertTriangle size={18} />, color: "#f59e0b", bg: "#fffbeb", textColor: "#d97706" },
};

/* ─── Shared styles ─── */
const card: React.CSSProperties = {
  backgroundColor: "white", borderRadius: "1rem",
  border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.5625rem 0.875rem",
  border: "1px solid #e2e8f0", borderRadius: "0.625rem",
  fontSize: "0.875rem", background: "#f8fafc", color: "#374151",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {label}
    </label>
    {children}
  </div>
);

/* ─── Dynamic form fields per measure type ─── */
const MesureFormFields = ({
  type, form, setForm,
}: {
  type: MesureType;
  form: Record<string, string>;
  setForm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) => {
  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const dateHeure = (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
      <FormField label="Date">
        <input type="date" value={form.date || ""} onChange={(e) => set("date", e.target.value)} style={inputStyle} />
      </FormField>
      <FormField label="Heure">
        <input type="time" value={form.heure || ""} onChange={(e) => set("heure", e.target.value)} style={inputStyle} />
      </FormField>
    </div>
  );

  const commentaire = (
    <FormField label="Commentaire (optionnel)">
      <textarea value={form.commentaire || ""} onChange={(e) => set("commentaire", e.target.value)}
        placeholder="Ex: après repos, à jeun..." rows={2} style={{ ...inputStyle, resize: "vertical" }} />
    </FormField>
  );

  if (type === "tension") return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <FormField label="Systolique (mmHg)">
          <input type="number" placeholder="130" value={form.systolique || ""} onChange={(e) => set("systolique", e.target.value)} style={inputStyle} />
        </FormField>
        <FormField label="Diastolique (mmHg)">
          <input type="number" placeholder="80" value={form.diastolique || ""} onChange={(e) => set("diastolique", e.target.value)} style={inputStyle} />
        </FormField>
      </div>
      {dateHeure}{commentaire}
    </>
  );

  if (type === "glycemie") return (
    <>
      <FormField label="Glycémie (g/L)">
        <input type="number" step="0.01" placeholder="0.90" value={form.valeur || ""} onChange={(e) => set("valeur", e.target.value)} style={inputStyle} />
      </FormField>
      {dateHeure}
      <FormField label="Contexte">
        <select value={form.contexte || ""} onChange={(e) => set("contexte", e.target.value)} style={inputStyle}>
          <option value="">Sélectionner...</option>
          <option value="a_jeun">À jeun</option>
          <option value="post_prandial">Post-prandial</option>
        </select>
      </FormField>
      {commentaire}
    </>
  );

  if (type === "saturation") return (
    <>
      <FormField label="Saturation (%)">
        <input type="number" min="80" max="100" placeholder="98" value={form.valeur || ""} onChange={(e) => set("valeur", e.target.value)} style={inputStyle} />
      </FormField>
      {dateHeure}{commentaire}
    </>
  );

  if (type === "frequence_cardiaque") return (
    <>
      <FormField label="Fréquence cardiaque (BPM)">
        <input type="number" placeholder="72" value={form.valeur || ""} onChange={(e) => set("valeur", e.target.value)} style={inputStyle} />
      </FormField>
      {dateHeure}{commentaire}
    </>
  );

  if (type === "temperature") return (
    <>
      <FormField label="Température (°C)">
        <input type="number" step="0.1" placeholder="37.5" value={form.valeur || ""} onChange={(e) => set("valeur", e.target.value)} style={inputStyle} />
      </FormField>
      {dateHeure}{commentaire}
    </>
  );

  if (type === "poids") return (
    <>
      <FormField label="Poids (kg)">
        <input type="number" step="0.1" placeholder="70.0" value={form.valeur || ""} onChange={(e) => set("valeur", e.target.value)} style={inputStyle} />
      </FormField>
      {dateHeure}{commentaire}
    </>
  );

  if (type === "effets_secondaires") return (
    <>
      <FormField label="Symptôme">
        <input type="text" placeholder="Ex: nausées, vertiges..." value={form.symptome || ""} onChange={(e) => set("symptome", e.target.value)} style={inputStyle} />
      </FormField>
      <FormField label="Intensité">
        <select value={form.intensite || ""} onChange={(e) => set("intensite", e.target.value)} style={inputStyle}>
          <option value="">Sélectionner...</option>
          <option value="legere">Légère</option>
          <option value="moderee">Modérée</option>
          <option value="severe">Sévère</option>
        </select>
      </FormField>
      <FormField label="Date">
        <input type="date" value={form.date || ""} onChange={(e) => set("date", e.target.value)} style={inputStyle} />
      </FormField>
      {commentaire}
    </>
  );

  return null;
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const PatientHealthTracking = () => {
  const [mesuresSante, setMesuresSante] = useState<MesureSante[]>(MESURES_INIT);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType]           = useState<MesureType>("tension");
  const [addForm, setAddForm]           = useState<Record<string, string>>({ date: "2026-03-12", heure: "07:30" });
  const [selectedType, setSelectedType] = useState<MesureType>("tension");
  const [profils, setProfils]           = useState<ProfilSuivi[]>(PROFILS_INIT);
  const [activeTab, setActiveTab]       = useState<TabKey>("graphiques");
  const [hoveredType, setHoveredType]   = useState<string | null>(null);

  /* ── Latest by type ── */
  const latestByType: Record<string, MesureSante> = {};
  mesuresSante.forEach((m) => {
    if (!latestByType[m.type] || m.date > latestByType[m.type].date) latestByType[m.type] = m;
  });
  const activeMesureTypes = [...new Set(mesuresSante.map((m) => m.type))] as MesureType[];

  const getTrend = (type: string) => {
    const vals = mesuresSante.filter((m) => m.type === type).slice(0, 3).map((m) => parseFloat(m.valeur));
    if (vals.length < 2) return "stable";
    return vals[0] > vals[1] ? "up" : vals[0] < vals[1] ? "down" : "stable";
  };

  /* ── Chart data ── */
  const tensionData = mesuresSante.filter((m) => m.type === "tension").slice().reverse()
    .map((m) => ({ date: m.date, systolique: parseInt(m.valeur), diastolique: parseInt(m.valeur2 || "0") }));
  const poidsData = mesuresSante.filter((m) => m.type === "poids").slice().reverse()
    .map((m) => ({ date: m.date, poids: parseFloat(m.valeur) }));
  const fcData = mesuresSante.filter((m) => m.type === "frequence_cardiaque").slice().reverse()
    .map((m) => ({ date: m.date, fc: parseInt(m.valeur) }));

  const toggleProfil = (id: string) =>
    setProfils((prev) => prev.map((p) => p.id === id ? { ...p, actif: !p.actif } : p));

  /* ── Save new measure ── */
  const handleSaveMesure = () => {
    const id    = `m_${Date.now()}`;
    const raw   = addForm.date || "2026-03-12";
    const parts = raw.split("-");
    const date  = parts.length === 3 ? `${parts[2]}/${parts[1]}` : raw;
    const heure = addForm.heure || "00:00";

    let newMesure: MesureSante | null = null;

    if (addType === "tension" && addForm.systolique) {
      newMesure = { id, type: "tension", valeur: addForm.systolique, valeur2: addForm.diastolique || "0", unite: "mmHg", date, heure, commentaire: addForm.commentaire };
    } else if (addType === "glycemie" && addForm.valeur) {
      newMesure = { id, type: "glycemie", valeur: addForm.valeur, unite: "g/L", date, heure, commentaire: addForm.commentaire || addForm.contexte };
    } else if (addType === "poids" && addForm.valeur) {
      newMesure = { id, type: "poids", valeur: addForm.valeur, unite: "kg", date, heure, commentaire: addForm.commentaire };
    } else if (addType === "temperature" && addForm.valeur) {
      newMesure = { id, type: "temperature", valeur: addForm.valeur, unite: "°C", date, heure, commentaire: addForm.commentaire };
    } else if (addType === "frequence_cardiaque" && addForm.valeur) {
      newMesure = { id, type: "frequence_cardiaque", valeur: addForm.valeur, unite: "bpm", date, heure, commentaire: addForm.commentaire };
    } else if (addType === "saturation" && addForm.valeur) {
      newMesure = { id, type: "saturation", valeur: addForm.valeur, unite: "%", date, heure, commentaire: addForm.commentaire };
    } else if (addType === "effets_secondaires" && addForm.symptome) {
      newMesure = { id, type: "effets_secondaires", valeur: addForm.symptome, unite: addForm.intensite || "", date, heure, commentaire: addForm.commentaire };
    }

    if (newMesure) {
      setMesuresSante((prev) => [newMesure!, ...prev]);
      setAddForm({ date: "2026-03-12", heure: "07:30" });
      setShowAddModal(false);
    }
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "graphiques", label: "Graphiques",      icon: <BarChart2 size={15} /> },
    { key: "historique", label: "Historique",       icon: <History size={15} /> },
    { key: "profils",    label: "Profils de suivi", icon: <Users size={15} /> },
  ];

  const chartTooltipStyle = {
    contentStyle: { borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  };

  /* ════════════════ RENDER ════════════════ */
  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* ─── Hero Banner ─── */}
      <div style={{
        background: "linear-gradient(135deg, #163344 0%, #1e4060 60%, #163344 100%)",
        borderRadius: "1rem", padding: "2rem", color: "white",
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
      }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: "0.75rem", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={20} color="white" />
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>Suivi de santé</div>
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
            Suivez vos constantes et gérez vos profils de surveillance
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.625rem", position: "relative", zIndex: 1 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0.625rem 1.125rem", borderRadius: "0.75rem",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            color: "white", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
          }}>
            <Bell size={15} /> Rappels
          </button>
          <button onClick={() => { setAddForm({ date: "2026-03-12", heure: "07:30" }); setShowAddModal(true); }} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0.625rem 1.125rem", borderRadius: "0.75rem",
            background: "#10b981", border: "none",
            color: "white", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(16,185,129,0.4)",
          }}>
            <Plus size={15} /> Ajouter une mesure
          </button>
        </div>
      </div>

      {/* ─── Summary cards ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.875rem" }}>
        {activeMesureTypes.filter((t) => t !== "effets_secondaires").map((type) => {
          const cfg    = MESURE_CFG[type];
          const latest = latestByType[type];
          const trend  = getTrend(type);
          if (!cfg || !latest) return null;
          const isHov  = hoveredType === type;
          return (
            <motion.div key={type}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => { setSelectedType(type); setActiveTab("historique"); }}
              onMouseEnter={() => setHoveredType(type)}
              onMouseLeave={() => setHoveredType(null)}
              style={{
                ...card, padding: "1rem", textAlign: "center", cursor: "pointer",
                border: `1.5px solid ${isHov ? cfg.color : "#e2e8f0"}`,
                boxShadow: isHov ? `0 4px 16px ${cfg.color}22` : "0 1px 3px rgba(0,0,0,0.06)",
                transition: "all 0.15s",
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: "0.75rem",
                background: cfg.bg, color: cfg.textColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 0.625rem",
              }}>{cfg.icon}</div>
              <div style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>{cfg.label}</div>
              <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1f2937", lineHeight: 1.1 }}>
                {type === "tension" ? `${latest.valeur}/${latest.valeur2}` : latest.valeur}
                <span style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 400, marginLeft: 3 }}>{latest.unite}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 6 }}>
                {trend === "up"     && <TrendingUp   size={12} color="#f59e0b" />}
                {trend === "down"   && <TrendingDown size={12} color="#10b981" />}
                {trend === "stable" && <Minus        size={12} color="#94a3b8" />}
                <span style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>{latest.date}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Tabs ─── */}
      <div style={card}>
        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", padding: "0 1.5rem", gap: "0.25rem" }}>
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "0.875rem 1rem", fontSize: "0.875rem", fontWeight: 600,
              background: "none", border: "none", cursor: "pointer",
              color: activeTab === t.key ? "#163344" : "#94a3b8",
              borderBottom: `2px solid ${activeTab === t.key ? "#163344" : "transparent"}`,
              marginBottom: -1, transition: "all 0.15s",
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "1.5rem" }}>
          <AnimatePresence mode="wait">

            {/* ══ GRAPHIQUES ══ */}
            {activeTab === "graphiques" && (
              <motion.div key="graph"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", fontWeight: 700, color: "#1f2937" }}>
                    <Heart size={16} color="#ef4444" /> Tension artérielle
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={tensionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#cbd5e1" />
                      <YAxis domain={[60, 160]} tick={{ fontSize: 12 }} stroke="#cbd5e1" />
                      <Tooltip {...chartTooltipStyle} />
                      <Legend />
                      <Line type="monotone" dataKey="systolique"  stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Systolique" />
                      <Line type="monotone" dataKey="diastolique" stroke="#163344" strokeWidth={2} dot={{ r: 4 }} name="Diastolique" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {poidsData.length > 0 && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", fontWeight: 700, color: "#1f2937" }}>
                      <Weight size={16} color="#10b981" /> Poids
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={poidsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#cbd5e1" />
                        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} stroke="#cbd5e1" />
                        <Tooltip {...chartTooltipStyle} />
                        <Line type="monotone" dataKey="poids" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Poids (kg)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {fcData.length > 0 && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", fontWeight: 700, color: "#1f2937" }}>
                      <Activity size={16} color="#ef4444" /> Fréquence cardiaque
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={fcData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#cbd5e1" />
                        <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} stroke="#cbd5e1" />
                        <Tooltip {...chartTooltipStyle} />
                        <Line type="monotone" dataKey="fc" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="FC (bpm)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>
            )}

            {/* ══ HISTORIQUE ══ */}
            {activeTab === "historique" && (
              <motion.div key="history"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              >
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                  {(Object.entries(MESURE_CFG) as [MesureType, typeof MESURE_CFG[MesureType]][]).map(([key, cfg]) => {
                    const isActive = selectedType === key;
                    return (
                      <button key={key} onClick={() => setSelectedType(key)} style={{
                        padding: "4px 14px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600,
                        border: `1.5px solid ${isActive ? cfg.color : "#e2e8f0"}`,
                        background: isActive ? cfg.bg : "white",
                        color: isActive ? cfg.textColor : "#94a3b8",
                        cursor: "pointer", transition: "all 0.15s",
                      }}>
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {mesuresSante.filter((m) => m.type === selectedType).map((m, i) => {
                    const cfg = MESURE_CFG[m.type as MesureType];
                    return (
                      <motion.div key={m.id}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "1rem 1.25rem", borderRadius: "0.875rem",
                          border: "1px solid #e2e8f0", background: "white",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: "0.75rem", flexShrink: 0,
                            background: cfg.bg, color: cfg.textColor,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>{cfg.icon}</div>
                          <div>
                            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1f2937" }}>
                              {m.type === "tension" ? `${m.valeur}/${m.valeur2} ${m.unite}` : `${m.valeur} ${m.unite}`}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#94a3b8", marginTop: 2 }}>
                              <Clock size={11} /> {m.date} à {m.heure}
                            </div>
                          </div>
                        </div>
                        {m.commentaire && (
                          <span style={{
                            padding: "3px 10px", borderRadius: "9999px",
                            background: "#f1f5f9", color: "#64748b", fontSize: "0.75rem", fontWeight: 500,
                          }}>{m.commentaire}</span>
                        )}
                      </motion.div>
                    );
                  })}
                  {mesuresSante.filter((m) => m.type === selectedType).length === 0 && (
                    <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                      <Activity size={36} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
                      <div style={{ fontSize: "0.875rem" }}>Aucune mesure enregistrée pour ce type</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ══ PROFILS ══ */}
            {activeTab === "profils" && (
              <motion.div key="profils"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "0 0 4px" }}>
                  Activez un profil de suivi pour recevoir des rappels automatiques adaptés à votre pathologie.
                </p>
                {profils.map((p) => (
                  <div key={p.id} style={{
                    padding: "1.25rem", borderRadius: "0.875rem",
                    border: `1.5px solid ${p.actif ? "#10b981" : "#e2e8f0"}`,
                    background: p.actif ? "#f0fdf4" : "white", transition: "all 0.2s",
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem",
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1f2937", marginBottom: 4 }}>{p.nom}</div>
                      <div style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: 10 }}>
                        Mesures : {p.mesures.map((m) => MESURE_CFG[m as MesureType]?.label || m).join(", ")}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                        {p.rappels.map((r, i) => (
                          <span key={i} style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "3px 10px", borderRadius: "9999px",
                            background: p.actif ? "#dcfce7" : "#f1f5f9",
                            color: p.actif ? "#166534" : "#64748b",
                            fontSize: "0.6875rem", fontWeight: 600,
                          }}>
                            <Bell size={10} /> {MESURE_CFG[r.type as MesureType]?.label || r.type} — {r.heure}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Custom toggle */}
                    <div onClick={() => toggleProfil(p.id)} style={{
                      width: 44, height: 24, borderRadius: "9999px", flexShrink: 0,
                      background: p.actif ? "#10b981" : "#d1d5db",
                      position: "relative", cursor: "pointer", transition: "background 0.2s",
                    }}>
                      <div style={{
                        position: "absolute", top: 3,
                        left: p.actif ? "calc(100% - 21px)" : 3,
                        width: 18, height: 18, borderRadius: "50%",
                        background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        transition: "left 0.2s",
                      }} />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Add Measure Modal ─── */}
      {showAddModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        }} onClick={() => setShowAddModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white", borderRadius: "1rem", width: "100%", maxWidth: 500,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto",
            }}
          >
            {/* Sticky header */}
            <div style={{
              padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              position: "sticky", top: 0, background: "white", zIndex: 1,
            }}>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1f2937" }}>Ajouter une mesure</div>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Type selector grid */}
              <FormField label="Type de mesure">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {(Object.entries(MESURE_CFG) as [MesureType, typeof MESURE_CFG[MesureType]][]).map(([key, cfg]) => {
                    const isActive = addType === key;
                    return (
                      <button key={key} onClick={() => { setAddType(key); setAddForm({ date: "2026-03-12", heure: "07:30" }); }} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "0.625rem 0.875rem", borderRadius: "0.625rem",
                        border: `1.5px solid ${isActive ? cfg.color : "#e2e8f0"}`,
                        background: isActive ? cfg.bg : "white",
                        color: isActive ? cfg.textColor : "#64748b",
                        fontSize: "0.8125rem", fontWeight: isActive ? 700 : 500,
                        cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                      }}>
                        <span style={{ flexShrink: 0, color: isActive ? cfg.textColor : "#94a3b8" }}>{cfg.icon}</span>
                        <span style={{ fontSize: "0.75rem", lineHeight: 1.2 }}>{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </FormField>

              {/* Dynamic fields with animation */}
              <AnimatePresence mode="wait">
                <motion.div key={addType}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.12 }}
                  style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
                >
                  <MesureFormFields type={addType} form={addForm} setForm={setAddForm} />
                </motion.div>
              </AnimatePresence>

              <button onClick={handleSaveMesure} style={{
                width: "100%", padding: "0.75rem", borderRadius: "0.75rem", border: "none",
                background: "#163344", color: "white", fontSize: "0.9375rem", fontWeight: 700,
                cursor: "pointer", marginTop: 4,
              }}>
                Enregistrer la mesure
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PatientHealthTracking;