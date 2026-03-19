import React from 'react';
import { Avatar, PatientStatusBadge } from '@/shared/components/ui';
import { formatRelativeDate, calculateAge, METRIC_ICONS } from '../../../shared/utils';
import {Patient} from "@/data/models/patient.model.ts";

interface PatientCardProps {
    patient: Patient;
    onView?: (patient: Patient) => void;
    onValidate?: (patient: Patient) => void;
    onSuspend?: (patient: Patient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
                                                     patient,
                                                     onView,
                                                     onValidate,
                                                     onSuspend,
                                                 }) => {
    const age = calculateAge(patient.dateOfBirth);

    return (
        <div className="card content-card-app" style={{ padding: 0 }}>
            {/* Header */}
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Avatar name={patient.name} size="lg" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{
                            fontSize: 16, fontWeight: 700, color: '#111827',
                            marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                            {patient.name}
                        </h4>
                        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
                            {age !== null ? `${age} ans` : '–'} · {patient.gender === 'male' ? 'Homme' : patient.gender === 'female' ? 'Femme' : 'Autre'}
                        </p>
                        <PatientStatusBadge status={patient.status} />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 20px' }}>
                {/* Contact */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                        <i className="fas fa-envelope" style={{ color: '#9ca3af', width: 16 }}></i>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {patient.email}
            </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                        <i className="fas fa-phone" style={{ color: '#9ca3af', width: 16 }}></i>
                        {patient.phone}
                    </div>
                </div>

                {/* Conditions */}
                {patient.conditions.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Pathologies
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {patient.conditions.map((c) => (
                                <span key={c} style={{
                                    padding: '3px 10px', background: '#eff6ff', color: '#1d4ed8',
                                    borderRadius: 12, fontSize: 12, fontWeight: 500,
                                }}>
                  {c}
                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Last activity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#9ca3af' }}>
                    <i className="fas fa-clock"></i>
                    Dernière activité : {formatRelativeDate(patient.lastActivity)}
                </div>
            </div>

            {/* Footer actions */}
            <div style={{
                padding: '12px 20px', background: '#fafafa',
                borderTop: '1px solid #f3f4f6',
                display: 'flex', gap: 8,
            }}>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onView?.(patient)}
                    style={{ flex: 1 }}
                >
                    <i className="fas fa-eye"></i> Voir
                </button>

                {patient.status === 'pending' && (
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => onValidate?.(patient)}
                    >
                        <i className="fas fa-check"></i> Valider
                    </button>
                )}

                {patient.status === 'active' && (
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onSuspend?.(patient)}
                        style={{ background: 'transparent', color: '#ef4444', border: '1px solid #fecaca' }}
                    >
                        <i className="fas fa-ban"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default PatientCard;