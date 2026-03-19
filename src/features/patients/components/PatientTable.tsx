// ============================================================
// PatientTable — Feature component
// ============================================================

import React from 'react';
import {Patient} from "@/data/models/patient.model.ts";
import {calculateAge, formatRelativeDate} from "@core/utils";
import {Avatar} from "@shared/components/ui/Avatar.tsx";
import {PatientStatusBadge} from "@shared/components/ui/StatusBadge.tsx";


interface PatientTableProps {
    patients: Patient[];
    isLoading?: boolean;
    onView?: (patient: Patient) => void;
    onValidate?: (patient: Patient) => void;
    onSuspend?: (patient: Patient) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({
                                                       patients,
                                                       isLoading,
                                                       onView,
                                                       onValidate,
                                                       onSuspend,
                                                   }) => {
    if (isLoading) {
        return (
            <div style={{ padding: 20 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{
                        height: 60, background: '#f9fafb', borderRadius: 8,
                        marginBottom: 8, animation: 'shimmer 2s infinite',
                    }} />
                ))}
            </div>
        );
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                    {['Patient', 'Âge / Sexe', 'Pathologies', 'Statut', 'Dernière activité', 'Actions'].map((col) => (
                        <th key={col} style={{
                            padding: '12px 16px', textAlign: 'left',
                            fontSize: 12, fontWeight: 600, color: '#6b7280',
                            textTransform: 'uppercase', letterSpacing: '0.05em',
                            whiteSpace: 'nowrap',
                        }}>
                            {col}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {patients.map((p) => {
                    const age = calculateAge(p.dateOfBirth);
                    return (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f9fafb' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                            {/* Patient */}
                            <td style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Avatar name={p.name} size="sm" />
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 2 }}>{p.name}</p>
                                        <p style={{ fontSize: 12, color: '#9ca3af' }}>{p.email}</p>
                                    </div>
                                </div>
                            </td>

                            {/* Age / Gender */}
                            <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151', whiteSpace: 'nowrap' }}>
                                {age !== null ? `${age} ans` : '–'} /{' '}
                                {p.gender === 'male' ? 'H' : p.gender === 'female' ? 'F' : 'A'}
                            </td>

                            {/* Conditions */}
                            <td style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                    {p.conditions.slice(0, 2).map((c) => (
                                        <span key={c} style={{
                                            padding: '2px 8px', background: '#eff6ff', color: '#1d4ed8',
                                            borderRadius: 10, fontSize: 11, fontWeight: 500,
                                        }}>
                        {c}
                      </span>
                                    ))}
                                    {p.conditions.length > 2 && (
                                        <span style={{ fontSize: 11, color: '#9ca3af' }}>+{p.conditions.length - 2}</span>
                                    )}
                                </div>
                            </td>

                            {/* Status */}
                            <td style={{ padding: '14px 16px' }}>
                                <PatientStatusBadge status={p.status} />
                            </td>

                            {/* Last activity */}
                            <td style={{ padding: '14px 16px', fontSize: 13, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                                {formatRelativeDate(p.lastActivity)}
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button
                                        className="btn btn-sm btn-ghost"
                                        onClick={() => onView?.(p)}
                                        title="Voir le dossier"
                                    >
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    {p.status === 'pending' && (
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => onValidate?.(p)}
                                            title="Valider le compte"
                                            style={{ fontSize: 12 }}
                                        >
                                            <i className="fas fa-check"></i>
                                        </button>
                                    )}
                                    {p.status === 'active' && (
                                        <button
                                            className="btn btn-sm"
                                            onClick={() => onSuspend?.(p)}
                                            title="Suspendre"
                                            style={{ background: 'transparent', color: '#ef4444', border: '1px solid #fecaca', fontSize: 12, padding: '6px 10px' }}
                                        >
                                            <i className="fas fa-ban"></i>
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default PatientTable;