'use client'

import { useGame } from "@/context/GameContext";
import { Avatar, Card, CardBody, Progress, Tooltip } from "@heroui/react";

export function UserProfileCard() {
    const { user } = useGame();

    const attributes = [
        {
            label: "Força",
            short: "FOR",
            value: user?.activeAvatar?.strength ?? 0,
            color: "text-red-500",
            bg: "bg-red-500/10",
            ring: "ring-red-500/20",
            description: "Alguém precisa crimpar os cabos de rede."
        },
        {
            label: "Inteligência",
            short: "INT",
            value: user?.activeAvatar?.intelligence ?? 0,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            ring: "ring-blue-500/20",
            description: "Entende por que o bug sumiu com um console.log."
        },
        {
            label: "Carisma",
            short: "CHA",
            value: user?.activeAvatar?.charisma ?? 0,
            color: "text-fuchsia-500",
            bg: "bg-fuchsia-500/10",
            ring: "ring-fuchsia-500/20",
            description: "Convence o cliente que o bug é uma feature."
        },
        {
            label: "Discrição",
            short: "DIS",
            value: user?.activeAvatar?.stealth ?? 0,
            color: "text-gray-500",
            bg: "bg-gray-500/10",
            ring: "ring-gray-500/20",
            description: "Faz commit direto na master sem ninguém ver."
        }
    ];

    return (
        <Card className="w-full bg-black border border-white/10 p-0 overflow-hidden">
            <CardBody className="p-3 md:p-4 grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-6 items-center">

                {/* Profile Section (Mobile: Top Left) */}
                <div className="col-span-1 md:w-auto flex flex-col items-center gap-2 min-w-[100px] md:min-w-[120px]">
                    <div className="relative">
                        <Avatar
                            src={user?.activeAvatar?.picture}
                            className="w-16 h-16 md:w-24 md:h-24 border-2 border-primary"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-black border border-white/20 px-2 py-0.5 rounded text-[10px] font-mono text-primary font-bold shadow-lg">
                            LVL {user?.activeAvatar?.level}
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-base md:text-lg leading-none mt-1 md:mt-2 truncate max-w-[120px]">{user?.activeAvatar?.name}</h3>
                        <p className="text-[10px] md:text-xs text-gray-500 font-mono">Iniciante</p>
                    </div>
                </div>

                {/* Money Section (Mobile: Top Right) */}
                <div className="col-span-1 md:w-auto flex flex-col items-center justify-center md:border-l border-white/10 md:pl-6 md:pr-6 h-full">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Dinheiro</div>
                    <div className="font-mono font-bold text-lg md:text-2xl text-green-400 break-all text-center">
                        R$ {(user?.activeAvatar?.money ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>

                {/* Attributes Section (Mobile: Middle Row - Full Width) */}
                <div className="col-span-2 md:col-span-1 md:w-auto flex flex-row md:flex-col gap-4 md:gap-3 md:border-l border-white/10 md:pl-6 justify-center md:order-last py-2 md:py-0 border-y border-white/10 md:border-y-0 bg-white/5 md:bg-transparent rounded-lg md:rounded-none">
                    {attributes.map((attr) => (
                        <div key={attr.short} className="flex items-center gap-2">
                            <Tooltip
                                content={
                                    <div className="px-1 py-2">
                                        <div className="text-small font-bold">{attr.label}</div>
                                        <div className="text-tiny">{attr.description}</div>
                                    </div>
                                }
                                placement="top"
                                closeDelay={0}
                            >
                                <div className={`w-8 h-8 md:w-8 md:h-8 rounded ${attr.bg} flex items-center justify-center ${attr.color} font-bold text-xs ring-1 ${attr.ring} cursor-help hover:scale-110 transition-transform`}>
                                    {attr.short}
                                </div>
                            </Tooltip>
                            <div className="font-mono font-bold text-sm hidden md:block">{attr.value}</div>
                            {/* Mobile Value Badge */}
                            <div className="font-mono font-bold text-xs md:hidden bg-black/50 px-1 rounded text-gray-300">{attr.value}</div>
                        </div>
                    ))}
                </div>

                {/* Main Stats Bars (Mobile: Bottom - Full Width) */}
                <div className="col-span-2 md:flex-1 w-full flex flex-col gap-3">

                    {/* Life - Red */}
                    <Tooltip
                        content="Vida: Cuidado para não parar no hospital."
                        placement="top"
                        closeDelay={0}
                    >
                        <div className="w-full flex items-center gap-2">
                            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-gray-400 min-w-[65px]">Vida:</span>
                            <Progress
                                value={user?.activeAvatar?.life ?? 0}
                                color="danger"
                                size="sm"
                                classNames={{
                                    track: "bg-white/10 h-2",
                                    indicator: "h-2",
                                    label: "hidden",
                                    value: "hidden"
                                }}
                                className="flex-1"
                            />
                            <span className="text-[10px] md:text-xs font-mono text-gray-500 min-w-[35px] text-right">{user?.activeAvatar?.life ?? 0}/100</span>
                        </div>
                    </Tooltip>

                    {/* Energia - Yellow */}
                    <Tooltip
                        content="Energia: Mesmo vivendo a base de chocolate e café uma hora ela acaba."
                        placement="top"
                        closeDelay={0}
                    >
                        <div className="w-full flex items-center gap-2">
                            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-gray-400 min-w-[65px]">Energia:</span>
                            <Progress
                                value={user?.activeAvatar?.stamina ?? 0}
                                size="sm"
                                classNames={{
                                    track: "bg-white/10 h-2",
                                    indicator: "!bg-yellow-500 h-2",
                                    label: "hidden",
                                    value: "hidden"
                                }}
                                className="flex-1"
                            />
                            <span className="text-[10px] md:text-xs font-mono text-gray-500 min-w-[35px] text-right">{user?.activeAvatar?.stamina ?? 0}/100</span>
                        </div>
                    </Tooltip>

                    {/* Respeito - Purple */}
                    <Tooltip
                        content="Respeito: Cada ponto que passa você fica mais próximo do Linus Torvalds"
                        placement="top"
                        closeDelay={0}
                    >
                        <div className="w-full flex items-center gap-2">
                            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-gray-400 min-w-[65px]">Respeito:</span>
                            <Progress
                                value={user?.activeAvatar?.experience ?? 0}
                                maxValue={user?.activeAvatar?.nextLevelExperience ?? 100}
                                size="sm"
                                classNames={{
                                    track: "bg-white/10 h-1.5",
                                    indicator: "!bg-purple-500 h-1.5",
                                    label: "hidden",
                                    value: "hidden"
                                }}
                                className="flex-1"
                            />
                            <span className="text-[10px] md:text-xs font-mono text-gray-500 min-w-[35px] text-right">{user?.activeAvatar?.experience ?? 0}/{user?.activeAvatar?.nextLevelExperience ?? 100}</span>
                        </div>
                    </Tooltip>
                </div>

            </CardBody>
        </Card >
    )
}
