'use client'

import { Star } from "lucide-react";
import { Tooltip } from "@heroui/react";

interface WantedStarsProps {
    wantedLevel: number;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function WantedStars({ wantedLevel = 0 }: WantedStarsProps) {
    const maxWantedLevel = 100;
    const starCount = 5;
    const perStar = maxWantedLevel / starCount;

    const clampedWantedLevel = clamp(wantedLevel, 0, maxWantedLevel);

    return (
        <Tooltip content="Ta achando que é GTA? Experimenta por 5...">
            <div className="flex gap-0.5 mb-1">
                {Array.from({ length: starCount }).map((_, starIndex) => {
                    const starProgress = clamp(
                        (clampedWantedLevel - starIndex * perStar) / perStar,
                        0,
                        1
                    );

                    return (
                        <div key={starIndex} className="relative" style={{ width: 14, height: 14 }}>
                            <Star
                                size={14}
                                className="text-gray-600 fill-transparent"
                            />

                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: `${starProgress * 100}%` }}
                            >
                                <Star
                                    size={14}
                                    className={`fill-yellow-500 text-yellow-500 ${starProgress === 1 ? "animate-pulse" : ""}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </Tooltip>
    );
}