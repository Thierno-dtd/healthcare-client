import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@core/auth/auth.store';
import { useConversations, useSendMessage, useCreerConversation } from '../hooks/useExpertMedical';
import type { ConversationMessage, Conversation } from '../types/patient.types';

/* ─── Inline responsive style ─── */
const responsiveCSS = `
  .expert-layout { display: flex; gap: 24px; height: calc(100vh - 160px); min-height: 520px; }
  .expert-sidebar { width: 320px; flex-shrink: 0; display: flex; flex-direction: column; }
  .expert-chat { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  @media (max-width: 900px) {
    .expert-layout { flex-direction: column; height: auto; }
    .expert-sidebar { width: 100%; max-height: 260px; }
    .expert-chat { min-height: 500px; }
  }
  .typing-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #94a3b8; margin: 0 2px; animation: typingBounce 1.2s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
`;

/* ─── Colors ─── */
const C = {
  primary: '#163344',
  medical: '#10b981',
  medicalLight: '#ecfdf5',
  blue: '#3b82f6',
  blueLight: '#eff6ff',
  blueDark: '#1d4ed8',
  amber: '#f59e0b',
  amberBg: '#fffbeb',
  amberBorder: '#fcd34d',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  white: '#ffffff',
  danger: '#ef4444',
};

