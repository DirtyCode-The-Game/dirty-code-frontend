'use client'

import { useState } from "react";
import { Button } from "@heroui/react";
import { useGame } from "@/context/GameContext";
import Link from "next/link";
import Image from "next/image";

export function GameTopbar() {
    const { logout } = useGame();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="h-16 bg-black/50 border-b border-white/10 relative z-50">
            <div className="container mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/game" className="flex items-center gap-2">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                            <Image
                                src="/logo.jpeg"
                                alt="Dirty Code Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                        <Link href="/game/user" className="hover:text-white transition-colors">Perfil</Link>
                        <Link href="/game/ranking" className="hover:text-white transition-colors">Ranking</Link>
                        <Link href="/game/news" className="hover:text-white transition-colors">Notícias</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                    {/* Desktop Logout */}
                    <div className="hidden md:block">
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
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5 shadow-2xl">
                    <nav className="flex flex-col gap-2">
                        <Link
                            href="/game/user"
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Perfil
                        </Link>
                        <Link
                            href="/game/ranking"
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Ranking
                        </Link>
                        <Link
                            href="#"
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Comunidade
                        </Link>
                        <Link
                            href="/game/news"
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-300 hover:text-white transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Notícias
                        </Link>
                    </nav>

                    <div className="h-px bg-white/10" />

                    <Button
                        variant="flat"
                        color="danger"
                        size="md"
                        onPress={() => {
                            setIsMenuOpen(false);
                            logout();
                        }}
                        className="font-mono uppercase text-sm w-full"
                    >
                        Sair do Sistema
                    </Button>
                </div>
            )}
        </nav>
    )
}
