import {getAvatarColors, getInitials} from "@core/utils";
import React from "react";

interface AvatarProps {
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    imageUrl?: string;
    className?: string;
}
const SIZE_CLASSES = { sm: 32, md: 40, lg: 56, xl: 80 };
const FONT_CLASSES = { sm: '12px', md: '14px', lg: '18px', xl: '28px' };

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', imageUrl, className = '' }) => {
    const colors = getAvatarColors(name);
    const px = SIZE_CLASSES[size];
    const fs = FONT_CLASSES[size];

    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt={name}
                style={{ width: px, height: px }}
                className={`rounded-full object-cover flex-shrink-0 ${className}`}
            />
        );
    }

    return (
        <div
            style={{
                width: px,
                height: px,
                background: colors.bg,
                color: colors.text,
                fontSize: fs,
            }}
            className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 ${className}`}
        >
            {getInitials(name)}
        </div>
    );
};