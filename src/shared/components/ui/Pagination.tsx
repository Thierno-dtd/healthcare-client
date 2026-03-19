import React from "react";

interface PaginationProps {
    page: number;
    totalPages: number;
    total: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}
export const Pagination: React.FC<PaginationProps> = ({
                                                          page, totalPages, total, pageSize, onPageChange,
                                                      }) => {
    if (totalPages <= 1) return null;

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
            <p style={{ fontSize: 13, color: '#6b7280' }}>
                Affichage de <strong>{start}</strong> à <strong>{end}</strong> sur <strong>{total}</strong>
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
                <button
                    className="btn btn-sm btn-ghost"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const n = i + 1;
                    return (
                        <button
                            key={n}
                            className={`btn btn-sm ${n === page ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => onPageChange(n)}
                        >
                            {n}
                        </button>
                    );
                })}
                <button
                    className="btn btn-sm btn-ghost"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );
};