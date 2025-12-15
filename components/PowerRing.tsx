
import React from 'react';

interface PowerRingProps {
    progress: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
    color?: string;
    icon?: React.ReactNode;
}

const PowerRing: React.FC<PowerRingProps> = ({
    progress,
    size = 60,
    strokeWidth = 4,
    color = '#3b82f6',
    icon
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg
                className="transform -rotate-90 w-full h-full"
                width={size}
                height={size}
            >
                <circle
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Circle */}
                <circle
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"
                />
            </svg>

            {/* Centered Icon */}
            {icon && (
                <div className="absolute inset-0 flex items-center justify-center">
                    {icon}
                </div>
            )}
        </div>
    );
};

export default PowerRing;
