import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import {
    usePatientRequests,
    useApproveRequest,
    useRejectRequest,
} from "@/hook/useDoctorFeatures";
import { formatRelativeDate } from "@/core/utils";
import toast from "react-hot-toast";
import {PatientRequest, RequestStatus} from "@/data/models/patienRequest.model.ts";

type FilterTab = "all" | "pending" | "approved" | "rejected";

// ─── Design tokens ──────────────────────────────────────────
const C = {
    primary:      "#2a6b8f",
    primaryDark:  "#1a3c52",
    primaryLight: "hsl(207,55%,92%)",
    border:       "hsl(214,32%,91%)",
    muted:        "hsl(210,40%,96%)",
    textMain:     "hsl(222,47%,11%)",
    textMuted:    "hsl(215,16%,47%)",
    white:        "#ffffff",
    bgPage:       "hsl(210,40%,98%)",
    green:        "hsl(152,55%,42%)",
    greenBg:      "hsl(152,55%,90%)",
    greenFg:      "hsl(152,55%,20%)",
    red:          "hsl(0,72%,51%)",
    redBg:        "hsl(0,72%,94%)",
    redFg:        "hsl(0,72%,35%)",
    orange:       "hsl(30,90%,55%)",
    orangeBg:     "hsl(30,90%,92%)",
    orangeFg:     "hsl(30,90%,30%)",
};

const cardStyle: React.CSSProperties = {
    background: C.white,
    borderRadius: 12,
    border: `1px solid ${C.border}`,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    padding: "20px",
};

// ─── Icons ──────────────────────────────────────────────────
const ICheckCircle = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);
const IXCircle = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
);
const IEye = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);
const IAlertTriangle = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ color: C.orange, flexShrink: 0 }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
);
const IClose = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);
const IExpand = () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
        <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
);

// ─── Patient type config ─────────────────────────────────────
const TYPE_CFG = {
    hypertension: { label: "Hypertension",      color: "#dc2626", bg: "#fee2e2" },
    diabetes:     { label: "Diabète",            color: "#d97706", bg: "#fef3c7" },
    both:         { label: "Hypert. + Diabète",  color: "#7c3aed", bg: "#ede9fe" },
};

