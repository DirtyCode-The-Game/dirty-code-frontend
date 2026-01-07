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

                    {/* Stamina - Yellow */}
                    <Progress
                        label="Stamina"
                        value={user?.activeAvatar?.stamina ?? 0}
                        size="md"
                        showValueLabel={true}
                        classNames={{
                            track: "bg-white/10",
                            indicator: "!bg-yellow-500",
                            label: "text-xs uppercase font-bold tracking-wider text-gray-400",
                            value: "text-xs uppercase font-bold tracking-wider text-gray-400"
                        }}
                    />

                    {/* XP - Purple */}
                    <Progress
                        label="Experiência"
                        value={user?.activeAvatar?.experience ?? 0}
                        size="md"
                        showValueLabel={true}
                        classNames={{
                            track: "bg-white/10",
                            indicator: "!bg-purple-500",
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
                <div className="flex flex-row md:flex-col gap-4 md:gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-center">
                    {attributes.map((attr) => (
                        <div key={attr.short} className="flex items-center gap-2">
                            <Tooltip
                                content={
                                    <div className="px-1 py-2">
                                        <div className="text-small font-bold">{attr.label}</div>
                                        <div className="text-tiny">{attr.description}</div>
                                    </div>
                                }
                                placement="left"
                                closeDelay={0}
                            >
                                <div className={`w-8 h-8 rounded ${attr.bg} flex items-center justify-center ${attr.color} font-bold text-xs ring-1 ${attr.ring} cursor-help`}>
                                    {attr.short}
                                </div>
                            </Tooltip>
                            <div className="font-mono font-bold text-sm">{attr.value}</div>
                        </div>
                    ))}
                </div>

            </CardBody>
        </Card >
    )
}
