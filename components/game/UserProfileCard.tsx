'use client'

import { useGame } from "@/context/GameContext";
import { Avatar, Card, CardBody, Progress } from "@heroui/react";

export function UserProfileCard() {
    let { user } = useGame();

    if (!user) {
        user = {
            id: "1",
            name: "Leo Dev (Server)",
            level: 1,

            life: 100,
            stamina: 100,
            addiction: 0,
            karma: 50,

            strength: 10,
            intelligence: 80,
            charisma: 25,

            money: 500,
            burnout: 0,
        }
    };

    return (
        <Card className="w-full bg-[#0a0a0a] border border-white/10 p-0 overflow-hidden">
            <CardBody className="p-4 flex flex-col md:flex-row gap-6 items-center">

                {/* Profile Section */}
                <div className="flex flex-col items-center gap-2 min-w-[120px]">
                    <div className="relative">
                        <Avatar
                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`}
                            className="w-24 h-24 border-2 border-primary"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-black border border-white/20 px-2 py-0.5 rounded text-[10px] font-mono text-primary font-bold">
                            LVL {user.level}
                        </div>
                    </div>
                    <h3 className="font-bold text-center text-lg leading-none mt-2">{user.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">Dev Júnior</p>
                </div>

                {/* Main Stats Bars */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 w-full">

                    {/* Life */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs uppercase font-bold tracking-wider text-gray-400">
                            <span>Vida</span>
                            <span>{user.life}%</span>
                        </div>
                        <Progress
                            aria-label="Vida"
                            value={user.life}
                            color="danger"
                            classNames={{ indicator: "bg-red-500" }}
                            size="sm"
                        />
                    </div>

                    {/* Stamina */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs uppercase font-bold tracking-wider text-gray-400">
                            <span>Stamina</span>
                            <span>{user.stamina}%</span>
                        </div>
                        <Progress
                            aria-label="Stamina"
                            value={user.stamina}
                            color="warning"
                            classNames={{ indicator: "bg-amber-500" }}
                            size="sm"
                        />
                    </div>

                    {/* Addiction */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs uppercase font-bold tracking-wider text-gray-400">
                            <span>Vício</span>
                            <span>{user.addiction}%</span>
                        </div>
                        <Progress
                            aria-label="Vício"
                            value={user.addiction}
                            color="secondary"
                            classNames={{ indicator: "bg-purple-500" }}
                            size="sm"
                        />
                    </div>

                    {/* Karma */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs uppercase font-bold tracking-wider text-gray-400">
                            <span>Karma</span>
                            <span>{user.karma}</span>
                        </div>
                        <Progress
                            aria-label="Karma"
                            value={user.karma}
                            maxValue={100} // Assuming 100 for visual
                            color="success"
                            classNames={{ indicator: "bg-emerald-500" }}
                            size="sm"
                        />
                    </div>

                </div>

                {/* Attributes Section - Right Side */}
                <div className="flex flex-row md:flex-col gap-4 md:gap-2 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs ring-1 ring-blue-500/20">
                            STR
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Força</div>
                            <div className="font-mono font-bold text-sm">{user.strength}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-500 font-bold text-xs ring-1 ring-cyan-500/20">
                            INT
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Intel</div>
                            <div className="font-mono font-bold text-sm">{user.intelligence}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-pink-500/10 flex items-center justify-center text-pink-500 font-bold text-xs ring-1 ring-pink-500/20">
                            CHA
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Carisma</div>
                            <div className="font-mono font-bold text-sm">{user.charisma}</div>
                        </div>
                    </div>
                </div>

            </CardBody>
        </Card>
    )
}
