import React, { useState, useEffect } from 'react';

/* ─── Types ─── */
type CallStatus = 'idle' | 'waiting' | 'connecting' | 'active' | 'ended';

interface PlannedCall {
  id: string;
  patientNom: string;
  patientAvatar: string;
  specialite: string;
  date: string;
  time: string;
  duration: string;
  status: 'a_venir' | 'pret';
}

/* ─── Mock data ─── */
const UPCOMING_CALLS: PlannedCall[] = [
  { id: 'vc_1', patientNom: 'BIMA Afi', patientAvatar: 'BA', specialite: 'Suivi cardiologie', date: '2026-03-05', time: '10:00', duration: '30 min', status: 'pret' },
  { id: 'vc_2', patientNom: 'KOFFI Mensah', patientAvatar: 'KM', specialite: 'Contrôle diabète', date: '2026-03-08', time: '14:30', duration: '20 min', status: 'a_venir' },
  { id: 'vc_3', patientNom: 'ADJO Sophie', patientAvatar: 'AS', specialite: 'Consultation dermatologie', date: '2026-03-12', time: '09:00', duration: '30 min', status: 'a_venir' },
];

/* ─── Colors ─── */
const C = {
  primary: '#163344', blue: '#3b82f6', blueDark: '#1d4ed8', blueLight: '#eff6ff',
  medical: '#10b981', medicalLight: '#ecfdf5', amber: '#f59e0b', amberLight: '#fffbeb',
  danger: '#ef4444', dangerLight: '#fef2f2',
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb', gray300: '#d1d5db',
  gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151',
  gray800: '#1f2937', white: '#ffffff',
};

const responsiveCSS = `
  .video-layout { display: grid; grid-template-columns: 1fr 380px; gap: 24px; }
  @media (max-width: 960px) { .video-layout { grid-template-columns: 1fr; } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
`;

