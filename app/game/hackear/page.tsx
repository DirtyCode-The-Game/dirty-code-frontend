'use client'
import { ActionPage } from "@/components/ActionPage";
import { getActionsByCategory } from "@/services/game_data";

export default function HackPage() {
    const actions = getActionsByCategory('hack');
    return <ActionPage title="Hackear" description="Acesse o que não é seu. Cuidado com os logs." actions={actions} color="success" />
}
