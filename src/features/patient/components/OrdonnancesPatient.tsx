import { useState } from "react";
import { CONSULTATIONS, HOSPITALISATIONS } from "@shared/data/mock-data";
import {
  Pill, Eye, ArrowLeft, Calendar, User, Stethoscope, Building2, ShoppingCart,
  CheckCircle, Clock, AlertCircle, Package, Search, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─── */
type PurchaseStatus = "Non achetés" | "Partiellement achetés" | "Tous achetés";

interface MedicamentWithPurchase {
  nom: string;
  dosage: string;
  forme: string;
  posologie: string;
  duree: string;
  instructions: string;
  achete: boolean;
}

interface PrescriptionData {
  id: string;
  medecin: string;
  date: string;
  contexte: "Consultation" | "Hospitalisation";
  contextId: string;
  medicaments: MedicamentWithPurchase[];
}

/* ─── Mock data ─── */
const mockPrescriptions: PrescriptionData[] = [
  {
    id: "ORD001", medecin: "Dr. Martin Dupont", date: "05/03/2026", contexte: "Consultation", contextId: "C001",
    medicaments: [
      { nom: "Oméprazole", dosage: "20mg", forme: "Gélule", posologie: "1 gélule le matin à jeun", duree: "28 jours", instructions: "À prendre 30 min avant le petit-déjeuner", achete: true },
      { nom: "Gaviscon", dosage: "500mg", forme: "Sachet", posologie: "1 sachet après les 3 repas", duree: "14 jours", instructions: "Bien agiter avant utilisation", achete: false },
    ]
  },
  {
    id: "ORD002", medecin: "Dr. Sophie Laurent", date: "15/01/2026", contexte: "Consultation", contextId: "C002",
    medicaments: [
      { nom: "Amlodipine", dosage: "5mg", forme: "Comprimé", posologie: "1 comprimé le matin", duree: "6 mois", instructions: "Ne pas interrompre sans avis médical", achete: true },
    ]
  },
  {
    id: "ORD003", medecin: "Dr. Martin Dupont", date: "20/09/2025", contexte: "Consultation", contextId: "C003",
    medicaments: [
      { nom: "Paracétamol", dosage: "1g", forme: "Comprimé", posologie: "1 comprimé toutes les 6h si fièvre", duree: "5 jours", instructions: "Ne pas dépasser 4g par jour", achete: true },
      { nom: "Carbocistéine", dosage: "750mg", forme: "Sirop", posologie: "1 cuillère à soupe 3x/jour", duree: "7 jours", instructions: "À prendre après les repas", achete: true },
    ]
  },
  {
    id: "ORD004", medecin: "Dr. Jean Moreau", date: "16/06/2025", contexte: "Hospitalisation", contextId: "H001",
    medicaments: [
      { nom: "Paracétamol", dosage: "1g", forme: "Comprimé", posologie: "1 comprimé toutes les 6h", duree: "5 jours", instructions: "Si douleur", achete: false },
      { nom: "Pantoprazole", dosage: "40mg", forme: "Comprimé", posologie: "1 comprimé le matin", duree: "14 jours", instructions: "À jeun", achete: false },
    ]
  },
];

/* ─── Helpers ─── */
const getPurchaseStatus = (meds: MedicamentWithPurchase[]): PurchaseStatus => {
  const bought = meds.filter((m) => m.achete).length;
  if (bought === 0) return "Non achetés";
  if (bought === meds.length) return "Tous achetés";
  return "Partiellement achetés";
};

const STATUS_CFG: Record<PurchaseStatus, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  "Non achetés":           { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: <AlertCircle size={11} /> },
  "Partiellement achetés": { color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", icon: <Clock size={11} /> },
  "Tous achetés":          { color: "#10b981", bg: "#ecfdf5", border: "#6ee7b7", icon: <CheckCircle size={11} /> },
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

/* ─── StatusBadge ─── */
const StatusBadge = ({ status }: { status: PurchaseStatus }) => {
  const cfg = STATUS_CFG[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, flexShrink: 0,
    }}>
      {cfg.icon} {status}
    </span>
  );
};

