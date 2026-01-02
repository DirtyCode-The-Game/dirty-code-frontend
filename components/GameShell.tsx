'use client';

import { Header } from "@/components/Header";
import { useGame } from "@/context/GameContext";
import { useEffect } from "react";
import { User } from "@/services/api";

interface GameShellProps {
    children: React.ReactNode;
    user: User | null;
}

export function GameShell({ children, user: serverUser }: GameShellProps) {
    const { user: contextUser, refreshUser } = useGame();

    // Hydrate context with server user on mount or update
    useEffect(() => {
        if (serverUser && JSON.stringify(serverUser) !== JSON.stringify(contextUser)) {
            refreshUser(serverUser);
        }
    }, [serverUser, contextUser, refreshUser]);

    return (
        <div className="flex flex-col min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#050505] to-black">
            <Header />
            <main className="flex-1 container mx-auto p-4 pt-28 pb-20 fade-in">
                {children}
            </main>

            <footer className="fixed bottom-0 left-0 right-0 p-2 bg-black/90 border-t border-white/5 text-[10px] text-gray-600 font-mono text-center">
                CONNECTED TO: {serverUser ? 'SERVER::SECURE' : 'LOCAL::UNVERIFIED'}
            </footer>
        </div>
    );
}
