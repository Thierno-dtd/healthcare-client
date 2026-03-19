import React from "react";

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}
export const LoadingSpinner: React.FC<SpinnerProps> = ({ size = 'md', text }) => {
    const sizeMap = { sm: 24, md: 40, lg: 64 };
    const px = sizeMap[size];

    return (
        <div className="flex flex-direction-column items-center justify-center gap-3 py-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div
                className="spinner"
                style={{ width: px, height: px }}
            />
            {text && <p style={{ color: '#6b7280', fontSize: 14 }}>{text}</p>}
        </div>
    );
};