import React from "react";

interface ErrorProps {
    message: string;
    onRetry?: () => void;
}
export const ErrorMessage: React.FC<ErrorProps> = ({ message, onRetry }) => (
    <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <i className="fas fa-exclamation-triangle"></i>
        <span style={{ flex: 1 }}>{message}</span>
        {onRetry && (
            <button className="btn btn-sm btn-outline" onClick={onRetry}>
                <i className="fas fa-redo"></i> Réessayer
            </button>
        )}
    </div>
);