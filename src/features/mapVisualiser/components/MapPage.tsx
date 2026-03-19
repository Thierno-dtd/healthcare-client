import React, { useState } from 'react';
import { useHospitals } from '@/hook/useHospitals';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import type { Hospital } from '@/data/models/hospital.model';

const FRANCE_CITIES: Record<string, { x: number; y: number }> = {
    Paris: { x: 52, y: 30 },
    Lyon: { x: 56, y: 53 },
    Bordeaux: { x: 33, y: 60 },
    Marseille: { x: 58, y: 72 },
};

const MapPage: React.FC = () => {
    const [selected, setSelected] = useState<Hospital | null>(null);
    const { data: hospitals = [], isLoading } = useHospitals();

    const activeCount = hospitals.filter((h) => h.status === 'active').length;

    return (
        <div className="content-body">
            {/* ── Header ─────────────────────────────────────────── */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                    Carte des établissements
                </h1>
                <p style={{ color: '#6b7280', fontSize: 15 }}>
                    Visualisez la répartition géographique des établissements
                </p>
            </div>

            {isLoading ? (
                <LoadingSpinner text="Chargement de la carte..." />
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
                    {/* ── Map (SVG mock) ───────────────────────────────── */}
                    <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: 480 }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #1a3c52 0%, #2a6b8f 100%)',
                            padding: '16px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <h3 style={{ color: 'white', fontSize: 15, fontWeight: 600 }}>
                                <i className="fas fa-map" style={{ marginRight: 8 }} />
                                France — {hospitals.length} établissements
                            </h3>
                            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                <span>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#4ade80', marginRight: 4 }} />
                  Actif ({activeCount})
                </span>
                                <span>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#f87171', marginRight: 4 }} />
                  Inactif ({hospitals.length - activeCount})
                </span>
                            </div>
                        </div>

                        {/* SVG France outline (simplified) */}
                        <div style={{ position: 'relative', background: '#eef4f8', height: 440 }}>
                            <svg
                                viewBox="0 0 100 100"
                                style={{ width: '100%', height: '100%' }}
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Simplified France outline */}
                                <path
                                    d="M 38 10 L 55 8 L 68 12 L 72 18 L 75 25 L 72 32 L 78 38 L 76 48 L 70 55 L 72 65 L 65 78 L 55 82 L 48 78 L 40 80 L 30 72 L 25 62 L 28 52 L 22 42 L 22 32 L 28 22 L 38 10 Z"
                                    fill="#c8e6f0"
                                    stroke="#8ab8cc"
                                    strokeWidth="1"
                                />

                                {/* Hospital markers */}
                                {hospitals.map((h) => {
                                    const pos = FRANCE_CITIES[h.city] ?? { x: 45 + Math.random() * 20, y: 35 + Math.random() * 30 };
                                    const isActive = h.status === 'active';
                                    const isSelected = selected?.id === h.id;

                                    return (
                                        <g
                                            key={h.id}
                                            transform={`translate(${pos.x}, ${pos.y})`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setSelected(h)}
                                        >
                                            {/* Pulse ring for selected */}
                                            {isSelected && (
                                                <circle
                                                    r="6"
                                                    fill="none"
                                                    stroke={isActive ? '#16a34a' : '#dc2626'}
                                                    strokeWidth="1"
                                                    opacity="0.4"
                                                />
                                            )}
                                            {/* Marker */}
                                            <circle
                                                r={isSelected ? 4 : 3}
                                                fill={isActive ? '#16a34a' : '#dc2626'}
                                                stroke="white"
                                                strokeWidth="0.8"
                                            />
                                            {/* Label */}
                                            <text
                                                y={-5}
                                                textAnchor="middle"
                                                fontSize="2.5"
                                                fill="#1a3c52"
                                                fontWeight={isSelected ? 700 : 500}
                                            >
                                                {h.city}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* Click hint */}
                            <div style={{
                                position: 'absolute',
                                bottom: 12,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(26,60,82,0.8)',
                                color: 'white',
                                padding: '6px 14px',
                                borderRadius: 20,
                                fontSize: 12,
                            }}>
                                <i className="fas fa-mouse-pointer" style={{ marginRight: 6 }} />
                                Cliquez sur un marqueur pour voir les détails
                            </div>
                        </div>
                    </div>

                    {/* ── Sidebar list ────────────────────────────────── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Selected detail */}
                        {selected && (
                            <div className="card" style={{ padding: 20, borderLeft: '4px solid #2a6b8f' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>
                                        {selected.name}
                                    </h3>
                                    <button
                                        onClick={() => setSelected(null)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                                    >
                                        <i className="fas fa-times" />
                                    </button>
                                </div>
                                {[
                                    { icon: 'fas fa-map-marker-alt', text: `${selected.address}, ${selected.city}` },
                                    { icon: 'fas fa-phone', text: selected.phone },
                                    { icon: 'fas fa-envelope', text: selected.email },
                                    { icon: 'fas fa-user-md', text: `${selected.doctorCount} médecins` },
                                    { icon: 'fas fa-users', text: `${selected.patientCount} patients` },
                                ].map(({ icon, text }) => (
                                    <div key={text} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#374151', marginBottom: 6 }}>
                                        <i className={icon} style={{ color: '#9ca3af', width: 16, flexShrink: 0, marginTop: 1 }} />
                                        <span>{text}</span>
                                    </div>
                                ))}
                                <div style={{ marginTop: 8 }}>
                  <span style={{
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      background: selected.status === 'active' ? '#d1fae5' : '#fee2e2',
                      color: selected.status === 'active' ? '#059669' : '#dc2626',
                  }}>
                    {selected.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                                </div>
                            </div>
                        )}

                        {/* Hospitals list */}
                        <div className="card" style={{ padding: 0, flex: 1, overflow: 'hidden' }}>
                            <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6' }}>
                                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                                    Liste des établissements
                                </h3>
                            </div>
                            <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                                {hospitals.map((h) => (
                                    <div
                                        key={h.id}
                                        onClick={() => setSelected(h)}
                                        style={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid #f9fafb',
                                            cursor: 'pointer',
                                            background: selected?.id === h.id ? '#f0f7ff' : 'transparent',
                                            transition: 'background 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                        }}
                                    >
                                        <div style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: h.status === 'active' ? '#16a34a' : '#dc2626',
                                            flexShrink: 0,
                                        }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                                                {h.name}
                                            </p>
                                            <p style={{ fontSize: 11, color: '#9ca3af' }}>
                                                {h.city} · {h.doctorCount} médecins
                                            </p>
                                        </div>
                                        <i className="fas fa-chevron-right" style={{ color: '#d1d5db', fontSize: 11 }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapPage;