import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCreatePatient } from '@/hook/usePatients';
import { useAuthStore } from '@/store/auth.store';
import { validatePatientForm } from '@/core/utils/validators';
import type { Gender } from '@/data/models/patient.model';

const NewPatientPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const createPatient = useCreatePatient();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'male' as Gender,
        conditions: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string) => {
        setForm((f) => ({ ...f, [field]: value }));
        // Clear field error on change
        if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validatePatientForm(form);
        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }

        try {
            await createPatient.mutateAsync({
                name: form.name,
                email: form.email,
                phone: form.phone,
                dateOfBirth: form.dateOfBirth,
                gender: form.gender,
                hospitalId: user?.hospitalId ?? 'h_001',
                doctorId: 'd_001',
                status: 'pending',
                conditions: form.conditions
                    .split(',')
                    .map((c) => c.trim())
                    .filter(Boolean),
            });
            toast.success('Patient créé avec succès');
            navigate('/patients');
        } catch {
            toast.error('Erreur lors de la création du patient');
        }
    };

    return (
        <div className="content-body">
            {/* ── Header ─────────────────────────────────────────── */}
            <div style={{ marginBottom: 28 }}>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate('/patients')}
                    style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}
                >
                    <i className="fas fa-arrow-left" />
                    Retour
                </button>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                    Nouveau patient
                </h1>
                <p style={{ color: '#6b7280', fontSize: 15 }}>
                    Enregistrez un nouveau patient sur la plateforme
                </p>
            </div>

            <div className="card" style={{ padding: 32, maxWidth: 680 }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                        {/* Name */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Nom complet *</label>
                            <input
                                className="form-control"
                                placeholder="Jean Dupont"
                                value={form.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                style={errors.name ? { borderColor: '#ef4444' } : {}}
                            />
                            {errors.name && <p style={errorStyle}>{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label style={labelStyle}>Email *</label>
                            <input
                                className="form-control"
                                type="email"
                                placeholder="jean.dupont@email.com"
                                value={form.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                style={errors.email ? { borderColor: '#ef4444' } : {}}
                            />
                            {errors.email && <p style={errorStyle}>{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label style={labelStyle}>Téléphone</label>
                            <input
                                className="form-control"
                                placeholder="+33 6 12 34 56 78"
                                value={form.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                style={errors.phone ? { borderColor: '#ef4444' } : {}}
                            />
                            {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                        </div>

                        {/* Date of birth */}
                        <div>
                            <label style={labelStyle}>Date de naissance *</label>
                            <input
                                className="form-control"
                                type="date"
                                value={form.dateOfBirth}
                                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                style={errors.dateOfBirth ? { borderColor: '#ef4444' } : {}}
                            />
                            {errors.dateOfBirth && <p style={errorStyle}>{errors.dateOfBirth}</p>}
                        </div>

                        {/* Gender */}
                        <div>
                            <label style={labelStyle}>Genre</label>
                            <select
                                className="form-control"
                                value={form.gender}
                                onChange={(e) => handleChange('gender', e.target.value)}
                            >
                                <option value="male">Homme</option>
                                <option value="female">Femme</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>

                        {/* Conditions */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Pathologies (séparées par des virgules)</label>
                            <input
                                className="form-control"
                                placeholder="hypertension, diabète type 2, asthme..."
                                value={form.conditions}
                                onChange={(e) => handleChange('conditions', e.target.value)}
                            />
                            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                                Entrez les pathologies séparées par des virgules. Exemple : hypertension, diabète type 2
                            </p>
                        </div>
                    </div>

                    {/* Info box */}
                    <div style={{
                        padding: '12px 16px',
                        background: '#f0f7ff',
                        borderRadius: 8,
                        marginBottom: 24,
                        display: 'flex',
                        gap: 10,
                        fontSize: 13,
                        color: '#2a6b8f',
                    }}>
                        <i className="fas fa-info-circle" style={{ marginTop: 2, flexShrink: 0 }} />
                        <span>
                            Le compte sera créé avec le statut <strong>En attente</strong> et devra être validé
                            par un médecin avant que le patient puisse accéder à la plateforme.
                        </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate('/patients')}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={createPatient.isPending}
                        >
                            {createPatient.isPending ? (
                                <><i className="fas fa-spinner icon-spin" style={{ marginRight: 8 }} />Création...</>
                            ) : (
                                <><i className="fas fa-user-plus" style={{ marginRight: 8 }} />Créer le patient</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 6,
};

const errorStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
};

export default NewPatientPage;