// ─── Status badge ────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
    const m: Record<string, { label: string; bg: string; color: string }> = {
        pending:  { label: "En attente", bg: C.orangeBg, color: C.orangeFg },
        approved: { label: "Approuvée",  bg: C.greenBg,  color: C.greenFg  },
        rejected: { label: "Rejetée",    bg: C.redBg,    color: C.redFg    },
    };
    const cfg = m[status] ?? m.pending;
    return (
        <span style={{ padding: "2px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.color, whiteSpace: "nowrap" }}>
      {cfg.label}
    </span>
    );
};

// ─── Side Detail Panel ───────────────────────────────────────
const DetailPanel = ({
                         req,
                         onClose,
                         onApprove,
                         onReject,
                         approving,
                         onImageClick,
                     }: {
    req: PatientRequest;
    onClose: () => void;
    onApprove: (req: PatientRequest) => void;
    onReject: (req: PatientRequest) => void;
    approving: boolean;
    onImageClick: (url: string, title: string) => void;
}) => {
    const typeCfg = TYPE_CFG[req.patientType];
    return (
        <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.22 }}
            style={{
                background: C.white, borderRadius: 12,
                border: `1px solid ${C.border}`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                overflow: "hidden", position: "sticky", top: 20,
                maxHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column",
            }}
        >
            {/* Panel header */}
            <div style={{
                padding: "18px 20px", borderBottom: `1px solid ${C.border}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})`,
                flexShrink: 0,
            }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.white, margin: 0 }}>
                    Détail de la demande
                </h3>
                <button onClick={onClose} style={{
                    background: "rgba(255,255,255,0.15)", border: "none", color: C.white,
                    width: 28, height: 28, borderRadius: 6, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <IClose />
                </button>
            </div>

            {/* Scrollable body */}
            <div style={{ padding: 20, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Patient info */}
                <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                        Informations patient
                    </p>
                    {([
                        ["fas fa-user",        req.fullName],
                        ["fas fa-envelope",    req.email],
                        ["fas fa-phone",       req.phone],
                        ["fas fa-calendar",    req.dateOfBirth],
                        ["fas fa-venus-mars",  req.gender === "male" ? "Homme" : "Femme"],
                    ] as [string, string][]).map(([icon, label]) => (
                        <div key={label} style={{ display: "flex", gap: 10, fontSize: 13, color: "#374151", marginBottom: 8 }}>
                            <i className={icon} style={{ color: "#9ca3af", width: 16, marginTop: 1 }} />
                            <span>{label}</span>
                        </div>
                    ))}
                </div>

                {/* Type badge */}
                <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                        Type de condition
                    </p>
                    <span style={{ padding: "6px 14px", borderRadius: 12, fontSize: 13, fontWeight: 600, background: typeCfg.bg, color: typeCfg.color, display: "inline-block" }}>
            {typeCfg.label}
          </span>
                </div>

                {/* Documents — clickable images */}
                <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                        Documents fournis
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {([
                            { label: "Dossier médical",      url: req.healthRecordImageUrl, icon: "fas fa-file-medical" },
                            { label: "Reçu de consultation", url: req.receiptImageUrl,      icon: "fas fa-receipt"      },
                        ]).map(doc => (
                            <div
                                key={doc.label}
                                onClick={() => onImageClick(doc.url, doc.label)}
                                style={{
                                    border: `1px solid ${C.border}`, borderRadius: 10,
                                    overflow: "hidden", cursor: "pointer",
                                    transition: "box-shadow 0.15s",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(42,107,143,0.15)")}
                                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                            >
                                <img
                                    src={doc.url}
                                    alt={doc.label}
                                    style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }}
                                />
                                <div style={{
                                    padding: "8px 12px", background: "#f9fafb",
                                    display: "flex", alignItems: "center", gap: 8,
                                }}>
                                    <i className={doc.icon} style={{ color: "#6b7280", fontSize: 12 }} />
                                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flex: 1 }}>{doc.label}</span>
                                    <span style={{ color: "#9ca3af" }}><IExpand /></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rejection message */}
                {req.status === "rejected" && req.rejectionMessage && (
                    <div style={{ padding: "12px 14px", background: C.redBg, borderRadius: 10, borderLeft: `4px solid ${C.red}` }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: C.red, marginBottom: 4 }}>Message de rejet</p>
                        <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{req.rejectionMessage}</p>
                    </div>
                )}

                {/* Action buttons (if pending) */}
                {req.status === "pending" && (
                    <div style={{ display: "flex", gap: 10, paddingTop: 4, borderTop: `1px solid ${C.border}` }}>
                        <button
                            onClick={() => onApprove(req)}
                            disabled={approving}
                            style={{
                                flex: 1, padding: "9px 0", background: C.green, color: C.white,
                                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                opacity: approving ? 0.6 : 1,
                            }}
                        >
                            <ICheckCircle /> Approuver
                        </button>
                        <button
                            onClick={() => onReject(req)}
                            style={{
                                flex: 1, padding: "9px 0", background: "transparent",
                                color: C.red, border: `2px solid ${C.redBg}`,
                                borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            }}
                        >
                            <IXCircle /> Rejeter
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// ─── Main ────────────────────────────────────────────────────
const PatientRequestsPage = () => {
    const doctorId = "d_001";

    const [filter, setFilter]             = useState<FilterTab>("all");
    const [detailReq, setDetailReq]       = useState<PatientRequest | null>(null);
    const [rejectingId, setRejectingId]   = useState<string | null>(null);
    const [rejectionMsg, setRejectionMsg] = useState("");
    const [imageModal, setImageModal]     = useState<{ url: string; title: string } | null>(null);

    const { data: requests = [], isLoading } = usePatientRequests(
        doctorId,
        filter !== "all" ? filter as RequestStatus : undefined
    );
    const approve = useApproveRequest();
    const reject  = useRejectRequest();

    const pendingCount = requests.filter(r => r.status === "pending").length;
    const filtered     = filter === "all" ? requests : requests.filter(r => r.status === filter);

    const handleApprove = useCallback(async (req: PatientRequest) => {
        try {
            await approve.mutateAsync(req.id);
            toast.success(`Demande de ${req.fullName} approuvée`);
            if (detailReq?.id === req.id) setDetailReq(null);
        } catch { toast.error("Erreur lors de l'approbation"); }
    }, [approve, detailReq]);

    const handleOpenReject = useCallback((req: PatientRequest) => {
        setRejectingId(req.id);
        setRejectionMsg("");
    }, []);

    const handleReject = useCallback(async () => {
        if (!rejectingId || !rejectionMsg.trim()) return;
        const req = requests.find(r => r.id === rejectingId);
        try {
            await reject.mutateAsync({ id: rejectingId, message: rejectionMsg });
            toast.success(`Demande de ${req?.fullName} rejetée`);
            setRejectingId(null);
            setRejectionMsg("");
            if (detailReq?.id === rejectingId) setDetailReq(null);
        } catch { toast.error("Erreur lors du rejet"); }
    }, [rejectingId, rejectionMsg, reject, requests, detailReq]);

    return (
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24, background: C.bgPage, minHeight: "100%" }}>

            {/* ── Header ──────────────────────────────────────── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h2 style={{ fontSize: 20, fontWeight: 600, color: C.textMain, margin: 0, marginBottom: 4 }}>
                        Demandes de suivi
                    </h2>
                    <p style={{ fontSize: 14, color: C.textMuted, margin: 0 }}>
                        {pendingCount} demande(s) en attente de validation
                    </p>
                </div>

                {/* Filter tabs */}
                <div style={{ display: "flex", gap: 2, background: C.muted, borderRadius: 10, padding: 4 }}>
                    {([["all","Toutes"],["pending","En attente"],["approved","Approuvées"],["rejected","Rejetées"]] as [FilterTab,string][]).map(([k,l]) => (
                        <button key={k} onClick={() => setFilter(k)} style={{
                            padding: "6px 12px", borderRadius: 7, fontSize: 13, fontWeight: 500,
                            cursor: "pointer", border: "none", transition: "all 0.15s",
                            background: filter === k ? C.white : "transparent",
                            color:      filter === k ? C.primary : C.textMuted,
                            boxShadow:  filter === k ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                        }}>{l}</button>
                    ))}
                </div>
            </div>

            {/* ── Pending alert banner ─────────────────────────── */}
            {pendingCount > 0 && (
                <div style={{ background: C.orangeBg, border: `1px solid ${C.orangeFg}40`, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                    <IAlertTriangle />
                    <p style={{ fontSize: 14, fontWeight: 500, color: C.orangeFg, margin: 0 }}>
                        {pendingCount} demande(s) nécessitent votre attention
                    </p>
                </div>
            )}

            {/* ── Body: list + side panel ──────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: detailReq ? "1fr 380px" : "1fr", gap: 24, alignItems: "start" }}>

                {/* List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {isLoading ? (
                        <div style={{ ...cardStyle, textAlign: "center", padding: 48, color: C.textMuted }}>Chargement...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ ...cardStyle, textAlign: "center", padding: 48, color: C.textMuted }}>
                            Aucune demande dans cette catégorie
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filtered.map(req => {
                                const isActive = detailReq?.id === req.id;
                                return (
                                    <motion.div
                                        key={req.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        style={{
                                            ...cardStyle,
                                            borderColor: isActive
                                                ? C.primary
                                                : req.status === "pending" ? `${C.orange}50` : C.border,
                                            background: isActive ? "hsl(207,55%,98%)" : C.white,
                                            transition: "border-color 0.2s, background 0.2s",
                                        }}
                                    >
                                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

                                            {/* Left: avatar + info */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                <div style={{
                                                    width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                                                    background: C.primaryLight, color: C.primary,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: 15, fontWeight: 600,
                                                }}>
                                                    {req.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: 15, fontWeight: 600, color: C.textMain, margin: 0, marginBottom: 3 }}>
                                                        {req.fullName}
                                                    </h3>
                                                    <p style={{ fontSize: 13, color: C.textMuted, margin: 0, marginBottom: 2 }}>
                                                        {req.hospitalName}
                                                    </p>
                                                    <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>
                                                        Soumise {formatRelativeDate(req.submittedAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right: badge + buttons */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                                <StatusBadge status={req.status} />

                                                {/* Détails → opens side panel */}
                                                <button
                                                    onClick={() => setDetailReq(isActive ? null : req)}
                                                    style={{
                                                        padding: "6px 12px", fontSize: 13, fontWeight: 500,
                                                        color: isActive ? C.white : C.primary,
                                                        background: isActive ? C.primary : "transparent",
                                                        border: `1px solid ${C.primary}50`,
                                                        borderRadius: 8, cursor: "pointer",
                                                        display: "flex", alignItems: "center", gap: 5,
                                                        transition: "all 0.15s",
                                                    }}
                                                >
                                                    <IEye /> {isActive ? "Fermer" : "Détails"}
                                                </button>

                                                {req.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(req)}
                                                            disabled={approve.isPending}
                                                            style={{
                                                                padding: "6px 12px", fontSize: 13, fontWeight: 500,
                                                                background: C.green, color: C.white,
                                                                border: "none", borderRadius: 8, cursor: "pointer",
                                                                display: "flex", alignItems: "center", gap: 5,
                                                                opacity: approve.isPending ? 0.6 : 1,
                                                            }}
                                                        >
                                                            <ICheckCircle /> Approuver
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenReject(req)}
                                                            style={{
                                                                padding: "6px 12px", fontSize: 13, fontWeight: 500,
                                                                background: C.red, color: C.white,
                                                                border: "none", borderRadius: 8, cursor: "pointer",
                                                                display: "flex", alignItems: "center", gap: 5,
                                                            }}
                                                        >
                                                            <IXCircle /> Rejeter
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

                {/* Side detail panel */}
                <AnimatePresence>
                    {detailReq && (
                        <DetailPanel
                            req={detailReq}
                            onClose={() => setDetailReq(null)}
                            onApprove={handleApprove}
                            onReject={handleOpenReject}
                            approving={approve.isPending}
                            onImageClick={(url, title) => setImageModal({ url, title })}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* ── Rejection Modal ──────────────────────────────── */}
            {rejectingId && (
                <div
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.30)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
                    onClick={() => { setRejectingId(null); setRejectionMsg(""); }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, width: "100%", maxWidth: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: C.textMain, display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ color: C.red }}><IXCircle size={20} /></span>
                            Rejeter la demande
                        </h3>
                        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>
                            Veuillez indiquer le motif du rejet pour{" "}
                            <strong>{requests.find(r => r.id === rejectingId)?.fullName}</strong>
                        </p>
                        <textarea
                            value={rejectionMsg}
                            onChange={e => setRejectionMsg(e.target.value)}
                            rows={4}
                            placeholder="Motif du rejet (obligatoire)..."
                            style={{
                                width: "100%", padding: "10px 12px", fontSize: 13,
                                background: C.muted, border: `1px solid ${C.border}`,
                                borderRadius: 10, outline: "none", resize: "vertical",
                                color: C.textMain, boxSizing: "border-box", minHeight: 100,
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = `${C.red}80`)}
                            onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                            <button
                                onClick={() => { setRejectingId(null); setRejectionMsg(""); }}
                                style={{ padding: "8px 16px", fontSize: 13, background: "none", border: "none", cursor: "pointer", color: C.textMuted }}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectionMsg.trim() || reject.isPending}
                                style={{
                                    padding: "8px 20px", background: C.red, color: C.white,
                                    border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
                                    cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                                    opacity: (!rejectionMsg.trim() || reject.isPending) ? 0.5 : 1,
                                }}
                            >
                                <IXCircle /> Confirmer le rejet
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* ── Image Modal ──────────────────────────────────── */}
            {imageModal && (
                <div
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
                    onClick={() => setImageModal(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.93 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ background: C.white, borderRadius: 16, overflow: "hidden", maxWidth: 760, width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.textMain, margin: 0 }}>{imageModal.title}</h3>
                            <button
                                onClick={() => setImageModal(null)}
                                style={{ background: C.muted, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted }}
                            >
                                <IClose />
                            </button>
                        </div>
                        <div style={{ overflow: "auto", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                            <img src={imageModal.url} alt={imageModal.title} style={{ maxWidth: "100%", borderRadius: 8 }} />
                        </div>
                    </motion.div>
                </div>
            )}

        </div>
    );
};

export default PatientRequestsPage;