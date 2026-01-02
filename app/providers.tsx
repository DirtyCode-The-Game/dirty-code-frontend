'use client'

import { HeroUIProvider } from '@heroui/react'
import { GameProvider } from '../context/GameContext'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <GameProvider>
                <div className="dark text-foreground bg-background min-h-screen font-sans">
                    {children}
                </div>
            </GameProvider>
        </HeroUIProvider>
    )
}
