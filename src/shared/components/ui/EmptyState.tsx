import React from "react";

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    action?: React.ReactNode;
}
export const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'fas fa-inbox', title, description, action }) => (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{
            width: 80, height: 80, background: '#f3f4f6', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
        }}>
            <i className={icon} style={{ fontSize: 32, color: '#9ca3af' }}></i>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1f2937', marginBottom: 8 }}>{title}</h3>
        {description && <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>{description}</p>}
        {action}
    </div>
);
