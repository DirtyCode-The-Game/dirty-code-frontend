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
    lockedItems?: string[]; // IDs of items that are locked
}

export function GameMenuCarousel({ items, activeId, onSelect, lockedItems = [] }: GameMenuCarouselProps) {
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

    // Auto-scroll to active item
    useEffect(() => {
        if (activeId && scrollRef.current) {
            const activeElement = document.getElementById(`menu-item-${activeId}`);
            if (activeElement) {
                // Determine if we are on mobile (simple check or always center)
                // always centering is good behavior for this type of menu
                activeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [activeId]);

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
                <div className="hidden md:flex absolute left-0 top-0 bottom-0 z-10 items-center pr-12 bg-gradient-to-r from-black via-black/80 to-transparent">
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
                <div className="hidden md:flex absolute right-0 top-0 bottom-0 z-10 items-center pl-12 bg-gradient-to-l from-black via-black/80 to-transparent">
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
                    const isLocked = lockedItems.includes(item.id);
                    return (
                        <Card
                            key={item.id}
                            id={`menu-item-${item.id}`} // Used for auto-scroll
                            isPressable
                            onPress={() => onSelect(item.id)}
                            className={`
                                flex-shrink-0 w-36 md:w-64 border bg-black transition-all duration-300 snap-center md:snap-start relative
                                ${isActive
                                    ? `bg-white/10 border-primary ring-1 ring-primary`
                                    : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                                }
                                ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}
                            `}
                        >
                            <CardBody className="p-3 md:p-4 flex flex-col items-start gap-1 md:gap-2 overflow-hidden h-full">
                                {/* Icon & Title */}
                                <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3 mb-0 md:mb-1 w-full">
                                    <div className={`p-1.5 md:p-2 rounded-lg bg-black/50 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                                        </svg>
                                    </div>
                                    <span className={`font-bold uppercase tracking-wider text-[10px] md:text-sm text-center md:text-left ${isActive ? 'text-white' : 'text-gray-300 decoration-slice'}`}>
                                        {item.title}
                                    </span>
                                </div>

                                {/* Desc */}
                                <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed line-clamp-2 md:line-clamp-2 text-center md:text-left hidden md:block">
                                    {item.desc}
                                </p>

                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full shadow-glow"></div>
                                )}

                                {/* Locked Indicator */}
                                {isLocked && (
                                    <div className="absolute top-2 right-2 bg-red-500/80 rounded-full p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    );
                })}
            </ScrollShadow>
        </div>
    )
}