/* ─── Progress bar ─── */
const ProgressBar = ({ bought, total }: { bought: number; total: number }) => (
  <div style={{ width: "100%", background: "#e2e8f0", borderRadius: "9999px", height: 6 }}>
    <div style={{
      height: 6, borderRadius: "9999px", background: "#10b981",
      width: `${(bought / total) * 100}%`, transition: "width 0.3s",
    }} />
  </div>
);

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const OrdonnancesPatient = () => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>(mockPrescriptions);
  const [selected, setSelected]           = useState<PrescriptionData | null>(null);
  const [filterStatus, setFilterStatus]   = useState("all");
  const [searchQuery, setSearchQuery]     = useState("");
  const [hoveredId, setHoveredId]         = useState<string | null>(null);

  const filtered = prescriptions.filter((p) => {
    const status = getPurchaseStatus(p.medicaments);
    const matchStatus = filterStatus === "all" || status === filterStatus;
    const matchSearch =
      p.medecin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.medicaments.some((m) => m.nom.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const toggleMedPurchase = (prescId: string, medIndex: number) => {
    const update = (p: PrescriptionData) => {
      if (p.id !== prescId) return p;
      const meds = [...p.medicaments];
      meds[medIndex] = { ...meds[medIndex], achete: !meds[medIndex].achete };
      return { ...p, medicaments: meds };
    };
    setPrescriptions((prev) => prev.map(update));
    setSelected((prev) => (prev ? update(prev) : null));
  };

  const markAllPurchased = (prescId: string) => {
    const update = (p: PrescriptionData) =>
      p.id === prescId ? { ...p, medicaments: p.medicaments.map((m) => ({ ...m, achete: true })) } : p;
    setPrescriptions((prev) => prev.map(update));
    setSelected((prev) => (prev ? update(prev) : null));
  };

  const getContextLabel = (p: PrescriptionData) => {
    if (p.contexte === "Consultation") {
      const c = CONSULTATIONS.find((c) => c.id === p.contextId);
      return c ? `${c.motif} (${c.date})` : "Consultation";
    }
    const h = HOSPITALISATIONS.find((h) => h.id === p.contextId);
    return h ? `${h.motif} (${h.dateAdmission})` : "Hospitalisation";
  };

  const stats = [
    { label: "Total",            value: prescriptions.length,                                                                     color: "#163344", bg: "#f1f5f9" },
    { label: "Tous achetés",     value: prescriptions.filter((p) => getPurchaseStatus(p.medicaments) === "Tous achetés").length,  color: "#10b981", bg: "#ecfdf5" },
    { label: "Partiellement",    value: prescriptions.filter((p) => getPurchaseStatus(p.medicaments) === "Partiellement achetés").length, color: "#f59e0b", bg: "#fffbeb" },
    { label: "Non achetés",      value: prescriptions.filter((p) => getPurchaseStatus(p.medicaments) === "Non achetés").length,   color: "#ef4444", bg: "#fef2f2" },
  ];

  /* ════ DETAIL VIEW ════ */
  if (selected) {
    const status     = getPurchaseStatus(selected.medicaments);
    const boughtCount = selected.medicaments.filter((m) => m.achete).length;

    return (
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Back */}
        <button onClick={() => setSelected(null)} style={{
          display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem",
          fontWeight: 600, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: 0,
        }}>
          <ArrowLeft size={16} /> Retour aux ordonnances
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.5rem" }} className="presc-detail-grid">

          {/* ── Left column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Header card */}
            <div style={card}>
              <div style={{
                padding: "1.5rem",
                background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                borderBottom: "1px solid #e2e8f0",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "0.875rem", flexShrink: 0,
                    background: "#163344", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}>
                    <Pill size={24} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1f2937" }}>
                      Ordonnance du {selected.date}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: 3 }}>{selected.medecin}</div>
                  </div>
                </div>
                <StatusBadge status={status} />
              </div>
              <div style={{ padding: "1.25rem 1.5rem", display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
                {[
                  { icon: <Calendar size={14} color="#94a3b8" />, label: "Date",          value: selected.date },
                  { icon: <User size={14} color="#94a3b8" />,     label: "Médecin",       value: selected.medecin },
                  { icon: <Package size={14} color="#94a3b8" />,  label: "Médicaments",   value: `${boughtCount}/${selected.medicaments.length} achetés` },
                ].map((f) => (
                  <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ marginTop: 2 }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1f2937", marginTop: 2 }}>{f.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Context card */}
            <div style={card}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9", fontWeight: 700, fontSize: "0.9375rem", color: "#1f2937" }}>
                Contexte médical
              </div>
              <div style={{ padding: "1.25rem 1.5rem" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.875rem 1rem", background: "#f8fafc", borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: "0.5rem", flexShrink: 0, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {selected.contexte === "Consultation"
                      ? <Stethoscope size={16} color="#3b82f6" />
                      : <Building2 size={16} color="#3b82f6" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {getContextLabel(selected)}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{selected.contexte}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medications card */}
            <div style={card}>
              <div style={{
                padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#1f2937" }}>
                  Médicaments ({selected.medicaments.length})
                </div>
                {status !== "Tous achetés" && (
                  <button onClick={() => markAllPurchased(selected.id)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", borderRadius: "0.625rem",
                    border: "1px solid #e2e8f0", background: "white",
                    color: "#374151", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                  }}>
                    <ShoppingCart size={13} /> Tout marquer acheté
                  </button>
                )}
              </div>
              <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {selected.medicaments.map((med, i) => (
                  <div key={i} style={{
                    padding: "1rem 1.25rem", borderRadius: "0.875rem",
                    border: `1.5px solid ${med.achete ? "#6ee7b7" : "#e2e8f0"}`,
                    background: med.achete ? "#f0fdf4" : "white",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                      {/* Custom checkbox */}
                      <div
                        onClick={() => toggleMedPurchase(selected.id, i)}
                        style={{
                          width: 20, height: 20, borderRadius: "0.375rem", flexShrink: 0, marginTop: 2,
                          border: `2px solid ${med.achete ? "#10b981" : "#d1d5db"}`,
                          background: med.achete ? "#10b981" : "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        {med.achete && <CheckCircle size={12} color="white" />}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Name + badges */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: 8 }}>
                          <span style={{
                            fontSize: "0.9375rem", fontWeight: 700,
                            color: med.achete ? "#94a3b8" : "#1f2937",
                            textDecoration: med.achete ? "line-through" : "none",
                          }}>
                            {med.nom}
                          </span>
                          <span style={{ padding: "2px 8px", borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: 700, background: "#f1f5f9", color: "#475569" }}>
                            {med.dosage}
                          </span>
                          <span style={{ padding: "2px 8px", borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: 600, background: "white", color: "#64748b", border: "1px solid #e2e8f0" }}>
                            {med.forme}
                          </span>
                        </div>

                        {/* Details grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 1.5rem", marginBottom: 8 }}>
                          <div style={{ fontSize: "0.8125rem" }}>
                            <span style={{ color: "#94a3b8" }}>Posologie : </span>
                            <span style={{ color: "#374151", fontWeight: 500 }}>{med.posologie}</span>
                          </div>
                          <div style={{ fontSize: "0.8125rem" }}>
                            <span style={{ color: "#94a3b8" }}>Durée : </span>
                            <span style={{ color: "#374151", fontWeight: 500 }}>{med.duree}</span>
                          </div>
                        </div>

                        {/* Instructions */}
                        {med.instructions && (
                          <div style={{
                            display: "flex", alignItems: "flex-start", gap: 6,
                            fontSize: "0.75rem", color: "#64748b", fontStyle: "italic",
                            background: "#f8fafc", borderRadius: "0.5rem", padding: "6px 10px",
                          }}>
                            <AlertCircle size={12} style={{ flexShrink: 0, marginTop: 1, color: "#94a3b8" }} />
                            {med.instructions}
                          </div>
                        )}
                      </div>

                      {med.achete && <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={card}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9", fontWeight: 700, fontSize: "0.9375rem", color: "#1f2937" }}>
                Suivi des achats
              </div>
              <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "#64748b" }}>Achetés</span>
                  <span style={{ fontWeight: 800, color: "#10b981" }}>{boughtCount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "#64748b" }}>Restants</span>
                  <span style={{ fontWeight: 800, color: "#f59e0b" }}>{selected.medicaments.length - boughtCount}</span>
                </div>
                <ProgressBar bought={boughtCount} total={selected.medicaments.length} />
                <div style={{ textAlign: "center", fontSize: "0.75rem", color: "#94a3b8" }}>
                  {Math.round((boughtCount / selected.medicaments.length) * 100)}% complété
                </div>
              </div>
            </div>

            {/* Quick tip */}
            <div style={{
              ...card, padding: "1.25rem", background: "#163344", border: "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Pill size={16} color="#10b981" />
                <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "white" }}>Rappel</span>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                Cochez les médicaments au fur et à mesure de vos achats en pharmacie.
              </p>
            </div>
          </div>
        </div>

        <style>{`@media (max-width: 900px) { .presc-detail-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    );
  }

  /* ════ LIST VIEW ════ */
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
              <Pill size={20} color="white" />
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>Mes Ordonnances</div>
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
            Suivez vos prescriptions et gérez vos achats en pharmacie
          </div>
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ ...card, padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 46, height: 46, borderRadius: "0.75rem", flexShrink: 0,
              background: s.bg, color: s.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.25rem", fontWeight: 800,
            }}>{s.value}</div>
            <div style={{ fontSize: "0.8125rem", color: "#64748b", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─── Filters ─── */}
      <div style={{ ...card, padding: "1rem 1.5rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Search size={15} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par médecin ou médicament..."
              style={{ ...inputStyle, paddingLeft: "2.25rem" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={14} color="#94a3b8" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ ...inputStyle, width: "auto", paddingRight: "2rem" }}
            >
              <option value="all">Tous les statuts</option>
              <option value="Non achetés">Non achetés</option>
              <option value="Partiellement achetés">Partiellement achetés</option>
              <option value="Tous achetés">Tous achetés</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Prescription list ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <AnimatePresence>
          {filtered.map((presc, i) => {
            const status      = getPurchaseStatus(presc.medicaments);
            const boughtCount = presc.medicaments.filter((m) => m.achete).length;
            const isHov       = hoveredId === presc.id;

            return (
              <motion.div key={presc.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
              >
                <div
                  onClick={() => setSelected(presc)}
                  onMouseEnter={() => setHoveredId(presc.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    ...card,
                    cursor: "pointer", padding: "1.25rem",
                    border: `1.5px solid ${isHov ? "#163344" : "#e2e8f0"}`,
                    boxShadow: isHov ? "0 4px 16px rgba(22,51,68,0.1)" : "0 1px 3px rgba(0,0,0,0.04)",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: "1rem",
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 48, height: 48, borderRadius: "0.75rem", flexShrink: 0,
                    background: isHov ? "#163344" : "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.15s",
                  }}>
                    <Pill size={22} color={isHov ? "white" : "#163344"} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: 6 }}>
                      <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1f2937" }}>
                        Ordonnance du {presc.date}
                      </div>
                      <StatusBadge status={status} />
                    </div>

                    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginBottom: 10 }}>
                      {[
                        { icon: <User size={11} />,       text: presc.medecin },
                        { icon: <Package size={11} />,    text: `${presc.medicaments.length} médicament${presc.medicaments.length > 1 ? "s" : ""}` },
                        { icon: <ShoppingCart size={11} />, text: `${boughtCount}/${presc.medicaments.length} achetés` },
                      ].map((m, mi) => (
                        <span key={mi} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#64748b" }}>
                          <span style={{ color: "#94a3b8" }}>{m.icon}</span> {m.text}
                        </span>
                      ))}
                    </div>

                    {/* Context badge + progress */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "2px 10px", borderRadius: "9999px",
                        background: "#f1f5f9", color: "#475569", fontSize: "0.6875rem", fontWeight: 600,
                      }}>
                        {presc.contexte === "Consultation" ? <Stethoscope size={10} /> : <Building2 size={10} />}
                        {presc.contexte}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 80, background: "#e2e8f0", borderRadius: "9999px", height: 5 }}>
                          <div style={{
                            height: 5, borderRadius: "9999px", background: "#10b981",
                            width: `${(boughtCount / presc.medicaments.length) * 100}%`,
                            transition: "width 0.3s",
                          }} />
                        </div>
                        <span style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 600 }}>
                          {Math.round((boughtCount / presc.medicaments.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(presc); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                      padding: "6px 14px", borderRadius: "0.5rem",
                      border: "1px solid #e2e8f0", background: "white",
                      color: "#374151", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    <Eye size={13} /> Détails
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1.5rem", color: "#94a3b8" }}>
            <Pill size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
            <div style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: 4 }}>Aucune ordonnance trouvée</div>
            <div style={{ fontSize: "0.8125rem" }}>Modifiez vos filtres de recherche</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdonnancesPatient;