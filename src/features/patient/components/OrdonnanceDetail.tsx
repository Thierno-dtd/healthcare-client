import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pill } from 'lucide-react';
import { useOrdonnanceDetail } from '../hooks/useOrdonnancePatient';

const card: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '1rem',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  overflow: 'hidden',
};

const OrdonnanceDetail: React.FC = () => {
  const { ordonnanceId } = useParams<{ ordonnanceId?: string }>();
  const navigate = useNavigate();
  const { data: ordonnance, isLoading, isError } = useOrdonnanceDetail(ordonnanceId);

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Chargement de l'ordonnance...
      </div>
    );
  }

  if (isError || !ordonnance) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem', color: '#64748b' }}>Ordonnance introuvable.</p>
        <button
          type="button"
          onClick={() => navigate('/patient/ordonnances')}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: '#3b82f6',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button
        type="button"
        onClick={() => navigate('/patient/ordonnances')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: '#3b82f6',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        <ArrowLeft size={18} /> Retour aux ordonnances
      </button>

      <div style={card}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '0.875rem',
              background: '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Pill size={24} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1f2937' }}>
                Ordonnance {ordonnance.id}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>
                {ordonnance.medecinNom} · {ordonnance.specialite}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{ordonnance.dateCreation}</span>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: 9999,
              fontSize: '0.75rem',
              fontWeight: 700,
              background: ordonnance.status === 'active' ? '#ecfdf5' : '#f1f5f9',
              color: ordonnance.status === 'active' ? '#10b981' : '#64748b',
            }}>
              {ordonnance.status}
            </span>
          </div>
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Médicaments prescrits</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {ordonnance.medicaments.map((med) => (
              <div key={med.id} style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '0.75rem',
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1f2937' }}>{med.nom}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {med.dosage} · {med.duree}
                  </div>
                  <div style={{ marginTop: 6, fontSize: '0.85rem', color: '#475569' }}>
                    {med.instructions}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: 9999,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: med.pris ? '#ecfdf5' : '#f1f5f9',
                    color: med.pris ? '#10b981' : '#64748b',
                  }}>
                    {med.pris ? 'Pris' : 'Non pris'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {ordonnance.notes && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 6 }}>Notes</h3>
              <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>{ordonnance.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdonnanceDetail;
