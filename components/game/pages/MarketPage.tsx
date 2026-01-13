'use client'

import { ActionCard } from "@/components/game/ActionCard";
import { ActionQuantitySelector } from "@/components/game/ActionQuantitySelector";
import { useEffect, useState } from "react";
import { api, GameAction, GameActionType } from "@/services/api";
import { useGame } from "@/context/GameContext";

export function MarketPage() {
    const { user } = useGame();
    const [actions, setActions] = useState<GameAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActions = async () => {
            if (!user?.activeAvatar) return;

            setIsLoading(true);
            const data = await api.getActionsByType(GameActionType.MARKET);
            setActions(data);
            setIsLoading(false);
        };
        fetchActions();
    }, [user?.activeAvatar?.strength, user?.activeAvatar?.intelligence, user?.activeAvatar?.charisma, user?.activeAvatar?.stealth]);

    return (
        <div>
            <div className="flex justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold uppercase text-white mb-2">Mercadinho</h1>
                    <p className="text-gray-400 text-sm md:text-lg border-l-2 border-primary pl-4">
                        Tudo que você precisa para virar a noite codando. Aceitamos VR.
                    </p>
                </div>
                <ActionQuantitySelector />
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6">
                {actions.map(action => (
                    <ActionCard key={action.id} action={action} />
                ))}
                {!isLoading && actions.length === 0 && (
                    <p className="text-gray-500 font-mono italic">O mercadinho está fechado. Volte mais tarde.</p>
                )}
            </div>
        </div>
    )
}
