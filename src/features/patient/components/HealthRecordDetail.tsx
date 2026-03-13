// ============================================================
// HealthRecordDetail — Détail d'un événement médical
// Route  : /patient/dossier/:eventId
// IDs attendus : cons_001 | cons_002 | hosp_001
// Navigation :
//   - examen réalisé   → /examens/:examId        (ExamenDetail via useExamDetail)
//   - examen planifié  → /examens?prefill=1&...   (pré-remplissage formulaire)
//   - ordonnance       → /patient/ordonnances/:ord.id  (OrdonnanceDetail via useOrdonnanceDetail)
// ============================================================

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Stethoscope, BedDouble, Calendar, MapPin, User, Clock,
  ArrowLeft, TestTube, Pill, CheckCircle, Plus,
  ChevronRight, AlertCircle,
} from "lucide-react";

import {
  CONSULTATIONS,
  HOSPITALISATIONS,
  getExamensForConsultation,
  getOrdonnancesForConsultation,
} from "@shared/data/mock-data";
import type { ExamenPatient, Prescription } from "@shared/data/mock-data";
import type {
  ConsultationRecord,
  HospitalisationRecord,
  OrdonnanceRecord,
} from "@shared/types/patient-record.types";

/* ─── Styles partagés ─── */
const card: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "1rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  border: "1px solid #e2e8f0",
  overflow: "hidden",
};

const sLabel: React.CSSProperties = {
  fontSize: "0.6875rem",
  fontWeight: 700,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: 10,
};

/* ─── Badge examen ─── */
const ExamBadge = ({ statut }: { statut: ExamenPatient["statut"] }) => {
  const cfg: Record<ExamenPatient["statut"], { color: string; bg: string; border: string }> = {
    "Réalisé":     { color: "#163344", bg: "#f1f5f9", border: "#cbd5e1" },
    "Planifié":    { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
    "Confirmé":    { color: "#10b981", bg: "#ecfdf5", border: "#6ee7b7" },
    "Reporté":     { color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d" },
    "Non réalisé": { color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  };
  const s = cfg[statut] ?? cfg["Planifié"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: "9999px",
      fontSize: "0.6875rem", fontWeight: 700,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {statut === "Réalisé" ? <CheckCircle size={9} /> : <TestTube size={9} />}
      {statut}
    </span>
  );
};

/* ─── Badge ordonnance ─── */
const OrdBadge = ({ statut }: { statut: string }) => {
  const isActive   = statut === "Active";
  const isTerminee = statut === "Terminée";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: "9999px",
      fontSize: "0.6875rem", fontWeight: 700,
      background: isActive ? "#ecfdf5" : isTerminee ? "#f1f5f9" : "#fffbeb",
      color:      isActive ? "#10b981" : isTerminee ? "#94a3b8" : "#f59e0b",
      border:     `1px solid ${isActive ? "#6ee7b7" : isTerminee ? "#e2e8f0" : "#fcd34d"}`,
    }}>
      <Pill size={9} />
      {statut}
    </span>
  );
};

