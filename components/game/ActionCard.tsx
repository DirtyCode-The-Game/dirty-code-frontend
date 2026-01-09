'use client'

import { useGame } from "@/context/GameContext";
import { Card, CardBody, Tooltip } from "@heroui/react";
import { useState, useEffect } from "react";
import { GameAction } from "@/services/api";

interface ActionCardProps {
    action: GameAction;
}

export function ActionCard({ action }: ActionCardProps) {
    const { performAction, user } = useGame();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        if (result) {
            const timer = setTimeout(() => setResult(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [result]);

    const handleAction = async () => {
        if (isDisabled) return;
        setIsLoading(true);
        setResult(null);
        const res = await performAction(action);
        setResult(res);
        setIsLoading(false);
    }

    const stamina = action.stamina;
    const moneyReward = action.money;
    const xpReward = action.xp;

    const formatValue = (value: number) => {
        const sign = value > 0 ? '+' : '';
        return `${sign}${value}`;
    };

    const isStaminaInsufficient = stamina < 0 ? (!!user && (user.activeAvatar?.stamina ?? 0) < Math.abs(stamina)) : false;

    const requirements = [
        { label: "FOR", value: action.requiredStrength ?? 0, color: "text-red-500", bg: "bg-red-500/10", ring: "ring-red-500/20", current: user?.activeAvatar?.strength ?? 0 },
        { label: "INT", value: action.requiredIntelligence ?? 0, color: "text-blue-500", bg: "bg-blue-500/10", ring: "ring-blue-500/20", current: user?.activeAvatar?.intelligence ?? 0 },
        { label: "CHA", value: action.requiredCharisma ?? 0, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10", ring: "ring-fuchsia-500/20", current: user?.activeAvatar?.charisma ?? 0 },
        { label: "DIS", value: action.requiredStealth ?? 0, color: "text-gray-500", bg: "bg-gray-500/10", ring: "ring-gray-500/20", current: user?.activeAvatar?.stealth ?? 0 },
    ];

    const hasMissingRequirements = requirements.some(req => req.current < req.value);
    const isDisabled = isStaminaInsufficient || hasMissingRequirements || isLoading;

    console.log(`Renderizando imagem: /actions/images/${action.actionImage}`);

    return (
        <Card
            isPressable={!isDisabled}
            onPress={handleAction}
            className={`bg-black border transition-all group w-full ${
                isLoading ? 'cursor-wait' : ''
            } ${
                result 
                    ? result.success 
                        ? 'border-green-500 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                        : 'border-red-500 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : 'border-white/10 hover:border-white/20'
            }`}
        >
            <CardBody className="p-3 md:p-6">
                <div className="flex flex-row gap-3 md:gap-6">
                    {/* Image - Responsive Size */}
                    {action.actionImage && (
                        <div className="flex-shrink-0 w-12 h-12 md:w-32 md:h-32 rounded-lg overflow-hidden border border-white/5 bg-zinc-900">
                            <img
                                src={`/actions/images/${action.actionImage}`}
                                alt={action.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-1 md:gap-4">
                        {/* Header: Title & Money */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <h3 className={`font-bold text-base md:text-xl text-white group-hover:text-primary transition-colors line-clamp-2 md:line-clamp-none`}>
                                    {action.title}
                                </h3>
                                {isLoading && (
                                    <span className="flex h-2 w-2 flex-shrink-0">
                                        <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75`}></span>
                                        <span className={`relative inline-flex rounded-full h-2 w-2 bg-primary`}></span>
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                {action.failureChance !== undefined && (
                                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                        (action.failureChance * 100) < 20 
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                            : (action.failureChance * 100) === 20 
                                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                    }`}>
                                        Risco: {Math.round(action.failureChance * 100)}%
                                    </div>
                                )}
                                {moneyReward !== undefined && moneyReward !== 0 && (
                                    <div className={`text-sm md:text-2xl font-bold font-mono whitespace-nowrap ${moneyReward > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {formatValue(moneyReward)} R$
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description / Result Message */}
                        <div className="min-h-[3rem] md:min-h-[4rem] flex items-center">
                            <p className={`text-xs md:text-sm leading-relaxed transition-all duration-300 ${
                                result 
                                    ? result.success ? 'text-green-400 font-medium' : 'text-red-400 font-medium'
                                    : 'text-gray-400'
                            }`}>
                                {result ? result.message : action.description}
                            </p>
                        </div>

                        {/* Footer: Stats & Requirements */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mt-auto">

                            {/* Costs / XP / Stamina */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] md:text-xs font-mono text-gray-500">
                                {stamina !== 0 && (
                                    <div className="flex items-center gap-1.5 bg-zinc-900/50 px-1.5 py-0.5 rounded border border-white/5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${stamina > 0 ? 'bg-blue-400' : 'bg-pink-500'}`}></span>
                                        <span className={stamina < 0 && isStaminaInsufficient ? 'text-pink-500 font-bold' : ''}>
                                            {stamina > 0 ? '+' : ''}{stamina} STA
                                        </span>
                                    </div>
                                )}
                                {xpReward !== undefined && xpReward !== 0 && (
                                    <div className="flex items-center gap-1.5 bg-zinc-900/50 px-1.5 py-0.5 rounded border border-white/5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                        <span>{formatValue(xpReward)} XP</span>
                                    </div>
                                )}
                            </div>

                            {/* Requirements */}
                            {requirements.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 justify-end">
                                    {requirements.filter(r => r.value > 0).map((req, idx) => {
                                        const met = req.current >= req.value;
                                        return (
                                            <Tooltip
                                                key={idx}
                                                content={
                                                    <div className="px-1 py-1">
                                                        <div className="font-bold text-tiny">{req.label}</div>
                                                        <div className="text-tiny">Necessário: {req.value}</div>
                                                        <div className={`text-tiny ${met ? 'text-green-400' : 'text-red-400'}`}>Atual: {req.current}</div>
                                                    </div>
                                                }
                                                delay={0}
                                                closeDelay={0}
                                                placement="top"
                                            >
                                                <div
                                                    className={`
                                                    h-6 min-w-[24px] px-1.5 rounded flex items-center justify-center text-[10px] font-bold shadow-sm ring-1 transition-all
                                                    ${met
                                                            ? 'bg-zinc-900 text-gray-400 ring-white/10 opacity-70 grayscale' // Requirement met styles 
                                                            : `${req.bg} ${req.color} ${req.ring} opacity-100` // Unmet styles (highlighted)
                                                        }
                                                `}
                                                >
                                                    {req.label} {req.value}
                                                </div>
                                            </Tooltip>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}
