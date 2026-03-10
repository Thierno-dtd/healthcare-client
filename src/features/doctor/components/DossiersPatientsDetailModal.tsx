import React from 'react';
import type { PatientDossier } from '../types/dossiersPatients.types';
import { C } from '../services/dossiersPatients.constants';
import { formatDate, getAccesBadge, getStatusStyle } from '../services/dossiersPatients.utils';

interface PatientDetailModalProps {
  patient: PatientDossier;
  onClose: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, onClose }) => {
  const acces = getAccesBadge(patient.typeAcces);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.white,
          borderRadius: 20,
          maxWidth: 560,
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${C.primary}, #1e4d6b)`,
            padding: '24px 28px',
            color: C.white,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {patient.avatar}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{patient.prenom} {patient.nom}</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>{patient.age} ans • Groupe {patient.groupeSanguin}</div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: 10,
                width: 36,
                height: 36,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fas fa-times" style={{ color: C.white, fontSize: 14 }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <span
              style={{
                ...getStatusStyle(patient.status),
                padding: '5px 14px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {patient.status}
            </span>
            <span
              style={{
                background: acces.bg,
                color: acces.color,
                padding: '5px 14px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <i className={acces.icon} style={{ marginRight: 6, fontSize: 10 }} />
              {acces.label}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Spécialité', value: patient.specialite, icon: 'fas fa-stethoscope' },
              { label: 'Dernier examen', value: formatDate(patient.dernierExamen), icon: 'fas fa-calendar' },
              { label: 'Téléphone', value: patient.telephone, icon: 'fas fa-phone' },
              { label: 'Groupe sanguin', value: patient.groupeSanguin, icon: 'fas fa-tint' },
            ].map((item, i) => (
              <div key={i} style={{ background: C.gray50, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, color: C.gray500, marginBottom: 4 }}>
                  <i className={item.icon} style={{ marginRight: 6, fontSize: 10 }} />
                  {item.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.gray800 }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 8 }}>
              <i className="fas fa-allergies" style={{ marginRight: 8, color: C.danger }} />Allergies
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {patient.allergies.length > 0 ? (
                patient.allergies.map((a, i) => (
                  <span key={i} style={{ background: C.dangerLight, color: '#991b1b', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>
                    {a}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: 13, color: C.gray400 }}>Aucune allergie connue</span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 8 }}>
              <i className="fas fa-heartbeat" style={{ marginRight: 8, color: C.amber }} />Maladies chroniques
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {patient.maladiesChroniques.length > 0 ? (
                patient.maladiesChroniques.map((m, i) => (
                  <span key={i} style={{ background: C.amberLight, color: '#92400e', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>
                    {m}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: 13, color: C.gray400 }}>Aucune maladie chronique</span>
              )}
            </div>
          </div>

          {patient.typeAcces !== 'refuse' && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 12,
                  border: 'none',
                  background: C.blue,
                  color: C.white,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <i className="fas fa-file-medical" style={{ marginRight: 8 }} />Voir le dossier complet
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 12,
                  border: `1px solid ${C.gray200}`,
                  background: C.white,
                  color: C.gray700,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <i className="fas fa-video" style={{ marginRight: 8 }} />Téléconsultation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailModal;
