'use client'

import { useGame } from "@/context/GameContext";
import { Avatar, Card, CardBody, Progress } from "@heroui/react";

export function UserProfileCard() {
    const { user } = useGame();

    console.log(user)
    console.log(user?.activeAvatar?.picture)

    return (
        <Card className="w-full bg-black border border-white/10 p-0 overflow-hidden">
            <CardBody className="p-4 flex flex-col md:flex-row gap-6 items-center">

                {/* Profile Section */}
                <div className="flex flex-col items-center gap-2 min-w-[120px]">
                    <div className="relative">
                        <Avatar
                            src={user?.activeAvatar?.picture}
                            className="w-24 h-24 border-2 border-primary"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-black border border-white/20 px-2 py-0.5 rounded text-[10px] font-mono text-primary font-bold">
                            LVL {user?.activeAvatar?.level}
                        </div>
                    </div>
                    <h3 className="font-bold text-center text-lg leading-none mt-2">{user?.activeAvatar?.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">Iniciante</p>
                </div>

                {/* Main Stats Bars */}
                <div className="flex-1 flex flex-col gap-4 w-full">

                    {/* Life - Red */}
                    <Progress
                        label="Vida"
                        value={user?.activeAvatar?.life ?? 0}
                        color="danger"
                        size="md"
                        showValueLabel={true}
                        classNames={{
                            track: "bg-white/10",
                            label: "text-xs uppercase font-bold tracking-wider text-gray-400",
                            value: "text-xs uppercase font-bold tracking-wider text-gray-400"
                        }}
                    />

                    {/* Stamina - Blue */}
                    <Progress
                        label="Stamina"
                        value={user?.activeAvatar?.stamina ?? 0}
                        size="md"
                        showValueLabel={true}
                        classNames={{
                            track: "bg-white/10",
                            indicator: "!bg-blue-500",
                            label: "text-xs uppercase font-bold tracking-wider text-gray-400",
                            value: "text-xs uppercase font-bold tracking-wider text-gray-400"
                        }}
                    />
                </div>

                {/* Money Section - Middle */}
                <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 pl-0 md:pl-6 pr-0 md:pr-6 w-full md:w-auto min-w-[100px]">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Dinheiro</div>
                    <div className="font-mono font-bold text-2xl text-green-400">
                        R$ {user?.activeAvatar?.money ?? 0}
                    </div>
                </div>

                {/* Attributes Section - Right Side */}
                <div className="flex flex-row md:flex-col gap-4 md:gap-2 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs ring-1 ring-blue-500/20">
                            MAL
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Malandragem</div>
                            <div className="font-mono font-bold text-sm">{user?.activeAvatar?.streetIntelligence ?? 0}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-500 font-bold text-xs ring-1 ring-cyan-500/20">
                            INT
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Inteligência</div>
                            <div className="font-mono font-bold text-sm">{user?.activeAvatar?.intelligence ?? 0}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-pink-500/10 flex items-center justify-center text-pink-500 font-bold text-xs ring-1 ring-pink-500/20">
                            CHA
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Carisma</div>
                            <div className="font-mono font-bold text-sm">{user?.activeAvatar?.charisma ?? 0}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-pink-500/10 flex items-center justify-center text-pink-500 font-bold text-xs ring-1 ring-pink-500/20">
                            DIS
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Discrição</div>
                            <div className="font-mono font-bold text-sm">{user?.activeAvatar?.stealth ?? 0}</div>
                        </div>
                    </div>
                </div>

            </CardBody>
        </Card >
    )
}
