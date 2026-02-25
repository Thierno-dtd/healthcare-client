import React, { useState, useEffect, useCallback } from 'react';

/* ─── Types ─── */
type CallStatus = 'idle' | 'waiting' | 'active' | 'ended';

interface PlannedCall {
  id: string;
  medecinNom: string;
  medecinAvatar: string;
  specialite: string;
  date: string;
  time: string;
  duration: string;
}

/* ─── Mock data ─── */
const UPCOMING_CALLS: PlannedCall[] = [
  { id: 'vc_1', medecinNom: 'Dr. Marie DIALLO', medecinAvatar: 'MD', specialite: 'Généraliste', date: '2026-03-05', time: '10:00', duration: '30 min' },
  { id: 'vc_2', medecinNom: 'Dr. Jean KOUASSI', medecinAvatar: 'JK', specialite: 'Cardiologue', date: '2026-03-15', time: '15:00', duration: '20 min' },
];

/* ─── Colors ─── */
const C = {
  primary: '#163344', blue: '#3b82f6', blueDark: '#1d4ed8', blueLight: '#eff6ff',
  medical: '#10b981', medicalLight: '#ecfdf5', amber: '#f59e0b', amberLight: '#fffbeb',
  amberBorder: '#fcd34d', danger: '#ef4444', dangerLight: '#fef2f2',
  gray50: '#f9fafb', gray100: '#f3f4f6', gray200: '#e5e7eb', gray300: '#d1d5db',
  gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151',
  gray800: '#1f2937', white: '#ffffff',
};

const responsiveCSS = `
  .video-layout-patient { display: grid; grid-template-columns: 1fr 380px; gap: 24px; }
  @media (max-width: 960px) { .video-layout-patient { grid-template-columns: 1fr; } }
  @keyframes pulsePatient { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
`;

