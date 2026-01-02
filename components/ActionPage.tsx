'use client'
import { useGame } from "@/context/GameContext";
import { Button, Card, CardBody } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    const { performFakeAction, user } = useGame();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();

    const handleAction = async (id: string) => {
        setLoadingId(id);
        await performFakeAction(id);
        setLoadingId(null);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase text-white mb-2 tracking-tighter shadow-glow">{title}</h1>
                    <p className="text-gray-400 font-mono text-lg border-l-2 border-gray-700 pl-4">{description}</p>
                </div>
                <Button isIconOnly variant="light" onPress={() => router.back()} className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {actions.map(action => (
                    <Card key={action.id} className="bg-[#0f0f0f] border border-white/5 hover:border-white/20 transition-all group">
                        <CardBody className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors">{action.title}</h3>
                                    {action.risk && action.risk > 50 ? (
                                        <span className="bg-danger/10 text-danger text-[10px] px-2 py-0.5 rounded border border-danger/20 font-mono uppercase">High Risk</span>
                                    ) : null}
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{action.description}</p>

                                <div className="flex items-center gap-6 text-xs font-mono pt-2 text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${action.energyCost > 0 ? 'bg-blue-500' : 'bg-pink-500'}`}></span>
                                        <span>{action.energyCost > 0 ? `-${action.energyCost}` : `+${Math.abs(action.energyCost)}`} Energia</span>
                                    </div>
                                    {action.moneyReward !== undefined && action.moneyReward !== 0 && (
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${action.moneyReward > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                            <span>{action.moneyReward > 0 ? '+' : ''}{action.moneyReward} $</span>
                                        </div>
                                    )}
                                    {action.risk !== undefined && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                            <span>{action.risk}% Falha</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                color={color}
                                variant="solid"
                                size="lg"
                                isLoading={loadingId === action.id}
                                onPress={() => handleAction(action.id)}
                                className="w-full md:w-auto font-bold tracking-wider px-8"
                                isDisabled={action.energyCost > 0 ? (!!user && user.energy < action.energyCost) : false}
                            >
                                {loadingId === action.id ? '...' : (action.energyCost < 0 ? 'RECUPERAR' : 'EXECUTAR')}
                            </Button>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}
