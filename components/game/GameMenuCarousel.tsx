'use client'

import { useRef } from "react";
import { Button } from "@heroui/react";

export type MenuItem = {
    title: string;
    id: string;
    desc: string;
    color: string;
    border: string;
    path: string;
    component: React.ReactNode;
}

interface GameMenuCarouselProps {
    items: MenuItem[];
    activeId: string;
    onSelect: (id: string) => void;
}

export function GameMenuCarousel({ items, activeId, onSelect }: GameMenuCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative group/carousel">
            {/* Navigation Buttons - Visible on large screens or hover */}
            <Button
                isIconOnly
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur border border-white/10 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:flex"
                onPress={() => scroll('left')}
            >
                ←
            </Button>

            <Button
                isIconOnly
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur border border-white/10 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:flex"
                onPress={() => scroll('right')}
            >
                →
            </Button>

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className={`
                                relative flex-shrink-0 w-64 p-4 rounded-xl transition-all duration-300 snap-center text-left
                                border group
                                ${isActive
                                    ? `bg-white/10 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] ring-1 ring-primary`
                                    : 'bg-[#0a0a0a] border-white/10 hover:border-white/30 hover:bg-white/5'
                                }
                            `}
                        >
                            {/* Icon & Title */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg bg-black/50 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                                    </svg>
                                </div>
                                <span className={`font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-gray-300 decoration-slice'}`}>
                                    {item.title}
                                </span>
                            </div>

                            {/* Desc */}
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                {item.desc}
                            </p>

                            {/* Active Indicator Bar */}
                            {isActive && (
                                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full shadow-glow"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    )
}
