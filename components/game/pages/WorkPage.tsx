'use client'

import { ActionCard } from "@/components/game/ActionCard";
import { useEffect, useState } from "react";
import { api, GameAction, GameActionType } from "@/services/api";
import { useGame } from "@/context/GameContext";

export function WorkPage() {
    const { user } = useGame();
    const [actions, setActions] = useState<GameAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActions = async () => {
            setIsLoading(true);
            const data = await api.getActionsByType(GameActionType.WORK);
            setActions(data);
            setIsLoading(false);
        };
        fetchActions();
    }, [user?.activeAvatar?.strength, user?.activeAvatar?.intelligence, user?.activeAvatar?.charisma, user?.activeAvatar?.stealth]);

    return (
        <div>
            <div>
                <h1 className="text-2xl md:text-4xl font-bold uppercase text-white mb-2">Trabalho</h1>
                <p className="text-gray-400 text-sm md:text-lg border-l-2 border-primary pl-4">
                    Onde o filho chora e a mãe não vê. Escolha seu veneno.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6">
                {actions.map(action => (
                    <ActionCard key={action.id} action={action} />
                ))}
                {!isLoading && actions.length === 0 && (
                    <p className="text-gray-500 font-mono italic">Nenhum trabalho disponível no momento.</p>
                )}
            </div>
        </div>
    )
}
