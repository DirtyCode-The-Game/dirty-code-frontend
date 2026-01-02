'use client'

import { useGame } from "@/context/GameContext";
import { Button, Card, CardBody } from "@heroui/react";
import { useState } from "react";
import { ActionItem } from "@/components/ActionPage";

interface ActionCardProps {
    action: ActionItem;
    color?: "primary" | "secondary" | "success" | "warning" | "danger";
}

export function ActionCard({ action, color = "primary" }: ActionCardProps) {
    const { performAction, user } = useGame();
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async () => {
        setIsLoading(true);
        await performAction(action.id);
        setIsLoading(false);
    }

    return (
        <Card className="bg-[#0f0f0f] border border-white/5 hover:border-white/20 transition-all group w-full">
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
                            <span>{action.energyCost > 0 ? `-${action.energyCost}` : `+${Math.abs(action.energyCost)}`} Stamina</span>
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
                    isLoading={isLoading}
                    onPress={handleAction}
                    className="w-full md:w-auto font-bold tracking-wider px-8"
                    isDisabled={action.energyCost > 0 ? (!!user && user.stamina < action.energyCost) : false}
                >
                    {isLoading ? '...' : (action.energyCost < 0 ? 'RECUPERAR' : 'EXECUTAR')}
                </Button>
            </CardBody>
        </Card>
    )
}
