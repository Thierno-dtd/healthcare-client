import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CONSULTATIONS, HOSPITALISATIONS, EXAMS } from "@shared/data/mock-data";
import {
  TestTube, Plus, Eye, FileText, Calendar, MapPin, Clock, Stethoscope, Building2,
  Upload, CheckCircle, XCircle, AlertTriangle, ArrowLeft, Image as ImageIcon,
  Download, X
} from "lucide-react";
import { motion } from "framer-motion";

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


/* ─── Status config ─── */
const STATUS_CFG: Record<ExamStatus, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  "Planifié":     { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", icon: <Calendar size={11} /> },
  "Confirmé":     { color: "#10b981", bg: "#ecfdf5", border: "#6ee7b7", icon: <CheckCircle size={11} /> },
  "Reporté":      { color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", icon: <AlertTriangle size={11} /> },
  "Réalisé":      { color: "#163344", bg: "#f1f5f9", border: "#cbd5e1", icon: <CheckCircle size={11} /> },
  "Non réalisé":  { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: <XCircle size={11} /> },
};

const card: React.CSSProperties = {
  backgroundColor: "white", borderRadius: "1rem",
  border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden",
};

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

/* ════ MODAL ════ */
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

/* ════ RESULT MODAL ════ */
const ResultModal = ({ open, onClose, exam, onSave }: {
  open: boolean; onClose: () => void;
  exam: Exam | null;
  onSave: (result: ExamResult) => void;
}) => {
  const [data, setData] = useState({ dateResultat: "", commentaireMedecin: "", interpretation: "" });

  const handleSave = () => {
    const result: ExamResult = { ...data, fichiers: [{ nom: "resultat_upload.pdf", type: "pdf" }] };
    onSave(result);
    setData({ dateResultat: "", commentaireMedecin: "", interpretation: "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={exam?.resultat ? "Modifier les résultats" : "Ajouter les résultats"}>
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

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const ExamenDetail = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  // Local state to allow status changes & result updates within the detail page
  const [exams, setExams] = useState<Exam[]>(EXAMS);
  const [showResultModal, setShowResultModal] = useState(false);

  const exam = exams.find((e) => e.id === examId);

  const handleStatusChange = (newStatus: ExamStatus) => {
    if (!exam) return;
    setExams((prev) => prev.map((e) => e.id === exam.id ? { ...e, statut: newStatus } : e));
  };

  const handleSaveResult = (result: ExamResult) => {
    if (!exam) return;
    setExams((prev) => prev.map((e) => e.id === exam.id ? { ...e, resultat: result, statut: "Réalisé" as ExamStatus } : e));
  };

  const getContextLabel = (e: Exam) => {
    if (e.contexte === "Consultation") {
      const c = CONSULTATIONS.find((c) => c.id === e.contextId);
      return c ? `Consultation · ${c.motif} (${c.date})` : "Consultation";
    }
    const h = HOSPITALISATIONS.find((h) => h.id === e.contextId);
    return h ? `Hospitalisation · ${h.motif} (${h.dateAdmission})` : "Hospitalisation";
  };

  if (!exam) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
        <TestTube size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
        <div style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: 8 }}>Examen introuvable</div>
        <button onClick={() => navigate("/examens")} style={{
          padding: "0.625rem 1.25rem", borderRadius: "0.75rem", border: "none",
          background: "#163344", color: "white", fontWeight: 600, cursor: "pointer",
        }}>
          Retour aux examens
        </button>
      </div>
    );
  }

  // Re-read from state so status updates are reflected
  const currentExam = exams.find((e) => e.id === examId)!;

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Back */}
      <button onClick={() => navigate("/examens")} style={{
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
                  <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#1f2937" }}>{currentExam.nom}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: 3 }}>{currentExam.lieu}</div>
                </div>
              </div>
              <StatusBadge statut={currentExam.statut} />
            </div>

            <div style={{ padding: "1.25rem 1.5rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              {[
                { icon: <Calendar size={14} color="#94a3b8" />, label: "Date",          value: currentExam.date },
                { icon: <Clock size={14} color="#94a3b8" />,    label: "Durée estimée", value: currentExam.dureeEstimee },
                { icon: <MapPin size={14} color="#94a3b8" />,   label: "Lieu",          value: currentExam.lieu },
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
                  {currentExam.contexte === "Consultation"
                    ? <Stethoscope size={16} color="#3b82f6" />
                    : <Building2 size={16} color="#3b82f6" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {getContextLabel(currentExam)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{currentExam.contexte}</div>
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
              {!currentExam.resultat && (
                <button onClick={() => setShowResultModal(true)} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: "0.625rem", border: "none",
                  background: "#163344", color: "white", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                }}>
                  <Plus size={13} /> Ajouter résultats
                </button>
              )}
            </div>
            <div style={{ padding: "1.25rem 1.5rem" }}>
              {currentExam.resultat ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {[
                      { label: "Date du résultat",        value: currentExam.resultat.dateResultat },
                      { label: "Commentaire du médecin",  value: currentExam.resultat.commentaireMedecin },
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
                      {currentExam.resultat.interpretation}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Fichiers joints</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {currentExam.resultat.fichiers.map((f, i) => (
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
              {currentExam.statut === "Planifié" && (
                <button onClick={() => handleStatusChange("Confirmé")} style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "0.625rem", borderRadius: "0.625rem", border: "none",
                  background: "#10b981", color: "white", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                }}>
                  <CheckCircle size={15} /> Confirmer ma présence
                </button>
              )}
              {(currentExam.statut === "Planifié" || currentExam.statut === "Confirmé") && (
                <button onClick={() => handleStatusChange("Reporté")} style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "0.625rem", borderRadius: "0.625rem",
                  border: "1px solid #fcd34d", background: "#fffbeb",
                  color: "#f59e0b", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                }}>
                  <AlertTriangle size={15} /> Reporter l'examen
                </button>
              )}
              {currentExam.statut !== "Réalisé" && (
                <button onClick={() => handleStatusChange("Réalisé")} style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "0.625rem", borderRadius: "0.625rem",
                  border: "1px solid #e2e8f0", background: "white",
                  color: "#374151", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                }}>
                  <CheckCircle size={15} /> Marquer comme réalisé
                </button>
              )}
              <button onClick={() => setShowResultModal(true)} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "0.625rem", borderRadius: "0.625rem",
                border: "1px solid #e2e8f0", background: "white",
                color: "#374151", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
              }}>
                <Upload size={15} /> {currentExam.resultat ? "Modifier résultats" : "Ajouter résultats"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResultModal
        open={showResultModal}
        onClose={() => setShowResultModal(false)}
        exam={currentExam}
        onSave={handleSaveResult}
      />

      <style>{`@media (max-width: 900px) { .exam-detail-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default ExamenDetail;