/* ════════════════════════════════════════════
   COMPOSANT PRINCIPAL
════════════════════════════════════════════ */
const HealthRecordDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate    = useNavigate();

  // ── Résolution de l'événement (cons_001 | cons_002 | hosp_001) ──
  const consultation    = CONSULTATIONS.find((c) => c.id === eventId);
  const hospitalisation = HOSPITALISATIONS.find((h) => h.id === eventId);
  const isConsult = !!consultation;
  const event     = consultation ?? hospitalisation;

  // ── Données liées via helpers mock-data ──
  // Les helpers filtrent par consultationId → retournent les vrais IDs (ord_001, exam_pat_001...)
  const examens: ExamenPatient[] = isConsult
    ? getExamensForConsultation(eventId!)
    : [];

  const ordonnances: Prescription[] = isConsult
    ? getOrdonnancesForConsultation(eventId!)
    : [];

  /* Événement introuvable */
  if (!event) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
        <AlertCircle size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
        <div style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: 8 }}>Événement introuvable</div>
        <div style={{ fontSize: "0.8125rem", color: "#94a3b8", marginBottom: 16 }}>
          ID reçu : <code>{eventId}</code>
        </div>
        <button
          onClick={() => navigate("/patient/dossier")}
          style={{
            padding: "0.625rem 1.25rem", borderRadius: "0.75rem", border: "none",
            background: "#163344", color: "white", fontWeight: 600, cursor: "pointer",
          }}
        >
          Retour au carnet
        </button>
      </div>
    );
  }

  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }); }
    catch { return d; }
  };

  const c = consultation as ConsultationRecord | undefined;
  const h = hospitalisation as HospitalisationRecord | undefined;

  const fields: { label: string; value?: string }[] = isConsult
    ? [
        { label: "Médecin",                value: c?.medecin },
        { label: "Type d'arrivée",         value: c?.typeArrivee },
        { label: "Diagnostic",             value: c?.diagnostic },
        { label: "Histoire de la maladie", value: c?.histoireMaladie },
        { label: "Examen clinique",        value: c?.examenClinique },
        { label: "Résumé syndromique",     value: c?.resumeSyndromique },
        { label: "Conduite à tenir",       value: c?.conduiteATenir },
        { label: "Évolution",              value: c?.evolution },
        { label: "Traitements habituels",  value: c?.traitementsHabituels?.join(", ") },
      ]
    : [
        { label: "Service",               value: h?.service },
        { label: "Chambre",               value: h?.chambre },
        { label: "Durée",                 value: h?.duree },
        { label: "Diagnostic final",      value: h?.diagnosticFinal },
        { label: "Traitement à la sortie",value: h?.traitementSortie },
        { label: "Bilan à réaliser",      value: h?.bilanARealiser },
        { label: "Prochain RDV",          value: h?.prochainRdv },
        { label: "Médecins",              value: h?.medecins?.join(", ") },
      ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      {/* ── Retour ── */}
      <button
        onClick={() => navigate("/patient/dossier")}
        style={{
          display: "flex", alignItems: "center", gap: 6, width: "fit-content",
          fontSize: "0.875rem", fontWeight: 600, color: "#3b82f6",
          background: "none", border: "none", cursor: "pointer", padding: 0,
        }}
      >
        <ArrowLeft size={16} /> Retour au carnet
      </button>

      <div style={card}>

        {/* ── En-tête ── */}
        <div style={{
          padding: "1.75rem",
          background: isConsult
            ? "linear-gradient(135deg, #ecfdf5, #d1fae5)"
            : "linear-gradient(135deg, #fff7ed, #fed7aa)",
          borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "flex-start", gap: "1rem",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "0.875rem", flexShrink: 0,
            background: isConsult ? "#10b981" : "#f97316",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}>
            {isConsult ? <Stethoscope size={24} color="white" /> : <BedDouble size={24} color="white" />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.08em", color: isConsult ? "#065f46" : "#9a3412", marginBottom: 6,
            }}>
              {isConsult ? "Consultation médicale" : "Hospitalisation"}
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1f2937", lineHeight: 1.2 }}>
              {isConsult ? c?.motif : h?.motif}
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "#64748b" }}>
                <Calendar size={12} />
                {isConsult
                  ? fmtDate(c?.date ?? "")
                  : `${fmtDate(h?.dateAdmission ?? "")} → ${h?.dateSortie ? fmtDate(h.dateSortie) : "En cours"}`}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "#64748b" }}>
                <MapPin size={12} /> {isConsult ? c?.hopital : h?.hopital}
              </span>
              {isConsult && c?.heure && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "#64748b" }}>
                  <Clock size={12} /> {c.heure}
                </span>
              )}
              {isConsult && c?.medecin && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "#64748b" }}>
                  <User size={12} /> {c.medecin}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Champs détail ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 3rem", padding: "0 1.75rem" }}>
          {fields.filter((f) => f.value).map((f, idx) => (
            <div key={f.label + idx} style={{ padding: "14px 0", borderBottom: "1px solid #f8fafc" }}>
              <div style={{ ...sLabel, marginBottom: 4 }}>{f.label}</div>
              <span style={{ fontSize: "0.875rem", color: "#1f2937", lineHeight: 1.6 }}>{f.value}</span>
            </div>
          ))}
        </div>

        {/* ── Tags antécédents (consultation) ── */}
        {isConsult && (c?.antecedentsPersonnels?.length ?? 0) > 0 && (
          <div style={{ padding: "1rem 1.75rem" }}>
            <div style={sLabel}>Antécédents personnels</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {c!.antecedentsPersonnels.map((a, i) => (
                <span key={i} style={{
                  padding: "3px 12px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600,
                  background: "#fff7ed", color: "#9a3412", border: "1px solid #fed7aa",
                }}>{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── Tags hypothèses (consultation) ── */}
        {isConsult && (c?.hypothesesDiagnostiques?.length ?? 0) > 0 && (
          <div style={{ padding: "0 1.75rem 1rem" }}>
            <div style={sLabel}>Hypothèses diagnostiques</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {c!.hypothesesDiagnostiques.map((hd, i) => (
                <span key={i} style={{
                  padding: "3px 12px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600,
                  background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe",
                }}>{hd}</span>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            EXAMENS PRESCRITS
            • Réalisé (vert)  → /examens/:exam.id   (useExamDetail cherche dans MOCK_EXAMS par id)
            • Planifié (gris) → /examens?prefill=1&... (champs pré-remplis)
        ══════════════════════════════════════ */}
        <div style={{ padding: "1rem 1.75rem 1.5rem" }}>
          <div style={sLabel}>Examens prescrits ({examens.length})</div>

          {examens.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "#94a3b8", margin: 0 }}>
              Aucun examen prescrit pour cet événement
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {examens.map((exam) => {
                const isDone = exam.statut === "Réalisé";

                const handleClick = () => {
                  if (isDone) {
                    navigate(`/examens/${exam.id}`);
                  } else {
                    const p = new URLSearchParams({
                      prefill:        "1",
                      type:           exam.type,
                      consultationId: exam.consultationId,
                      medecin:        exam.medecin,
                      medecinId:      exam.medecinId,
                      hopital:        exam.hopital,
                      service:        exam.service,
                      motif:          exam.motif,
                    });
                    navigate(`/examens?${p.toString()}`);
                  }
                };

                return (
                  <div
                    key={exam.id}
                    onClick={handleClick}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.875rem",
                      padding: "0.75rem 1rem", borderRadius: "0.75rem",
                      border: `1.5px solid ${isDone ? "#6ee7b7" : "#e2e8f0"}`,
                      background: isDone ? "#f0fdf4" : "#f8fafc",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border      = `1.5px solid ${isDone ? "#10b981" : "#163344"}`;
                      e.currentTarget.style.boxShadow   = "0 2px 8px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border      = `1.5px solid ${isDone ? "#6ee7b7" : "#e2e8f0"}`;
                      e.currentTarget.style.boxShadow   = "none";
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: "0.625rem", flexShrink: 0,
                      background: isDone ? "#10b981" : "#e2e8f0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <TestTube size={16} color={isDone ? "white" : "#94a3b8"} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: "0.875rem", fontWeight: 700,
                        color: isDone ? "#1f2937" : "#64748b",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {exam.type}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 2 }}>
                        {exam.hopital} · {exam.date}
                      </div>
                      {isDone && exam.resultats && (
                        <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2, fontStyle: "italic" }}>
                          {exam.resultats}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <ExamBadge statut={exam.statut} />
                      {isDone
                        ? <ChevronRight size={14} color="#10b981" />
                        : (
                          <span style={{
                            display: "flex", alignItems: "center", gap: 4,
                            fontSize: "0.6875rem", fontWeight: 700, color: "#163344",
                          }}>
                            <Plus size={11} /> Saisir
                          </span>
                        )
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════
            ORDONNANCES ASSOCIÉES
            Clic → /patient/ordonnances/:ord.id
            OrdonnanceDetail utilise useOrdonnanceDetail(ordonnanceId)
            → ordonnancePatientService.getOrdonnance(id)
            → ORDONNANCES_RECORD.find(o => o.id === ordonnanceId) ✅ IDs : ord_001, ord_002, ord_003
        ══════════════════════════════════════ */}
        <div style={{ padding: "0 1.75rem 1.75rem" }}>
          <div style={sLabel}>Ordonnances associées ({ordonnances.length})</div>

          {ordonnances.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "#94a3b8", margin: 0 }}>
              Aucune ordonnance pour cet événement
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ordonnances.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => navigate(`/patient/ordonnances/${ord.id}`)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.875rem",
                    padding: "0.75rem 1rem", borderRadius: "0.75rem",
                    border: "1.5px solid #e2e8f0", background: "#fafafa",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border    = "1.5px solid #163344";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border    = "1.5px solid #e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: "0.625rem", flexShrink: 0,
                    background: "#f0fdf4",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Pill size={16} color="#10b981" />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1f2937" }}>
                      Ordonnance du {ord.date}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>
                      {ord.medecin} · {ord.medicaments.length} médicament{ord.medicaments.length > 1 ? "s" : ""}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                      {ord.medicaments.map((m, i) => (
                        <span key={i} style={{
                          padding: "1px 8px", borderRadius: "9999px",
                          fontSize: "0.6875rem", fontWeight: 600,
                          background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0",
                        }}>
                          {m.nom} {m.dosage}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <OrdBadge statut={ord.status} />
                    <span style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: "0.8125rem", fontWeight: 600, color: "#3b82f6",
                    }}>
                      Détails <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default HealthRecordDetail;