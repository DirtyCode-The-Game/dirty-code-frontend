'use client'
import { ActionCard } from "@/components/game/ActionCard";
import { GameAction } from "@/services/api";

export function ActionPage({ title, description, actions }: { title: string, description: string, actions: GameAction[] }) {

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-4xl font-bold uppercase text-white mb-2">{title}</h1>
                    <p className="text-gray-400 text-lg border-l-2 border-gray-700 pl-4">{description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {actions.map(action => (
                    <ActionCard key={action.id} action={action} />
                ))}
            </div>
        </div>
    )
}
