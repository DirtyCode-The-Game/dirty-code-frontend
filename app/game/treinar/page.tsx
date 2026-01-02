'use client'
import { ActionPage } from "@/components/ActionPage";
import { getActionsByCategory } from "@/services/game_data";

export default function TrainPage() {
    // Creating some dummy training actions if not in game_data
    // Assuming getActionsByCategory('train') might be empty as I didn't add "train" prefixed actions in game_data.ts explicitly yet? 
    // Wait, I didn't. I'll add them or just render empty.
    // Better to have some content.
    const actions = getActionsByCategory('train');
    return <ActionPage title="Treinar" description="Invista em você mesmo. O ROI é lento mas existe." actions={actions} color="warning" />
}