const cardStyle: React.CSSProperties = {
  background: C.white, borderRadius: 16, border: `1px solid ${C.gray200}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden',
};

/* ─── Countdown helper ─── */
const getCountdown = (dateStr: string, timeStr: string) => {
  const target = new Date(`${dateStr}T${timeStr}:00`);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { label: "L'appel peut commencer", ready: true, days: 0, hours: 0, minutes: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}j`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}min`);
  return { label: parts.join(' '), ready: false, days, hours, minutes };
};

const AppelVideoPatient: React.FC = () => {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeCall, setActiveCall] = useState<PlannedCall | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [, setTick] = useState(0); // Force re-render for countdowns

  // Countdown ticker — refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

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

  // Simulate doctor starting the call
  const simulateJoin = useCallback((call: PlannedCall) => {
    setActiveCall(call);
    setCallStatus('waiting');
  }, []);

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
              Prêt pour votre téléconsultation
            </div>
            <div style={{ fontSize: 14, color: C.gray500, marginBottom: 16, maxWidth: 420 }}>
              Seul votre médecin peut lancer l'appel. Vous serez notifié lorsque la consultation commencera.
            </div>
            <div style={{
              background: C.amberLight, border: `1px solid ${C.amberBorder}`, borderRadius: 12,
              padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 400,
            }}>
              <i className="fas fa-info-circle" style={{ color: C.amber, fontSize: 16, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#92400e' }}>
                Consultez vos prochaines téléconsultations dans le panneau à droite.
              </span>
            </div>
          </div>
        );

      case 'waiting':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%', background: C.amberLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
              animation: 'pulsePatient 1.5s infinite',
            }}>
              <i className="fas fa-clock" style={{ fontSize: 40, color: C.amber }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.gray800, marginBottom: 8 }}>
              En attente du médecin...
            </div>
            <div style={{ fontSize: 14, color: C.gray500, marginBottom: 32 }}>
              {activeCall?.medecinNom} va lancer l'appel. Veuillez patienter.
            </div>
            <button
              onClick={() => { setCallStatus('idle'); setActiveCall(null); }}
              style={{
                padding: '10px 24px', borderRadius: 12, border: 'none',
                background: C.danger, color: C.white, fontSize: 14, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Quitter la salle d'attente
            </button>
          </div>
        );

      case 'active':
        return (
          <div>
            <div style={{
              background: '#0f172a', borderRadius: 16, aspectRatio: '16/9', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            }}>
              <div style={{ textAlign: 'center', color: C.white }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%', background: '#334155',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                  fontSize: 32, fontWeight: 700,
                }}>{activeCall?.medecinAvatar}</div>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{activeCall?.medecinNom}</div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>{activeCall?.specialite}</div>
              </div>

              {/* Self view */}
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

              <div style={{
                position: 'absolute', top: 16, left: 16,
                background: C.danger, color: C.white, padding: '6px 14px', borderRadius: 20,
                fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.white, animation: 'pulsePatient 1s infinite' }} />
                En cours • {formatDuration(callDuration)}
              </div>
            </div>

            {/* Controls — patient can mute/toggle cam/end but NOT launch  */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '24px 0' }}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                style={{
                  width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: isMuted ? C.danger : C.gray100, color: isMuted ? C.white : C.gray700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}
              >
                <i className={isMuted ? 'fas fa-microphone-slash' : 'fas fa-microphone'} />
              </button>
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                style={{
                  width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: !isVideoOn ? C.danger : C.gray100, color: !isVideoOn ? C.white : C.gray700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}
              >
                <i className={isVideoOn ? 'fas fa-video' : 'fas fa-video-slash'} />
              </button>
              <button
                onClick={() => { setCallStatus('ended'); }}
                style={{
                  width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: C.danger, color: C.white,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}
              >
                <i className="fas fa-phone" style={{ transform: 'rotate(135deg)' }} />
              </button>
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
              Durée : {formatDuration(callDuration)}
            </div>
            <div style={{ fontSize: 13, color: C.gray400, marginBottom: 24 }}>
              Un résumé de la consultation sera ajouté à votre dossier médical
            </div>
            <button
              onClick={() => { setCallStatus('idle'); setActiveCall(null); setCallDuration(0); }}
              style={{
                padding: '10px 24px', borderRadius: 12, border: 'none',
                background: C.blue, color: C.white, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Retour à l'accueil
            </button>
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
              <div style={{ fontSize: 13, color: C.gray500 }}>Interface de téléconsultation pour vos rendez-vous en ligne</div>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="video-layout-patient">
          {/* Left: Call interface */}
          <div style={cardStyle}>
            <div style={{ padding: 24 }}>
              {renderCallInterface()}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Upcoming calls with countdown */}
            <div style={cardStyle}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.gray200}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="fas fa-calendar-check" style={{ color: C.blue, fontSize: 14 }} />
                <span style={{ fontWeight: 600, fontSize: 14, color: C.gray800 }}>Prochaines téléconsultations</span>
              </div>
              <div style={{ padding: 16 }}>
                {UPCOMING_CALLS.map((call) => {
                  const countdown = getCountdown(call.date, call.time);
                  return (
                    <div key={call.id} style={{
                      padding: 16, borderRadius: 12, border: `1px solid ${C.gray200}`,
                      marginBottom: 12,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.gray800 }}>{call.medecinNom}</div>
                          <div style={{ fontSize: 12, color: C.gray500 }}>{call.specialite}</div>
                        </div>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                          background: countdown.ready ? C.medicalLight : C.gray100,
                          color: countdown.ready ? '#065f46' : C.gray600,
                        }}>
                          {countdown.ready ? 'Prêt' : 'À venir'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, color: C.gray500 }}>
                        <span><i className="fas fa-calendar" style={{ marginRight: 6, fontSize: 10 }} />{formatDate(call.date)}</span>
                        <span><i className="fas fa-clock" style={{ marginRight: 6, fontSize: 10 }} />{call.time} ({call.duration})</span>
                      </div>

                      {/* Countdown or join */}
                      {countdown.ready ? (
                        <button
                          onClick={() => simulateJoin(call)}
                          disabled={callStatus !== 'idle'}
                          style={{
                            width: '100%', padding: '8px 0', borderRadius: 10, border: 'none',
                            background: callStatus !== 'idle' ? C.gray300 : C.blue,
                            color: C.white, fontSize: 13, fontWeight: 600,
                            cursor: callStatus !== 'idle' ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          }}
                        >
                          <i className="fas fa-video" style={{ fontSize: 12 }} />Rejoindre l'appel
                        </button>
                      ) : (
                        <div style={{
                          background: C.amberLight, border: `1px solid ${C.amberBorder}`,
                          borderRadius: 10, padding: '10px 14px',
                          display: 'flex', alignItems: 'center', gap: 10,
                        }}>
                          <i className="fas fa-hourglass-half" style={{ color: C.amber, fontSize: 14 }} />
                          <div>
                            <div style={{ fontSize: 11, color: '#92400e', fontWeight: 600 }}>Temps restant</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#92400e' }}>{countdown.label}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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
                      background: C.medicalLight, color: '#065f46',
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
                  'Préparez vos documents médicaux',
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

export default AppelVideoPatient;
