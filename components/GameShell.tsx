'use client';

import { GameTopbar } from "@/components/game/GameTopbar";
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
        <div className="flex flex-col min-h-screen bg-black">
            <GameTopbar />
            <main className="flex-1 container mx-auto p-2 fade-in">
                {children}
            </main>
        </div>
    );
}
