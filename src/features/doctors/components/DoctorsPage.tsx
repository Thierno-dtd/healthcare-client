import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';
import { StatCard } from '@/shared/components/ui/StatCard';
import { Avatar } from '@/shared/components/ui/Avatar';
import { formatRelativeDate } from '@/core/utils';
import type { Doctor } from '@/data/models/doctor.model';
import {useDoctors, useUpdateDoctorStatus} from "@/hook/useDoctors.ts";

const STATUS_CONFIG = {
    active: { label: 'Actif', color: '#059669', bg: '#d1fae5' },
    pending: { label: 'En attente', color: '#d97706', bg: '#fef3c7' },
    inactive: { label: 'Inactif', color: '#dc2626', bg: '#fee2e2' },
};

const DoctorsPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<Doctor['status'] | 'all'>('all');

    const { data: doctors = [], isLoading, isError, error, refetch } = useDoctors({
        search,
        status: statusFilter,
    });

    const updateStatus = useUpdateDoctorStatus();

    const handleActivate = useCallback(async (doctor: Doctor) => {
        try {
            await updateStatus.mutateAsync({ id: doctor.id, status: 'active' });
            toast.success(`Dr. ${doctor.name} activé`);
        } catch {
            toast.error('Erreur lors de l\'activation');
        }
    }, [updateStatus]);

    const handleDeactivate = useCallback(async (doctor: Doctor) => {
        if (!confirm(`Désactiver le compte de ${doctor.name} ?`)) return;
        try {
            await updateStatus.mutateAsync({ id: doctor.id, status: 'inactive' });
            toast.success(`Dr. ${doctor.name} désactivé`);
        } catch {
            toast.error('Erreur lors de la désactivation');
        }
    }, [updateStatus]);

    const active = doctors.filter((d) => d.status === 'active').length;
    const pending = doctors.filter((d) => d.status === 'pending').length;

    return (
        <div className="content-body">
            {/* ── Header ─────────────────────────────────────────── */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                    Médecins
                </h1>
                <p style={{ color: '#6b7280', fontSize: 15 }}>
                    Gérez les médecins et leurs accès
                </p>
            </div>

            {/* ── Stats ─────────────────────────────────────────── */}
            <div className="stats-grid" style={{ marginBottom: 28 }}>
                <StatCard icon="fas fa-user-md" iconColor="blue" label="Total médecins" value={doctors.length} />
                <StatCard icon="fas fa-user-check" iconColor="green" label="Actifs" value={active} />
                <StatCard icon="fas fa-user-clock" iconColor="orange" label="En attente" value={pending} />
                <StatCard
                    icon="fas fa-stethoscope"
                    iconColor="purple"
                    label="Patients suivis"
                    value={doctors.reduce((s, d) => s + d.patientCount, 0)}
                />
            </div>

            {/* ── Main card ─────────────────────────────────────── */}
            <div className="card" style={{ padding: 0 }}>
                {/* Toolbar */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    gap: 16,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                }}>
                    <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
                        <i className="fas fa-search" style={{
                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                            color: '#9ca3af', fontSize: 14,
                        }} />
                        <input
                            type="text"
                            placeholder="Rechercher un médecin..."
                            className="form-control"
                            style={{ paddingLeft: 40 }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="form-control"
                        style={{ width: 'auto', minWidth: 160 }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as Doctor['status'] | 'all')}
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs</option>
                        <option value="pending">En attente</option>
                        <option value="inactive">Inactifs</option>
                    </select>
                </div>

                {/* Content */}
                {isError ? (
                    <div style={{ padding: 24 }}>
                        <ErrorMessage
                            message={error instanceof Error ? error.message : 'Erreur de chargement'}
                            onRetry={() => refetch()}
                        />
                    </div>
                ) : isLoading ? (
                    <LoadingSpinner text="Chargement des médecins..." />
                ) : doctors.length === 0 ? (
                    <EmptyState
                        icon="fas fa-user-md"
                        title="Aucun médecin trouvé"
                        description={search ? `Aucun résultat pour "${search}"` : 'Aucun médecin dans cette catégorie'}
                        action={
                            search ? (
                                <button className="btn btn-outline" onClick={() => setSearch('')}>
                                    Réinitialiser
                                </button>
                            ) : undefined
                        }
                    />
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                                {['Médecin', 'Spécialisation', 'Patients', 'Alertes', 'Statut', 'Rejoint le', 'Actions'].map((col) => (
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
                            {doctors.map((doc) => {
                                const cfg = STATUS_CONFIG[doc.status];
                                return (
                                    <tr
                                        key={doc.id}
                                        style={{ borderBottom: '1px solid #f9fafb' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <Avatar name={doc.name} size="sm" />
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 2 }}>
                                                        {doc.name}
                                                    </p>
                                                    <p style={{ fontSize: 12, color: '#9ca3af' }}>{doc.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151' }}>
                        <span style={{
                            padding: '3px 10px',
                            background: '#dbeafe',
                            color: '#1d4ed8',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 500,
                        }}>
                          {doc.specialization}
                        </span>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: 14, color: '#374151', textAlign: 'center' }}>
                                            {doc.patientCount}
                                        </td>
                                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                            {doc.alertCount > 0 ? (
                                                <span style={{
                                                    padding: '3px 10px',
                                                    background: '#fee2e2',
                                                    color: '#dc2626',
                                                    borderRadius: 12,
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                }}>
                            {doc.alertCount}
                          </span>
                                            ) : (
                                                <span style={{ color: '#9ca3af', fontSize: 13 }}>–</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                        <span style={{
                            padding: '4px 12px',
                            background: cfg.bg,
                            color: cfg.color,
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 600,
                        }}>
                          {cfg.label}
                        </span>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                                            {formatRelativeDate(doc.joinedAt)}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                {doc.status === 'pending' && (
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => handleActivate(doc)}
                                                        disabled={updateStatus.isPending}
                                                        title="Activer"
                                                    >
                                                        <i className="fas fa-check" />
                                                    </button>
                                                )}
                                                {doc.status === 'active' && (
                                                    <button
                                                        className="btn btn-sm"
                                                        onClick={() => handleDeactivate(doc)}
                                                        disabled={updateStatus.isPending}
                                                        style={{
                                                            background: 'transparent',
                                                            color: '#ef4444',
                                                            border: '1px solid #fecaca',
                                                            padding: '6px 10px',
                                                        }}
                                                        title="Désactiver"
                                                    >
                                                        <i className="fas fa-ban" />
                                                    </button>
                                                )}
                                                <button className="btn btn-sm btn-ghost" title="Voir profil">
                                                    <i className="fas fa-eye" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorsPage;