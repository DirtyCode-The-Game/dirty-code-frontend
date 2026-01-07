export interface Avatar {
    id: string;
    name: string;
    picture?: string;
    level: number;
    experience: number;
    stamina: number;
    life: number;
    money: number; // BigDecimal in backend, number in JS
    availablePoints: number;
    intelligence: number;
    charisma: number;
    strength: number;
    stealth: number;
    active: boolean;
    burnout: number;
}

export enum GameActionType {
    HACKING = 'hacking',
    WORK = 'work',
    TRAIN = 'train'
}

export interface GameAction {
    id: string;
    type: GameActionType;
    title: string;
    description: string;
    stamina: number;
    money: number;
    moneyVariation: number;
    xp: number;
    xpVariation: number;
    requiredStrength?: number;
    requiredIntelligence?: number;
    requiredCharisma?: number;
    requiredStealth?: number;
    textFile: string;
    actionImage: string;
}

export interface User {
    id: string;
    email?: string;
    name?: string;
    activeAvatar?: Avatar;
}

export const api = {
    loginWithGoogle: async (): Promise<{ token: string; user: User }> => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        return {
            token: "mock-token-" + Math.random().toString(36).substring(7),
            user: {
                id: "1",
                name: "Leo Dev",
                activeAvatar: {
                    id: "avatar_1",
                    name: "Leo Dev",
                    level: 1,
                    experience: 0,
                    life: 100,
                    stamina: 100,
                    money: 500,
                    availablePoints: 0,
                    intelligence: 80,
                    charisma: 25,
                    strength: 10,
                    stealth: 5,
                    active: true,
                    burnout: 0,
                },
            },
        };
    },

    getToken: async (): Promise<string | null> => {
        try {
            const tokenRes = await fetch('/api/auth/token');
            if (!tokenRes.ok) return null;
            const { token } = await tokenRes.json();
            return token;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    },

    getActionsByType: async (type: GameActionType): Promise<GameAction[]> => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/dirty-code';
        try {
            const token = await api.getToken();

            const response = await fetch(`${baseUrl}/v1/actions/type/${type}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch actions');
            return await response.json();
        } catch (error) {
            console.error(`Error fetching actions of type ${type}:`, error);
            return [];
        }
    },

    performAction: async (actionId: string): Promise<{ success: boolean; message: string; rewards?: any }> => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/dirty-code';
        try {
            const token = await api.getToken();

            const response = await fetch(`${baseUrl}/v1/actions/${actionId}/perform`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { 
                    success: false, 
                    message: errorData.message || 'Falha ao executar ação.' 
                };
            }

            const updatedAvatar = await response.json();
            return {
                success: true,
                message: 'Ação concluída com sucesso!',
                rewards: {
                    activeAvatar: updatedAvatar
                }
            };
        } catch (error) {
            console.error('Error performing action:', error);
            return { success: false, message: 'Erro de conexão ao executar ação.' };
        }
    },
    createAvatar: async (data: any) => {
        const { createAvatarAction } = await import('@/app/actions/avatar');
        return await createAvatarAction(data);
    },
    updateAvatar: async (data: any) => {
        const { updateAvatarAction } = await import('@/app/actions/avatar');
        return await updateAvatarAction(data);
    }
};
