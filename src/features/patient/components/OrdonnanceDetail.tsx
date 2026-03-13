import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CONSULTATIONS, HOSPITALISATIONS } from "@shared/data/mock-data";
import {
  Pill, ArrowLeft, Calendar, User, Stethoscope, Building2, ShoppingCart,
  CheckCircle, Clock, AlertCircle, Package
} from "lucide-react";

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

/* ─── Same mock data as OrdonnancesPatient.tsx ─── */
const mockPrescriptions: PrescriptionData[] = [
  {
    id: "ORD001", medecin: "Dr. Martin Dupont", date: "05/03/2026", contexte: "Consultation", contextId: "C001",
    medicaments: [
      { nom: "Oméprazole",  dosage: "20mg",  forme: "Gélule",  posologie: "1 gélule le matin à jeun",    duree: "28 jours", instructions: "À prendre 30 min avant le petit-déjeuner", achete: true },
      { nom: "Gaviscon",    dosage: "500mg", forme: "Sachet",  posologie: "1 sachet après les 3 repas",  duree: "14 jours", instructions: "Bien agiter avant utilisation",            achete: false },
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
      { nom: "Paracétamol",  dosage: "1g",    forme: "Comprimé", posologie: "1 comprimé toutes les 6h si fièvre", duree: "5 jours",  instructions: "Ne pas dépasser 4g par jour",    achete: true },
      { nom: "Carbocistéine",dosage: "750mg", forme: "Sirop",    posologie: "1 cuillère à soupe 3x/jour",         duree: "7 jours",  instructions: "À prendre après les repas",      achete: true },
    ]
  },
  {
    id: "ORD004", medecin: "Dr. Jean Moreau", date: "16/06/2025", contexte: "Hospitalisation", contextId: "H001",
    medicaments: [
      { nom: "Paracétamol", dosage: "1g",   forme: "Comprimé", posologie: "1 comprimé toutes les 6h", duree: "5 jours",  instructions: "Si douleur", achete: false },
      { nom: "Pantoprazole",dosage: "40mg", forme: "Comprimé", posologie: "1 comprimé le matin",       duree: "14 jours", instructions: "À jeun",     achete: false },
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

const card: React.CSSProperties = {
  backgroundColor: "white", borderRadius: "1rem",
  border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden",
};

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
const OrdonnancePatientDetail = () => {
  const { ordonnanceId } = useParams<{ ordonnanceId: string }>();
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>(mockPrescriptions);

  const prescription = prescriptions.find((p) => p.id === ordonnanceId);

  const toggleMedPurchase = (medIndex: number) => {
    if (!prescription) return;
    setPrescriptions((prev) =>
      prev.map((p) => {
        if (p.id !== ordonnanceId) return p;
        const meds = [...p.medicaments];
        meds[medIndex] = { ...meds[medIndex], achete: !meds[medIndex].achete };
        return { ...p, medicaments: meds };
      })
    );
  };

  const markAllPurchased = () => {
    if (!prescription) return;
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === ordonnanceId
          ? { ...p, medicaments: p.medicaments.map((m) => ({ ...m, achete: true })) }
          : p
      )
    );
  };

  const getContextLabel = (p: PrescriptionData) => {
    if (p.contexte === "Consultation") {
      const c = CONSULTATIONS.find((c) => c.id === p.contextId);
      return c ? `${c.motif} (${c.date})` : "Consultation";
    }
    const h = HOSPITALISATIONS.find((h) => h.id === p.contextId);
    return h ? `${h.motif} (${h.dateAdmission})` : "Hospitalisation";
  };

  if (!prescription) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
        <Pill size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
        <div style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: 8 }}>Ordonnance introuvable</div>
        <button onClick={() => navigate("/patient/ordonnances")} style={{
          padding: "0.625rem 1.25rem", borderRadius: "0.75rem", border: "none",
          background: "#163344", color: "white", fontWeight: 600, cursor: "pointer",
        }}>
          Retour aux ordonnances
        </button>
      </div>
    );
  }

  // Re-read after state update
  const selected = prescriptions.find((p) => p.id === ordonnanceId)!;
  const status = getPurchaseStatus(selected.medicaments);
  const boughtCount = selected.medicaments.filter((m) => m.achete).length;

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Back */}
      <button onClick={() => navigate("/patient/ordonnances")} style={{
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
                { icon: <Calendar size={14} color="#94a3b8" />, label: "Date",        value: selected.date },
                { icon: <User size={14} color="#94a3b8" />,     label: "Médecin",     value: selected.medecin },
                { icon: <Package size={14} color="#94a3b8" />,  label: "Médicaments", value: `${boughtCount}/${selected.medicaments.length} achetés` },
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
                <button onClick={markAllPurchased} style={{
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
                    {/* Checkbox */}
                    <div
                      onClick={() => toggleMedPurchase(i)}
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
          <div style={{ ...card, padding: "1.25rem", background: "#163344", border: "none" }}>
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
};

export default OrdonnancePatientDetail;