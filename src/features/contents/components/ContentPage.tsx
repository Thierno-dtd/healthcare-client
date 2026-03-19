import React, { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useContent, useTogglePublish, useDeleteContent } from '@/hook/useContent';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ErrorMessage } from '@/shared/components/ui/ErrorMessage';
import { StatCard } from '@/shared/components/ui/StatCard';
import { formatRelativeDate } from '@/core/utils';
import type { ContentType, HealthContent } from '@/data/models/healthContent.model';

const TYPE_CONFIG: Record<ContentType, { label: string; color: string; bg: string; icon: string }> = {
    advice: { label: 'Conseil', color: '#059669', bg: '#d1fae5', icon: 'fas fa-lightbulb' },
    event: { label: 'Événement', color: '#7c3aed', bg: '#e9d5ff', icon: 'fas fa-calendar-alt' },
    news: { label: 'Actualité', color: '#1d4ed8', bg: '#dbeafe', icon: 'fas fa-newspaper' },
};

const ContentPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');

    const { data: content = [], isLoading, isError, error, refetch } = useContent({
        search,
        type: typeFilter,
    });

    const togglePublish = useTogglePublish();
    const deleteContent = useDeleteContent();

    const handleTogglePublish = useCallback(async (item: HealthContent) => {
        try {
            await togglePublish.mutateAsync(item.id);
            toast.success(item.isPublished ? 'Article dépublié' : 'Article publié');
        } catch {
            toast.error('Erreur lors de la mise à jour');
        }
    }, [togglePublish]);

    const handleDelete = useCallback(async (item: HealthContent) => {
        if (!confirm(`Supprimer "${item.title}" ?`)) return;
        try {
            await deleteContent.mutateAsync(item.id);
            toast.success('Contenu supprimé');
        } catch {
            toast.error('Erreur lors de la suppression');
        }
    }, [deleteContent]);

    const published = content.filter((c) => c.isPublished).length;
    const byType = (t: ContentType) => content.filter((c) => c.type === t).length;

    return (
        <div className="content-body">
            {/* ── Header ─────────────────────────────────────────── */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 6 }}>
                            Contenu de santé
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: 15 }}>
                            Gérez les conseils, événements et actualités
                        </p>
                    </div>
                    <button className="btn btn-primary btn-sm">
                        <i className="fas fa-plus" style={{ marginRight: 8 }} />
                        Nouveau contenu
                    </button>
                </div>
            </div>

            {/* ── Stats ─────────────────────────────────────────── */}
            <div className="stats-grid" style={{ marginBottom: 28 }}>
                <StatCard icon="fas fa-newspaper" iconColor="blue" label="Total" value={content.length} />
                <StatCard icon="fas fa-check-circle" iconColor="green" label="Publiés" value={published} />
                <StatCard icon="fas fa-lightbulb" iconColor="orange" label="Conseils" value={byType('advice')} />
                <StatCard icon="fas fa-calendar-alt" iconColor="purple" label="Événements" value={byType('event')} />
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
                            placeholder="Rechercher..."
                            className="form-control"
                            style={{ paddingLeft: 40 }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {(['all', 'advice', 'event', 'news'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTypeFilter(t)}
                                className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-ghost'}`}
                            >
                                {t === 'all' ? 'Tout' : t === 'advice' ? 'Conseils' : t === 'event' ? 'Événements' : 'Actualités'}
                            </button>
                        ))}
                    </div>
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
                    <LoadingSpinner text="Chargement du contenu..." />
                ) : content.length === 0 ? (
                    <EmptyState
                        icon="fas fa-newspaper"
                        title="Aucun contenu trouvé"
                        description={search ? `Aucun résultat pour "${search}"` : 'Aucun contenu dans cette catégorie'}
                    />
                ) : (
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {content.map((item) => {
                            const typeCfg = TYPE_CONFIG[item.type];
                            return (
                                <div
                                    key={item.id}
                                    className="card"
                                    style={{
                                        padding: '20px',
                                        borderLeft: `4px solid ${typeCfg.color}`,
                                        opacity: item.isPublished ? 1 : 0.7,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{
                            padding: '3px 10px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 600,
                            background: typeCfg.bg,
                            color: typeCfg.color,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                        }}>
                          <i className={typeCfg.icon} />
                            {typeCfg.label}
                        </span>
                                                {!item.isPublished && (
                                                    <span style={{
                                                        padding: '3px 10px',
                                                        borderRadius: 12,
                                                        fontSize: 11,
                                                        fontWeight: 600,
                                                        background: '#f3f4f6',
                                                        color: '#6b7280',
                                                    }}>
                            Brouillon
                          </span>
                                                )}
                                            </div>

                                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                                                {item.title}
                                            </h3>
                                            <p style={{
                                                fontSize: 13,
                                                color: '#6b7280',
                                                marginBottom: 10,
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical' as const,
                                            }}>
                                                {item.body}
                                            </p>

                                            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#9ca3af', flexWrap: 'wrap' }}>
                        <span>
                          <i className="fas fa-user" style={{ marginRight: 4 }} />
                            {item.authorName}
                        </span>
                                                <span>
                          <i className="fas fa-clock" style={{ marginRight: 4 }} />
                                                    {formatRelativeDate(item.publishedAt)}
                        </span>
                                                {item.tags.length > 0 && (
                                                    <span>
                            <i className="fas fa-tag" style={{ marginRight: 4 }} />
                                                        {item.tags.slice(0, 3).join(', ')}
                          </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                            <button
                                                className={`btn btn-sm ${item.isPublished ? 'btn-ghost' : 'btn-secondary'}`}
                                                onClick={() => handleTogglePublish(item)}
                                                disabled={togglePublish.isPending}
                                                title={item.isPublished ? 'Dépublier' : 'Publier'}
                                                style={{ fontSize: 12 }}
                                            >
                                                <i className={`fas fa-${item.isPublished ? 'eye-slash' : 'eye'}`} style={{ marginRight: 4 }} />
                                                {item.isPublished ? 'Dépublier' : 'Publier'}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-ghost"
                                                title="Modifier"
                                            >
                                                <i className="fas fa-edit" />
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => handleDelete(item)}
                                                disabled={deleteContent.isPending}
                                                title="Supprimer"
                                                style={{
                                                    background: 'transparent',
                                                    color: '#ef4444',
                                                    border: '1px solid #fecaca',
                                                    padding: '6px 10px',
                                                }}
                                            >
                                                <i className="fas fa-trash" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentPage;