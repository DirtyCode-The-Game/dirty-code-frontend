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
    type?: 'work' | 'crime' | 'business' | 'training' | 'lifestyle';
}

export function ActionPage({ title, description, actions, color = "primary" }: { title: string, description: string, actions: ActionItem[], color?: "primary" | "secondary" | "success" | "warning" | "danger" }) {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase text-white mb-2 tracking-tighter shadow-glow">{title}</h1>
                    <p className="text-gray-400 font-mono text-lg border-l-2 border-gray-700 pl-4">{description}</p>
                </div>
                {/* Back button might be redundant if this is embedded, but keeping for now or removing if user wants pure dashboard */}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {actions.map(action => (
                    <ActionCard key={action.id} action={action} color={color} />
                ))}
            </div>
        </div>
    )
}
