import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pill, Eye, Calendar, User, Stethoscope, Building2, ShoppingCart,
  CheckCircle, Clock, AlertCircle, Package, Search, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrdonnancesPatient } from "../hooks/useOrdonnancePatient";
import type { OrdonnancePatient } from "../types/patient.types";

/* ─── Types locaux (suivi achat côté UI uniquement) ─── */
type PurchaseStatus = "Non achetés" | "Partiellement achetés" | "Tous achetés";
type AchatMap = Record<string, Set<string>>;

const PATIENT_ID = "pat_001";

/* ─── Helpers ─── */
const getPurchaseStatus = (total: number, bought: number): PurchaseStatus => {
  if (bought === 0) return "Non achetés";
  if (bought === total) return "Tous achetés";
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

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.5625rem 0.875rem",
  border: "1px solid #e2e8f0", borderRadius: "0.625rem",
  fontSize: "0.875rem", background: "#f8fafc", color: "#374151",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
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

/* ════════════════════════════════════════════
   MAIN COMPONENT — LIST ONLY
════════════════════════════════════════════ */
const OrdonnancesPatient = () => {
  const navigate = useNavigate();

  // ── Données via hook → ordonnancePatientService → ORDONNANCES_RECORD (IDs: ord_001, ord_002, ord_003)
  const { data: prescriptions = [], isLoading } = useOrdonnancesPatient(PATIENT_ID);

  // ── Suivi achat local (UI only, sera remplacé par API)
  const [achatMap, setAchatMap] = useState<AchatMap>({});

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleAchat = (ordId: string, medNom: string) => {
    setAchatMap((prev) => {
      const set = new Set(prev[ordId] ?? []);
      set.has(medNom) ? set.delete(medNom) : set.add(medNom);
      return { ...prev, [ordId]: set };
    });
  };

  const getBoughtCount = (ord: OrdonnancePatient) =>
    (achatMap[ord.id]?.size ?? 0);

  // OrdonnancePatient (depuis le service) utilise :
  //   .id              → ord_001, ord_002, ord_003
  //   .medecinNom      → nom du médecin
  //   .medicaments[]   → { id, nom, dosage, duree, instructions, pris }
  //   .status          → "active" | "terminée" (lowercase depuis le service)

  const filtered = prescriptions.filter((p) => {
    const bought = getBoughtCount(p);
    const status = getPurchaseStatus(p.medicaments.length, bought);
    const matchStatus = filterStatus === "all" || status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      p.medecinNom.toLowerCase().includes(q) ||
      p.medicaments.some((m) => m.nom.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  const stats = [
    { label: "Total",         value: prescriptions.length, color: "#163344", bg: "#f1f5f9" },
    { label: "Tous achetés",  value: prescriptions.filter((p) => getPurchaseStatus(p.medicaments.length, getBoughtCount(p)) === "Tous achetés").length,   color: "#10b981", bg: "#ecfdf5" },
    { label: "Partiellement", value: prescriptions.filter((p) => getPurchaseStatus(p.medicaments.length, getBoughtCount(p)) === "Partiellement achetés").length, color: "#f59e0b", bg: "#fffbeb" },
    { label: "Non achetés",   value: prescriptions.filter((p) => getPurchaseStatus(p.medicaments.length, getBoughtCount(p)) === "Non achetés").length,    color: "#ef4444", bg: "#fef2f2" },
  ];

  if (isLoading) return <div style={{ padding: "2rem", color: "#64748b" }}>Chargement des ordonnances…</div>;

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
            const boughtCount = getBoughtCount(presc);
            const status      = getPurchaseStatus(presc.medicaments.length, boughtCount);
            const isHov       = hoveredId === presc.id;

            return (
              <motion.div key={presc.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
              >
                <div
                  onClick={() => navigate(`/patient/ordonnances/${presc.id}`)}
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
                        Ordonnance du {presc.dateCreation}
                      </div>
                      <StatusBadge status={status} />
                    </div>

                    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginBottom: 10 }}>
                      {[
                        { icon: <User size={11} />,        text: presc.medecinNom },
                        { icon: <Package size={11} />,     text: `${presc.medicaments.length} médicament${presc.medicaments.length > 1 ? "s" : ""}` },
                        { icon: <ShoppingCart size={11} />, text: `${boughtCount}/${presc.medicaments.length} achetés` },
                      ].map((m, mi) => (
                        <span key={mi} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#64748b" }}>
                          <span style={{ color: "#94a3b8" }}>{m.icon}</span> {m.text}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "2px 10px", borderRadius: "9999px",
                        background: presc.status === "active" ? "#ecfdf5" : "#f1f5f9",
                        color: presc.status === "active" ? "#065f46" : "#64748b",
                        fontSize: "0.6875rem", fontWeight: 600,
                      }}>
                        <Pill size={10} />
                        {presc.status === "active" ? "Active" : "Terminée"}
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
                    onClick={(e) => { e.stopPropagation(); navigate(`/patient/ordonnances/${presc.id}`); }}
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