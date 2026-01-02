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
            addiction: 12,
            karma: 50,

            strength: 10,
            intelligence: 80,
            charisma: 25,

            money: 500,
            burnout: 0,
        }
    };

    return (
        <Card className="w-full bg-black border border-white/10 p-0 overflow-hidden">
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
                <div className="flex-1 flex flex-col gap-4 w-full">

                    {/* Life - Red */}
                    <Progress
                        label="Vida"
                        value={user.life || 0}
                        color="danger"
                        size="md"
                        showValueLabel={true}
                        classNames={{
                            track: "bg-white/10",
                            label: "text-xs uppercase font-bold tracking-wider text-gray-400",
                            value: "text-xs uppercase font-bold tracking-wider text-gray-400"
                        }}
                    />

                    {/* Stamina - Blue */}
                    <Progress
                        label="Stamina"
                        value={user.stamina || 0}
                        size="md"
                        showValueLabel={true}
                        classNames={{
                            track: "bg-white/10",
                            indicator: "!bg-blue-500",
                            label: "text-xs uppercase font-bold tracking-wider text-gray-400",
                            value: "text-xs uppercase font-bold tracking-wider text-gray-400"
                        }}
                    />

                    {/* Addiction - Green */}
                    <Progress
                        label="Vício"
                        value={user.addiction || 0}
                        color="success"
                        size="md"
                        showValueLabel={true}
                        classNames={{
                            track: "bg-white/10",
                            label: "text-xs uppercase font-bold tracking-wider text-gray-400",
                            value: "text-xs uppercase font-bold tracking-wider text-gray-400"
                        }}
                    />

                    {/* Karma - Yellow */}
                    <Progress
                        label="Karma"
                        value={user.karma || 0}
                        maxValue={100}
                        color="warning"
                        size="md"
                        showValueLabel={true}
                        classNames={{
                            track: "bg-white/10",
                            label: "text-xs uppercase font-bold tracking-wider text-gray-400",
                            value: "text-xs uppercase font-bold tracking-wider text-gray-400"
                        }}
                    />

                </div>

                {/* Money Section - Middle */}
                <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 pl-0 md:pl-6 pr-0 md:pr-6 w-full md:w-auto min-w-[100px]">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Dinheiro</div>
                    <div className="font-mono font-bold text-2xl text-green-400">
                        R$ {user.money}
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
        </Card >
    )
}
