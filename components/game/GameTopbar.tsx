'use client'

import { Button } from "@heroui/react";
import { useGame } from "@/context/GameContext";
import Link from "next/link";

export function GameTopbar() {
    const { logout } = useGame();

    return (
        <nav className="fixed top-0 left-0 right-0 w-full h-16 bg-black/50 backdrop-blur-md border-b border-white/10 z-50">
            <div className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/game" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-black">
                            DC
                        </div>
                        <span className="font-bold tracking-tighter text-xl hidden md:block">
                            DIRTY<span className="text-primary">CODE</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                        <Link href="#" className="hover:text-white transition-colors">Ranking</Link>
                        <Link href="#" className="hover:text-white transition-colors">Comunidade</Link>
                        <Link href="#" className="hover:text-white transition-colors">Patch Notes</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="flat"
                        color="danger"
                        size="sm"
                        onPress={logout}
                        className="font-mono uppercase text-xs"
                    >
                        Sair do Sistema
                    </Button>
                </div>
            </div>
        </nav>
    )
}
