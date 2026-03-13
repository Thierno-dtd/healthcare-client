import { useState } from "react";
import { CONSULTATIONS, HOSPITALISATIONS } from "@shared/data/mock-data";
import {
  TestTube, Plus, Eye, FileText, Calendar, MapPin, Clock, Stethoscope, Building2,
  Upload, CheckCircle, XCircle, AlertTriangle, ArrowLeft, Image as ImageIcon,
  Download, Search, Filter, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─── */
type ExamStatus = "Planifié" | "Confirmé" | "Reporté" | "Réalisé" | "Non réalisé";
type ExamContext = "Consultation" | "Hospitalisation";

interface ExamResult {
  dateResultat: string;
  commentaireMedecin: string;
  interpretation: string;
  fichiers: { nom: string; type: "pdf" | "image" }[];
}

interface Exam {
  id: string;
  nom: string;
  date: string;
  lieu: string;
  statut: ExamStatus;
  dureeEstimee: string;
  contexte: ExamContext;
  contextId: string;
  resultat?: ExamResult;
}

/* ─── Mock data ─── */
const mockExams: Exam[] = [
  {
    id: "EX001", nom: "NFS (Numération Formule Sanguine)", date: "05/03/2026", lieu: "Laboratoire BioSanté, Paris",
    statut: "Réalisé", dureeEstimee: "15 min", contexte: "Consultation", contextId: "C001",
    resultat: { dateResultat: "06/03/2026", commentaireMedecin: "Résultats dans les limites normales", interpretation: "Pas d'anomalie détectée. Bilan sanguin satisfaisant.", fichiers: [{ nom: "NFS_060326.pdf", type: "pdf" }] }
  },
  {
    id: "EX002", nom: "Fibroscopie gastrique", date: "20/03/2026", lieu: "CHU Saint-Louis, Paris",
    statut: "Planifié", dureeEstimee: "30 min", contexte: "Consultation", contextId: "C001"
  },
  {
    id: "EX003", nom: "Scanner abdominal", date: "12/06/2025", lieu: "CHU Saint-Louis, Paris",
    statut: "Réalisé", dureeEstimee: "45 min", contexte: "Hospitalisation", contextId: "H001",
    resultat: { dateResultat: "12/06/2025", commentaireMedecin: "Cholécystite chronique lithiasique confirmée", interpretation: "Vésicule biliaire lithiasique avec épaississement pariétal modéré.", fichiers: [{ nom: "Scanner_120625.pdf", type: "pdf" }, { nom: "Scanner_image.jpg", type: "image" }] }
  },
  {
    id: "EX004", nom: "Bilan lipidique complet", date: "15/01/2026", lieu: "Laboratoire Cerba, Boulogne",
    statut: "Réalisé", dureeEstimee: "10 min", contexte: "Consultation", contextId: "C002",
    resultat: { dateResultat: "16/01/2026", commentaireMedecin: "Bilan lipidique satisfaisant", interpretation: "Tous les paramètres sont dans les normes.", fichiers: [{ nom: "Bilan_lipidique.pdf", type: "pdf" }] }
  },
  {
    id: "EX005", nom: "Radio pulmonaire", date: "20/09/2025", lieu: "Clinique du Parc, Paris",
    statut: "Réalisé", dureeEstimee: "10 min", contexte: "Consultation", contextId: "C003"
  },
  {
    id: "EX006", nom: "IRM cérébrale", date: "10/04/2026", lieu: "Centre d'Imagerie Médicale, Lyon",
    statut: "Confirmé", dureeEstimee: "45 min", contexte: "Consultation", contextId: "C001"
  },
  {
    id: "EX007", nom: "Bilan hépatique", date: "01/07/2025", lieu: "Laboratoire BioSanté, Paris",
    statut: "Reporté", dureeEstimee: "15 min", contexte: "Hospitalisation", contextId: "H001"
  },
];

/* ─── Status config ─── */
const STATUS_CFG: Record<ExamStatus, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  "Planifié":     { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", icon: <Calendar size={11} /> },
  "Confirmé":     { color: "#10b981", bg: "#ecfdf5", border: "#6ee7b7", icon: <CheckCircle size={11} /> },
  "Reporté":      { color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", icon: <AlertTriangle size={11} /> },
  "Réalisé":      { color: "#163344", bg: "#f1f5f9", border: "#cbd5e1", icon: <CheckCircle size={11} /> },
  "Non réalisé":  { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: <XCircle size={11} /> },
};

/* ─── Shared card style ─── */
const card: React.CSSProperties = {
  backgroundColor: "white", borderRadius: "1rem",
  border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden",
};

/* ─── StatusBadge ─── */
const StatusBadge = ({ statut }: { statut: ExamStatus }) => {
  const cfg = STATUS_CFG[statut];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, flexShrink: 0,
    }}>
      {cfg.icon} {statut}
    </span>
  );
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const Examens = () => {
  const [exams, setExams]                   = useState<Exam[]>(mockExams);
  const [selectedExam, setSelectedExam]     = useState<Exam | null>(null);
  const [filterStatus, setFilterStatus]     = useState<string>("all");
  const [searchQuery, setSearchQuery]       = useState("");
  const [showAddModal, setShowAddModal]     = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultExamId, setResultExamId]     = useState<string | null>(null);
  const [hoveredId, setHoveredId]           = useState<string | null>(null);

  const [newExam, setNewExam] = useState({
    nom: "", lieu: "", date: "", dureeEstimee: "",
    statut: "Planifié" as ExamStatus, contexte: "Consultation" as ExamContext, contextId: "",
  });

  const filteredExams = exams.filter((e) => {
    const matchStatus = filterStatus === "all" || e.statut === filterStatus;
    const matchSearch = e.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.lieu.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleAddExam = () => {
    if (!newExam.nom || !newExam.date) return;
    setExams((prev) => [{ ...newExam, id: `EX${String(prev.length + 1).padStart(3, "0")}` }, ...prev]);
    setNewExam({ nom: "", lieu: "", date: "", dureeEstimee: "", statut: "Planifié", contexte: "Consultation", contextId: "" });
    setShowAddModal(false);
  };

  const handleStatusChange = (examId: string, newStatus: ExamStatus) => {
    setExams((prev) => prev.map((e) => e.id === examId ? { ...e, statut: newStatus } : e));
    setSelectedExam((prev) => prev?.id === examId ? { ...prev, statut: newStatus } : prev);
  };

  const getContextLabel = (exam: Exam) => {
    if (exam.contexte === "Consultation") {
      const c = CONSULTATIONS.find((c) => c.id === exam.contextId);
      return c ? `Consultation · ${c.motif} (${c.date})` : "Consultation";
    }
    const h = HOSPITALISATIONS.find((h) => h.id === exam.contextId);
    return h ? `Hospitalisation · ${h.motif} (${h.dateAdmission})` : "Hospitalisation";
  };

  const openResultModal = (examId: string) => { setResultExamId(examId); setShowResultModal(true); };

  /* ── Stats ── */
  const stats = [
    { label: "Total",      value: exams.length,                                                 color: "#163344", bg: "#f1f5f9" },
    { label: "Planifiés",  value: exams.filter((e) => e.statut === "Planifié" || e.statut === "Confirmé").length, color: "#3b82f6", bg: "#eff6ff" },
    { label: "Réalisés",   value: exams.filter((e) => e.statut === "Réalisé").length,            color: "#10b981", bg: "#ecfdf5" },
    { label: "Reportés",   value: exams.filter((e) => e.statut === "Reporté").length,            color: "#f59e0b", bg: "#fffbeb" },
  ];

  /* ════ DETAIL VIEW ════ */
  if (selectedExam) {
    return (
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Back */}
        <button onClick={() => setSelectedExam(null)} style={{
          display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem",
          fontWeight: 600, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: 0,
        }}>
          <ArrowLeft size={16} /> Retour aux examens
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem" }} className="exam-detail-grid">

          {/* ── Left column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Main info card */}
            <div style={card}>
              <div style={{
                padding: "1.5rem",
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                borderBottom: "1px solid #e2e8f0",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "0.875rem", flexShrink: 0,
                    background: "#163344", display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}>
                    <TestTube size={24} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1f2937" }}>{selectedExam.nom}</div>
                    <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: 3 }}>{selectedExam.lieu}</div>
                  </div>
                </div>
                <StatusBadge statut={selectedExam.statut} />
              </div>

              <div style={{ padding: "1.25rem 1.5rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                {[
                  { icon: <Calendar size={14} color="#94a3b8" />, label: "Date", value: selectedExam.date },
                  { icon: <Clock size={14} color="#94a3b8" />,    label: "Durée estimée", value: selectedExam.dureeEstimee },
                  { icon: <MapPin size={14} color="#94a3b8" />,   label: "Lieu", value: selectedExam.lieu },
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
                  <div style={{
                    width: 36, height: 36, borderRadius: "0.5rem", flexShrink: 0,
                    background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {selectedExam.contexte === "Consultation"
                      ? <Stethoscope size={16} color="#3b82f6" />
                      : <Building2 size={16} color="#3b82f6" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {getContextLabel(selectedExam)}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{selectedExam.contexte}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results card */}
            <div style={card}>
              <div style={{
                padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#1f2937" }}>Résultats</div>
                {!selectedExam.resultat && (
                  <button onClick={() => openResultModal(selectedExam.id)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", borderRadius: "0.625rem", border: "none",
                    background: "#163344", color: "white", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                  }}>
                    <Plus size={13} /> Ajouter résultats
                  </button>
                )}
              </div>
              <div style={{ padding: "1.25rem 1.5rem" }}>
                {selectedExam.resultat ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      {[
                        { label: "Date du résultat", value: selectedExam.resultat.dateResultat },
                        { label: "Commentaire du médecin", value: selectedExam.resultat.commentaireMedecin },
                      ].map((f) => (
                        <div key={f.label}>
                          <div style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{f.label}</div>
                          <div style={{ fontSize: "0.875rem", color: "#1f2937" }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Interprétation</div>
                      <div style={{ fontSize: "0.875rem", color: "#374151", background: "#f8fafc", borderRadius: "0.625rem", padding: "0.875rem", lineHeight: 1.6 }}>
                        {selectedExam.resultat.interpretation}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Fichiers joints</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {selectedExam.resultat.fichiers.map((f, i) => (
                          <div key={i} style={{
                            display: "flex", alignItems: "center", gap: "0.75rem",
                            padding: "0.625rem 0.875rem", border: "1px solid #e2e8f0",
                            borderRadius: "0.625rem", background: "#fafafa",
                          }}>
                            {f.type === "pdf"
                              ? <FileText size={18} color="#ef4444" />
                              : <ImageIcon size={18} color="#3b82f6" />}
                            <span style={{ flex: 1, fontSize: "0.875rem", color: "#374151" }}>{f.nom}</span>
                            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                              <Download size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#94a3b8" }}>
                    <FileText size={40} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
                    <div style={{ fontSize: "0.875rem" }}>Aucun résultat disponible</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={card}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9", fontWeight: 700, fontSize: "0.9375rem", color: "#1f2937" }}>
                Actions
              </div>
              <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {selectedExam.statut === "Planifié" && (
                  <button onClick={() => handleStatusChange(selectedExam.id, "Confirmé")} style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "0.625rem", borderRadius: "0.625rem", border: "none",
                    background: "#10b981", color: "white", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                  }}>
                    <CheckCircle size={15} /> Confirmer ma présence
                  </button>
                )}
                {(selectedExam.statut === "Planifié" || selectedExam.statut === "Confirmé") && (
                  <button onClick={() => handleStatusChange(selectedExam.id, "Reporté")} style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "0.625rem", borderRadius: "0.625rem",
                    border: "1px solid #fcd34d", background: "#fffbeb",
                    color: "#f59e0b", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                  }}>
                    <AlertTriangle size={15} /> Reporter l'examen
                  </button>
                )}
                {selectedExam.statut !== "Réalisé" && (
                  <button onClick={() => handleStatusChange(selectedExam.id, "Réalisé")} style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "0.625rem", borderRadius: "0.625rem",
                    border: "1px solid #e2e8f0", background: "white",
                    color: "#374151", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                  }}>
                    <CheckCircle size={15} /> Marquer comme réalisé
                  </button>
                )}
                <button onClick={() => openResultModal(selectedExam.id)} style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "0.625rem", borderRadius: "0.625rem",
                  border: "1px solid #e2e8f0", background: "white",
                  color: "#374151", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                }}>
                  <Upload size={15} /> {selectedExam.resultat ? "Modifier résultats" : "Ajouter résultats"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Result modal */}
        <ResultModal
          open={showResultModal} onClose={() => setShowResultModal(false)}
          examId={resultExamId} exams={exams} setExams={setExams} setSelectedExam={setSelectedExam}
        />

        {/* Responsive grid */}
        <style>{`@media (max-width: 900px) { .exam-detail-grid { grid-template-columns: 1fr !important; } }`}</style>
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
              <TestTube size={20} color="white" />
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>Mes Examens</div>
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
            Suivez vos examens médicaux et consultez vos résultats
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{
          position: "relative", zIndex: 1,
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.625rem 1.25rem", borderRadius: "0.75rem",
          background: "#10b981", border: "none", color: "white",
          fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
          boxShadow: "0 4px 12px rgba(16,185,129,0.4)",
        }}>
          <Plus size={16} /> Ajouter un examen
        </button>
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
          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Search size={15} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un examen..."
              style={{
                width: "100%", paddingLeft: "2.25rem", paddingRight: "1rem",
                paddingTop: "0.5625rem", paddingBottom: "0.5625rem",
                border: "1px solid #e2e8f0", borderRadius: "0.625rem",
                fontSize: "0.875rem", outline: "none", background: "#f8fafc",
                color: "#374151", boxSizing: "border-box",
              }}
            />
          </div>
          {/* Status filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={14} color="#94a3b8" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: "0.5625rem 0.875rem", border: "1px solid #e2e8f0",
                borderRadius: "0.625rem", fontSize: "0.875rem", background: "#f8fafc",
                color: "#374151", outline: "none", cursor: "pointer",
              }}
            >
              <option value="all">Tous les statuts</option>
              <option value="Planifié">Planifié</option>
              <option value="Confirmé">Confirmé</option>
              <option value="Reporté">Reporté</option>
              <option value="Réalisé">Réalisé</option>
              <option value="Non réalisé">Non réalisé</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Exam list ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <AnimatePresence>
          {filteredExams.map((exam, i) => {
            const isHov = hoveredId === exam.id;
            return (
              <motion.div key={exam.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
              >
                <div
                  onClick={() => setSelectedExam(exam)}
                  onMouseEnter={() => setHoveredId(exam.id)}
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
                    <TestTube size={22} color={isHov ? "white" : "#163344"} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: 6 }}>
                      <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {exam.nom}
                      </div>
                      <StatusBadge statut={exam.statut} />
                    </div>
                    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginBottom: 8 }}>
                      {[
                        { icon: <Calendar size={11} />, text: exam.date },
                        { icon: <MapPin size={11} />,   text: exam.lieu },
                        { icon: <Clock size={11} />,    text: exam.dureeEstimee },
                      ].map((m, mi) => (
                        <span key={mi} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#64748b" }}>
                          <span style={{ color: "#94a3b8" }}>{m.icon}</span> {m.text}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "2px 10px", borderRadius: "9999px",
                        background: "#f1f5f9", color: "#475569", fontSize: "0.6875rem", fontWeight: 600,
                      }}>
                        {exam.contexte === "Consultation" ? <Stethoscope size={10} /> : <Building2 size={10} />}
                        {exam.contexte}
                      </span>
                      {exam.resultat && (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "2px 10px", borderRadius: "9999px",
                          background: "#ecfdf5", color: "#10b981", fontSize: "0.6875rem", fontWeight: 600,
                        }}>
                          <FileText size={10} /> Résultats disponibles
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setSelectedExam(exam)} style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "6px 14px", borderRadius: "0.5rem",
                      border: "1px solid #e2e8f0", background: "white",
                      color: "#374151", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                    }}>
                      <Eye size={13} /> Détails
                    </button>
                    <button onClick={() => openResultModal(exam.id)} style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "6px 14px", borderRadius: "0.5rem", border: "none",
                      background: exam.resultat ? "#f1f5f9" : "#163344",
                      color: exam.resultat ? "#374151" : "white",
                      fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                    }}>
                      <FileText size={13} /> {exam.resultat ? "Résultats" : "Ajouter"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredExams.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1.5rem", color: "#94a3b8" }}>
            <TestTube size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
            <div style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: 4 }}>Aucun examen trouvé</div>
            <div style={{ fontSize: "0.8125rem" }}>Modifiez vos filtres ou ajoutez un nouvel examen</div>
          </div>
        )}
      </div>

      {/* ─── Add Exam Modal ─── */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Ajouter un examen">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <FormField label="Nom de l'examen">
            <input value={newExam.nom} onChange={(e) => setNewExam((p) => ({ ...p, nom: e.target.value }))}
              placeholder="Ex: Analyse sanguine" style={inputStyle} />
          </FormField>
          <FormField label="Lieu">
            <input value={newExam.lieu} onChange={(e) => setNewExam((p) => ({ ...p, lieu: e.target.value }))}
              placeholder="Laboratoire, hôpital..." style={inputStyle} />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <FormField label="Date prévue">
              <input type="date" value={newExam.date} onChange={(e) => setNewExam((p) => ({ ...p, date: e.target.value }))} style={inputStyle} />
            </FormField>
            <FormField label="Durée estimée">
              <input value={newExam.dureeEstimee} onChange={(e) => setNewExam((p) => ({ ...p, dureeEstimee: e.target.value }))}
                placeholder="Ex: 30 min" style={inputStyle} />
            </FormField>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <FormField label="Statut">
              <select value={newExam.statut} onChange={(e) => setNewExam((p) => ({ ...p, statut: e.target.value as ExamStatus }))} style={inputStyle}>
                <option value="Planifié">Planifié</option>
                <option value="Confirmé">Confirmé</option>
              </select>
            </FormField>
            <FormField label="Contexte">
              <select value={newExam.contexte} onChange={(e) => setNewExam((p) => ({ ...p, contexte: e.target.value as ExamContext }))} style={inputStyle}>
                <option value="Consultation">Consultation</option>
                <option value="Hospitalisation">Hospitalisation</option>
              </select>
            </FormField>
          </div>
          <FormField label="Lié à">
            <select value={newExam.contextId} onChange={(e) => setNewExam((p) => ({ ...p, contextId: e.target.value }))} style={inputStyle}>
              <option value="">Sélectionner...</option>
              {newExam.contexte === "Consultation"
                ? CONSULTATIONS.filter((c) => c.patientId === "P001").map((c) => (
                    <option key={c.id} value={c.id}>{c.motif} ({c.date})</option>
                  ))
                : HOSPITALISATIONS.filter((h) => h.patientId === "P001").map((h) => (
                    <option key={h.id} value={h.id}>{h.motif} ({h.dateAdmission})</option>
                  ))
              }
            </select>
          </FormField>
          <button onClick={handleAddExam} style={{
            width: "100%", padding: "0.75rem", borderRadius: "0.75rem", border: "none",
            background: "#163344", color: "white", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer",
          }}>
            Ajouter l'examen
          </button>
        </div>
      </Modal>

      {/* ─── Result Modal ─── */}
      <ResultModal
        open={showResultModal} onClose={() => setShowResultModal(false)}
        examId={resultExamId} exams={exams} setExams={setExams} setSelectedExam={setSelectedExam}
      />
    </div>
  );
};

/* ════ MODAL wrapper ════ */
const Modal = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
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
          background: "white", borderRadius: "1rem", width: "100%", maxWidth: 500,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
        }}
      >
        <div style={{
          padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
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

/* ════ RESULT MODAL ════ */
const ResultModal = ({ open, onClose, examId, exams, setExams, setSelectedExam }: {
  open: boolean; onClose: () => void; examId: string | null;
  exams: Exam[]; setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  setSelectedExam: React.Dispatch<React.SetStateAction<Exam | null>>;
}) => {
  const [data, setData] = useState({ dateResultat: "", commentaireMedecin: "", interpretation: "" });

  const handleSave = () => {
    if (!examId) return;
    const result: ExamResult = { ...data, fichiers: [{ nom: "resultat_upload.pdf", type: "pdf" }] };
    setExams((prev) => prev.map((e) => e.id === examId ? { ...e, resultat: result, statut: "Réalisé" as ExamStatus } : e));
    setSelectedExam((prev) => prev?.id === examId ? { ...prev, resultat: result, statut: "Réalisé" as ExamStatus } : prev);
    setData({ dateResultat: "", commentaireMedecin: "", interpretation: "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Ajouter les résultats">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <FormField label="Date du résultat">
          <input type="date" value={data.dateResultat} onChange={(e) => setData((p) => ({ ...p, dateResultat: e.target.value }))} style={inputStyle} />
        </FormField>
        <FormField label="Commentaire du médecin">
          <textarea value={data.commentaireMedecin} onChange={(e) => setData((p) => ({ ...p, commentaireMedecin: e.target.value }))}
            placeholder="Commentaire..." rows={2} style={{ ...inputStyle, resize: "vertical" }} />
        </FormField>
        <FormField label="Interprétation médicale">
          <textarea value={data.interpretation} onChange={(e) => setData((p) => ({ ...p, interpretation: e.target.value }))}
            placeholder="Analyse détaillée..." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        </FormField>
        <FormField label="Fichiers">
          <div style={{
            border: "2px dashed #e2e8f0", borderRadius: "0.75rem", padding: "1.5rem",
            textAlign: "center", cursor: "pointer", background: "#fafafa",
          }}>
            <Upload size={28} color="#94a3b8" style={{ margin: "0 auto 8px", display: "block" }} />
            <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Cliquez pour télécharger</div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>PDF, JPG, PNG — Max 10 Mo</div>
          </div>
        </FormField>
        <button onClick={handleSave} style={{
          width: "100%", padding: "0.75rem", borderRadius: "0.75rem", border: "none",
          background: "#163344", color: "white", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer",
        }}>
          Enregistrer les résultats
        </button>
      </div>
    </Modal>
  );
};

/* ════ HELPERS ════ */
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

export default Examens;