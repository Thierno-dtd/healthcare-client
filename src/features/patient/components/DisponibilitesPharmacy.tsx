import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, SlidersHorizontal, Navigation, Phone, MapPin,
  Clock, ChevronDown, X, Loader2, AlertCircle,
  PackageCheck, Package, PackageX, Crosshair, WifiOff
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */
type StockStatus = "en_stock" | "sur_commande" | "indisponible";

interface Pharmacie {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  phone?: string;
  distance?: number;
  stock?: StockStatus;   // undefined = mode fallback
  garde: boolean;
  openNow: boolean;
  openUntil?: string;
}

/* ══════════════════════════════════════════════════════════════
   COUCHE API
   → Modifie uniquement cette section quand ton backend est prêt
══════════════════════════════════════════════════════════════ */

/**
 * Recherche par médicament via ton backend.
 * Retourne null si indisponible → fallback automatique.
 *
 * TODO quand l'API est prête :
 *   1. Décommenter le bloc fetch ci-dessous
 *   2. Adapter les noms de champs selon ta vraie réponse JSON
 *   3. Supprimer "return null" en bas
 */
async function searchPharmaciesByMedicament(
  medicament: string,
  lat: number,
  lon: number
): Promise<Pharmacie[] | null> {
  void medicament; void lat; void lon;

  // const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  // try {
  //   const res = await fetch(
  //     `${API_BASE}/api/pharmacies/recherche?medicament=${encodeURIComponent(medicament)}&lat=${lat}&lon=${lon}&rayon=5000`,
  //     { signal: AbortSignal.timeout(8000) }
  //   );
  //   if (!res.ok) return null;
  //   const data = await res.json();
  //   return data.map((item: any) => ({
  //     id: item.pharmacie_id, name: item.nom, address: item.adresse,
  //     lat: item.latitude, lon: item.longitude, phone: item.telephone,
  //     distance: item.distance_metres, stock: item.stock,
  //     garde: item.de_garde, openNow: item.ouvert_maintenant, openUntil: item.fermeture,
  //   }));
  // } catch { return null; }

  return null; // ← supprimer cette ligne quand le backend est prêt
}

/** Fallback Overpass : pharmacies proches, sans info stock */
async function fetchNearbyPharmacies(lat: number, lon: number): Promise<Pharmacie[]> {
  const query = `[out:json][timeout:10];node["amenity"="pharmacy"](around:3000,${lat},${lon});out body;`;
  const res   = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
  const json  = await res.json();
  return (json.elements ?? [])
    .slice(0, 20)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((el: any): Pharmacie => ({
      id:       String(el.id),
      name:     el.tags?.name ?? "Pharmacie",
      address:  [el.tags?.["addr:housenumber"], el.tags?.["addr:street"], el.tags?.["addr:city"]]
                  .filter(Boolean).join(" ") || "Adresse non renseignée",
      lat:      el.lat, lon: el.lon,
      phone:    el.tags?.phone,
      distance: haversine(lat, lon, el.lat, el.lon),
      stock:    undefined,
      garde:    !!el.tags?.opening_hours?.includes("24/7"),
      openNow:  true,
      openUntil: el.tags?.opening_hours?.split(";")[0]?.split("-").pop()?.trim(),
    }))
    .sort((a: Pharmacie, b: Pharmacie) => (a.distance ?? 0) - (b.distance ?? 0));
}

