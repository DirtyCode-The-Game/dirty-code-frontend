'use client'

import { useGame } from "@/context/GameContext";
import { api } from "@/services/api";
import { formatMoney, getAvatarTitle } from "@/lib/game-utils";
import { Avatar, Card, CardBody, Progress, Tooltip } from "@heroui/react";
import { useState } from "react";
import { WantedStars } from "./WantedStars";

export function UserProfileCard() {
    const { user, syncUserWithBackend } = useGame();
    const [isUpdating, setIsUpdating] = useState(false);

    const availablePoints = user?.activeAvatar?.availablePoints ?? 0;


    const handleIncreaseAttribute = async (attr: string) => {
        if (!user?.activeAvatar || isUpdating || availablePoints <= 0) return;

        setIsUpdating(true);
        try {
            await api.increaseAttribute(attr);
            // Sync with backend to get the fully updated avatar state including potential level ups or side effects
            await syncUserWithBackend();
        } catch (error) {
            console.error("Erro ao aumentar atributo:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const attributes = [
        {
            label: "Força",
            short: "FOR",
            value: user?.activeAvatar?.strength ?? 0,
            tempValue: user?.activeAvatar?.temporaryStrength ?? 0,
            color: "text-red-500",
            bg: "bg-red-500/10",
            ring: "ring-red-500/20",
            description: "Alguém precisa crimpar os cabos de rede."
        },
        {
            label: "Inteligência",
            short: "INT",
            value: user?.activeAvatar?.intelligence ?? 0,
            tempValue: user?.activeAvatar?.temporaryIntelligence ?? 0,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            ring: "ring-blue-500/20",
            description: "Entende por que o bug sumiu com um console.log."
        },
        {
            label: "Carisma",
            short: "CHA",
            value: user?.activeAvatar?.charisma ?? 0,
            tempValue: user?.activeAvatar?.temporaryCharisma ?? 0,
            color: "text-fuchsia-500",
            bg: "bg-fuchsia-500/10",
            ring: "ring-fuchsia-500/20",
            description: "Convence o cliente que o bug é uma feature."
        },
        {
            label: "Discrição",
            short: "DIS",
            value: user?.activeAvatar?.stealth ?? 0,
            tempValue: user?.activeAvatar?.temporaryStealth ?? 0,
            color: "text-gray-500",
            bg: "bg-gray-500/10",
            ring: "ring-gray-500/20",
            description: "Faz commit direto na master sem ninguém ver."
        }
    ];

    return (
        <Card className="w-full bg-black border border-white/10 p-0 overflow-hidden">
            <CardBody className="p-2 md:p-3 grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-5 items-center">

                {/* Profile Section (Mobile: Top Left) */}
                <div className="col-span-1 md:w-auto flex flex-col items-center gap-1.5 min-w-[110px]">
                    <div className="relative">
                        <Avatar
                            src={user?.activeAvatar?.picture}
                            className="w-14 h-14 md:w-20 md:h-20 border-2 border-primary"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-black border border-white/20 px-2 py-0.5 rounded text-[10px] font-mono text-primary font-bold shadow-lg">
                            LVL {user?.activeAvatar?.level}
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center w-full">
                        <h3 className="font-bold text-sm md:text-base leading-none mt-1 md:mt-1.5 truncate w-full px-1">{user?.activeAvatar?.name}</h3>
                        <p className="text-[9px] md:text-[11px] text-gray-500 font-mono w-full">{user?.activeAvatar ? getAvatarTitle(user.activeAvatar.level, user.activeAvatar.hacking, user.activeAvatar.work) : "Iniciante"}</p>
                    </div>
                </div>

                {/* Money Section (Mobile: Top Right) */}
                <div className="col-span-1 md:w-auto flex flex-col items-center justify-center md:border-l border-white/10 md:px-4 md:self-stretch">
                    <div className="flex flex-col items-center justify-center gap-1.5 md:gap-2">
                        <div className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">
                            {availablePoints > 0 ? "Pontos Disponíveis" : "Dinheiro"}
                        </div>
                        <div
                            className={`font-mono font-bold text-base md:text-xl break-all text-center ${
                                availablePoints > 0 ? "text-primary animate-pulse" : "text-green-400"
                            }`}
                        >
                            {availablePoints > 0 ? availablePoints : `R$ ${formatMoney(user?.activeAvatar?.money ?? 0)}`}
                        </div>
                        <div className="flex justify-center">
                            <WantedStars wantedLevel={user?.activeAvatar?.wantedLevel ?? 0} />
                        </div>
                    </div>
                </div>


                {/* Attributes Section (Mobile: Middle Row - Full Width) */}
                <div className="col-span-2 md:col-span-1 md:w-auto flex flex-row md:flex-col gap-3 md:gap-2.5 md:border-l border-white/10 md:pl-4 justify-center md:order-last py-1.5 md:py-0 border-y border-white/10 md:border-y-0 bg-white/5 md:bg-transparent rounded-lg md:rounded-none">
                    {attributes.map((attr) => (
                        <div key={attr.short} className="flex items-center gap-1.5">
                            <Tooltip
                                content={
                                    <div className="px-1 py-2">
                                        <div className="text-small font-bold">{attr.label}</div>
                                        <div className="text-tiny">{attr.description}</div>
                                        {availablePoints > 0 && (
                                            <div className="text-tiny mt-1 text-primary font-bold">
                                                Clique para aumentar (+1)
                                            </div>
                                        )}
                                    </div>
                                }
                                placement="top"
                                closeDelay={0}
                            >
                                <div
                                    onClick={() => handleIncreaseAttribute(attr.short)}
                                    className={`w-7 h-7 md:w-7 md:h-7 rounded ${attr.bg} flex items-center justify-center ${attr.color} font-bold text-[10px] md:text-xs ring-1 ${attr.ring} transition-all ${availablePoints > 0
                                        ? "cursor-pointer hover:scale-110 active:scale-95 animate-pulse"
                                        : "cursor-help hover:scale-110"
                                        } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {availablePoints > 0 ? "+" : attr.short}
                                </div>
                            </Tooltip>
                            <div className="font-mono font-bold text-xs md:text-sm hidden md:block">
                                {attr.value}
                                {attr.tempValue !== 0 && (
                                    <span className={`${attr.tempValue > 0 ? 'text-green-500' : 'text-red-500'} ml-1`}>
                                        {attr.tempValue > 0 ? '+' : ''}{attr.tempValue}
                                    </span>
                                )}
                            </div>
                            {/* Mobile Value Badge */}
                            <div className="font-mono font-bold text-[10px] md:hidden bg-black/50 px-1 rounded text-gray-300">
                                {attr.value}
                                {attr.tempValue !== 0 && (
                                    <span className={`${attr.tempValue > 0 ? 'text-green-500' : 'text-red-500'} ml-0.5`}>
                                        {attr.tempValue > 0 ? '+' : ''}{attr.tempValue}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Stats Bars (Mobile: Bottom - Full Width) */}
                <div className="col-span-2 md:flex-1 w-full flex flex-col gap-2">

                    {/* Life - Red */}
                    <Tooltip
                        content="Vida: Cuidado para não parar no hospital."
                        placement="top"
                        closeDelay={0}
                    >
                        <div className="w-full flex items-center gap-2">
                            <span className="text-[9px] md:text-[11px] uppercase font-bold tracking-wider text-gray-400 min-w-[60px]">Vida:</span>
                            <Progress
                                id="progress-life"
                                value={user?.activeAvatar?.life ?? 0}
                                color="danger"
                                size="sm"
                                classNames={{
                                    track: "bg-white/10 h-1.5",
                                    indicator: "h-1.5",
                                    label: "hidden",
                                    value: "hidden"
                                }}
                                className="flex-1"
                            />
                            <span className="text-[9px] md:text-[11px] font-mono text-gray-500 min-w-[30px] text-right">{user?.activeAvatar?.life ?? 0}/100</span>
                        </div>
                    </Tooltip>

                    {/* Energia - Yellow */}
                    <Tooltip
                        content="Energia: Mesmo vivendo a base de chocolate e café uma hora ela acaba."
                        placement="top"
                        closeDelay={0}
                    >
                        <div className="w-full flex items-center gap-2">
                            <span className="text-[9px] md:text-[11px] uppercase font-bold tracking-wider text-gray-400 min-w-[60px]">Energia:</span>
                            <Progress
                                id="progress-stamina"
                                value={user?.activeAvatar?.stamina ?? 0}
                                size="sm"
                                classNames={{
                                    track: "bg-white/10 h-1.5",
                                    indicator: "!bg-yellow-500 h-1.5",
                                    label: "hidden",
                                    value: "hidden"
                                }}
                                className="flex-1"
                            />
                            <span className="text-[9px] md:text-[11px] font-mono text-gray-500 min-w-[30px] text-right">{user?.activeAvatar?.stamina ?? 0}/100</span>
                        </div>
                    </Tooltip>

                    {/* Respeito - Purple */}
                    <Tooltip
                        content="Respeito: Cada ponto que passa você fica mais próximo do Linus Torvalds"
                        placement="top"
                        closeDelay={0}
                    >
                        <div className="w-full flex items-center gap-2">
                            <span className="text-[9px] md:text-[11px] uppercase font-bold tracking-wider text-gray-400 min-w-[60px]">Respeito:</span>
                            <Progress
                                id="progress-experience"
                                value={user?.activeAvatar?.experience ?? 0}
                                maxValue={user?.activeAvatar?.nextLevelExperience ?? 100}
                                size="sm"
                                classNames={{
                                    track: "bg-white/10 h-1",
                                    indicator: "!bg-purple-500 h-1",
                                    label: "hidden",
                                    value: "hidden"
                                }}
                                className="flex-1"
                            />
                            <span className="text-[9px] md:text-[11px] font-mono text-gray-500 min-w-[30px] text-right">{user?.activeAvatar?.experience ?? 0}/{user?.activeAvatar?.nextLevelExperience ?? 100}</span>
                        </div>
                    </Tooltip>
                </div>

            </CardBody>
        </Card >
    )
}
