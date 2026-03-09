'use client'

import { ActionCard } from "@/components/game/ActionCard";
import { ActionQuantitySelector } from "@/components/game/ActionQuantitySelector";
import { useEffect, useState, useMemo } from "react";
import { GameAction, GameActionType } from "@/services/api";
import { useGame } from "@/context/GameContext";
import { Accordion, AccordionItem, Spinner } from "@heroui/react";
import { CountdownTimer } from "../CountdownTimer";

export function TrainingPage() {
    const { user, actionCounts, setActionCountForCategory, cachedActions, fetchActions, syncUserWithBackend, expandedAccordionKeys, setExpandedAccordionKeysForCategory } = useGame();
    const actions = cachedActions[GameActionType.TRAINING] || [];
    const [isLoading, setIsLoading] = useState(actions.length === 0);
    const actionCount = actionCounts['training'] || 1;
    const setActionCount = (count: number) => setActionCountForCategory('training', count);

    const userLevel = user?.activeAvatar?.level || 1;

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

    const persistedKeys = expandedAccordionKeys[GameActionType.TRAINING];

    const [expandedKeys, setExpandedKeys] = useState<string[] | "all">(persistedKeys || []);

    const defaultExpandedKey = useMemo(() => {
        if (groupedActions.length === 0) return undefined;

        const exactMatch = groupedActions.find(g => userLevel <= g.level && userLevel >= g.level - 10);
        if (exactMatch) return exactMatch.level.toString();

        const nextLevel = groupedActions.find(g => g.level > userLevel && userLevel >= g.level - 10);
        if (nextLevel) return nextLevel.level.toString();

        const availableGroups = groupedActions.filter(g => g.level === 0 || userLevel >= g.level - 10);
        if (availableGroups.length > 0) {
            return availableGroups[availableGroups.length - 1].level.toString();
        }

        return undefined;
    }, [groupedActions, userLevel]);

    useEffect(() => {
        if (persistedKeys !== undefined) {
            const filtered = (persistedKeys || []).filter(key => {
                const level = parseInt(key);
                return level === 0 || userLevel >= level - 10;
            });

            if (JSON.stringify(filtered) !== JSON.stringify(expandedKeys)) {
                setExpandedKeys(filtered);
            }
        } else if (defaultExpandedKey) {
            if (JSON.stringify([defaultExpandedKey]) !== JSON.stringify(expandedKeys)) {
                setExpandedKeys([defaultExpandedKey]);
            }
        }
    }, [persistedKeys, userLevel, defaultExpandedKey]);

    const handleExpandedChange = (keys: any) => {
        const keysArray = Array.from(keys) as string[];

        const allowedKeys = keysArray.filter(key => {
            const level = parseInt(key);
            return level === 0 || userLevel >= level - 10;
        });

        setExpandedKeys(allowedKeys);
        setExpandedAccordionKeysForCategory(GameActionType.TRAINING, allowedKeys);
    };

    useEffect(() => {
        const loadActions = async () => {
            if (!user?.activeAvatar) return;

            const isInitialLoad = actions.length === 0;
            if (isInitialLoad) {
                setIsLoading(true);
                await Promise.all([
                    fetchActions(GameActionType.TRAINING),
                    syncUserWithBackend()
                ]);
                setIsLoading(false);
            } else {
                await syncUserWithBackend();
            }
        };

        loadActions();
    }, [user?.activeAvatar?.id]);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold uppercase text-white mb-2">Academia Dev</h1>
                    <p className="text-gray-400 text-sm md:text-lg border-l-2 border-primary pl-4">
                        No pain, no gain. Fique monstrão (de conhecimento).
                    </p>
                    <p className="text-gray-400 text-sm md:text-lg border-l-2 border-primary pl-4">
                        Ganhe status temporarios por 24h.
                    </p>
                    {user?.activeAvatar?.statusCooldown && (
                        <>
                            <p className="text-yellow-500 text-xs md:text-sm font-bold mt-2 animate-pulse">
                                ⚠️ Você já possui bônus ativos. Aguarde {user?.activeAvatar?.statusCooldown && <CountdownTimer targetDate={user.activeAvatar.statusCooldown} />} para treinar novamente.
                            </p>
                            <p className="text-yellow-500 text-xs md:text-sm font-bold mt-2 animate-pulse">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ou procure por um desneuralizador no hospital.
                            </p>
                        </>
                    )}

                </div>
                <div className="w-full md:w-auto flex justify-end">
                    <ActionQuantitySelector value={actionCount} onChange={setActionCount} />
                </div>
            </div>

            <div className="mt-1 md:mt-5">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner color="primary" label="Assistindo tutorial indiano de 2012 no mudo..." labelColor="primary" />
                    </div>
                ) : groupedActions.length > 0 ? (
                    <Accordion
                        variant="splitted"
                        selectionMode="multiple"
                        selectedKeys={expandedKeys}
                        onSelectionChange={handleExpandedChange}
                    >
                        {groupedActions.map((group) => {
                            const isLocked = group.level > 0 && userLevel < group.level - 10;
                            return (
                                <AccordionItem
                                    key={group.level.toString()}
                                    aria-label={`Nível Recomendado ${group.level}`}
                                    isDisabled={isLocked}
                                    title={
                                        <div className="flex items-center justify-between pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold uppercase tracking-wider ${isLocked ? 'text-gray-600' : 'text-white'}`}>
                                                    {group.level === 0 ? "Geral" : `Treinos recomendados do nível ${Math.max(0, group.level - 10)} até o nível ${group.level}`}
                                                </span>
                                                {isLocked && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
                                                    </svg>
                                                )}
                                            </div>
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
                                        base: `bg-zinc-900/50 border border-white/5 mb-1 ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`,
                                        title: "text-sm",
                                        trigger: "py-2 px-2",
                                        content: "px-0 pb-1 pt-0"
                                    }}
                                >
                                    <div className="grid grid-cols-1 gap-1 md:gap-3">
                                        {group.actions.map(action => (
                                            <ActionCard key={action.id} action={action} actionCount={actionCount} />
                                        ))}
                                    </div>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                ) : !isLoading && (
                    <p className="text-gray-500 font-mono italic">Nenhum treinamento disponível no momento.</p>
                )}
            </div>
        </div>
    )
}