/* ─── Shared inline style objects ─── */
const cardStyle: React.CSSProperties = {
  background: C.white,
  borderRadius: 16,
  border: `1px solid ${C.gray200}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const ExpertMedicalPatient: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const patientId = user?.id ?? '';
  const { data: conversations, isLoading } = useConversations(user?.id);
  const sendMessage = useSendMessage(patientId);
  const creerConversation = useCreerConversation(patientId);

  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState<string | null>(null);
  const [sendHover, setSendHover] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll on new message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* Load messages when selecting a conversation */
  useEffect(() => {
    if (selectedConv) {
      setMessages(selectedConv.messages);
    }
  }, [selectedConv]);

  const handleSend = async () => {
    if (!input.trim() || sendMessage.isPending) return;

    const userMessage: ConversationMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      if (!selectedConv) {
        const newConv = await creerConversation.mutateAsync(userInput);
        setSelectedConv(newConv);
      }

      const response = await sendMessage.mutateAsync({
        conversationId: selectedConv?.id,
        message: userInput,
      });

      setMessages((prev) => [...prev, response.message]);
    } catch {
      // Error handled by toast in hook
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewConversation = () => {
    setSelectedConv(null);
    setMessages([]);
    setInput('');
  };

  const suggestions = [
    { icon: 'fas fa-heartbeat', text: "J'ai des douleurs à la poitrine" },
    { icon: 'fas fa-brain', text: 'Comment gérer mon stress ?' },
    { icon: 'fas fa-pills', text: 'Effets secondaires de mes médicaments' },
    { icon: 'fas fa-file-prescription', text: 'Quand renouveler mon ordonnance ?' },
  ];

  /* ─── Loading state ─── */
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 12 }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: C.blue }} />
        <span style={{ color: C.gray500, fontSize: 14 }}>Chargement...</span>
      </div>
    );
  }

  /* ─── Format date helper ─── */
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <style>{responsiveCSS}</style>

      <div style={{ padding: 24 }}>
        {/* ─── Page header ─── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="fas fa-robot" style={{ color: C.white, fontSize: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.primary, margin: 0 }}>Expert Médical IA</div>
              <div style={{ fontSize: 13, color: C.gray500 }}>Posez vos questions de santé à notre assistant intelligent</div>
            </div>
          </div>
        </div>

        {/* ─── Main 2-column layout ─── */}
        <div className="expert-layout">

          {/* ════════ LEFT: Conversation history ════════ */}
          <div className="expert-sidebar">
            <div style={{ ...cardStyle, flex: 1 }}>
              {/* Card header */}
              <div style={{
                padding: '16px 20px', borderBottom: `1px solid ${C.gray200}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-history" style={{ color: C.blue, fontSize: 14 }} />
                  <span style={{ fontWeight: 600, fontSize: 14, color: C.gray800 }}>Historique</span>
                </div>
                <button
                  onClick={startNewConversation}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: C.blue, color: C.white, fontSize: 12, fontWeight: 600,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.blueDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.blue)}
                >
                  <i className="fas fa-plus" style={{ fontSize: 10 }} />
                  Nouvelle
                </button>
              </div>

              {/* Conversation list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
                {conversations && conversations.length > 0 ? (
                  conversations.map((conv) => {
                    const isActive = selectedConv?.id === conv.id;
                    const isHover = sidebarHovered === conv.id;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConv(conv)}
                        onMouseEnter={() => setSidebarHovered(conv.id)}
                        onMouseLeave={() => setSidebarHovered(null)}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '12px 14px', borderRadius: 10, border: 'none',
                          marginBottom: 6, cursor: 'pointer', transition: 'all 0.15s',
                          background: isActive ? C.blueLight : isHover ? C.gray50 : 'transparent',
                          borderLeft: isActive ? `3px solid ${C.blue}` : '3px solid transparent',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <i className="fas fa-comment-dots" style={{ fontSize: 12, color: isActive ? C.blue : C.gray400 }} />
                          <span style={{
                            fontSize: 13, fontWeight: isActive ? 600 : 500,
                            color: isActive ? C.blue : C.gray700,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>{conv.titre}</span>
                        </div>
                        <div style={{ fontSize: 11, color: C.gray400, marginTop: 4, paddingLeft: 20 }}>
                          {formatDate(conv.dernierMessage)}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                    <i className="fas fa-comments" style={{ fontSize: 28, color: C.gray300, marginBottom: 8, display: 'block' }} />
                    <span style={{ fontSize: 13, color: C.gray400 }}>Aucune conversation</span>
                  </div>
                )}
              </div>

              {/* Patient context bottom card */}
              <div style={{
                margin: 12, padding: 14, borderRadius: 10,
                background: C.medicalLight, border: `1px solid ${C.medical}20`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <i className="fas fa-user-shield" style={{ fontSize: 12, color: C.medical }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#065f46' }}>Contexte patient</span>
                </div>
                <div style={{ fontSize: 11, color: '#065f46', lineHeight: 1.5 }}>
                  Vos données médicales sont utilisées pour personnaliser les réponses de l'IA.
                </div>
              </div>
            </div>
          </div>

          {/* ════════ RIGHT: Chat area ════════ */}
          <div className="expert-chat">
            <div style={{ ...cardStyle, flex: 1 }}>

              {/* Chat header */}
              <div style={{
                padding: '14px 20px', borderBottom: `1px solid ${C.gray200}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className="fas fa-robot" style={{ color: C.white, fontSize: 15 }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.gray800 }}>Expert Médical IA</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.medical, display: 'inline-block' }} />
                      <span style={{ fontSize: 11, color: C.medical, fontWeight: 500 }}>En ligne</span>
                    </div>
                  </div>
                </div>
                {selectedConv && (
                  <span style={{
                    fontSize: 11, color: C.gray400, background: C.gray100,
                    padding: '4px 10px', borderRadius: 20,
                  }}>
                    {messages.length} message{messages.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Disclaimer banner */}
              <div style={{
                margin: '12px 16px 0', padding: '10px 14px', borderRadius: 10,
                background: C.amberBg, border: `1px solid ${C.amberBorder}`,
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <i className="fas fa-exclamation-triangle" style={{ color: C.amber, fontSize: 14, marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#92400e', lineHeight: 1.5 }}>
                  Les informations fournies sont à titre informatif uniquement et ne remplacent pas une consultation médicale.
                  En cas d'urgence, contactez le SAMU (119).
                </span>
              </div>

              {/* Messages area */}
              <div
                ref={scrollAreaRef}
                style={{
                  flex: 1, overflowY: 'auto', padding: '16px 20px',
                  display: 'flex', flexDirection: 'column', gap: 16,
                }}
              >
                {/* Empty state */}
                {messages.length === 0 && !isTyping && (
                  <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24,
                  }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 20,
                      background: `linear-gradient(135deg, ${C.blueLight}, ${C.blue}22)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <i className="fas fa-robot" style={{ fontSize: 28, color: C.blue }} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: C.gray800, marginBottom: 6 }}>
                        Bienvenue !
                      </div>
                      <div style={{ fontSize: 13, color: C.gray500, maxWidth: 360 }}>
                        Posez une question sur votre santé ou choisissez un sujet ci-dessous.
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                      {suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(s.text)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 16px', borderRadius: 20,
                            background: C.gray50, border: `1px solid ${C.gray200}`,
                            cursor: 'pointer', fontSize: 12, color: C.gray700,
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = C.blueLight;
                            e.currentTarget.style.borderColor = C.blue;
                            e.currentTarget.style.color = C.blue;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = C.gray50;
                            e.currentTarget.style.borderColor = C.gray200;
                            e.currentTarget.style.color = C.gray700;
                          }}
                        >
                          <i className={s.icon} style={{ fontSize: 11 }} />
                          {s.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message bubbles */}
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', gap: 10 }}>
                      {/* Bot avatar */}
                      {!isUser && (
                        <div style={{
                          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                          background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <i className="fas fa-robot" style={{ color: C.white, fontSize: 13 }} />
                        </div>
                      )}

                      <div style={{ maxWidth: '75%' }}>
                        {/* Sender label */}
                        <div style={{
                          fontSize: 11, fontWeight: 600, marginBottom: 4,
                          color: isUser ? C.medical : C.blue,
                          textAlign: isUser ? 'right' : 'left',
                        }}>
                          {isUser ? 'Vous' : 'Expert IA'}
                        </div>
                        {/* Bubble */}
                        <div style={{
                          padding: '12px 16px', borderRadius: 14,
                          background: isUser ? C.blue : C.gray100,
                          color: isUser ? C.white : C.gray800,
                          borderBottomRightRadius: isUser ? 4 : 14,
                          borderBottomLeftRadius: isUser ? 14 : 4,
                          fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                        }}>
                          {msg.content}
                        </div>
                        {/* Timestamp */}
                        <div style={{
                          fontSize: 10, color: C.gray400, marginTop: 4,
                          textAlign: isUser ? 'right' : 'left',
                        }}>
                          {formatTime(msg.timestamp)}
                        </div>
                        {/* Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div style={{
                            marginTop: 6, padding: '6px 10px', borderRadius: 8,
                            background: C.gray50, border: `1px solid ${C.gray200}`,
                            fontSize: 11, color: C.gray500,
                          }}>
                            <i className="fas fa-link" style={{ marginRight: 6, fontSize: 10 }} />
                            Sources : {msg.sources.join(', ')}
                          </div>
                        )}
                      </div>

                      {/* User avatar */}
                      {isUser && (
                        <div style={{
                          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                          background: `linear-gradient(135deg, ${C.medical}, #059669)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <i className="fas fa-user" style={{ color: C.white, fontSize: 13 }} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isTyping && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                      background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <i className="fas fa-robot" style={{ color: C.white, fontSize: 13 }} />
                    </div>
                    <div style={{
                      padding: '12px 20px', borderRadius: 14, borderBottomLeftRadius: 4,
                      background: C.gray100, display: 'flex', alignItems: 'center', gap: 2,
                    }}>
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.gray200}`, background: C.gray50 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <textarea
                    placeholder="Posez votre question de santé..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    disabled={sendMessage.isPending}
                    style={{
                      flex: 1, resize: 'none', border: `1px solid ${C.gray200}`,
                      borderRadius: 12, padding: '10px 14px', fontSize: 13,
                      outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
                      background: C.white, color: C.gray800,
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.blue)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = C.gray200)}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sendMessage.isPending}
                    onMouseEnter={() => setSendHover(true)}
                    onMouseLeave={() => setSendHover(false)}
                    style={{
                      width: 42, height: 42, borderRadius: 12, border: 'none',
                      background: !input.trim() || sendMessage.isPending
                        ? C.gray300
                        : sendHover ? C.blueDark : C.blue,
                      color: C.white, cursor: !input.trim() || sendMessage.isPending ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s', flexShrink: 0,
                    }}
                  >
                    {sendMessage.isPending
                      ? <i className="fas fa-spinner fa-spin" style={{ fontSize: 14 }} />
                      : <i className="fas fa-paper-plane" style={{ fontSize: 14 }} />
                    }
                  </button>
                </div>
                <div style={{ fontSize: 10, color: C.gray400, marginTop: 6, textAlign: 'center' }}>
                  <i className="fas fa-lock" style={{ marginRight: 4 }} />
                  Vos échanges sont chiffrés et confidentiels • Entrée pour envoyer, Maj+Entrée pour un retour à la ligne
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertMedicalPatient;
