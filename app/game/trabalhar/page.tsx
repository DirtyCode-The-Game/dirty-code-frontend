'use client'
import { ActionPage } from "@/components/ActionPage";
import { getActionsByCategory } from "@/services/game_data";

export default function WorkPage() {
    const actions = getActionsByCategory('work');
    return <ActionPage title="Trabalhar" description="Troque seu tempo (e saúde mental) por dinheiro." actions={actions} color="primary" />
}
