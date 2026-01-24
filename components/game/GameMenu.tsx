'use client'

import { Card, CardBody } from "@heroui/react";

export type MenuItem = {
    title: string;
    id: string;
    desc: string;
    color: string;
    border: string;
    path: string;
    component: React.ReactNode;
}

interface GameMenuProps {
    items: MenuItem[];
    activeId: string;
    onSelect: (id: string) => void;
    lockedItems?: string[];
}

export function GameMenu({ items, activeId, onSelect, lockedItems = [] }: GameMenuProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 w-full">
            {items.map((item) => {
                const isActive = activeId === item.id;
                const isLocked = lockedItems.includes(item.id);
                
                return (
                    <Card
                        key={item.id}
                        isPressable={!isLocked}
                        onPress={() => !isLocked && onSelect(item.id)}
                        className={`
                            border bg-black transition-all duration-300 relative h-full
                            ${isActive
                                ? `bg-white/10 border-primary ring-1 ring-primary`
                                : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                            }
                            ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        <CardBody className="p-3 flex flex-col gap-2 overflow-hidden h-full">
                            {/* Header: Icon & Title */}
                            <div className="flex items-center gap-2">
                                {/* Icon */}
                                <div className={`p-1.5 rounded-lg bg-black/50 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                                    </svg>
                                </div>

                                {/* Title */}
                                <span className={`font-bold uppercase tracking-wider text-[10px] md:text-xs leading-tight ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                    {item.title}
                                </span>
                            </div>

                            {/* Description - Visible on larger screens */}
                            <p className="text-[10px] text-gray-500 leading-tight line-clamp-2 hidden md:block pl-1">
                                {item.desc}
                            </p>

                            {/* Locked Indicator */}
                            {isLocked && (
                                <div className="absolute top-1 right-1 bg-red-500/80 rounded-full p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </div>
                            )}

                            {/* Active Indicator Bar */}
                            {isActive && (
                                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full shadow-glow"></div>
                            )}
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
}
