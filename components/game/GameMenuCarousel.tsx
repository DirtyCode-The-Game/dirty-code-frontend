'use client'

import { useRef, useState, useEffect } from "react";
import { Button, Card, CardBody, ScrollShadow } from "@heroui/react";

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
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', checkScroll);
            // Check initial state
            checkScroll();
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 280; // Largura do card (256px) + gap (16px) aprox
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative group w-full">
            {/* Left Arrow */}
            {showLeftArrow && (
                <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-12 bg-gradient-to-r from-black via-black/80 to-transparent">
                    <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        className="bg-zinc-900/80 border border-white/10 text-white rounded-full ml-2"
                        onPress={() => scroll('left')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </Button>
                </div>
            )}

            {/* Right Arrow */}
            {showRightArrow && (
                <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-12 bg-gradient-to-l from-black via-black/80 to-transparent">
                    <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        className="bg-zinc-900/80 border border-white/10 text-white rounded-full mr-2"
                        onPress={() => scroll('right')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </Button>
                </div>
            )}

            <ScrollShadow
                ref={scrollRef}
                orientation="horizontal"
                className="flex gap-4 snap-x snap-mandatory scrollbar-hide w-full mt-0 pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                hideScrollBar
            >
                {items.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                        <Card
                            key={item.id}
                            isPressable
                            onPress={() => onSelect(item.id)}
                            className={`
                                flex-shrink-0 w-64 border bg-black transition-all duration-300 snap-start
                                ${isActive
                                ? `bg-white/10 border-primary ring-1 ring-primary`
                                : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                            }
                            `}
                        >
                            <CardBody className="p-4 flex flex-col items-start gap-2 overflow-hidden">
                                {/* Icon & Title */}
                                <div className="flex items-center gap-3 mb-1 w-full">
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
                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 text-left">
                                    {item.desc}
                                </p>

                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full shadow-glow"></div>
                                )}
                            </CardBody>
                        </Card>
                    );
                })}
            </ScrollShadow>
        </div>
    )
}
