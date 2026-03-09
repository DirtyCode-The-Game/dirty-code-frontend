'use client'

import { Card, CardBody } from "@heroui/react";
import { useGame } from "@/context/GameContext";
import { CountdownTimer } from "./CountdownTimer";

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
    const { user, hasUnreadMessages } = useGame();
    return (
        <div className="flex gap-1 w-full overflow-x-auto pb-2 -mb-2 scrollbar-hide md:overflow-visible md:pb-0 md:mb-0 px-1 md:px-0 snap-x snap-mandatory">
            {items.map((item, index) => {
                const isActive = activeId === item.id;
                const isLocked = lockedItems.includes(item.id);
                const showUnread = item.id === 'Helldit' && hasUnreadMessages && !isActive;

                return (
                    <div key={item.id} className="shrink-0 snap-start md:min-w-0 md:w-auto md:flex-1">
                        <Card
                            isPressable={!isLocked}
                            onPress={() => !isLocked && onSelect(item.id)}
                            className={`
                                min-w-[70px] border bg-black transition-all duration-300 relative h-full rounded-2xl
                                ${isActive
                                    ? `bg-white/10 border-primary ring-1 ring-primary`
                                    : showUnread
                                        ? 'border-primary/50 bg-primary/5 animate-pulse'
                                        : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                                }
                                ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            <CardBody className="p-1.5 md:p-3 flex flex-col gap-0.5 md:gap-2 overflow-hidden h-full items-center md:items-start text-center md:text-left justify-center md:justify-start">
                                <div className="flex flex-col md:flex-row items-center gap-0.5 md:gap-2">
                                    <div className={`p-1 rounded-lg flex-shrink-0 relative ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                                        </svg>
                                        {showUnread && (
                                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_5px_rgba(var(--primary-rgb),1)]"></span>
                                            </span>
                                        )}
                                    </div>

                                    <span className={`font-bold uppercase tracking-wider text-[8px] md:text-xs leading-tight ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                        {item.title}
                                        {item.id === 'treinar' && user?.activeAvatar?.statusCooldown && (
                                            <CountdownTimer
                                                targetDate={user.activeAvatar.statusCooldown}
                                                className="ml-1 text-[8px] md:text-[9px] text-yellow-500 font-bold animate-pulse inline-block"
                                            />
                                        )}
                                    </span>
                                </div>

                                <p className="text-[10px] text-gray-500 leading-tight line-clamp-2 hidden md:block pl-1">
                                    {item.desc}
                                </p>

                                {isLocked && (
                                    <div className="absolute top-1 right-1 bg-red-500/80 rounded-full p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </div>
                                )}

                                {isActive && (
                                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full shadow-glow"></div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                );
            })}
        </div>
    );
}