const cardStyle: React.CSSProperties = {
  background: C.white, borderRadius: 16, border: `1px solid ${C.gray200}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden',
};

const AppelVideoMedecin: React.FC = () => {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeCall, setActiveCall] = useState<PlannedCall | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [btnHover, setBtnHover] = useState<string | null>(null);

  // Call timer
  useEffect(() => {
    if (callStatus !== 'active') return;
    const interval = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR');

  const startCall = (call: PlannedCall) => {
    setActiveCall(call);
    setCallStatus('connecting');
    setCallDuration(0);
    setTimeout(() => setCallStatus('active'), 2000);
  };

  const endCall = () => {
    setCallStatus('ended');
    setTimeout(() => { setCallStatus('idle'); setActiveCall(null); setCallDuration(0); }, 3000);
  };

  /* ─── Call interface ─── */
  const renderCallInterface = () => {
    switch (callStatus) {
      case 'idle':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%', background: C.blueLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
            }}>
              <i className="fas fa-video" style={{ fontSize: 40, color: C.blue }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.gray800, marginBottom: 8 }}>
              Prêt pour la téléconsultation
            </div>
            <div style={{ fontSize: 14, color: C.gray500, marginBottom: 32, maxWidth: 420 }}>
              Sélectionnez un rendez-vous planifié pour démarrer la consultation vidéo avec votre patient
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onMouseEnter={() => setBtnHover('test')}
                onMouseLeave={() => setBtnHover(null)}
                style={{
                  padding: '12px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: btnHover === 'test' ? C.blueDark : C.blue, color: C.white,
                  fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'background 0.2s',
                }}
              >
                <i className="fas fa-video" style={{ fontSize: 14 }} />Démarrer un appel test
              </button>
              <button style={{
                padding: '12px 24px', borderRadius: 12, border: `1px solid ${C.gray200}`,
                background: C.white, color: C.gray700, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <i className="fas fa-cog" style={{ fontSize: 14 }} />Paramètres
              </button>
            </div>
          </div>
        );

      case 'connecting':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%', background: C.blueLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
              animation: 'pulse 1.5s infinite',
            }}>
              <i className="fas fa-video" style={{ fontSize: 40, color: C.blue }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.gray800, marginBottom: 8 }}>Connexion en cours...</div>
            <div style={{ fontSize: 14, color: C.gray500 }}>
              Établissement de la connexion avec {activeCall?.patientNom}
            </div>
          </div>
        );

      case 'active':
        return (
          <div>
            {/* Video area */}
            <div style={{
              background: '#0f172a', borderRadius: 16, aspectRatio: '16/9', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            }}>
              <div style={{ textAlign: 'center', color: C.white }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%', background: '#334155',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                  fontSize: 32, fontWeight: 700,
                }}>{activeCall?.patientAvatar}</div>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{activeCall?.patientNom}</div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>{activeCall?.specialite}</div>
              </div>

              {/* Self view PIP */}
              <div style={{
                position: 'absolute', bottom: 16, right: 16, width: 180, height: 135,
                background: '#1e293b', borderRadius: 12, border: '2px solid #475569',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isVideoOn ? (
                  <span style={{ color: C.white, fontSize: 12 }}>Votre caméra</span>
                ) : (
                  <div style={{ textAlign: 'center', color: C.white }}>
                    <i className="fas fa-video-slash" style={{ fontSize: 24, marginBottom: 4, display: 'block' }} />
                    <span style={{ fontSize: 10 }}>Caméra désactivée</span>
                  </div>
                )}
              </div>

              {/* Duration badge */}
              <div style={{
                position: 'absolute', top: 16, left: 16,
                background: C.danger, color: C.white, padding: '6px 14px', borderRadius: 20,
                fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.white, animation: 'pulse 1s infinite' }} />
                En cours • {formatDuration(callDuration)}
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '24px 0' }}>
              {[
                { id: 'mic', icon: isMuted ? 'fas fa-microphone-slash' : 'fas fa-microphone', active: isMuted, onClick: () => setIsMuted(!isMuted), color: C.danger },
                { id: 'vid', icon: isVideoOn ? 'fas fa-video' : 'fas fa-video-slash', active: !isVideoOn, onClick: () => setIsVideoOn(!isVideoOn), color: C.danger },
                { id: 'screen', icon: 'fas fa-desktop', active: false, onClick: () => {}, color: C.blue },
                { id: 'chat', icon: 'fas fa-comment', active: false, onClick: () => {}, color: C.blue },
              ].map((ctrl) => (
                <button
                  key={ctrl.id}
                  onClick={ctrl.onClick}
                  style={{
                    width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: ctrl.active ? ctrl.color : C.gray100,
                    color: ctrl.active ? C.white : C.gray700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', fontSize: 18,
                  }}
                >
                  <i className={ctrl.icon} />
                </button>
              ))}
              <button
                onClick={endCall}
                style={{
                  width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: C.danger, color: C.white,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}
              >
                <i className="fas fa-phone" style={{ transform: 'rotate(135deg)' }} />
              </button>
            </div>

            {/* Status bar */}
            <div style={{ textAlign: 'center', fontSize: 12, color: C.gray500 }}>
              {isMuted && <span>🔇 Micro coupé  •  </span>}
              {!isVideoOn && <span>📹 Caméra désactivée</span>}
            </div>
          </div>
        );

      case 'ended':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%', background: C.medicalLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
            }}>
              <i className="fas fa-check" style={{ fontSize: 40, color: C.medical }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.gray800, marginBottom: 8 }}>Appel terminé</div>
            <div style={{ fontSize: 14, color: C.gray500, marginBottom: 4 }}>
              Durée : {formatDuration(callDuration)} avec {activeCall?.patientNom}
            </div>
            <div style={{ fontSize: 13, color: C.gray400 }}>
              Un résumé sera ajouté au dossier médical du patient
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{responsiveCSS}</style>
      <div style={{ padding: 24 }}>
        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="fas fa-video" style={{ color: C.white, fontSize: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.primary }}>Appel vidéo</div>
              <div style={{ fontSize: 13, color: C.gray500 }}>Lancez des téléconsultations avec vos patients autorisés</div>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="video-layout">
          {/* Left: Call interface */}
          <div style={cardStyle}>
            <div style={{ padding: 24 }}>
              {renderCallInterface()}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Upcoming calls */}
            <div style={cardStyle}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.gray200}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="fas fa-calendar-check" style={{ color: C.blue, fontSize: 14 }} />
                <span style={{ fontWeight: 600, fontSize: 14, color: C.gray800 }}>Prochaines téléconsultations</span>
              </div>
              <div style={{ padding: 16 }}>
                {UPCOMING_CALLS.map((call) => (
                  <div key={call.id} style={{
                    padding: 16, borderRadius: 12, border: `1px solid ${C.gray200}`,
                    marginBottom: 12, transition: 'all 0.15s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: `linear-gradient(135deg, ${C.blue}20, ${C.blue}40)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: C.blue,
                        }}>{call.patientAvatar}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.gray800 }}>{call.patientNom}</div>
                          <div style={{ fontSize: 11, color: C.gray500 }}>{call.specialite}</div>
                        </div>
                      </div>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                        background: call.status === 'pret' ? C.medicalLight : C.gray100,
                        color: call.status === 'pret' ? '#065f46' : C.gray600,
                      }}>
                        {call.status === 'pret' ? 'Prêt' : 'À venir'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, color: C.gray500 }}>
                      <span><i className="fas fa-calendar" style={{ marginRight: 6, fontSize: 10 }} />{formatDate(call.date)}</span>
                      <span><i className="fas fa-clock" style={{ marginRight: 6, fontSize: 10 }} />{call.time} ({call.duration})</span>
                    </div>
                    <button
                      onClick={() => startCall(call)}
                      disabled={callStatus !== 'idle'}
                      style={{
                        width: '100%', padding: '8px 0', borderRadius: 10, border: 'none',
                        background: callStatus !== 'idle' ? C.gray300 : C.blue,
                        color: C.white, fontSize: 13, fontWeight: 600,
                        cursor: callStatus !== 'idle' ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'background 0.2s',
                      }}
                    >
                      <i className="fas fa-video" style={{ fontSize: 12 }} />
                      Lancer l'appel
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* System check */}
            <div style={cardStyle}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.gray200}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="fas fa-cog" style={{ color: C.gray500, fontSize: 14 }} />
                <span style={{ fontWeight: 600, fontSize: 14, color: C.gray800 }}>Vérification système</span>
              </div>
              <div style={{ padding: 16 }}>
                {[
                  { label: 'Caméra', status: 'Détectée', ok: true },
                  { label: 'Microphone', status: 'Détecté', ok: true },
                  { label: 'Connexion', status: 'Stable', ok: true },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0', borderBottom: i < 2 ? `1px solid ${C.gray100}` : 'none',
                  }}>
                    <span style={{ fontSize: 13, color: C.gray700 }}>{item.label}</span>
                    <span style={{
                      background: item.ok ? C.medicalLight : C.dangerLight,
                      color: item.ok ? '#065f46' : '#991b1b',
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    }}>
                      ✓ {item.status}
                    </span>
                  </div>
                ))}
                <button style={{
                  width: '100%', padding: '8px 0', borderRadius: 10,
                  border: `1px solid ${C.gray200}`, background: C.white,
                  color: C.gray700, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <i className="fas fa-cog" style={{ fontSize: 11 }} />Configurer
                </button>
              </div>
            </div>

            {/* Tips */}
            <div style={cardStyle}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.gray200}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="fas fa-lightbulb" style={{ color: C.amber, fontSize: 14 }} />
                <span style={{ fontWeight: 600, fontSize: 14, color: C.gray800 }}>Conseils</span>
              </div>
              <div style={{ padding: 16 }}>
                {[
                  'Vérifiez votre connexion internet',
                  'Assurez-vous d\'être dans un endroit calme',
                  'Testez votre caméra et micro avant l\'appel',
                  'Préparez le dossier du patient à l\'avance',
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', fontSize: 12, color: C.gray600 }}>
                    <span style={{ color: C.blue, marginTop: 1 }}>•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppelVideoMedecin;
