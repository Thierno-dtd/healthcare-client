import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import {
  Stethoscope, BedDouble, Calendar, MapPin,
  Download, ChevronRight, FileText, Activity,
  User, Filter
} from "lucide-react";

import { useHealthRecord } from "../hooks/useHealthRecord";
import type { TimelineEvent, PassageType } from "../types/healthRecord.types";

const HealthRecord = () => {
  const patientId = 'pat_001';
  const { patient: patientQuery, consultations, hospitalisations } = useHealthRecord(patientId);
  const patient = patientQuery.data;

  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"tous" | "consultation" | "hospitalisation">("tous");

  const allEvents: TimelineEvent[] = [
    ...(consultations.data ?? []).map((c) => ({
      id: c.id, type: "consultation" as const, date: c.date, hopital: c.hopital, motif: c.motif,
      diagnostic: c.diagnostic, medecin: c.medecin, resumeSyndromique: c.resumeSyndromique,
      examens: c.examensParacliniques, traitement: c.conduiteATenir, evolution: c.evolution,
    })),
    ...(hospitalisations.data ?? []).map((h) => ({
      id: h.id, type: "hospitalisation" as const, date: h.dateAdmission, hopital: h.hopital,
      motif: h.motif, diagnostic: h.diagnosticFinal, service: h.service,
      datesSejour: `${h.dateAdmission} → ${h.dateSortie || "En cours"}`,
      traitement: h.traitementSortie, prochainRdv: h.prochainRdv, bilan: h.bilanARealiser,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const events = filterType === "tous"
    ? allEvents
    : allEvents.filter((e) => e.type === filterType);

  if (!patient) return <div>Chargement...</div>;

  const consultCount = allEvents.filter((e) => e.type === "consultation").length;
  const hospitCount  = allEvents.filter((e) => e.type === "hospitalisation").length;
  const isConsult    = (t: PassageType) => t === "consultation";

  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }); }
    catch { return d; }
  };

  const getYear = (d: string) => d.slice(0, 4);
  const grouped = events.reduce<Record<string, TimelineEvent[]>>((acc, e) => {
    const yr = getYear(e.date);
    if (!acc[yr]) acc[yr] = [];
    acc[yr].push(e);
    return acc;
  }, {});
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  const card: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  };

  const filterBtn = (active: boolean): React.CSSProperties => ({
    padding: "6px 16px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600,
    border: `1.5px solid ${active ? "#163344" : "#e2e8f0"}`,
    background: active ? "#163344" : "white",
    color: active ? "white" : "#64748b",
    cursor: "pointer", transition: "all 0.15s",
  });

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
        <div style={{ position: "absolute", right: 60, bottom: -50, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FileText size={20} color="white" />
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{patient.nom}</div>
          </div>
          <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
            {patient.id} · groupe sanguin : {patient.groupeSanguin} · {patient.age} ans
          </div>
        </div>

        <button
          style={{
            position: "relative", zIndex: 1,
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.625rem 1.25rem", borderRadius: "0.75rem",
            background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)", color: "white",
            fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
        >
          <Download size={15} /> Télécharger (PDF)
        </button>
      </div>

      {/* ─── Stats cards ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[
          { label: "Total passages",    value: allEvents.length,  icon: <Activity size={20} />,    color: "#3b82f6", bg: "#eff6ff" },
          { label: "Consultations",     value: consultCount,       icon: <Stethoscope size={20} />, color: "#10b981", bg: "#ecfdf5" },
          { label: "Hospitalisations",  value: hospitCount,        icon: <BedDouble size={20} />,   color: "#f97316", bg: "#fff7ed" },
        ].map((s) => (
          <div key={s.label} style={{ ...card, padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 46, height: 46, borderRadius: "0.75rem", flexShrink: 0,
              background: s.bg, color: s.color,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1f2937", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════ TIMELINE VIEW ══════ */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
        {/* Header + filters */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "#1f2937" }}>
            Historique de vos passages médicaux
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Filter size={14} color="#94a3b8" />
            {(["tous", "consultation", "hospitalisation"] as const).map((f) => (
              <button key={f} style={filterBtn(filterType === f)} onClick={() => setFilterType(f)}>
                {f === "tous" ? "Tous" : f === "consultation" ? "Consultations" : "Hospitalisations"}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped timeline */}
        {years.map((year) => (
          <div key={year} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <span style={{
                padding: "3px 14px", borderRadius: "9999px",
                background: "#163344", color: "white",
                fontSize: "0.8125rem", fontWeight: 700, flexShrink: 0,
              }}>{year}</span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {grouped[year].map((event, i) => {
                const isC   = isConsult(event.type);
                const isHov = hoveredId === event.id;
                return (
                  <motion.div key={event.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <div
                      onClick={() => navigate(`/patient/dossier/${event.id}`)}
                      onMouseEnter={() => setHoveredId(event.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "0.875rem",
                        border: `1.5px solid ${isHov ? (isC ? "#10b981" : "#f97316") : "#e2e8f0"}`,
                        padding: "1.25rem",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        boxShadow: isHov ? `0 4px 16px ${isC ? "#10b98118" : "#f9731618"}` : "0 1px 3px rgba(0,0,0,0.04)",
                        display: "flex", alignItems: "center", gap: "1rem",
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: 46, height: 46, borderRadius: "0.75rem", flexShrink: 0,
                        background: isC ? "#ecfdf5" : "#fff7ed",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isC
                          ? <Stethoscope size={20} color="#10b981" />
                          : <BedDouble size={20} color="#f97316" />}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: 5, flexWrap: "wrap" }}>
                          <span style={{
                            padding: "2px 10px", borderRadius: "9999px",
                            fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                            background: isC ? "#ecfdf5" : "#fff7ed",
                            color: isC ? "#065f46" : "#9a3412",
                          }}>
                            {isC ? "Consultation" : "Hospitalisation"}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#94a3b8" }}>
                            <Calendar size={11} /> {fmtDate(event.date)}
                          </span>
                        </div>
                        <div style={{
                          fontSize: "0.9375rem", fontWeight: 700, color: "#1f2937", marginBottom: 4,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {event.motif}
                        </div>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#64748b" }}>
                            <MapPin size={11} /> {event.hopital}
                          </span>
                          {event.medecin && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#64748b" }}>
                              <User size={11} /> {event.medecin}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: 5 }}>
                          <strong style={{ color: "#374151" }}>Diagnostic :</strong> {event.diagnostic}
                        </div>
                      </div>

                      {/* CTA */}
                      <div style={{
                        display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
                        fontSize: "0.8125rem", fontWeight: 600,
                        color: isHov ? (isC ? "#10b981" : "#f97316") : "#94a3b8",
                        transition: "color 0.15s",
                      }}>
                        Résumé <ChevronRight size={15} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1.5rem", color: "#94a3b8" }}>
            <Activity size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: "0.875rem" }}>Aucun passage trouvé</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HealthRecord;