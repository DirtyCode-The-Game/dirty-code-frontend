'use client';
import { useGame } from '@/context/GameContext';
import { Avatar, Progress, Button, Chip } from '@heroui/react';
import { useRouter } from 'next/navigation';

export const Header = () => {
    const { user, logout } = useGame();
    const router = useRouter();

    if (!user) return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">

                {/* Profile Section */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/game')}>
                    <Avatar
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        isBordered
                        color="primary"
                    />
                    <div className="hidden md:block leading-tight">
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-xs text-primary font-mono">Lvl {user.level} Dev</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="flex-1 flex items-center justify-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">

                    {/* Energy */}
                    <div className="flex flex-col w-24 md:w-32">
                        <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1 text-gray-400">
                            <span>Energia</span>
                            <span>{user.energy}%</span>
                        </div>
                        <Progress
                            value={user.energy}
                            color={user.energy < 20 ? "danger" : "success"}
                            size="sm"
                            aria-label="Energia"
                        />
                    </div>

                    {/* Money */}
                    <div className="flex items-center gap-2">
                        <Chip color="success" variant="flat" className="font-mono font-bold">
                            $ {user.money.toLocaleString()}
                        </Chip>
                    </div>

                    {/* Burnout */}
                    <div className="flex flex-col w-24 md:w-32 hidden sm:flex">
                        <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1 text-gray-400">
                            <span>Burnout</span>
                            <span>{user.burnout}%</span>
                        </div>
                        <Progress
                            value={user.burnout}
                            color="danger"
                            size="sm"
                            aria-label="Burnout"
                        />
                    </div>
                </div>

                {/* Actions */}
                <Button isIconOnly variant="light" color="danger" onPress={logout} aria-label="Logout">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                </Button>
            </div>
        </header>
    );
};