/* ══════════════════════════════════════════════════════════════
   UTILITAIRES
══════════════════════════════════════════════════════════════ */
function haversine(la1: number, lo1: number, la2: number, lo2: number) {
  const R = 6371000, toRad = (x: number) => (x * Math.PI) / 180;
  const dLa = toRad(la2 - la1), dLo = toRad(lo2 - lo1);
  const a = Math.sin(dLa / 2) ** 2 + Math.cos(toRad(la1)) * Math.cos(toRad(la2)) * Math.sin(dLo / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
const fmtDist = (m: number) => m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;

/**
 * Charge Leaflet (CSS + JS) une seule fois, sans toucher au DOM principal.
 * Résout le problème de "page blanche" qui survenait quand Leaflet
 * réinitialisait le document pendant le chargement dynamique.
 */
function useLeaflet(onReady: () => void) {
  useEffect(() => {
    // Déjà chargé
    if ((window as any).L) { onReady(); return; }

    let cancelled = false;

    // CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id    = "leaflet-css";
      link.rel   = "stylesheet";
      link.href  = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // JS
    if (!document.getElementById("leaflet-js")) {
      const script   = document.createElement("script");
      script.id      = "leaflet-js";
      script.src     = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload  = () => { if (!cancelled) onReady(); };
      script.onerror = () => console.error("Leaflet failed to load");
      document.head.appendChild(script);
    } else {
      // Script tag existe mais L pas encore dispo (course condition) → attendre
      const interval = setInterval(() => {
        if ((window as any).L && !cancelled) { clearInterval(interval); onReady(); }
      }, 100);
      return () => { cancelled = true; clearInterval(interval); };
    }

    return () => { cancelled = true; };
  // onReady est stable (useCallback), pas besoin de le mettre en dep
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ══════════════════════════════════════════════════════════════
   COMPOSANTS UI
══════════════════════════════════════════════════════════════ */
const StockBadge = ({ stock }: { stock?: StockStatus }) => {
  if (!stock) return (
    <span style={{ padding: "3px 8px", borderRadius: "9999px", fontSize: "0.625rem", fontWeight: 700, background: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0", flexShrink: 0 }}>
      Stock inconnu
    </span>
  );
  const cfg = {
    en_stock:     { label: "EN STOCK",     color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: <PackageCheck size={10} /> },
    sur_commande: { label: "SUR COMMANDE", color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: <Package      size={10} /> },
    indisponible: { label: "INDISPONIBLE", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: <PackageX     size={10} /> },
  }[stock];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: "9999px", fontSize: "0.625rem", fontWeight: 800, letterSpacing: "0.05em", background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, flexShrink: 0 }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const Pill = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
  <button onClick={onClick} style={{ padding: "0.375rem 0.875rem", borderRadius: "9999px", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", border: `1.5px solid ${active ? "#163344" : "#e2e8f0"}`, background: active ? "#163344" : "white", color: active ? "white" : "#374151" }}>
    {label}
  </button>
);

const PharmacieCard = ({ p, selected, onClick }: { p: Pharmacie; selected: boolean; onClick: () => void }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: "white", borderRadius: "0.875rem", padding: "1rem", border: `1.5px solid ${selected ? "#163344" : hov ? "#163344" : "#e2e8f0"}`, cursor: "pointer", transition: "all 0.15s", boxShadow: selected ? "0 4px 20px rgba(22,51,68,0.12)" : hov ? "0 2px 8px rgba(0,0,0,0.06)" : "none" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: 8 }}>
        <div style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#1f2937", lineHeight: 1.2 }}>{p.name}</div>
        <StockBadge stock={p.stock} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: 6, flexWrap: "wrap" }}>
        {p.distance !== undefined && <>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
            <Navigation size={11} color="#163344" /> {fmtDist(p.distance)}
          </span>
          <span style={{ color: "#e2e8f0" }}>•</span>
        </>}
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", fontWeight: 600, color: p.openNow ? "#16a34a" : "#dc2626" }}>
          <Clock size={11} />
          {p.garde ? "24h/24" : p.openNow ? `Ouvert jusqu'à ${p.openUntil ?? "—"}` : "Fermé"}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 5, marginBottom: p.phone || p.garde ? 8 : 12 }}>
        <MapPin size={11} color="#94a3b8" style={{ marginTop: 2, flexShrink: 0 }} />
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{p.address}</span>
      </div>

      {(p.phone || p.garde) && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          {p.phone && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "#475569" }}><Phone size={11} /> {p.phone}</span>}
          {p.garde && <span style={{ padding: "2px 8px", borderRadius: "9999px", fontSize: "0.625rem", fontWeight: 800, background: "#163344", color: "white" }}>★ GARDE</span>}
        </div>
      )}

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={(e) => { e.stopPropagation(); window.open(`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`, "_blank"); }}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0.5rem", borderRadius: "0.625rem", border: "none", background: "#163344", color: "white", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer" }}
        >
          <Navigation size={13} /> Itinéraire
        </button>
        {p.phone && (
          <a href={`tel:${p.phone}`} onClick={(e) => e.stopPropagation()} style={{ width: 38, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0.625rem", border: "1.5px solid #e2e8f0", background: "white", color: "#163344", textDecoration: "none", flexShrink: 0 }}>
            <Phone size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════════════ */
const DisponibilitesPharmacy = () => {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef  = useRef<any[]>([]);
  const userMarker  = useRef<any>(null);
  const mapReady    = useRef(false);

  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [query, setQuery]           = useState("");
  const [pharmacies, setPharmacies] = useState<Pharmacie[]>([]);
  const [isFallback, setIsFallback] = useState(false);
  const [dbUnavailable, setDbUnavailable] = useState(false); // BDD non connectée
  const [loading, setLoading]       = useState(false);
  const [autoLoading, setAutoLoading] = useState(true); // chargement initial auto
  const [searched, setSearched]     = useState(false);
  const [selected, setSelected]     = useState<string | null>(null);
  const [userPos, setUserPos]       = useState<{ lat: number; lon: number } | null>(null);
  const [geoStatus, setGeoStatus]   = useState<"idle" | "locating" | "ok" | "denied">("idle");
  const [filterOuvert, setFilterOuvert] = useState(false);
  const [filterGarde, setFilterGarde]   = useState(false);
  const [sortBy, setSortBy]             = useState<"distance" | "stock">("distance");

  /* ── Leaflet ready callback ── */
  const onLeafletReady = useCallback(() => {
    setLeafletLoaded(true);
  }, []);

  useLeaflet(onLeafletReady);

  /* ── Init carte quand Leaflet est chargé ── */
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapReady.current) return;
    const L   = (window as any).L;
    const map = L.map(mapRef.current, { zoomControl: false }).setView([48.8566, 2.3522], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapInstance.current = map;
    mapReady.current    = true;
  }, [leafletLoaded]);

  /* ── Mise à jour des markers ── */
  const updateMarkers = useCallback((list: Pharmacie[], selId: string | null) => {
    const L = (window as any).L;
    if (!L || !mapInstance.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    list.forEach((p) => {
      const isSel = p.id === selId;
      const color = p.stock === "en_stock" ? "#16a34a" : p.stock === "sur_commande" ? "#d97706" : p.stock === "indisponible" ? "#dc2626" : "#163344";
      const size  = isSel ? 40 : 30;
      const icon  = L.divIcon({
        className: "",
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${isSel ? "#163344" : color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,${isSel ? ".4" : ".2"});display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <svg xmlns="http://www.w3.org/2000/svg" width="${isSel ? 18 : 14}" height="${isSel ? 18 : 14}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>
        </div>`,
        iconSize: [size, size], iconAnchor: [size / 2, size / 2],
      });
      const marker = L.marker([p.lat, p.lon], { icon })
        .addTo(mapInstance.current)
        .bindTooltip(p.name, { direction: "top", offset: [0, -(size / 2) - 2] });
      marker.on("click", () => setSelected(p.id));
      markersRef.current.push(marker);
    });

    if (list.length > 0) {
      mapInstance.current.fitBounds(L.latLngBounds(list.map((p) => [p.lat, p.lon])), { padding: [50, 50] });
    }
  }, []);

  useEffect(() => {
    updateMarkers(pharmacies, selected);
  }, [pharmacies, selected, updateMarkers]);

  /* ── Place user marker on map ── */
  const placeUserMarker = useCallback((lat: number, lon: number) => {
    const L = (window as any).L;
    if (!L || !mapInstance.current) return;
    if (userMarker.current) userMarker.current.remove();
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:16px;height:16px;border-radius:50%;background:#163344;border:3px solid white;box-shadow:0 0 0 5px rgba(22,51,68,0.18)"></div>`,
      iconSize: [16, 16], iconAnchor: [8, 8],
    });
    userMarker.current = L.marker([lat, lon], { icon })
      .addTo(mapInstance.current)
      .bindTooltip("Votre position", { direction: "top" });
    mapInstance.current.setView([lat, lon], 13, { animate: true });
  }, []);

  /* ── Charge les pharmacies proches (sans recherche) ── */
  const loadNearby = useCallback(async (lat: number, lon: number) => {
    setAutoLoading(true);
    try {
      const results = await fetchNearbyPharmacies(lat, lon);
      setPharmacies(results);
      setIsFallback(true);
      setSearched(true);
    } catch {
      setPharmacies([]);
    } finally {
      setAutoLoading(false);
    }
  }, []);

  /* ── Géolocalisation automatique au montage ── */
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      setAutoLoading(false);
      return;
    }
    setGeoStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setUserPos({ lat, lon });
        setGeoStatus("ok");
        // Place le marker dès que la carte est prête
        const tryPlace = () => {
          if (mapInstance.current) {
            placeUserMarker(lat, lon);
            loadNearby(lat, lon);
          } else {
            setTimeout(tryPlace, 200);
          }
        };
        tryPlace();
      },
      () => {
        setGeoStatus("denied");
        setAutoLoading(false);
        // Paris par défaut
        const tryLoad = () => {
          if (mapInstance.current) {
            loadNearby(48.8566, 2.3522);
          } else {
            setTimeout(tryLoad, 200);
          }
        };
        tryLoad();
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Recherche par médicament ── */
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSelected(null);
    setIsFallback(false);
    setDbUnavailable(false);
    const pos = userPos ?? { lat: 48.8566, lon: 2.3522 };
    try {
      const results = await searchPharmaciesByMedicament(query, pos.lat, pos.lon);
      if (results && results.length > 0) {
        setPharmacies(results);
        setIsFallback(false);
      } else {
        // BDD indispo → pharmacies proches silencieusement
        const fallback = await fetchNearbyPharmacies(pos.lat, pos.lon);
        setPharmacies(fallback);
        setIsFallback(true);
      }
    } catch {
      try {
        const fallback = await fetchNearbyPharmacies(pos.lat, pos.lon);
        setPharmacies(fallback);
      } catch { setPharmacies([]); }
      setIsFallback(true);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  /* ── Reset query ── */
  const handleClear = () => {
    setQuery("");
    setIsFallback(true); // revient aux pharmacies proches déjà chargées
  };

  /* ── Liste filtrée ── */
  const displayed = pharmacies
    .filter((p) => !filterOuvert || p.openNow)
    .filter((p) => !filterGarde  || p.garde)
    .sort((a, b) =>
      sortBy === "distance"
        ? (a.distance ?? 0) - (b.distance ?? 0)
        : (["en_stock","sur_commande","indisponible"].indexOf(a.stock ?? "indisponible")) -
          (["en_stock","sur_commande","indisponible"].indexOf(b.stock ?? "indisponible"))
    );

  const isLoading = loading || autoLoading;

  /* ════ RENDER ════ */
  return (
    <div style={{ height: "calc(100vh - 64px)", display: "flex", overflow: "hidden", fontFamily: "inherit" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* ─────── PANNEAU GAUCHE ─────── */}
      <div style={{ width: 390, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: "1px solid #e2e8f0", background: "#f8fafc", overflow: "hidden" }}>

        {/* Header recherche */}
        <div style={{ padding: "1rem", background: "white", borderBottom: "1px solid #f1f5f9" }}>

          {/* Statut géoloc */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem", fontSize: "0.75rem", fontWeight: 600 }}>
            {geoStatus === "locating" && <><Loader2 size={12} color="#163344" style={{ animation: "spin 1s linear infinite" }} /><span style={{ color: "#64748b" }}>Détection de votre position...</span></>}
            {geoStatus === "ok"       && <><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} /><span style={{ color: "#16a34a" }}>Position détectée — pharmacies proches chargées</span></>}
            {geoStatus === "denied"   && <><AlertCircle size={12} color="#f59e0b" /><span style={{ color: "#f59e0b" }}>Position non disponible — Paris par défaut</span></>}
          </div>

          {/* Input recherche */}
          <div style={{ position: "relative", marginBottom: "0.75rem" }}>
            <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Rechercher un médicament (ex: Doliprane)..."
              style={{ width: "100%", padding: "0.625rem 2.25rem 0.625rem 2.5rem", border: "1.5px solid #e2e8f0", borderRadius: "0.875rem", fontSize: "0.875rem", background: "white", color: "#1f2937", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.15s" }}
              onFocus={(e) => (e.target.style.borderColor = "#163344")}
              onBlur={(e)  => (e.target.style.borderColor = "#e2e8f0")}
            />
            {query && (
              <button onClick={handleClear} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filtres */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "0.375rem 0.875rem", borderRadius: "9999px", border: "1.5px solid #163344", background: "#163344", color: "white", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer" }}>
              <SlidersHorizontal size={12} /> Filtres
            </button>
            <button
              onClick={() => setSortBy((v) => v === "distance" ? "stock" : "distance")}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "0.375rem 0.875rem", borderRadius: "9999px", border: "1.5px solid #e2e8f0", background: "white", color: "#374151", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer" }}
            >
              {sortBy === "distance" ? "Distance" : "Stock"} <ChevronDown size={12} />
            </button>
            <Pill active={filterOuvert} label="Ouvert"   onClick={() => setFilterOuvert((v) => !v)} />
            <Pill active={filterGarde}  label="De garde" onClick={() => setFilterGarde((v)  => !v)} />
          </div>
        </div>

        {/* Bouton rechercher */}
        <div style={{ padding: "0.75rem 1rem", background: "white", borderBottom: "1px solid #f1f5f9" }}>
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            style={{ width: "100%", padding: "0.625rem", borderRadius: "0.75rem", border: "none", background: !query.trim() ? "#e2e8f0" : "#163344", color: !query.trim() ? "#94a3b8" : "white", fontSize: "0.875rem", fontWeight: 700, cursor: !query.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            {loading
              ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Recherche...</>
              : <><Search size={15} /> Trouver ce médicament</>}
          </button>
        </div>

        

        {/* Liste résultats */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem" }}>

          {/* Chargement initial */}
          {autoLoading && (
            <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
              <Loader2 size={36} style={{ margin: "0 auto 12px", display: "block", animation: "spin 1s linear infinite" }} />
              <div style={{ fontSize: "0.875rem" }}>Chargement des pharmacies proches...</div>
            </div>
          )}

          {/* Chargement recherche */}
          {loading && !autoLoading && (
            <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
              <Loader2 size={36} style={{ margin: "0 auto 12px", display: "block", animation: "spin 1s linear infinite" }} />
              <div style={{ fontSize: "0.875rem" }}>Recherche de « {query} »...</div>
            </div>
          )}

          {/* Aucun résultat */}
          {!isLoading && searched && displayed.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 1.5rem", color: "#94a3b8" }}>
              <AlertCircle size={36} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
              <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#64748b", marginBottom: 6 }}>Aucun résultat</div>
              <div style={{ fontSize: "0.8125rem" }}>Modifiez les filtres ou élargissez la zone.</div>
            </div>
          )}

          {/* Résultats */}
          {!isLoading && displayed.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", padding: "0 0.25rem 0.375rem", fontWeight: 600 }}>
                {displayed.length} pharmacie{displayed.length > 1 ? "s" : ""}
                {query && !isFallback ? ` avec « ${query} »` : " proches de votre position"}
              </div>
              {displayed.map((p) => (
                <PharmacieCard
                  key={p.id} p={p} selected={selected === p.id}
                  onClick={() => {
                    setSelected(p.id);
                    if (mapInstance.current) mapInstance.current.setView([p.lat, p.lon], 16, { animate: true });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─────── CARTE ─────── */}
      <div style={{ flex: 1, position: "relative" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

        {/* Légende stock réel */}
        {searched && !isLoading && !isFallback && (
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 999, background: "white", borderRadius: "0.75rem", padding: "0.625rem 0.875rem", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", display: "flex", gap: "0.875rem", alignItems: "center" }}>
            {[{ color: "#16a34a", label: "En stock" }, { color: "#d97706", label: "Sur commande" }, { color: "#dc2626", label: "Indisponible" }].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.6875rem", fontWeight: 600, color: "#374151" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, border: "2px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                {l.label}
              </div>
            ))}
          </div>
        )}

        {/* Légende fallback */}
        {searched && !isLoading && isFallback && (
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 999, background: "#fffbeb", borderRadius: "0.75rem", padding: "0.625rem 0.875rem", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #fde68a", display: "flex", alignItems: "center", gap: 6, fontSize: "0.6875rem", fontWeight: 600, color: "#d97706" }}>
            <WifiOff size={12} /> Pharmacies proches — stock non disponible
          </div>
        )}

        {/* Bouton recentrer */}
        {userPos && (
          <button
            onClick={() => { if (mapInstance.current && userPos) mapInstance.current.setView([userPos.lat, userPos.lon], 14, { animate: true }); }}
            title="Recentrer sur ma position"
            style={{ position: "absolute", bottom: 80, right: 12, zIndex: 999, width: 40, height: 40, borderRadius: "50%", background: "white", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#163344" }}
          >
            <Crosshair size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DisponibilitesPharmacy;