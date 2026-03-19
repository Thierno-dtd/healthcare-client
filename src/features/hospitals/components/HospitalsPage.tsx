import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useHospitals, useUpdateHospital } from '@/hook/useHospitals';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';
import { StatCard } from '@/shared/components/ui/StatCard';
import { formatRelativeDate } from '@/core/utils';
import type { Hospital } from '@/data/models/hospital.model';

const HospitalsPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<Hospital['status'] | 'all'>('all');

    const { data: hospitals = [], isLoading, isError, error, refetch } = useHospitals({
        search,
        status: statusFilter,
    });

    const updateHospital = useUpdateHospital();

    const handleToggleStatus = useCallback(async (hospital: Hospital) => {
        const newStatus: Hospital['status'] = hospital.status === 'active' ? 'inactive' : 'active';
        const label = newStatus === 'active' ? 'activé' : 'désactivé';
        try {
            await updateHospital.mutateAsync({ id: hospital.id, updates: { status: newStatus } });
            toast.success(`${hospital.name} ${label}`);
        } catch {
            toast.error('Erreur lors de la mise à jour');
        }
    }, [updateHospital]);

    const active = hospitals.filter((h) => h.status === 'active').length;
    const totalDoctors = hospitals.reduce((s, h) => s + h.doctorCount, 0);
    const totalPatients = hospitals.reduce((s, h) => s + h.patientCount, 0);

    return (
        <div className="content-body">
            {/* ── Header ─────────────────────────────────────────── */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                    Établissements de santé
                </h1>
                <p style={{ color: '#6b7280', fontSize: 15 }}>
                    Gérez les hôpitaux et cliniques de la plateforme
                </p>
            </div>

            {/* ── Stats ─────────────────────────────────────────── */}
            <div className="stats-grid" style={{ marginBottom: 28 }}>
                <StatCard icon="fas fa-hospital" iconColor="blue" label="Établissements" value={hospitals.length} />
                <StatCard icon="fas fa-check-circle" iconColor="green" label="Actifs" value={active} />
                <StatCard icon="fas fa-user-md" iconColor="purple" label="Médecins total" value={totalDoctors} />
                <StatCard icon="fas fa-users" iconColor="orange" label="Patients total" value={totalPatients} />
            </div>

            {/* ── Main card ─────────────────────────────────────── */}
            <div className="card" style={{ padding: 0 }}>
                {/* Toolbar */}
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
                    display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center',
                }}>
                    <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
                        <i className="fas fa-search" style={{
                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                            color: '#9ca3af', fontSize: 14,
                        }} />
                        <input
                            type="text"
                            placeholder="Rechercher un établissement..."
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
                        onChange={(e) => setStatusFilter(e.target.value as Hospital['status'] | 'all')}
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs</option>
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
                    <LoadingSpinner text="Chargement des établissements..." />
                ) : hospitals.length === 0 ? (
                    <EmptyState
                        icon="fas fa-hospital"
                        title="Aucun établissement trouvé"
                        description={search ? `Aucun résultat pour "${search}"` : 'Aucun établissement'}
                        action={search ? (
                            <button className="btn btn-outline" onClick={() => setSearch('')}>
                                Réinitialiser
                            </button>
                        ) : undefined}
                    />
                ) : (
                    <div className="content-grid" style={{ padding: 24, gap: 20 }}>
                        {hospitals.map((hospital) => (
                            <HospitalCard
                                key={hospital.id}
                                hospital={hospital}
                                onToggleStatus={() => handleToggleStatus(hospital)}
                                isLoading={updateHospital.isPending}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Hospital Card subcomponent ───────────────────────────────
interface HospitalCardProps {
    hospital: Hospital;
    onToggleStatus: () => void;
    isLoading: boolean;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, onToggleStatus, isLoading }) => {
    const isActive = hospital.status === 'active';

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Color band */}
            <div style={{
                height: 6,
                background: isActive
                    ? 'linear-gradient(90deg, #059669, #14b8a6)'
                    : 'linear-gradient(90deg, #dc2626, #ef4444)',
            }} />

            <div style={{ padding: '20px 20px 16px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 10,
                            background: isActive ? '#d1fae5' : '#fee2e2',
                            color: isActive ? '#059669' : '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20,
                        }}>
                            <i className="fas fa-hospital" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 2 }}>
                                {hospital.name}
                            </h3>
                            <p style={{ fontSize: 12, color: '#9ca3af' }}>
                                {hospital.city}, {hospital.country}
                            </p>
                        </div>
                    </div>
                    <span style={{
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 600,
                        background: isActive ? '#d1fae5' : '#fee2e2',
                        color: isActive ? '#059669' : '#dc2626',
                    }}>
            {isActive ? 'Actif' : 'Inactif'}
          </span>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16, fontSize: 13, color: '#6b7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="fas fa-map-marker-alt" style={{ width: 16, color: '#9ca3af' }} />
                        {hospital.address}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="fas fa-phone" style={{ width: 16, color: '#9ca3af' }} />
                        {hospital.phone}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="fas fa-envelope" style={{ width: 16, color: '#9ca3af' }} />
                        {hospital.email}
                    </div>
                </div>

                {/* Stats row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 12,
                    marginBottom: 16,
                }}>
                    {[
                        { icon: 'fas fa-user-md', label: 'Médecins', value: hospital.doctorCount, color: '#2563eb', bg: '#dbeafe' },
                        { icon: 'fas fa-users', label: 'Patients', value: hospital.patientCount, color: '#7c3aed', bg: '#e9d5ff' },
                    ].map((stat) => (
                        <div key={stat.label} style={{
                            padding: '12px',
                            borderRadius: 8,
                            background: '#f9fafb',
                            textAlign: 'center',
                        }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: stat.bg,
                                color: stat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 6px',
                                fontSize: 14,
                            }}>
                                <i className={stat.icon} />
                            </div>
                            <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 2 }}>
                                {stat.value}
                            </p>
                            <p style={{ fontSize: 11, color: '#9ca3af' }}>{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 12,
                    borderTop: '1px solid #f3f4f6',
                }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>
            <i className="fas fa-calendar" style={{ marginRight: 4 }} />
            Créé le {formatRelativeDate(hospital.createdAt)}
          </span>
                    <button
                        className="btn btn-sm"
                        onClick={onToggleStatus}
                        disabled={isLoading}
                        style={{
                            background: isActive ? 'transparent' : '#d1fae5',
                            color: isActive ? '#dc2626' : '#059669',
                            border: `1px solid ${isActive ? '#fecaca' : '#a7f3d0'}`,
                            fontSize: 12,
                        }}
                    >
                        <i className={`fas fa-${isActive ? 'ban' : 'check'}`} style={{ marginRight: 4 }} />
                        {isActive ? 'Désactiver' : 'Activer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HospitalsPage;