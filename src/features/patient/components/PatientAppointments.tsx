import { useState } from "react";
import {
  Calendar, MapPin, User, Clock, Plus, X, Video, Phone,
  CheckCircle, AlertTriangle, Ban, ChevronRight, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─── */
type StatutRdv = "planifié" | "confirmé" | "reporté" | "annulé" | "terminé";
type TypeRdv   = "physique" | "teleconsultation";

interface RendezVous {
  id: string;
  motif: string;
  medecin: string;
  specialite: string;
  date: string;
  heure: string;
  type: TypeRdv;
  statut: StatutRdv;
  hopital?: string;
  service?: string;
  lieu?: string;
  appelActif?: boolean;
  notes?: string;
}

/* ─── Local mock data ─── */
const RDV_INIT: RendezVous[] = [
  {
    id: "rdv_001", motif: "Suivi cardiologique", medecin: "Dr. Jean Dupont",
    specialite: "Cardiologie", date: "20/03/2026", heure: "10:30",
    type: "physique", statut: "confirmé",
    hopital: "Clinique du Parc", service: "Cardiologie", lieu: "Bâtiment B — Salle 204",
  },
  {
    id: "rdv_002", motif: "Téléconsultation — Résultats analyses", medecin: "Dr. Sophie Laurent",
    specialite: "Médecine générale", date: "25/03/2026", heure: "14:00",
    type: "teleconsultation", statut: "planifié", appelActif: false,
  },
  {
    id: "rdv_003", motif: "IRM cérébrale — Préparation", medecin: "Dr. Claire Martin",
    specialite: "Neurologie", date: "10/04/2026", heure: "09:00",
    type: "physique", statut: "planifié",
    hopital: "CHU Saint-Louis", service: "Neurologie", lieu: "Bâtiment Imagerie",
  },
  {
    id: "rdv_004", motif: "Consultation urgence — Douleurs thoraciques", medecin: "Dr. Jean Dupont",
    specialite: "Cardiologie", date: "20/02/2026", heure: "10:30",
    type: "physique", statut: "terminé",
    hopital: "Hôpital Général", service: "Urgences",
    notes: "ECG réalisé, bilan sanguin prescrit. Mise sous bêtabloquants.",
  },
  {
    id: "rdv_005", motif: "Contrôle glycémique", medecin: "Dr. Sophie Laurent",
    specialite: "Médecine générale", date: "15/01/2026", heure: "11:00",
    type: "physique", statut: "terminé",
    hopital: "Clinique du Parc", service: "Consultations",
  },
  {
    id: "rdv_006", motif: "Téléconsultation annulée — Fièvre", medecin: "Dr. Sophie Laurent",
    specialite: "Médecine générale", date: "05/02/2026", heure: "16:00",
    type: "teleconsultation", statut: "annulé",
  },
];

/* ─── Status config ─── */
const STATUT_CFG: Record<StatutRdv, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  planifié: { label: "Planifié", color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", icon: <Clock size={11} /> },
  confirmé: { label: "Confirmé", color: "#10b981", bg: "#ecfdf5", border: "#6ee7b7", icon: <CheckCircle size={11} /> },
  reporté:  { label: "Reporté",  color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", icon: <AlertTriangle size={11} /> },
  annulé:   { label: "Annulé",   color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: <Ban size={11} /> },
  terminé:  { label: "Terminé",  color: "#64748b", bg: "#f1f5f9", border: "#cbd5e1", icon: <CheckCircle size={11} /> },
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

/* ─── Status Badge ─── */
const StatusBadge = ({ statut }: { statut: StatutRdv }) => {
  const cfg = STATUT_CFG[statut];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
      padding: "3px 10px", borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

/* ─── Modal wrapper ─── */
const Modal = ({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white", borderRadius: "1rem", width: "100%", maxWidth: 520,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto",
        }}
      >
        <div style={{
          padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: "white", zIndex: 1,
        }}>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1f2937" }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: "1.5rem" }}>{children}</div>
      </motion.div>
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const PatientAppointments = () => {
  const [rdvList, setRdvList]     = useState<RendezVous[]>(RDV_INIT);
  const [selected, setSelected]   = useState<RendezVous | null>(null);
  const [activeTab, setActiveTab] = useState<"a-venir" | "passes">("a-venir");
  const [showAddModal, setShowAddModal]   = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  /* ── New appointment form ── */
  const [newRdv, setNewRdv] = useState({
    motif: "", medecin: "", specialite: "", date: "", heure: "",
    type: "physique" as TypeRdv, hopital: "", service: "", notes: "",
  });

  const upcoming = rdvList.filter((r) => ["planifié", "confirmé", "reporté"].includes(r.statut));
  const past     = rdvList.filter((r) => ["terminé", "annulé"].includes(r.statut));

  const handleConfirm = (id: string) => {
    setRdvList((prev) => prev.map((r) => r.id === id ? { ...r, statut: "confirmé" as StatutRdv } : r));
    setSelected((prev) => prev?.id === id ? { ...prev, statut: "confirmé" as StatutRdv } : prev);
  };

  const handleAnnuler = (id: string) => {
    setRdvList((prev) => prev.map((r) => r.id === id ? { ...r, statut: "annulé" as StatutRdv } : r));
    setSelected(null);
  };

  const handleReporter = (id: string) => {
    setRdvList((prev) => prev.map((r) => r.id === id ? { ...r, statut: "reporté" as StatutRdv } : r));
    setSelected((prev) => prev?.id === id ? { ...prev, statut: "reporté" as StatutRdv } : prev);
  };

  const handleAddRdv = () => {
    if (!newRdv.motif || !newRdv.date || !newRdv.heure) return;
    const rdv: RendezVous = {
      id: `rdv_${Date.now()}`,
      motif: newRdv.motif,
      medecin: newRdv.medecin || "À confirmer",
      specialite: newRdv.specialite || "",
      date: newRdv.date.split("-").reverse().join("/"),
      heure: newRdv.heure,
      type: newRdv.type,
      statut: "planifié",
      hopital: newRdv.hopital || undefined,
      service: newRdv.service || undefined,
      notes: newRdv.notes || undefined,
    };
    setRdvList((prev) => [rdv, ...prev]);
    setNewRdv({ motif: "", medecin: "", specialite: "", date: "", heure: "", type: "physique", hopital: "", service: "", notes: "" });
    setShowAddModal(false);
  };

  /* ─── RDV Card ─── */
  const RdvCard = ({ r, isPast }: { r: RendezVous; isPast?: boolean }) => {
    const isHov  = hoveredId === r.id;
    const isTele = r.type === "teleconsultation";
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        onClick={() => setSelected(r)}
        onMouseEnter={() => setHoveredId(r.id)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          ...card, padding: "1.25rem", cursor: "pointer", opacity: isPast ? 0.75 : 1,
          border: `1.5px solid ${isTele && !isPast ? (isHov ? "#7c3aed" : "#ddd6fe") : isHov ? "#163344" : "#e2e8f0"}`,
          borderLeft: isTele ? `4px solid ${isPast ? "#94a3b8" : "#7c3aed"}` : undefined,
          boxShadow: isHov ? "0 4px 16px rgba(22,51,68,0.1)" : "0 1px 3px rgba(0,0,0,0.04)",
          transition: "all 0.15s",
          display: "flex", alignItems: "center", gap: "1rem",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 46, height: 46, borderRadius: "0.75rem", flexShrink: 0,
          background: isTele ? (isPast ? "#f1f5f9" : "#ede9fe") : (isPast ? "#f1f5f9" : "#eff6ff"),
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.15s",
        }}>
          {isTele
            ? <Video size={20} color={isPast ? "#94a3b8" : "#7c3aed"} />
            : <Calendar size={20} color={isPast ? "#94a3b8" : "#163344"} />}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: 6 }}>
            <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.motif}
            </div>
            <StatusBadge statut={r.statut} />
          </div>

          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
            {[
              { icon: <Clock size={11} />,   text: `${r.date} à ${r.heure}` },
              { icon: <User size={11} />,    text: r.medecin },
              { icon: <MapPin size={11} />,  text: isTele ? "Téléconsultation" : `${r.hopital} — ${r.service}` },
            ].map((m, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#64748b" }}>
                <span style={{ color: "#94a3b8" }}>{m.icon}</span> {m.text}
              </span>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: 8, flexWrap: "wrap" }}>
            {r.specialite && (
              <span style={{ padding: "2px 10px", borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: 600, background: "#f1f5f9", color: "#475569" }}>
                {r.specialite}
              </span>
            )}
            {isTele && (
              <span style={{ padding: "2px 10px", borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: 600, background: "#ede9fe", color: "#7c3aed", display: "flex", alignItems: "center", gap: 4 }}>
                <Video size={9} /> Vidéo
              </span>
            )}
          </div>
        </div>

        {/* Actions inline */}
        {!isPast && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", flexShrink: 0 }}
            onClick={(e) => e.stopPropagation()}>
            {isTele && r.appelActif && r.statut === "confirmé" && (
              <button style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px", borderRadius: "0.5rem", border: "none",
                background: "#7c3aed", color: "white", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer",
              }}>
                <Phone size={13} /> Rejoindre
              </button>
            )}
            {r.statut === "planifié" && (
              <button onClick={() => handleConfirm(r.id)} style={{
                padding: "5px 12px", borderRadius: "0.5rem",
                border: "1px solid #6ee7b7", background: "#ecfdf5",
                color: "#059669", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
              }}>
                Confirmer
              </button>
            )}
            <ChevronRight size={16} color="#94a3b8" style={{ alignSelf: "center" }} />
          </div>
        )}
      </motion.div>
    );
  };

  /* ════ RENDER ════ */
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
        <div style={{ position: "absolute", right: 80, bottom: -60, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: "0.75rem", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calendar size={20} color="white" />
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>Mes rendez-vous</div>
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
            Gérez vos consultations, confirmez vos présences et rejoignez vos téléconsultations.
          </div>
        </div>

        {/* Stats inline */}
        <div style={{ display: "flex", gap: "1.5rem", position: "relative", zIndex: 1, flexWrap: "wrap" }}>
          {[
            { label: "À venir",  value: upcoming.length, color: "#10b981" },
            { label: "Passés",   value: past.length,     color: "#94a3b8" },
            { label: "Total",    value: rdvList.length,  color: "white"   },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
          <button onClick={() => setShowAddModal(true)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0.625rem 1.25rem", borderRadius: "0.75rem",
            background: "#10b981", border: "none",
            color: "white", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(16,185,129,0.4)", alignSelf: "center",
          }}>
            <Plus size={16} /> Prendre un rendez-vous
          </button>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div style={card}>
        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", padding: "0 1.5rem", gap: "0.25rem" }}>
          {([
            { key: "a-venir", label: `À venir (${upcoming.length})` },
            { key: "passes",  label: `Passés (${past.length})` },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: "0.875rem 1rem", fontSize: "0.875rem", fontWeight: 600,
              background: "none", border: "none", cursor: "pointer",
              color: activeTab === t.key ? "#163344" : "#94a3b8",
              borderBottom: `2px solid ${activeTab === t.key ? "#163344" : "transparent"}`,
              marginBottom: -1, transition: "all 0.15s",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <AnimatePresence mode="wait">

            {activeTab === "a-venir" && (
              <motion.div key="upcoming"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                {upcoming.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                    <Calendar size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: 4 }}>Aucun rendez-vous à venir</div>
                    <div style={{ fontSize: "0.8125rem" }}>Prenez un rendez-vous pour commencer</div>
                  </div>
                ) : (
                  upcoming.map((r) => <RdvCard key={r.id} r={r} />)
                )}
              </motion.div>
            )}

            {activeTab === "passes" && (
              <motion.div key="past"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                {past.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                    <Calendar size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                    <div style={{ fontSize: "0.875rem" }}>Aucun rendez-vous passé</div>
                  </div>
                ) : (
                  past.map((r) => <RdvCard key={r.id} r={r} isPast />)
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Detail Modal ─── */}
      <AnimatePresence>
        {selected && (
          <Modal open={!!selected} onClose={() => setSelected(null)} title="Détails du rendez-vous">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "0.875rem", flexShrink: 0,
                  background: selected.type === "teleconsultation" ? "#ede9fe" : "#eff6ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {selected.type === "teleconsultation"
                    ? <Video size={24} color="#7c3aed" />
                    : <Calendar size={24} color="#163344" />}
                </div>
                <div>
                  <div style={{ fontSize: "1.0625rem", fontWeight: 800, color: "#1f2937", marginBottom: 5 }}>{selected.motif}</div>
                  <StatusBadge statut={selected.statut} />
                </div>
              </div>

              {/* Info grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                {[
                  { label: "Médecin",       value: selected.medecin },
                  { label: "Spécialité",    value: selected.specialite },
                  { label: "Date & heure",  value: `${selected.date} à ${selected.heure}` },
                  { label: "Type",          value: selected.type === "teleconsultation" ? "Téléconsultation" : "Consultation physique" },
                  ...(selected.type === "physique" && selected.hopital ? [
                    { label: "Hôpital", value: selected.hopital },
                    { label: "Lieu",    value: selected.lieu || selected.service || "—" },
                  ] : []),
                ].map((f) => (
                  <div key={f.label}>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{f.label}</div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Notes (textarea) */}
              <FormField label="Notes / Observations">
                <textarea
                  value={selected.notes || ""}
                  onChange={(e) => {
                    const notes = e.target.value;
                    setSelected((prev) => prev ? { ...prev, notes } : null);
                    setRdvList((prev) => prev.map((r) => r.id === selected.id ? { ...r, notes } : r));
                  }}
                  placeholder="Ajoutez des notes sur ce rendez-vous..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </FormField>

              {/* Teleconsultation block */}
              {selected.type === "teleconsultation" && (
                <div style={{
                  padding: "1rem", borderRadius: "0.875rem",
                  border: "1px solid #ddd6fe", background: "#faf5ff",
                  display: "flex", flexDirection: "column", gap: "0.75rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#7c3aed", fontSize: "0.875rem" }}>
                    <Video size={15} /> Appel vidéo
                  </div>
                  {selected.appelActif ? (
                    <>
                      <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                        L'appel a été lancé. Vous pouvez rejoindre maintenant.
                      </div>
                      <button style={{
                        width: "100%", padding: "0.75rem", borderRadius: "0.75rem", border: "none",
                        background: "#7c3aed", color: "white", fontSize: "0.9375rem", fontWeight: 700,
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      }}>
                        <Phone size={16} /> Rejoindre l'appel vidéo
                      </button>
                    </>
                  ) : (
                    <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                      L'appel n'est pas encore actif. Le médecin lancera l'appel à l'heure prévue.
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {["planifié", "confirmé"].includes(selected.statut) && (
                <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                  {selected.statut === "planifié" && (
                    <button onClick={() => handleConfirm(selected.id)} style={{
                      flex: 1, padding: "0.625rem", borderRadius: "0.625rem", border: "none",
                      background: "#10b981", color: "white", fontSize: "0.875rem", fontWeight: 700,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}>
                      <CheckCircle size={14} /> Confirmer présence
                    </button>
                  )}
                  <button onClick={() => handleReporter(selected.id)} style={{
                    flex: 1, padding: "0.625rem", borderRadius: "0.625rem",
                    border: "1px solid #e2e8f0", background: "white",
                    color: "#374151", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                  }}>
                    Reporter
                  </button>
                  <button onClick={() => handleAnnuler(selected.id)} style={{
                    padding: "0.625rem 0.875rem", borderRadius: "0.625rem",
                    border: "1px solid #fecaca", background: "white",
                    color: "#ef4444", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <X size={13} /> Annuler
                  </button>
                </div>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ─── Add RDV Modal ─── */}
      <AnimatePresence>
        {showAddModal && (
          <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Prendre un rendez-vous">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Type selector */}
              <FormField label="Type de consultation">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {([
                    { key: "physique",         label: "Consultation physique", icon: <Calendar size={16} />, color: "#163344", bg: "#eff6ff" },
                    { key: "teleconsultation", label: "Téléconsultation",      icon: <Video size={16} />,    color: "#7c3aed", bg: "#ede9fe" },
                  ] as const).map((t) => {
                    const isActive = newRdv.type === t.key;
                    return (
                      <button key={t.key} onClick={() => setNewRdv((p) => ({ ...p, type: t.key }))} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "0.75rem", borderRadius: "0.75rem",
                        border: `1.5px solid ${isActive ? t.color : "#e2e8f0"}`,
                        background: isActive ? t.bg : "white",
                        color: isActive ? t.color : "#64748b",
                        fontSize: "0.8125rem", fontWeight: isActive ? 700 : 500, cursor: "pointer",
                      }}>
                        {t.icon} {t.label}
                      </button>
                    );
                  })}
                </div>
              </FormField>

              <FormField label="Motif de consultation">
                <textarea
                  value={newRdv.motif}
                  onChange={(e) => setNewRdv((p) => ({ ...p, motif: e.target.value }))}
                  placeholder="Décrivez le motif de votre rendez-vous..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </FormField>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <FormField label="Médecin souhaité">
                  <input value={newRdv.medecin} onChange={(e) => setNewRdv((p) => ({ ...p, medecin: e.target.value }))}
                    placeholder="Dr. Nom Prénom" style={inputStyle} />
                </FormField>
                <FormField label="Spécialité">
                  <input value={newRdv.specialite} onChange={(e) => setNewRdv((p) => ({ ...p, specialite: e.target.value }))}
                    placeholder="Ex: Cardiologie" style={inputStyle} />
                </FormField>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <FormField label="Date souhaitée">
                  <input type="date" value={newRdv.date} onChange={(e) => setNewRdv((p) => ({ ...p, date: e.target.value }))} style={inputStyle} />
                </FormField>
                <FormField label="Heure souhaitée">
                  <input type="time" value={newRdv.heure} onChange={(e) => setNewRdv((p) => ({ ...p, heure: e.target.value }))} style={inputStyle} />
                </FormField>
              </div>

              {newRdv.type === "physique" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <FormField label="Hôpital / Clinique">
                    <input value={newRdv.hopital} onChange={(e) => setNewRdv((p) => ({ ...p, hopital: e.target.value }))}
                      placeholder="Nom de l'établissement" style={inputStyle} />
                  </FormField>
                  <FormField label="Service">
                    <input value={newRdv.service} onChange={(e) => setNewRdv((p) => ({ ...p, service: e.target.value }))}
                      placeholder="Ex: Cardiologie" style={inputStyle} />
                  </FormField>
                </div>
              )}

              <FormField label="Notes supplémentaires (optionnel)">
                <textarea
                  value={newRdv.notes}
                  onChange={(e) => setNewRdv((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Informations complémentaires, symptômes, questions pour le médecin..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </FormField>

              <button onClick={handleAddRdv} style={{
                width: "100%", padding: "0.75rem", borderRadius: "0.75rem", border: "none",
                background: !newRdv.motif || !newRdv.date || !newRdv.heure ? "#94a3b8" : "#163344",
                color: "white", fontSize: "0.9375rem", fontWeight: 700,
                cursor: !newRdv.motif || !newRdv.date || !newRdv.heure ? "not-allowed" : "pointer",
                marginTop: 4,
              }}>
                Confirmer la demande
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientAppointments;