'use client'
import { ActionPage } from "@/components/ActionPage";
import { getActionsByCategory } from "@/services/game_data";

export default function NightlifePage() {
    const actions = getActionsByCategory('life');
    return <ActionPage title="Vida Noturna" description="Recupere energias ou perca o resto da dignidade." actions={actions} color="danger" />
}
