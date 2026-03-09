'use client'

import { ActionCard } from "@/components/game/ActionCard";
import { ActionQuantitySelector } from "@/components/game/ActionQuantitySelector";
import { useEffect, useState } from "react";
import { GameActionType } from "@/services/api";
import { useGame } from "@/context/GameContext";
import { Spinner } from "@heroui/react";

export function MarketPage() {
    const { user, actionCounts, setActionCountForCategory, cachedActions, fetchActions, syncUserWithBackend } = useGame();
    const actions = cachedActions[GameActionType.MARKET] || [];
    const [isLoading, setIsLoading] = useState(actions.length === 0);
    const actionCount = actionCounts['market'] || 1;
    const setActionCount = (count: number) => setActionCountForCategory('market', count);

    useEffect(() => {
        const loadActions = async () => {
            if (!user?.activeAvatar) return;

            const isInitialLoad = actions.length === 0;
            if (isInitialLoad) {
                setIsLoading(true);
                await Promise.all([
                    fetchActions(GameActionType.MARKET),
                    syncUserWithBackend()
                ]);
                setIsLoading(false);
            } else {
                await syncUserWithBackend();
            }
        };

        loadActions();
    }, [user?.activeAvatar?.id]);

    return (
        <div>
            <div className="flex justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold uppercase text-white mb-2">Mercadinho</h1>
                    <p className="text-gray-400 text-sm md:text-lg border-l-2 border-primary pl-4">
                        Tudo que você precisa para virar a noite codando. Aceitamos VR.
                    </p>
                </div>
                <ActionQuantitySelector value={actionCount} onChange={setActionCount} />
            </div>

            <div className="grid grid-cols-1 gap-2 md:gap-3 mt-4 md:mt-5">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner color="primary" label="Esquentando a pizza de ontem no microondas..." labelColor="primary" />
                    </div>
                ) : actions.length > 0 ? (
                    actions.map(action => (
                        <ActionCard key={action.id} action={action} actionCount={actionCount} />
                    ))
                ) : (
                    <p className="text-gray-500 font-mono italic">O mercadinho está fechado. Volte mais tarde.</p>
                )}
            </div>
        </div>
    )
}
