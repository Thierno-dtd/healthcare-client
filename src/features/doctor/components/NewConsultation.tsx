import { useAuthStore } from "@/core/auth/auth.store";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

/* ─── Types ─── */
interface MedicamentForm {
  nom: string;
  dosage: string;
  posologie: string;
  duree: string;
}

interface AnalyseForm {
  type: string;
  urgence: string;
  instructions: string;
}

interface AntecedentEntry {
  id: string;
  label: string;
}

/* ─── Helpers ─── */
const Section: React.FC<{ icon: string; title: string; children: React.ReactNode ; onClose?: () => void;}> = ({
  icon,
  title,
  children,
  onClose
}) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      overflow: "hidden",
      marginBottom: 16,
    }}
  >
    <div
      style={{
        padding: "12px 20px",
        borderBottom: "1px solid #f3f4f6",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <i className={icon} style={{ color: "#22c55e", fontSize: 14 }} />
      <span style={{ fontWeight: 600, fontSize: 14, color: "#163344" }}>{title}</span>
       {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-sm text-muted-foreground hover:text-foreground"
          style={{ marginLeft: "auto", cursor: "pointer", color: "#6b7280" }}
        >
          ✕ Fermer
        </button>
      )}
    </div>
    <div style={{ padding: "16px 20px" }}>{children}</div>
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "#6b7280",
      marginBottom: 6,
    }}
  >
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  fontSize: 13,
  border: "1px solid #d1d5db",
  borderRadius: 8,
  outline: "none",
  background: "#fff",
  color: "#1f2937",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 90,
  fontFamily: "inherit",
  lineHeight: 1.5,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  backgroundSize: "18px",
  paddingRight: 34,
  cursor: "pointer",
};

const TagBadge: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "#f0fdf4",
      color: "#15803d",
      border: "1px solid #bbf7d0",
      borderRadius: 20,
      padding: "3px 10px",
      fontSize: 12,
      fontWeight: 500,
    }}
  >
    {label}
    <button
      onClick={onRemove}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#6b7280",
        padding: 0,
        lineHeight: 1,
        fontSize: 13,
      }}
    >
      ×
    </button>
  </span>
);

