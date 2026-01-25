'use client'

import { useEffect, useState } from "react";

interface CountdownTimerProps {
    targetDate: string | Date;
    onExpire?: () => void;
    className?: string;
}

export function CountdownTimer({ targetDate, onExpire, className }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const target = new Date(targetDate).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft('');
                if (onExpire) onExpire();
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const parts = [];
            if (hours > 0) parts.push(`${hours}h`);
            if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
            parts.push(`${seconds}s`);

            setTimeLeft(parts.join(' '));
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [targetDate, onExpire]);

    if (!timeLeft) return null;

    return (
        <span className={className}>
            {timeLeft}
        </span>
    );
}
