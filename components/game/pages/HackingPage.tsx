'use client'

import { ActionCard } from "@/components/game/ActionCard";
import { useEffect, useState } from "react";
import { api, GameAction, GameActionType } from "@/services/api";

export function HackingPage() {
    const [actions, setActions] = useState<GameAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActions = async () => {
            const data = await api.getActionsByType(GameActionType.HACKING);
            setActions(data);
            setIsLoading(false);
        };
        fetchActions();
    }, []);

    return (
        <div>
            <div>
                <h1 className="text-4xl font-bold uppercase text-white mb-2">Black Hat Zone</h1>
                <p className="text-gray-400 text-lg border-l-2 border-primary pl-4">
                    Não deixe rastros. A polícia cibernética está de olho.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6">
                {actions.map(action => (
                    <ActionCard key={action.id} action={action} />
                ))}
                {!isLoading && actions.length === 0 && (
                    <p className="text-gray-500 font-mono italic">Nenhuma missão disponível no momento.</p>
                )}
            </div>
        </div>
    )
}
