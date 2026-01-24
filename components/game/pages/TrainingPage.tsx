'use client'

import { ActionCard } from "@/components/game/ActionCard";
import { ActionQuantitySelector } from "@/components/game/ActionQuantitySelector";
import { useEffect, useState, useMemo } from "react";
import { GameAction, GameActionType } from "@/services/api";
import { useGame } from "@/context/GameContext";
import { Accordion, AccordionItem } from "@heroui/react";

export function TrainingPage() {
    const { user, actionCounts, setActionCountForCategory, cachedActions, fetchActions } = useGame();
    const actions = cachedActions[GameActionType.TRAIN] || [];
    const [isLoading, setIsLoading] = useState(actions.length === 0);
    const actionCount = actionCounts['training'] || 1;
    const setActionCount = (count: number) => setActionCountForCategory('training', count);

    const userLevel = user?.activeAvatar?.level || 1;

    // Agrupar ações por recommendedMaxLevel
    const groupedActions = useMemo(() => {
        const groups: Record<number, GameAction[]> = {};
        actions.forEach(action => {
            const level = action.recommendedMaxLevel || 0;
            if (!groups[level]) groups[level] = [];
            groups[level].push(action);
        });
        
        return Object.keys(groups)
            .map(Number)
            .sort((a, b) => a - b)
            .map(level => ({
                level,
                actions: groups[level]
            }));
    }, [actions]);

    const defaultExpandedKey = useMemo(() => {
        if (groupedActions.length === 0) return undefined;
        const exactMatch = groupedActions.find(g => g.level === userLevel);
        if (exactMatch) return exactMatch.level.toString();
        const nextLevel = groupedActions.find(g => g.level > userLevel);
        if (nextLevel) return nextLevel.level.toString();
        return groupedActions[groupedActions.length - 1].level.toString();
    }, [groupedActions, userLevel]);

    useEffect(() => {
        const loadActions = async () => {
            if (!user?.activeAvatar) return;
            
            const isInitialLoad = actions.length === 0;
            if (isInitialLoad) setIsLoading(true);
            
            await fetchActions(GameActionType.TRAIN, !isInitialLoad);
            
            if (isInitialLoad) setIsLoading(false);
        };
        
        loadActions();
    }, [user?.activeAvatar?.strength, user?.activeAvatar?.intelligence, user?.activeAvatar?.charisma, user?.activeAvatar?.stealth]);

    return (
        <div>
            <div className="flex justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold uppercase text-white mb-2">Academia Dev</h1>
                    <p className="text-gray-400 text-sm md:text-lg border-l-2 border-primary pl-4">
                        No pain, no gain. Fique monstrão (de conhecimento).
                    </p>
                </div>
                <ActionQuantitySelector value={actionCount} onChange={setActionCount} />
            </div>

            <div className="mt-6">
                {!isLoading && groupedActions.length > 0 ? (
                    <Accordion 
                        variant="splitted" 
                        selectionMode="multiple" 
                        defaultExpandedKeys={defaultExpandedKey ? [defaultExpandedKey] : []}
                    >
                        {groupedActions.map((group) => (
                            <AccordionItem
                                key={group.level.toString()}
                                aria-label={`Nível Recomendado ${group.level}`}
                                title={
                                    <div className="flex items-center justify-between pr-4">
                                        <span className="text-white font-bold uppercase tracking-wider">
                                            {group.level === 0 ? "Geral" : `Treinos recomendados até o nível ${group.level}`}
                                        </span>
                                        {group.level > 0 && group.level < userLevel && (
                                            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">
                                                Completado
                                            </span>
                                        )}
                                        {group.level === userLevel && (
                                            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/30">
                                                Nível Atual
                                            </span>
                                        )}
                                    </div>
                                }
                                classNames={{
                                    base: "bg-zinc-900/50 border border-white/5 mb-2",
                                    title: "text-sm",
                                    content: "px-2 pb-4"
                                }}
                            >
                                <div className="grid grid-cols-1 gap-4">
                                    {group.actions.map(action => (
                                        <ActionCard key={action.id} action={action} actionCount={actionCount} />
                                    ))}
                                </div>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : !isLoading && (
                    <p className="text-gray-500 font-mono italic">Nenhum treinamento disponível no momento.</p>
                )}
            </div>
        </div>
    )
}
