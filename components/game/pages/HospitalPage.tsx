'use client'

import { ActionCard } from "@/components/game/ActionCard";
import { ActionQuantitySelector } from "@/components/game/ActionQuantitySelector";
import { useEffect, useState } from "react";
import { api, GameAction, GameActionType } from "@/services/api";
import { useGame } from "@/context/GameContext";
import Image from "next/image";

export function HospitalPage() {
    const [actions, setActions] = useState<GameAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const { user, refreshUser } = useGame();

    useEffect(() => {
        const fetchActions = async () => {
            const data = await api.getActionsByType(GameActionType.HOSPITAL);
            setActions(data);
            setIsLoading(false);
        };
        fetchActions();
    }, []);

    // Check if user is in hospital timeout
    const avatar = user?.activeAvatar;
    const isInHospital = avatar?.timeoutType === 'HOSPITAL' && avatar?.timeout;
    const timeoutDate = isInHospital && avatar.timeout ? new Date(avatar.timeout) : null;

    // Calculate remaining time
    const [remainingTime, setRemainingTime] = useState<string>('');
    const [timeoutExpired, setTimeoutExpired] = useState(false);

    useEffect(() => {
        if (!timeoutDate) return;

        const updateCountdown = () => {
            const now = new Date();
            const diff = timeoutDate.getTime() - now.getTime();

            if (diff <= 0) {
                setRemainingTime('Você pode sair do hospital agora!');
                setTimeoutExpired(true);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
            setTimeoutExpired(false);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [timeoutDate]);

    // Calculate freedom cost and check if user can afford it (minimum 500)
    const freedomCost = avatar ? 500 * Math.max(1, avatar.level) : 500;
    const canAffordFreedom = avatar ? avatar.money >= freedomCost : false;

    const handleDischarge = async () => {
        setIsProcessing(true);
        try {
            const result = await api.leaveTimeout();

            if (result.avatar) {
                refreshUser({ activeAvatar: result.avatar });
            }

            window.location.href = '/game';
        } catch (error: any) {
            alert(error.message || 'Erro ao sair do hospital');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBuyFreedom = async () => {
        setIsProcessing(true);
        try {
            const result = await api.buyFreedom();

            if (result.avatar) {
                refreshUser({ activeAvatar: result.avatar });
            }

            window.location.href = '/game';
        } catch (error: any) {
            alert(error.message || 'Erro ao comprar liberdade');
        } finally {
            setIsProcessing(false);
        }
    };

    // If user is in hospital, show hospital scene
    if (isInHospital) {
        return (
            <div>
                {/* Header - same pattern as other pages */}
                <div className="flex justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold uppercase text-white mb-2">
                            🏥 Hospital
                        </h1>
                        <p className="text-gray-400 text-sm md:text-lg border-l-2 border-red-500 pl-4">
                            Seu HP chegou a zero. Você precisa descansar e se recuperar.
                        </p>
                    </div>
                </div>

                {/* Content area - following the grid pattern */}
                <div className="grid grid-cols-1 gap-4 mt-6">
                    {/* Hospital scene card */}
                    <div className="bg-black/30 border border-red-500/50 rounded-xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                            {/* Hospital Image */}
                            <div className="flex-shrink-0">
                                <Image
                                    src="/hospital_scene.png"
                                    alt="Hospital Scene"
                                    width={400}
                                    height={300}
                                    className="rounded-lg opacity-90 border border-red-500/30"
                                    priority={false}
                                />
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <div>
                                    <h2 className="text-red-400 text-xl md:text-2xl font-bold mb-2">
                                        Você está internado!
                                    </h2>
                                    <p className="text-gray-400 text-sm md:text-base">
                                        Overworking não compila. Rest() é obrigatório.
                                    </p>
                                </div>

                                {/* Countdown Timer */}
                                <div className="bg-black/70 rounded-lg p-6 border border-red-500/30">
                                    <p className="text-gray-300 text-xs md:text-sm mb-3 uppercase tracking-wider">
                                        {timeoutExpired ? 'Timeout expirado!' : 'Tempo restante de internação:'}
                                    </p>
                                    <p className="text-red-400 text-4xl md:text-5xl font-bold font-mono">
                                        {remainingTime}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {timeoutExpired ? (
                                        // Show discharge button when timeout expired
                                        <button
                                            onClick={handleDischarge}
                                            disabled={isProcessing}
                                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <span className="animate-spin">⏳</span>
                                                    Processando...
                                                </>
                                            ) : (
                                                <>
                                                    <span>✅</span>
                                                    Sair do Hospital (HP restaurado para 100)
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        // Show buy freedom button when timeout not expired
                                        <button
                                            onClick={handleBuyFreedom}
                                            disabled={isProcessing || !canAffordFreedom}
                                            className={`w-full font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${canAffordFreedom
                                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                                : 'bg-gray-600 cursor-not-allowed'
                                                } disabled:bg-gray-600 disabled:cursor-not-allowed text-white`}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <span className="animate-spin">⏳</span>
                                                    Processando...
                                                </>
                                            ) : (
                                                <>
                                                    <span>💰</span>
                                                    Comprar Liberdade ({freedomCost.toFixed(2)} R$)
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {!timeoutExpired && !canAffordFreedom && (
                                        <p className="text-red-400 text-sm text-center">
                                            Você não tem dinheiro suficiente. Necessário: {freedomCost.toFixed(2)} R$
                                        </p>
                                    )}
                                </div>

                                {/* Additional Info */}
                                <div className="flex items-start gap-3 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-400 flex-shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    <p className="text-gray-400 text-sm">
                                        Você não pode realizar ações enquanto estiver internado. Use este tempo para refletir sobre suas escolhas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Normal hospital page - show actions
    return (
        <div>
            <div className="flex justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold uppercase text-white mb-2">
                        🏥 Hospital
                    </h1>
                    <p className="text-gray-400 text-sm md:text-lg border-l-2 border-red-500 pl-4">
                        Cuide da sua saúde. HP baixo é refactoring na carne.
                    </p>
                </div>
                <ActionQuantitySelector />
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6">
                {actions.map(action => (
                    <ActionCard key={action.id} action={action} />
                ))}
                {!isLoading && actions.length === 0 && (
                    <p className="text-gray-500 font-mono italic">
                        O hospital está fechado. Volte mais tarde.
                    </p>
                )}
            </div>
        </div>
    );
}
