import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Store
import { useAuthStore } from '../../../core/stores/auth.store';

// Hooks
import {
    usePatients,
    usePatientStats,
    useUpdatePatientStatus,
} from '../../../core/hooks/usePatients';

// Feature components
import PatientTable from '../../../features/patients/components/PatientTable';
import PatientCard from '../../../features/patients/components/PatientCard';

// Shared components
import {
    StatCard,
    EmptyState,
    ErrorMessage,
    Pagination,
    LoadingSpinner,
} from '../../../shared/components/ui';

import type { Patient, PatientStatus } from '../../../core/models';

// ─── View mode toggle ─────────────────────────────────────────
type ViewMode = 'table' | 'grid';

const PatientsPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [viewMode, setViewMode] = useState<ViewMode>('table');

    // ── Data via hooks ──────────────────────────────────────────
    const {
        data: paginatedPatients,
        isLoading,
        isError,
        error,
        refetch,
        filters,
        setSearch,
        setStatus,
        setPage,
    } = usePatients({
        doctorId: user?.role === 'doctor' ? undefined : undefined, // Doctor sees their patients
        pageSize: 10,
    });

    const { data: stats, isLoading: statsLoading } = usePatientStats(
        user?.role === 'doctor' ? { doctorId: 'd_001' } : {}
    );

    const updateStatus = useUpdatePatientStatus();

    // ── Handlers ────────────────────────────────────────────────
    const handleView = useCallback((patient: Patient) => {
        navigate(`/patients/${patient.id}`);
    }, [navigate]);

    const handleValidate = useCallback(async (patient: Patient) => {
        try {
            await updateStatus.mutateAsync({ id: patient.id, status: 'active' });
            toast.success(`Compte de ${patient.name} validé`);
        } catch {
            toast.error('Erreur lors de la validation');
        }
    }, [updateStatus]);

    const handleSuspend = useCallback(async (patient: Patient) => {
        if (!confirm(`Suspendre le compte de ${patient.name} ?`)) return;
        try {
            await updateStatus.mutateAsync({ id: patient.id, status: 'suspended' });
            toast.success(`Compte de ${patient.name} suspendu`);
        } catch {
            toast.error('Erreur lors de la suspension');
        }
    }, [updateStatus]);

    const patients = paginatedPatients?.data ?? [];
    const total = paginatedPatients?.total ?? 0;
    const totalPages = paginatedPatients?.totalPages ?? 1;

    return (
        <div className="content-body">

            {/* ── Page header ──────────────────────────────────────── */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                    Gestion des patients
                </h1>
                <p style={{ color: '#6b7280', fontSize: 15 }}>
                    Suivez et gérez vos patients en temps réel
                </p>
            </div>

            {/* ── Stats ────────────────────────────────────────────── */}
            {statsLoading ? (
                <div className="stats-grid" style={{ marginBottom: 28 }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: 88, borderRadius: 12 }} />
                    ))}
                </div>
            ) : stats ? (
                <div className="stats-grid" style={{ marginBottom: 28 }}>
                    <StatCard icon="fas fa-users" iconColor="blue" label="Total patients" value={stats.total} />
                    <StatCard icon="fas fa-user-check" iconColor="green" label="Actifs" value={stats.active} />
                    <StatCard icon="fas fa-user-clock" iconColor="orange" label="En attente" value={stats.pending} />
                    <StatCard icon="fas fa-user-plus" iconColor="purple" label="Ce mois" value={stats.newThisMonth} />
                </div>
            ) : null}

            {/* ── Main card ─────────────────────────────────────────── */}
            <div className="card" style={{ padding: 0 }}>

                {/* Toolbar */}
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
                    display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center',
                }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
                        <i className="fas fa-search" style={{
                            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                            color: '#9ca3af', fontSize: 14,
                        }} />
                        <input
                            type="text"
                            placeholder="Rechercher un patient..."
                            className="form-control"
                            style={{ paddingLeft: 40 }}
                            value={filters.search ?? ''}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Status filter */}
                    <select
                        className="form-control"
                        style={{ width: 'auto', minWidth: 160 }}
                        value={filters.status ?? 'all'}
                        onChange={(e) => setStatus(e.target.value as PatientStatus | 'all')}
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs</option>
                        <option value="pending">En attente</option>
                        <option value="suspended">Suspendus</option>
                    </select>

                    {/* View toggle */}
                    <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
                        <button
                            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setViewMode('table')}
                            title="Vue tableau"
                        >
                            <i className="fas fa-list"></i>
                        </button>
                        <button
                            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setViewMode('grid')}
                            title="Vue grille"
                        >
                            <i className="fas fa-th-large"></i>
                        </button>
                    </div>

                    {/* Add patient (admin/manager) */}
                    {user?.role !== 'doctor' && (
                        <button className="btn btn-primary btn-sm" onClick={() => navigate('/patients/new')}>
                            <i className="fas fa-plus"></i> Ajouter
                        </button>
                    )}
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
                    <LoadingSpinner text="Chargement des patients..." />
                ) : patients.length === 0 ? (
                    <EmptyState
                        icon="fas fa-user-slash"
                        title="Aucun patient trouvé"
                        description={
                            filters.search
                                ? `Aucun résultat pour "${filters.search}"`
                                : 'Aucun patient dans cette catégorie'
                        }
                        action={
                            filters.search || filters.status !== 'all' ? (
                                <button className="btn btn-outline" onClick={() => { setSearch(''); setStatus('all'); }}>
                                    Réinitialiser les filtres
                                </button>
                            ) : undefined
                        }
                    />
                ) : viewMode === 'table' ? (
                    <PatientTable
                        patients={patients}
                        onView={handleView}
                        onValidate={handleValidate}
                        onSuspend={handleSuspend}
                    />
                ) : (
                    <div style={{ padding: 24 }}>
                        <div className="content-grid">
                            {patients.map((p) => (
                                <PatientCard
                                    key={p.id}
                                    patient={p}
                                    onView={handleView}
                                    onValidate={handleValidate}
                                    onSuspend={handleSuspend}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {patients.length > 0 && (
                    <div style={{ padding: '0 24px 16px' }}>
                        <Pagination
                            page={filters.page ?? 1}
                            totalPages={totalPages}
                            total={total}
                            pageSize={filters.pageSize ?? 10}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientsPage;