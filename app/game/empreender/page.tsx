'use client'
import { ActionPage } from "@/components/ActionPage";
import { getActionsByCategory } from "@/services/game_data";

export default function BusinessPage() {
    const actions = getActionsByCategory('biz');
    return <ActionPage title="Empreender" description="Crie, falhe, pivote, repita. O caminho para o IPO." actions={actions} color="secondary" />
}
