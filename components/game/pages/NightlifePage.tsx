'use client'

import { ActionCard } from "@/components/game/ActionCard";
import { GameAction, GameActionType } from "@/services/api";

const NIGHTLIFE_ACTIONS: GameAction[] = [
    { 
        id: "energy_drink", 
        type: GameActionType.WORK,
        title: "Beber Energético", 
        description: "Recupere energia, ganhe vício.", 
        stamina: 20, 
        money: -10, 
        moneyVariation: 0,
        xp: 0,
        xpVariation: 0,
        textFile: "",
        actionImage: ""
    },
    { 
        id: "clubbing", 
        type: GameActionType.WORK,
        title: "Ir pra Balada", 
        description: "Gastar dinheiro para fingir felicidade.", 
        stamina: -50, 
        money: -100, 
        moneyVariation: 0,
        xp: 10,
        xpVariation: 0,
        textFile: "",
        actionImage: ""
    },
];

export function NightlifePage() {
    return (
        <div>
            <div>
                <h1 className="text-4xl font-bold uppercase text-white mb-2">Night City</h1>
                <p className="text-gray-400 text-lg border-l-2 border-primary pl-4">
                    Relaxe, beba e esqueça os bugs de produção.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6">
                {NIGHTLIFE_ACTIONS.map(action => (
                    <ActionCard key={action.id} action={action} />
                ))}
            </div>
        </div>
    )
}
