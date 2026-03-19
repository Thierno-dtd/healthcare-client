import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { getAvatarGradient, ROLE_LABELS, formatDate } from '@/core/utils';

const ProfilePage: React.FC = () => {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [isSaving, setIsSaving] = useState(false);

    if (!user) return null;

    const gradient = getAvatarGradient(user.name);
    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise((r) => setTimeout(r, 600));
        setIsSaving(false);
        setIsEditing(false);
        toast.success('Profil mis à jour');
    };

    return (
        <div className="content-body">
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                    Mon profil
                </h1>
                <p style={{ color: '#6b7280', fontSize: 15 }}>
                    Gérez vos informations personnelles
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
                {/* ── Avatar card ─────────────────────────────────── */}
                <div className="card" style={{ padding: 32, textAlign: 'center' }}>
                    <div style={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 36,
                        fontWeight: 700,
                        color: 'white',
                        margin: '0 auto 16px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    }}>
                        {initials}
                    </div>

                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                        {user.name}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>
                        {user.email}
                    </p>

                    <div style={{
                        padding: '8px 16px',
                        borderRadius: 20,
                        background: '#dbeafe',
                        color: '#1d4ed8',
                        fontSize: 13,
                        fontWeight: 600,
                        display: 'inline-block',
                        marginBottom: 24,
                    }}>
                        <i className="fas fa-shield-alt" style={{ marginRight: 6 }} />
                        {ROLE_LABELS[user.role] ?? user.role}
                    </div>

                    <div style={{ fontSize: 12, color: '#9ca3af' }}>
                        <i className="fas fa-calendar" style={{ marginRight: 4 }} />
                        Membre depuis {formatDate(user.createdAt)}
                    </div>

                    {user.hospitalId && (
                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
                            <i className="fas fa-hospital" style={{ marginRight: 4 }} />
                            ID établissement : {user.hospitalId}
                        </div>
                    )}
                </div>

                {/* ── Info card ───────────────────────────────────── */}
                <div className="card" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
                            Informations personnelles
                        </h3>
                        {!isEditing ? (
                            <button
                                className="btn btn-sm btn-outline"
                                onClick={() => setIsEditing(true)}
                            >
                                <i className="fas fa-edit" style={{ marginRight: 6 }} />
                                Modifier
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                    className="btn btn-sm btn-ghost"
                                    onClick={() => { setIsEditing(false); setName(user.name); setEmail(user.email); }}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <><i className="fas fa-spinner icon-spin" style={{ marginRight: 6 }} />Sauvegarde...</>
                                    ) : (
                                        <><i className="fas fa-save" style={{ marginRight: 6 }} />Sauvegarder</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gap: 20 }}>
                        {[
                            {
                                label: 'Nom complet',
                                icon: 'fas fa-user',
                                value: name,
                                onChange: (v: string) => setName(v),
                                editable: true,
                            },
                            {
                                label: 'Adresse email',
                                icon: 'fas fa-envelope',
                                value: email,
                                onChange: (v: string) => setEmail(v),
                                editable: true,
                            },
                            {
                                label: 'Rôle',
                                icon: 'fas fa-shield-alt',
                                value: ROLE_LABELS[user.role] ?? user.role,
                                editable: false,
                            },
                            {
                                label: 'Identifiant',
                                icon: 'fas fa-fingerprint',
                                value: user.id,
                                editable: false,
                            },
                        ].map(({ label, icon, value, onChange, editable }) => (
                            <div key={label}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                                    {label}
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <i className={icon} style={{ color: '#9ca3af', width: 16, fontSize: 14 }} />
                                    {isEditing && editable ? (
                                        <input
                                            className="form-control"
                                            value={value}
                                            onChange={(e) => onChange?.(e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: 15, color: '#111827', fontWeight: 500 }}>
                      {value}
                    </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Security section */}
                    <div style={{
                        marginTop: 32,
                        padding: 20,
                        background: '#f9fafb',
                        borderRadius: 12,
                        border: '1px solid #f3f4f6',
                    }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 12 }}>
                            <i className="fas fa-lock" style={{ marginRight: 8, color: '#6b7280' }} />
                            Sécurité du compte
                        </h4>
                        <button className="btn btn-sm btn-outline">
                            <i className="fas fa-key" style={{ marginRight: 6 }} />
                            Changer le mot de passe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;