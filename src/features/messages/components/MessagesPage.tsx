import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { useMessages, useMarkMessageRead, useSendMessage, useDeleteMessage } from '@/hook/useMessages';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';
import { Avatar } from '@/shared/components/ui/Avatar';
import { formatRelativeTime } from '@/core/utils';
import type { Message } from '@/data/models/notification.model';

const MessagesPage: React.FC = () => {
    const { user } = useAuthStore();
    const [selected, setSelected] = useState<Message | null>(null);
    const [showCompose, setShowCompose] = useState(false);
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');
    const [composeToId, setComposeToId] = useState('');

    const { data: messages = [], isLoading, isError, error, refetch } = useMessages(user?.id ?? '');
    const markRead = useMarkMessageRead();
    const sendMsg = useSendMessage();
    const deleteMsg = useDeleteMessage();

    const unread = messages.filter((m) => !m.isRead).length;

    const handleSelect = useCallback(async (msg: Message) => {
        setSelected(msg);
        if (!msg.isRead) {
            await markRead.mutateAsync(msg.id);
        }
    }, [markRead]);

    const handleSend = useCallback(async () => {
        if (!composeBody.trim() || !composeSubject.trim()) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }
        try {
            await sendMsg.mutateAsync({
                fromId: user?.id ?? '',
                fromName: user?.name ?? '',
                toId: composeToId || 'p_004',
                subject: composeSubject,
                body: composeBody,
            });
            toast.success('Message envoyé');
            setShowCompose(false);
            setComposeSubject('');
            setComposeBody('');
        } catch {
            toast.error("Erreur lors de l'envoi");
        }
    }, [composeBody, composeSubject, composeToId, sendMsg, user]);

    const handleDelete = useCallback(async (id: string) => {
        if (!confirm('Supprimer ce message ?')) return;
        try {
            await deleteMsg.mutateAsync(id);
            if (selected?.id === id) setSelected(null);
            toast.success('Message supprimé');
        } catch {
            toast.error('Erreur lors de la suppression');
        }
    }, [deleteMsg, selected]);

    return (
        <div className="content-body">
            {/* ── Header ─────────────────────────────────────────── */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                            Messages
                            {unread > 0 && (
                                <span style={{
                                    marginLeft: 12, fontSize: 14, fontWeight: 600,
                                    background: '#2a6b8f', color: 'white',
                                    padding: '2px 10px', borderRadius: 20,
                                }}>
                                    {unread} non lu{unread > 1 ? 's' : ''}
                                </span>
                            )}
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: 15 }}>
                            Communiquez avec vos patients
                        </p>
                    </div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowCompose(true)}
                    >
                        <i className="fas fa-pen" style={{ marginRight: 8 }} />
                        Nouveau message
                    </button>
                </div>
            </div>

            {/* ── Layout ─────────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.5fr' : '1fr', gap: 24 }}>

                {/* Message list */}
                <div className="card" style={{ padding: 0 }}>
                    {isError ? (
                        <div style={{ padding: 24 }}>
                            <ErrorMessage
                                message={error instanceof Error ? error.message : 'Erreur de chargement'}
                                onRetry={() => refetch()}
                            />
                        </div>
                    ) : isLoading ? (
                        <LoadingSpinner text="Chargement des messages..." />
                    ) : messages.length === 0 ? (
                        <EmptyState
                            icon="fas fa-envelope-open"
                            title="Aucun message"
                            description="Votre boîte de réception est vide"
                            action={
                                <button className="btn btn-primary btn-sm" onClick={() => setShowCompose(true)}>
                                    Envoyer un message
                                </button>
                            }
                        />
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => handleSelect(msg)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '16px 20px',
                                    borderBottom: '1px solid #f3f4f6',
                                    cursor: 'pointer',
                                    background: selected?.id === msg.id
                                        ? '#f0f7ff'
                                        : !msg.isRead ? '#fafbff' : 'transparent',
                                    transition: 'background 0.2s',
                                }}
                            >
                                <Avatar name={msg.fromName} size="md" />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                        <p style={{ fontWeight: !msg.isRead ? 700 : 500, fontSize: 14, color: '#111827' }}>
                                            {msg.fromName}
                                        </p>
                                        <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                                            {formatRelativeTime(msg.sentAt)}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 13, fontWeight: !msg.isRead ? 600 : 400, color: '#374151', marginBottom: 2 }}>
                                        {msg.subject}
                                    </p>
                                    <p style={{
                                        fontSize: 12, color: '#9ca3af',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>
                                        {msg.body}
                                    </p>
                                </div>
                                {!msg.isRead && (
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2a6b8f', flexShrink: 0 }} />
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Message detail */}
                {selected && (
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <Avatar name={selected.fromName} size="lg" />
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{selected.fromName}</p>
                                    <p style={{ fontSize: 12, color: '#9ca3af' }}>{formatRelativeTime(selected.sentAt)}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                    className="btn btn-sm btn-ghost"
                                    onClick={() => setShowCompose(true)}
                                    title="Répondre"
                                >
                                    <i className="fas fa-reply" />
                                </button>
                                <button
                                    className="btn btn-sm"
                                    onClick={() => handleDelete(selected.id)}
                                    style={{ background: 'transparent', color: '#ef4444', border: '1px solid #fecaca', padding: '6px 10px' }}
                                    title="Supprimer"
                                >
                                    <i className="fas fa-trash" />
                                </button>
                                <button
                                    className="btn btn-sm btn-ghost"
                                    onClick={() => setSelected(null)}
                                    title="Fermer"
                                >
                                    <i className="fas fa-times" />
                                </button>
                            </div>
                        </div>

                        <div style={{
                            padding: '16px 20px',
                            background: '#f9fafb',
                            borderRadius: 8,
                            marginBottom: 20,
                            borderLeft: '3px solid #2a6b8f',
                        }}>
                            <p style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{selected.subject}</p>
                        </div>

                        <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7 }}>{selected.body}</p>

                        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f3f4f6' }}>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                    setComposeToId(selected.fromId);
                                    setComposeSubject(`Re: ${selected.subject}`);
                                    setShowCompose(true);
                                }}
                            >
                                <i className="fas fa-reply" style={{ marginRight: 8 }} />
                                Répondre
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Compose Modal ───────────────────────────────────── */}
            {showCompose && (
                <div className="modal-overlay" onClick={() => setShowCompose(false)}>
                    <div className="modal-container" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><i className="fas fa-pen" style={{ marginRight: 10, color: '#2a6b8f' }} />Nouveau message</h3>
                            <button className="modal-close" onClick={() => setShowCompose(false)}>
                                <i className="fas fa-times" />
                            </button>
                        </div>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                                    Destinataire (ID patient)
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="Ex: p_004"
                                    value={composeToId}
                                    onChange={(e) => setComposeToId(e.target.value)}
                                />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                                    Objet
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="Objet du message"
                                    value={composeSubject}
                                    onChange={(e) => setComposeSubject(e.target.value)}
                                />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                                    Message
                                </label>
                                <textarea
                                    className="form-control"
                                    placeholder="Votre message..."
                                    rows={5}
                                    value={composeBody}
                                    onChange={(e) => setComposeBody(e.target.value)}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowCompose(false)}>Annuler</button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSend}
                                disabled={sendMsg.isPending}
                            >
                                {sendMsg.isPending ? (
                                    <><i className="fas fa-spinner icon-spin" style={{ marginRight: 8 }} />Envoi...</>
                                ) : (
                                    <><i className="fas fa-paper-plane" style={{ marginRight: 8 }} />Envoyer</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesPage;