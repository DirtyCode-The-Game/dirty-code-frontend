'use client'

import { useGame } from "@/context/GameContext";
import { Card, CardBody, Tooltip } from "@heroui/react";
import { useState } from "react";
import { GameAction } from "@/services/api";

interface ActionCardProps {
    action: GameAction;
}

export function ActionCard({ action }: ActionCardProps) {
    const { performAction, user } = useGame();
    const [isLoading, setIsLoading] = useState(false);

    console.log(action.actionImage)
    
    const handleAction = async () => {
        if (isDisabled) return;
        setIsLoading(true);
        await performAction(action.id);
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
            className={`bg-black border border-white/10 hover:border-white/20 transition-all group w-full ${isLoading ? 'cursor-wait' : ''}`}
        >
            <CardBody className="flex flex-row items-center justify-between p-6 gap-6">
                {action.actionImage && (
                    <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border border-white/5">
                        <img 
                            src={`/actions/images/${action.actionImage}`}
                            alt={action.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className={`font-bold text-xl text-white group-hover:text-primary transition-colors`}>
                                {action.title}
                            </h3>
                            {isLoading && (
                                <span className="flex h-2 w-2">
                                    <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 bg-primary`}></span>
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">{action.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-gray-500">
                        {stamina !== 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${stamina > 0 ? 'bg-blue-400' : 'bg-pink-500'}`}></span>
                                <span className={stamina < 0 && isStaminaInsufficient ? 'text-pink-500 font-bold' : ''}>
                                    {stamina > 0 ? '+' : ''}{stamina} Stamina
                                </span>
                            </div>
                        )}
                        {xpReward !== undefined && xpReward !== 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                <span>{formatValue(xpReward)} XP</span>
                            </div>
                        )}
                    </div>

                    {requirements.length > 0 && (
                        <div className="flex flex-row gap-2">
                            {requirements.map((req, idx) => (
                                <Tooltip 
                                    key={idx} 
                                    content={`${req.label}: Necessário ${req.value} (Você tem ${req.current})`}
                                    delay={0}
                                    closeDelay={0}
                                    placement="bottom"
                                >
                                    <div 
                                        className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold shadow-sm ring-1 ${req.bg} ${req.color} ${req.ring}`}
                                    >
                                        {req.value}
                                    </div>
                                </Tooltip>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    {moneyReward !== undefined && moneyReward !== 0 && (
                        <div className={`text-2xl font-bold ${moneyReward > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatValue(moneyReward)} R$
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    )
}
