'use client'

import { useGame } from "@/context/GameContext";
import { ActionItem } from "@/components/ActionPage";
import { useState } from "react";
import { Button, Select, SelectItem, Chip } from "@heroui/react";

interface WorkAction extends ActionItem {
    requirements: {
        intelligence: number;
        charisma: number;
    }
}

const WORK_ACTIONS: WorkAction[] = [
    {
        id: "freelance_bug",
        title: "Corrigir Bug Crítico",
        description: "Cliente está desesperado. O sistema caiu.",
        energyCost: 10,
        moneyReward: 50,
        risk: 10,
        requirements: { intelligence: 10, charisma: 1 }
    },
    {
        id: "create_landing",
        title: "Criar Landing Page",
        description: "Mais uma LP genérica para vender curso.",
        energyCost: 20,
        moneyReward: 120,
        risk: 5,
        requirements: { intelligence: 5, charisma: 10 }
    },
    {
        id: "maintain_legacy",
        title: "Manter Legado COBOL",
        description: "O código tem 30 anos e cheira a naftalina.",
        energyCost: 35,
        moneyReward: 300,
        risk: 30,
        requirements: { intelligence: 30, charisma: 0 }
    },
];

export function WorkPage() {
    const { user, performAction } = useGame();
    const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleWork = async () => {
        if (!selectedActionId) return;
        setIsLoading(true);
        await performAction(selectedActionId);
        setIsLoading(false);
    };

    const selectedAction = WORK_ACTIONS.find(a => a.id === selectedActionId);

    const meetsRequirements = (action: WorkAction) => {
        if (!user?.activeAvatar) return false;
        const avatar = user.activeAvatar;

        return (avatar.intelligence || 0) >= action.requirements.intelligence &&
            (avatar.charisma || 0) >= action.requirements.charisma;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold uppercase text-white mb-2">Trabalho</h1>
                <p className="text-gray-400 text-lg border-l-2 border-primary pl-4">
                    Onde o filho chora e a mãe não vê. Escolha seu veneno.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <Select
                    placeholder="Selecione um trabalho..."
                    selectedKeys={selectedActionId ? [selectedActionId] : []}
                    className="max-w-full"
                    variant="faded"
                    size="lg"
                    classNames={{
                        trigger: "bg-zinc-900 border-white/10 min-h-[100px] h-auto py-4 data-[hover=true]:border-primary/50",
                        value: "text-lg w-full",
                        popoverContent: "bg-zinc-900 border border-white/10 dark",
                        innerWrapper: "group-data-[has-label=true]:pt-0 w-full"
                    }}
                    renderValue={(items) => {
                        return items.map((item) => {
                            const action = WORK_ACTIONS.find(a => a.id === item.key);
                            if (!action) return null;
                            return (
                                <div key={item.key} className="flex flex-col gap-3 w-full pr-8">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xl font-bold text-white leading-none">{action.title}</span>
                                            <span className="text-sm text-gray-400 truncate max-w-[200px] sm:max-w-md">{action.description}</span>
                                        </div>
                                        {(action.risk ?? 0) > 0 && (
                                            <Chip size="sm" variant="flat" color="danger" className="border border-danger/20 text-[10px] h-5 min-h-0 px-1">
                                                {action.risk}% RISK
                                            </Chip>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-6 text-xs font-mono border-t border-white/5 pt-3">
                                        <div className="flex items-center gap-2 text-blue-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                            <span className="font-bold">-{action.energyCost} STM</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-green-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                            <span className="font-bold text-base">+${action.moneyReward}</span>
                                        </div>
                                        <div className="w-px h-4 bg-white/10 mx-2"></div>
                                        <div className="flex gap-4 text-gray-400">
                                            <span className={`font-bold transition-colors ${(user?.activeAvatar?.intelligence || 0) >= action.requirements.intelligence ? "text-gray-300" : "text-red-400"}`}>
                                                INT {action.requirements.intelligence}
                                            </span>
                                            <span className={`font-bold transition-colors ${(user?.activeAvatar?.charisma || 0) >= action.requirements.charisma ? "text-gray-300" : "text-red-400"}`}>
                                                CHA {action.requirements.charisma}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        });
                    }}
                    onSelectionChange={(keys) => setSelectedActionId(Array.from(keys)[0] as string)}
                >
                    {WORK_ACTIONS.map((action) => (
                        <SelectItem
                            key={action.id}
                            textValue={action.title}
                            className="h-auto py-3 data-[hover=true]:bg-white/5"
                        >
                            <div className="flex flex-col gap-2 w-full">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-white">{action.title}</span>
                                        <span className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-md">{action.description}</span>
                                    </div>
                                    {action.risk > 0 && (
                                        <Chip size="sm" variant="flat" color="danger" className="border border-danger/20 text-[10px] h-5 min-h-0">
                                            {action.risk}% RISK
                                        </Chip>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-xs font-mono border-t border-white/5 pt-2 mt-1">
                                    <div className="flex items-center gap-1.5 text-blue-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        -{action.energyCost} STM
                                    </div>
                                    <div className="flex items-center gap-1.5 text-green-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        +${action.moneyReward}
                                    </div>
                                    <div className="w-px h-3 bg-white/20 mx-1"></div>
                                    <div className="flex gap-3 text-gray-400">
                                        <span className={(user?.activeAvatar?.intelligence || 0) >= action.requirements.intelligence ? "text-gray-300" : "text-red-400"}>
                                            INT {action.requirements.intelligence}
                                        </span>
                                        <span className={(user?.activeAvatar?.charisma || 0) >= action.requirements.charisma ? "text-gray-300" : "text-red-400"}>
                                            CHA {action.requirements.charisma}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
                <Button
                    size="lg"
                    color={selectedAction && !meetsRequirements(selectedAction) ? "danger" : "primary"}
                    variant={selectedAction && !meetsRequirements(selectedAction) ? "flat" : "shadow"}
                    className="font-bold tracking-wider w-full md:w-auto px-16"
                    isLoading={isLoading}
                    isDisabled={!selectedActionId || (selectedAction ? !meetsRequirements(selectedAction) : true)}
                    onPress={handleWork}
                >
                    {isLoading ? 'TRABALHANDO...' : selectedAction && !meetsRequirements(selectedAction) ? 'REQUISITOS INSUFICIENTES' : 'EXECUTAR TRABALHO'}
                </Button>
            </div>
        </div>
    )
}
