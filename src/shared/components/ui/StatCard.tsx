import React from "react";

interface StatCardProps {
    icon: string;
    iconColor: 'blue' | 'green' | 'orange' | 'red' | 'purple';
    label: string;
    value: number | string;
    trend?: { value: number; label: string };
}
export const StatCard: React.FC<StatCardProps> = ({ icon, iconColor, label, value, trend }) => (
    <div className="stat-card">
        <div className={`stat-icon ${iconColor}`}>
            <i className={icon}></i>
        </div>
        <div className="stat-info">
            <h3>{value}</h3>
            <p>{label}</p>
            {trend && (
                <p style={{ fontSize: 12, marginTop: 4, color: trend.value >= 0 ? '#059669' : '#dc2626' }}>
                    <i className={`fas fa-arrow-${trend.value >= 0 ? 'up' : 'down'}`}></i>{' '}
                    {Math.abs(trend.value)}% {trend.label}
                </p>
            )}
        </div>
    </div>
);
