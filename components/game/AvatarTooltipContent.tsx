'use client'

import { Avatar, Card, CardBody, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { formatMoney, getAvatarTitle } from "@/lib/game-utils";

interface AvatarData {
    story?: string;
    id: string;
    name: string;
    level: number;
    money: number;
    picture: string;
    hacking: number;
    work: number;
}

interface AvatarTooltipContentProps {
    avatarId: string;
}

export function AvatarTooltipContent({ avatarId }: AvatarTooltipContentProps) {
    const { getAvatarData, avatarCache } = useGame();
    const [avatar, setAvatar] = useState<AvatarData | null>(avatarCache[avatarId] || null);
    const [isLoading, setIsLoading] = useState(!avatarCache[avatarId]);
    const [visitCount, setVisitCount] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            const hasCache = !!avatarCache[avatarId];
            if (!hasCache) {
                setIsLoading(true);
            }
            
            const shouldRefresh = hasCache && visitCount === 1;
            
            const data = await getAvatarData(avatarId, shouldRefresh);
            
            if (isMounted && data) {
                setAvatar(data);
                setIsLoading(false);
                setVisitCount(prev => prev + 1);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, [avatarId, getAvatarData]);


    if (isLoading && !avatar) {
        return (
            <div className="flex justify-center p-4 min-w-[200px]">
                <Spinner size="sm" color="primary" />
            </div>
        );
    }

    if (!avatar) {
        return (
            <div className="p-4 text-gray-500 font-mono text-xs">
                Hacker não encontrado...
            </div>
        );
    }

    return (
        <Card className="max-w-[280px] bg-black border border-white/10 shadow-xl overflow-hidden">
            <CardBody className="p-3 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar
                            src={avatar.picture}
                            className="w-12 h-12 border border-primary/50"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-black border border-white/20 px-1 py-0.5 rounded text-[8px] font-mono text-primary font-bold">
                            L{avatar.level}
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <h3 className="font-bold text-sm text-white leading-tight">{avatar.name}</h3>
                        <p className="text-[9px] text-primary font-mono uppercase tracking-tighter">{getAvatarTitle(avatar.level, avatar.hacking, avatar.work)}</p>
                        <p className="text-green-400 font-bold font-mono text-[11px]">
                            R$ {formatMoney(avatar.money)}
                        </p>
                    </div>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-2">
                    <div className="flex flex-col gap-0.5">
                        <p className="text-[10px] text-gray-400 italic line-clamp-2 leading-tight">
                            {avatar.story || "Este hacker prefere manter o anonimato..."}
                        </p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
