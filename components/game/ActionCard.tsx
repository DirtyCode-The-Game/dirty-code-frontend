'use client'

import {useGame} from "@/context/GameContext";
import { Card, CardBody, Chip, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { GameAction, GameActionType } from "@/services/api";
import { AnimatePresence, motion } from "framer-motion";
import { formatMoney, getNoEnergyMessage, getNoMoneyMessage, isNoMoneyError } from "@/lib/game-utils";

interface ActionCardProps {
    action: GameAction;
    actionCount?: number;
    hideRequirements?: boolean;
    isSmall?: boolean;
}

export function ActionCard({ action, actionCount = 1, hideRequirements: hideRequirementsProp, isSmall }: ActionCardProps) {
    const { performAction, user } = useGame();
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ 
        message: string; 
        type: 'success' | 'failure' | 'stamina';
        count?: number;
        variations?: {
            experience?: number;
            life?: number;
            stamina?: number;
            money?: number;
            temporaryStrength?: number;
            temporaryIntelligence?: number;
            temporaryCharisma?: number;
            temporaryStealth?: number;
        } | null;
    } | null>(null);

    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => {
                setFeedback(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    const handleAction = async () => {
        if (actionCount <= 0) return;

        const staminaNeededPerAction = Math.abs(action.stamina);
        const currentStamina = user?.activeAvatar?.stamina ?? 0;
        
        if (action.stamina < 0 && currentStamina < staminaNeededPerAction) {
            const message = await getNoEnergyMessage();

            setFeedback({
                message,
                type: 'stamina'
            });
            return;
        }

        const moneyRequiredPerAction = effectiveActionMoney < 0 ? Math.abs(effectiveActionMoney) : 0;
        const currentMoney = user?.activeAvatar?.money ?? 0;

        if (moneyRequiredPerAction > 0 && currentMoney < moneyRequiredPerAction) {
            const message = await getNoMoneyMessage();

            setFeedback({
                message,
                type: 'failure'
            });
            return;
        }

        if (isLoading) return;

        setIsLoading(true);
        try {
            const result = await performAction(action, actionCount);
            
            let message = result.message;
            setFeedback({ 
                message, 
                type: result.success ? 'success' : 'failure',
                count: result.timesExecuted,
                variations: result.variations
            });
        } catch (error: any) {
            let message = error.message || "Erro ao realizar ação. Tente novamente.";
            
            if (isNoMoneyError(message)) {
                message = await getNoMoneyMessage();
            }

            setFeedback({
                message,
                type: 'failure'
            });
        } finally {
            setIsLoading(false);
        }
    }

    const purchaseInfo = user?.activeAvatar?.actionPurchases?.find(p => p.actionId === action.id);
    const effectiveActionMoney = purchaseInfo ? -Math.abs(purchaseInfo.currentPrice) : action.money;

    const effectiveCount = (() => {
        if (!user?.activeAvatar) return actionCount;
        
        let maxByStamina = Infinity;
        if (action.stamina < 0) {
            maxByStamina = Math.floor((user.activeAvatar.stamina ?? 0) / Math.abs(action.stamina));
        }

        let maxByMoney = Infinity;
        if (effectiveActionMoney < 0) {
            maxByMoney = Math.floor((user.activeAvatar.money ?? 0) / Math.abs(effectiveActionMoney));
        }

        const maxPossible = Math.max(1, Math.min(maxByStamina, maxByMoney));
        return Math.min(actionCount, maxPossible);
    })();

    const stamina = action.stamina * effectiveCount;
    const moneyReward = effectiveActionMoney * effectiveCount;
    const xpReward = action.xp * effectiveCount;
    const hpReward = (action.hp ?? 0) * effectiveCount;

    const tempStrGain = (action.temporaryStrength ?? 0) * effectiveCount;
    const tempIntGain = (action.temporaryIntelligence ?? 0) * effectiveCount;
    const tempChaGain = (action.temporaryCharisma ?? 0) * effectiveCount;
    const tempSteGain = (action.temporaryStealth ?? 0) * effectiveCount;

    const hasMoneyVariation = action.moneyVariation !== undefined && action.moneyVariation > 0;
    const hasXpVariation = action.xpVariation !== undefined && action.xpVariation > 0;
    const hasHpVariation = action.hpVariation !== undefined && action.hpVariation > 0;
    const hasLostHpFailureVariation = action.lostHpFailureVariation !== undefined && action.lostHpFailureVariation > 0;

    const formatValue = (value: number, hasVariation?: boolean) => {
        const sign = value > 0 ? '+' : '';
        const approx = hasVariation ? '≈' : '';
        return `${approx}${sign}${value}`;
    };

    const formatMoneyValue = (value: number, hasVariation?: boolean) => {
        const sign = value > 0 ? '+' : '';
        const approx = hasVariation ? '≈' : '';
        return `${approx}${sign}${formatMoney(value)}`;
    };


    const requirements = [
        { label: "FOR", value: action.requiredStrength ?? 0, color: "text-red-500", bg: "bg-red-500/10", ring: "ring-red-500/20", current: (user?.activeAvatar?.strength ?? 0) + (user?.activeAvatar?.temporaryStrength ?? 0) },
        { label: "INT", value: action.requiredIntelligence ?? 0, color: "text-blue-500", bg: "bg-blue-500/10", ring: "ring-blue-500/20", current: (user?.activeAvatar?.intelligence ?? 0) + (user?.activeAvatar?.temporaryIntelligence ?? 0) },
        { label: "CHA", value: action.requiredCharisma ?? 0, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10", ring: "ring-fuchsia-500/20", current: (user?.activeAvatar?.charisma ?? 0) + (user?.activeAvatar?.temporaryCharisma ?? 0) },
        { label: "DIS", value: action.requiredStealth ?? 0, color: "text-gray-500", bg: "bg-gray-500/10", ring: "ring-gray-500/20", current: (user?.activeAvatar?.stealth ?? 0) + (user?.activeAvatar?.temporaryStealth ?? 0) },
    ];

    const riskPercentage = Math.round((action.failureChance ?? 0) * 100);
    const isTraining = action.type === GameActionType.TRAINING;
    const isMarket = action.type === GameActionType.MARKET;
    const isHospital = action.type === GameActionType.HOSPITAL;
    const isJail = action.type === GameActionType.JAIL;
    const hideRequirements = hideRequirementsProp || isTraining || isMarket || isHospital || isJail;

    const hasStatusCooldown = !!user?.activeAvatar?.statusCooldown;
    const isTrainingDisabled = isTraining && hasStatusCooldown;

    return (
        <Card
            isPressable={!isTrainingDisabled}
            onPress={handleAction}
            className={`bg-black border border-white/10 hover:border-white/20 transition-all group w-full relative overflow-hidden ${isLoading ? 'cursor-wait' : isTrainingDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]"
                    >
                        <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" />
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">Da um tempo safado, estou registrando sua ação...</p>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`absolute inset-0 z-20 flex items-center justify-center p-4 text-center backdrop-blur-md ${
                            feedback.type === 'success' ? 'bg-green-500/20 text-green-400' : 
                            feedback.type === 'stamina' ? 'bg-yellow-500/20 text-yellow-400' : 
                            'bg-red-500/20 text-red-400'
                        }`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setFeedback(null);
                        }}
                    >
                        {feedback.count !== undefined && feedback.count > 1 && (
                            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">
                                x{feedback.count}
                            </div>
                        )}
                        <div className="space-y-4">
                            <p className="text-sm md:text-base font-medium leading-tight max-w-[80%] mx-auto whitespace-pre-line">
                                {feedback.message}
                            </p>
                            {feedback.variations && (
                                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-mono">
                                    {feedback.variations.stamina !== 0 && feedback.variations.stamina !== undefined && (
                                        <div className={`flex items-center gap-1.5 ${feedback.variations.stamina < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                            <span>
                                                {feedback.variations.stamina > 0 ? '+' : ''}{feedback.variations.stamina} Energia
                                            </span>
                                        </div>
                                    )}
                                    
                                    {feedback.variations.experience !== 0 && feedback.variations.experience !== undefined && (
                                        <div className={`flex items-center gap-1.5 ${feedback.variations.experience < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                            <span>{formatValue(feedback.variations.experience, hasXpVariation)} Respeito</span>
                                        </div>
                                    )}
                                    {feedback.variations.money !== 0 && feedback.variations.money !== undefined && (
                                        <div className={`flex items-center gap-1.5 ${feedback.variations.money < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <span>R$ {formatMoneyValue(Number(feedback.variations.money), hasMoneyVariation)}</span>
                                        </div>
                                    )}
                                    {feedback.variations.life !== 0 && feedback.variations.life !== undefined && (
                                        <div className={`flex items-center gap-1.5 ${feedback.variations.life < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                            <span>{formatValue(feedback.variations.life, hasHpVariation)} HP</span>
                                        </div>
                                    )}
                                    {feedback.variations.temporaryStrength !== 0 && feedback.variations.temporaryStrength !== undefined && (
                                        <div className={`flex items-center gap-1.5 ${feedback.variations.temporaryStrength > 0 ? 'text-red-500' : 'text-orange-500'} font-bold`}>
                                            <span>{feedback.variations.temporaryStrength > 0 ? '+' : ''}{feedback.variations.temporaryStrength} FOR</span>
                                        </div>
                                    )}
                                    {feedback.variations.temporaryIntelligence !== 0 && feedback.variations.temporaryIntelligence !== undefined && (
                                        <div className={`flex items-center gap-1.5 ${feedback.variations.temporaryIntelligence > 0 ? 'text-blue-500' : 'text-orange-500'} font-bold`}>
                                            <span>{feedback.variations.temporaryIntelligence > 0 ? '+' : ''}{feedback.variations.temporaryIntelligence} INT</span>
                                        </div>
                                    )}
                                    {feedback.variations.temporaryCharisma !== 0 && feedback.variations.temporaryCharisma !== undefined && (
                                        <div className={`flex items-center gap-1.5 ${feedback.variations.temporaryCharisma > 0 ? 'text-fuchsia-500' : 'text-orange-500'} font-bold`}>
                                            <span>{feedback.variations.temporaryCharisma > 0 ? '+' : ''}{feedback.variations.temporaryCharisma} CHA</span>
                                        </div>
                                    )}
                                    {feedback.variations.temporaryStealth !== 0 && feedback.variations.temporaryStealth !== undefined && (
                                        <div className={`flex items-center gap-1.5 ${feedback.variations.temporaryStealth > 0 ? 'text-gray-400' : 'text-orange-500'} font-bold`}>
                                            <span>{feedback.variations.temporaryStealth > 0 ? '+' : ''}{feedback.variations.temporaryStealth} DIS</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CardBody className={`flex flex-row items-center justify-between ${isSmall ? 'p-3.5 gap-4' : 'p-6 gap-6'}`}>
                {action.actionImage && (
                    <div className={`flex-shrink-0 ${isSmall ? 'w-20 h-20' : 'w-32 h-32'} rounded-lg overflow-hidden border border-white/5`}>
                        <img
                            src={`/actions/images/${action.actionImage}`}
                            alt={action.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="flex-1 space-y-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className={`font-bold ${isSmall ? 'text-sm' : 'text-xl'} text-white group-hover:text-primary transition-colors`}>
                                {action.title}
                            </h3>
                            {isLoading && (
                                <span className="flex h-2 w-2">
                                    <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 bg-primary`}></span>
                                </span>
                            )}
                        </div>
                        <p className={`${isSmall ? 'text-[11px]' : 'text-sm'} text-gray-400 leading-relaxed`}>{action.description}</p>
                    </div>

                    <div className={`flex flex-wrap items-center ${isSmall ? 'gap-x-4 gap-y-1.5 text-[11px]' : 'gap-x-6 gap-y-2 text-xs'} font-mono text-gray-500`}>
                        {stamina !== 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                <span className={stamina < 0 && (user?.activeAvatar?.stamina ?? 0) < Math.abs(stamina) ? 'text-red-500 font-bold' : ''}>
                                    {stamina > 0 ? '+' : ''}{stamina} Energia
                                </span>
                            </div>
                        )}
                        {xpReward !== undefined && xpReward !== 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                <span>{formatValue(xpReward, hasXpVariation)} Respeito</span>
                            </div>
                        )}
                        {action.specialAction === 'VOLUNTARY_WORK' && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                <span>-5% Respeito Total</span>
                            </div>
                        )}
                        {hpReward !== 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span className={hpReward < 0 && (user?.activeAvatar?.life ?? 0) < Math.abs(hpReward) ? 'text-red-500 font-bold' : ''}>
                                    {formatValue(hpReward, hasHpVariation)} HP
                                </span>
                            </div>
                        )}
                        {tempStrGain !== 0 && (
                            <div className="flex items-center gap-1.5 text-red-500 font-bold">
                                <span>{tempStrGain > 0 ? '+' : ''}{tempStrGain} FOR</span>
                            </div>
                        )}
                        {tempIntGain !== 0 && (
                            <div className="flex items-center gap-1.5 text-blue-500 font-bold">
                                <span>{tempIntGain > 0 ? '+' : ''}{tempIntGain} INT</span>
                            </div>
                        )}
                        {tempChaGain !== 0 && (
                            <div className="flex items-center gap-1.5 text-fuchsia-500 font-bold">
                                <span>{tempChaGain > 0 ? '+' : ''}{tempChaGain} CHA</span>
                            </div>
                        )}
                        {tempSteGain !== 0 && (
                            <div className="flex items-center gap-1.5 text-gray-400 font-bold">
                                <span>{tempSteGain > 0 ? '+' : ''}{tempSteGain} DIS</span>
                            </div>
                        )}
                        {!hideRequirements && action.lostHpFailure !== undefined && action.lostHpFailure !== 0 && (
                            <div className="flex items-center gap-1.5 text-red-400/80">
                                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                                <span>
                                    {hasLostHpFailureVariation ? '≈' : ''}-{riskPercentage > 50 ? action.lostHpFailure * 3 : action.lostHpFailure} HP (falha)
                                </span>
                            </div>
                        )}
                        {!hideRequirements && action.canBeArrested && (
                            <div className="flex items-center gap-1.5 text-orange-400/80">
                                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                                <span>
                                    {riskPercentage > 50 ? '15' : '5'}m Cadeia (falha)
                                </span>
                            </div>
                        )}
                    </div>

                    {!hideRequirements && requirements.length > 0 && (
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

                <div className="flex flex-col items-center gap-2">
                    {!hideRequirements && (
                        <>
                            <Tooltip
                                content={riskPercentage > 50 ? "Risco Crítico: Punições triplicadas (HP e Cadeia)!" : "Chance de falha"}
                                isDisabled={riskPercentage <= 50}
                                color="danger"
                            >
                                <Chip
                                    size="sm"
                                    variant="flat"
                                    color={riskPercentage <= 10 ? "success" : riskPercentage <= 25 ? "warning" : "danger"}
                                    className={`font-bold font-mono ${riskPercentage > 50 ? "animate-pulse border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : ""}`}
                                >
                                    RISCO: {riskPercentage}%
                                </Chip>
                            </Tooltip>
                            {riskPercentage > 50 && (
                                <div className="text-[10px] text-red-500 font-bold uppercase tracking-tighter animate-bounce">
                                    Punição 3x
                                </div>
                            )}
                        </>
                    )}
                    {moneyReward !== undefined && moneyReward !== 0 && (
                        <div className={`${isSmall ? 'text-xl' : 'text-2xl'} font-bold ${moneyReward > 0 ? 'text-green-500' : (user?.activeAvatar?.money ?? 0) < Math.abs(moneyReward) ? 'text-red-600' : 'text-red-500'}`}>
                            R$ {formatMoneyValue(moneyReward, hasMoneyVariation)}
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    )
}
