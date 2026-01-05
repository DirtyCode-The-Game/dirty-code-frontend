'use client'
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ActionCard } from "@/components/game/ActionCard";

export type ActionItem = {
    id: string;
    title: string;
    description: string;
    energyCost: number;
    moneyReward?: number;
    risk?: number;
    type?: 'work' | 'crime' | 'training';
}

export function ActionPage({ title, description, actions, color = "primary" }: { title: string, description: string, actions: ActionItem[], color?: "primary" | "secondary" | "success" | "warning" | "danger" }) {
    const router = useRouter();

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
                    <ActionCard key={action.id} action={action} color={color} />
                ))}
            </div>
        </div>
    )
}
