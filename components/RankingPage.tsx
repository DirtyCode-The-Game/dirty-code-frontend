'use client'

import { Card, CardBody, User as UserUI, Chip } from "@heroui/react";
import { useEffect, useState } from "react";
import { api, Avatar } from "@/services/api";

export function RankingPage() {
    const [ranking, setRanking] = useState<Avatar[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            const data = await api.getRanking();
            setRanking(data);
            setIsLoading(false);
        };
        fetchRanking();
    }, []);

    const getRankStyle = (index: number) => {
        switch (index) {
            case 0: return "text-yellow-400 font-bold text-xl drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]";
            case 1: return "text-gray-300 font-bold text-lg";
            case 2: return "text-amber-600 font-bold text-lg";
            default: return "text-gray-500 font-mono";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold uppercase text-white mb-2">Ranking</h1>
                    <p className="text-gray-400 text-sm md:text-lg border-l-2 border-primary pl-4">
                        Os maiores devs do submundo sujo.
                    </p>
                </div>
                <div className="hidden md:block">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-primary/20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a2.25 2.25 0 10-4.5 0v5.75c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V9.375m-6 3.375c0 .621-.504 1.125-1.125 1.125H5.25A2.25 2.25 0 013 11.25V9.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V12.75z" />
                    </svg>
                </div>
            </div>

            <div className="grid gap-3">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500 animate-pulse">
                        Carregando dados da Interpol...
                    </div>
                ) : ranking.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        Nenhum dev encontrado.
                    </div>
                ) : (
                    ranking.map((avatar, index) => (
                        <Card key={avatar.id} className="bg-black/40 border border-white/5 hover:border-primary/30 transition-colors">
                            <CardBody className="flex flex-row items-center gap-4 p-4">
                                {/* Rank Position */}
                                <div className={`w-12 text-center ${getRankStyle(index)}`}>
                                    #{index + 1}
                                </div>

                                {/* Avatar Info */}
                                <div className="flex-1 min-w-0">
                                    <UserUI
                                        name={
                                            <span className={`font-semibold tracking-wide ${index === 0 ? 'text-primary' : 'text-gray-200'}`}>
                                                {avatar.name}
                                            </span>
                                        }
                                        description={
                                            <span className="text-xs text-gray-400">
                                                Respeito {avatar.totalExperience || 0}
                                            </span>
                                        }
                                        avatarProps={{
                                            src: avatar.picture ? (avatar.picture.startsWith('/') ? avatar.picture : `/${avatar.picture}`) : '/avatars/avatar_1.png',
                                            radius: "sm",
                                            isBordered: index < 3,
                                            color: index === 0 ? "warning" : index === 1 ? "default" : index === 2 ? "danger" : "default",
                                            className: "w-12 h-12 text-large"
                                        }}
                                    />
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-right">
                                    <div className="hidden sm:block">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dinheiro</div>
                                        <div className="font-mono text-primary">R$ {avatar.money?.toFixed(2) || '0.00'}</div>
                                    </div>
                                    <div className="text-right pl-4 border-l border-white/10">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Nível</div>
                                        <Chip size="sm" variant="flat" color={index === 0 ? "warning" : "default"} className="font-bold">
                                            Lvl {avatar.level}
                                        </Chip>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
