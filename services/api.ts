import { GAME_ACTIONS } from "./game_data";

export type User = {
    id: string;
    name: string;
    level: number;
    energy: number;
    money: number;
    reputation: number;
    burnout: number;
};

export const api = {
    loginWithGoogle: async (): Promise<{ token: string; user: User }> => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        return {
            token: "mock-token-" + Math.random().toString(36).substring(7),
            user: {
                id: "1",
                name: "Leo Dev",
                level: 1,
                energy: 100,
                money: 500,
                reputation: 0,
                burnout: 0,
            },
        };
    },

    performAction: async (actionId: string): Promise<{ success: boolean; message: string; rewards?: Partial<User> }> => {
        await new Promise((resolve) => setTimeout(resolve, 600));

        const action = GAME_ACTIONS[actionId];
        if (!action) return { success: false, message: "Ação desconhecida." };

        // Lógica de Risco
        const roll = Math.random() * 100;
        const success = roll > action.risk;

        if (!success) {
            // Falha!
            return {
                success: false,
                message: `Falha em ${action.title}! Algo deu errado.`,
                rewards: {
                    // Penalidade opcional na falha
                    energy: -5
                }
            };
        }

        // Sucesso
        // Calcular recompensas reais
        // Se moneyReward > 0, ganha. Se < 0, já foi pago no client (custo), mas aqui confirmamos? 
        // Vamos simplificar: API retorna o delta final.

        const moneyDelta = action.moneyReward; // Pode ser negativo (custo) ou positivo (ganho)
        const energyDelta = -action.energyCost; // Cost is positive in config, so delta is negative. 
        // Oops, if action restores energy (cost negative), delta becomes positive. Correct.

        return {
            success: true,
            message: `${action.title} concluído!`,
            rewards: {
                money: moneyDelta,
                energy: energyDelta,
                reputation: action.reputationReward
            }
        };
    }
};