/* ─── Main Component ─── */
const NouvelleConsultation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId") || "";
  const { user } = useAuthStore();

  /* Basic info */
  const [typeArrivee, setTypeArrivee] = useState("Sur rendez-vous");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [motif, setMotif] = useState("");

  /* Anamnèse */
  const [histoire, setHistoire] = useState("");
  const [antecedentsPerso, setAntecedentsPerso] = useState<AntecedentEntry[]>([
    { id: "1", label: "Hypertension artérielle (2018)" },
    { id: "2", label: "Appendicectomie (2005)" },
  ]);
  const [antecedentsFamiliaux, setAntecedentsFamiliaux] = useState<AntecedentEntry[]>([
    { id: "1", label: "Diabète type 2 (mère)" },
    { id: "2", label: "Cancer du côlon (père)" },
  ]);
  const [traitementsHabituels, setTraitementsHabituels] = useState<AntecedentEntry[]>([
    { id: "1", label: "Amlodipine 5mg - 1cp" },
  ]);
  const [newPerso, setNewPerso] = useState("");
  const [newFamilial, setNewFamilial] = useState("");
  const [newTraitement, setNewTraitement] = useState("");

  /* Examen clinique */
  const [examen, setExamen] = useState("");

  /* Synthèse */
  const [resumeSyndromique, setResumeSyndromique] = useState("");
  const [hypotheses, setHypotheses] = useState("");
  const [diagnosticRetenu, setDiagnosticRetenu] = useState("");

  /* Actions */
  const [conduite, setConduite] = useState("");
  const [evolution, setEvolution] = useState("");
  const [showOrdonnance, setShowOrdonnance] = useState(false);
  const [showAnalyses, setShowAnalyses] = useState(false);
  const [hospitaliser, setHospitaliser] = useState(false);

  const [medicaments, setMedicaments] = useState<MedicamentForm[]>([
    { nom: "", dosage: "", posologie: "", duree: "" },
  ]);
  const [analyses, setAnalyses] = useState<AnalyseForm[]>([
    { type: "", urgence: "Normal", instructions: "" },
  ]);

  /* ─── Helpers for dynamic lists ─── */
  const addTag = (
    list: AntecedentEntry[],
    setList: React.Dispatch<React.SetStateAction<AntecedentEntry[]>>,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!value.trim()) return;
    setList([...list, { id: Date.now().toString(), label: value.trim() }]);
    setValue("");
  };

  const removeTag = (
    list: AntecedentEntry[],
    setList: React.Dispatch<React.SetStateAction<AntecedentEntry[]>>,
    id: string
  ) => setList(list.filter((t) => t.id !== id));

  const btnPrimary: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 18px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  };

  const btnOutline: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 18px",
    background: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <div className="page-content">
      {/* ── Page Header ── */}
      <div className="content-header-app">
        <div
          className="header-image"
          style={{
            background:
              "linear-gradient(rgba(22,51,68,0.88), rgba(22,51,68,0.96)), url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80)",
            backgroundSize: "cover",
          }}
        >
          <button
            onClick={() =>
              navigate(
                patientId
                  ? `/medecin/patients/${patientId}/consultations`
                  : "/medecin/patients"
              )
            }
            style={{
              position: "absolute",
              top: 20,
              left: 28,
              background: "rgba(255,255,255,0.12)",
              border: "none",
              color: "#fff",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <i className="fas fa-arrow-left" style={{ fontSize: 12 }} /> Retour
          </button>
          <div className="header-overlay">
            <h1>Dossiers Patients</h1>
            <p>Accédez aux dossiers médicaux de vos patients autorisés</p>
          </div>
        </div>
      </div>

      {/* ── Form Body ── */}
      <div className="content-body" style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* ══ Informations de base ══ */}
        <Section icon="fas fa-stethoscope" title="Informations de base">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Patient */}
            <div>
              <Label>Patient</Label>
              <div style={{ position: "relative" }}>
                <i
                  className="fas fa-user"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    fontSize: 12,
                  }}
                />
                <input
                  style={{ ...inputStyle, paddingLeft: 30 }}
                  value={patientId}
                  readOnly
                />
              </div>
            </div>

            {/* Type d'arrivée */}
            <div>
              <Label>Type d'arrivée</Label>
              <select
                style={selectStyle}
                value={typeArrivee}
                onChange={(e) => setTypeArrivee(e.target.value)}
              >
                <option>Sur rendez-vous</option>
                <option>Sans rendez-vous</option>
                <option>Urgence</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <Label>Date</Label>
              <input
                type="date"
                style={inputStyle}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Heure */}
            <div>
              <Label>Heure</Label>
              <input
                type="time"
                style={inputStyle}
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
              />
            </div>

            {/* Motif — full width */}
            <div style={{ gridColumn: "1 / -1" }}>
              <Label>Motif de consultation</Label>
              <input
                style={inputStyle}
                placeholder="Dc: Douleurs abdominales persistantes"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
              />
            </div>
          </div>
        </Section>

        {/* ══ Anamnèse ══ */}
        <Section icon="fas fa-notes-medical" title="Anamnèse">
          {/* Histoire de la maladie */}
          <div style={{ marginBottom: 18 }}>
            <Label>Histoire de la maladie</Label>
            <textarea
              style={textareaStyle}
              placeholder="Décrire l'histoire de la maladie..."
              value={histoire}
              onChange={(e) => setHistoire(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Antécédents personnels */}
            <div>
              <Label>Antécédents personnels</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {antecedentsPerso.map((t) => (
                  <TagBadge
                    key={t.id}
                    label={t.label}
                    onRemove={() => removeTag(antecedentsPerso, setAntecedentsPerso, t.id)}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Ajouter..."
                  value={newPerso}
                  onChange={(e) => setNewPerso(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    addTag(antecedentsPerso, setAntecedentsPerso, newPerso, setNewPerso)
                  }
                />
                <button
                  onClick={() =>
                    addTag(antecedentsPerso, setAntecedentsPerso, newPerso, setNewPerso)
                  }
                  style={{
                    ...btnPrimary,
                    padding: "9px 12px",
                    borderRadius: 8,
                  }}
                >
                  <i className="fas fa-plus" style={{ fontSize: 12 }} />
                </button>
              </div>
            </div>

            {/* Antécédents familiaux */}
            <div>
              <Label>Antécédents familiaux</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {antecedentsFamiliaux.map((t) => (
                  <TagBadge
                    key={t.id}
                    label={t.label}
                    onRemove={() => removeTag(antecedentsFamiliaux, setAntecedentsFamiliaux, t.id)}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Ajouter..."
                  value={newFamilial}
                  onChange={(e) => setNewFamilial(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    addTag(antecedentsFamiliaux, setAntecedentsFamiliaux, newFamilial, setNewFamilial)
                  }
                />
                <button
                  onClick={() =>
                    addTag(antecedentsFamiliaux, setAntecedentsFamiliaux, newFamilial, setNewFamilial)
                  }
                  style={{ ...btnPrimary, padding: "9px 12px", borderRadius: 8 }}
                >
                  <i className="fas fa-plus" style={{ fontSize: 12 }} />
                </button>
              </div>
            </div>
          </div>

          {/* Traitements habituels */}
          <div style={{ marginTop: 18 }}>
            <Label>Traitements habituels</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {traitementsHabituels.map((t) => (
                <TagBadge
                  key={t.id}
                  label={t.label}
                  onRemove={() => removeTag(traitementsHabituels, setTraitementsHabituels, t.id)}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="Ex: Amlodipine 5mg - 1cp"
                value={newTraitement}
                onChange={(e) => setNewTraitement(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  addTag(traitementsHabituels, setTraitementsHabituels, newTraitement, setNewTraitement)
                }
              />
              <button
                onClick={() =>
                  addTag(traitementsHabituels, setTraitementsHabituels, newTraitement, setNewTraitement)
                }
                style={{ ...btnPrimary, padding: "9px 12px", borderRadius: 8 }}
              >
                <i className="fas fa-plus" style={{ fontSize: 12 }} />
              </button>
            </div>
          </div>
        </Section>

        {/* ══ Examen clinique ══ */}
        <Section icon="fas fa-heartbeat" title="Examen clinique">
          <textarea
            style={{ ...textareaStyle, minHeight: 110 }}
            placeholder="Détaillez l'examen clinique effectué..."
            value={examen}
            onChange={(e) => setExamen(e.target.value)}
          />
        </Section>

        {/* ══ Synthèse ══ */}
        <Section icon="fas fa-clipboard-list" title="Synthèse">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <Label>Résumé syndromique</Label>
              <textarea
                style={{ ...textareaStyle, minHeight: 80 }}
                placeholder="Résumé syndromique..."
                value={resumeSyndromique}
                onChange={(e) => setResumeSyndromique(e.target.value)}
              />
            </div>
            <div>
              <Label>Hypothèses diagnostiques</Label>
              <input
                style={inputStyle}
                placeholder="Séparer par des virgules"
                value={hypotheses}
                onChange={(e) => setHypotheses(e.target.value)}
              />
            </div>
            <div>
              <Label>Diagnostic retenu</Label>
              <input
                style={inputStyle}
                placeholder="Diagnostic final..."
                value={diagnosticRetenu}
                onChange={(e) => setDiagnosticRetenu(e.target.value)}
              />
            </div>
          </div>
        </Section>

        {/* ══ Actions ══ */}
        <Section icon="fas fa-tasks" title="Actions">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <Label>Conduite à tenir (CAT)</Label>
              <textarea
                style={{ ...textareaStyle, minHeight: 80 }}
                placeholder="Décrire la conduite à tenir..."
                value={conduite}
                onChange={(e) => setConduite(e.target.value)}
              />
            </div>
            <div>
              <Label>Évolution</Label>
              <textarea
                style={textareaStyle}
                placeholder="Noter sur l'évolution..."
                value={evolution}
                onChange={(e) => setEvolution(e.target.value)}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
              <button
                onClick={() => setShowOrdonnance(!showOrdonnance)}
                style={{
                  ...btnPrimary,
                  background: showOrdonnance ? "#16a34a" : "#22c55e",
                }}
              >
                <i className="fas fa-prescription" style={{ fontSize: 12 }} />
                Générer une ordonnance
              </button>
              <button
                onClick={() => setShowAnalyses(!showAnalyses)}
                style={{
                  ...btnPrimary,
                  background: showAnalyses ? "#1d4ed8" : "#3b82f6",
                }}
              >
                <i className="fas fa-flask" style={{ fontSize: 12 }} />
                Demander des analyses
              </button>

               <label className="flex items-center gap-2 px-4 py-2.5 bg-warning text-warning-foreground rounded-lg text-sm font-medium cursor-pointer"
               style={{
                  ...btnPrimary,
                  background: hospitaliser ? "#b45309" : "#f59e0b",
                  color: hospitaliser ? "#fff" : "#1f2937",
                }}
               >
                
              <input type="checkbox" checked={hospitaliser} onChange={(e) => setHospitaliser(e.target.checked)} className="rounded" />
              <i className="fas fa-hospital" style={{ fontSize: 12 }} />
              Hospitaliser le patient
            </label>
            </div>
          </div>
        </Section>

        {/* ══ Ordonnance (conditionnelle) ══ */}
        {showOrdonnance && (
          <Section icon="fas fa-prescription" title="Ordonnance" onClose={() => setShowOrdonnance(false)}>
            {medicaments.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                  gap: 10,
                  marginBottom: 10,
                  alignItems: "end",
                }}
              >
                <div>
                  {i === 0 && <Label>Médicament</Label>}
                  <input
                    style={inputStyle}
                    placeholder="Nom du médicament"
                    value={m.nom}
                    onChange={(e) => {
                      const updated = [...medicaments];
                      updated[i].nom = e.target.value;
                      setMedicaments(updated);
                    }}
                  />
                </div>
                <div>
                  {i === 0 && <Label>Dosage</Label>}
                  <input
                    style={inputStyle}
                    placeholder="500mg"
                    value={m.dosage}
                    onChange={(e) => {
                      const updated = [...medicaments];
                      updated[i].dosage = e.target.value;
                      setMedicaments(updated);
                    }}
                  />
                </div>
                <div>
                  {i === 0 && <Label>Posologie</Label>}
                  <input
                    style={inputStyle}
                    placeholder="3×/jour"
                    value={m.posologie}
                    onChange={(e) => {
                      const updated = [...medicaments];
                      updated[i].posologie = e.target.value;
                      setMedicaments(updated);
                    }}
                  />
                </div>
                <div>
                  {i === 0 && <Label>Durée</Label>}
                  <input
                    style={inputStyle}
                    placeholder="7 jours"
                    value={m.duree}
                    onChange={(e) => {
                      const updated = [...medicaments];
                      updated[i].duree = e.target.value;
                      setMedicaments(updated);
                    }}
                  />
                </div>
                <button
                  onClick={() => setMedicaments(medicaments.filter((_, idx) => idx !== i))}
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#ef4444",
                    borderRadius: 8,
                    width: 36,
                    height: 36,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: i === 0 ? 22 : 0,
                  }}
                >
                  <i className="fas fa-trash" style={{ fontSize: 12 }} />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setMedicaments([...medicaments, { nom: "", dosage: "", posologie: "", duree: "" }])
              }
              style={{ ...btnOutline, marginTop: 4 }}
            >
              <i className="fas fa-plus" style={{ fontSize: 11 }} /> Ajouter un médicament
            </button>
          </Section>
        )}

        {/* ══ Analyses (conditionnelle) ══ */}
        {showAnalyses && (
          <Section icon="fas fa-flask" title="Demande d'analyses" onClose={() => setShowAnalyses(false)}>
            {analyses.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr auto",
                  gap: 10,
                  marginBottom: 10,
                  alignItems: "end",
                }}
              >
                <div>
                  {i === 0 && <Label>Type d'analyse</Label>}
                  <input
                    style={inputStyle}
                    placeholder="Ex: NFS, Glycémie..."
                    value={a.type}
                    onChange={(e) => {
                      const updated = [...analyses];
                      updated[i].type = e.target.value;
                      setAnalyses(updated);
                    }}
                  />
                </div>
                <div>
                  {i === 0 && <Label>Urgence</Label>}
                  <select
                    style={selectStyle}
                    value={a.urgence}
                    onChange={(e) => {
                      const updated = [...analyses];
                      updated[i].urgence = e.target.value;
                      setAnalyses(updated);
                    }}
                  >
                    <option>Normal</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <button
                  onClick={() => setAnalyses(analyses.filter((_, idx) => idx !== i))}
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#ef4444",
                    borderRadius: 8,
                    width: 36,
                    height: 36,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: i === 0 ? 22 : 0,
                  }}
                >
                  <i className="fas fa-trash" style={{ fontSize: 12 }} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setAnalyses([...analyses, { type: "", urgence: "Normal", instructions: "" }])}
              style={{ ...btnOutline, marginTop: 4 }}
            >
              <i className="fas fa-plus" style={{ fontSize: 11 }} /> Ajouter une analyse
            </button>
          </Section>
        )}

        {hospitaliser && (
          <Section icon="fas fa-stethoscope" title="Informations de base" onClose={() => setHospitaliser(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Patient */}
            <div>
              <Label>Numéro de chambre</Label>
              <div style={{ position: "relative" }}>
                <i
                  className="fas fa-user"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    fontSize: 12,
                  }}
                />
                <input
                  style={{ ...inputStyle, paddingLeft: 30 }}
                  placeholder="EX: 312B"
                  readOnly
                />
              </div>
            </div>

            {/* Type d'arrivée */}
            <div>
              <Label>Service médical</Label>
              <select
                style={selectStyle}
                value={typeArrivee}
                onChange={(e) => setTypeArrivee(e.target.value)}
              >
                <option>Médecine générale </option>
                <option>Chirurgie</option>
                <option>Cardiologie</option>
                <option>Pneumologie</option>
                <option>Urgences</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <Label>Date d'admission</Label>
              <input
                type="date"
                style={inputStyle}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Heure */}
            <div>
              <Label>Heure d'admission</Label>
              <input
                type="time"
                style={inputStyle}
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
              />
            </div>
            <div>
              <Label>Médecin référent</Label>
              <div style={{ position: "relative" }}>
                <i
                  className="fas fa-user"
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    fontSize: 12,
                  }}
                />
                <input
                  style={{ ...inputStyle, paddingLeft: 30 }}
                  value={`Dr. ${user?.nom} ${user?.prenom}` || "Dr. Inconnu"}
                  readOnly
                />
              </div>
            </div>

            {/* Motif — full width */}
            <div style={{ gridColumn: "1 / -1" }}>
              <Label>Motif de consultation</Label>
              <textarea
              style={textareaStyle}
              placeholder="Motif..."
              value={histoire}
              onChange={(e) => setHistoire(e.target.value)}
            />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <Label>Instructions initiales</Label>
              <textarea
              style={textareaStyle}
              placeholder="Instructions..."
              value={histoire}
              onChange={(e) => setHistoire(e.target.value)}
            />
            </div>
          </div>
          <button
              onClick={() => {
                setAnalyses([...analyses, { type: "", urgence: "Normal", instructions: "" }])
                toast.success("Patient hospitalisé avec succès !");
                setHospitaliser(false);
              }}
              style={{ ...btnOutline, marginTop: 4, background: "#b45309", color:  "#fff" }}
            >
              <i className="fas fa-plus" style={{ fontSize: 11 }} /> Creer une hospitalisation
            </button>
        </Section>
        )}

        {/* ══ Footer buttons ══ */}
        <div
          style={{
            display: "flex",
            gap: 12,
            paddingTop: 8,
            paddingBottom: 32,
          }}
        >
          <button style={btnPrimary}>
            <i className="fas fa-save" style={{ fontSize: 12 }} />
            Enregistrer la consultation
          </button>
          <button
            style={{ ...btnOutline, borderColor: "#22c55e", color: "#16a34a" }}
          >
            <i className="fas fa-file-alt" style={{ fontSize: 12 }} />
            Générer le résumé pour le carnet de santé
          </button>
        </div>
      </div>
    </div>
  );
};

export default NouvelleConsultation;