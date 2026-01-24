export interface Avatar {
    id: string;
    name: string;
    picture?: string;
    level: number;
    experience: number;
    totalExperience?: number;
    nextLevelExperience: number;
    stamina: number;
    life: number;
    money: number; // BigDecimal in backend, number in JS
    availablePoints: number;
    intelligence: number;
    charisma: number;
    strength: number;
    stealth: number;
    hacking: number;
    work: number;
    focus: 'work' | 'hacking' | 'both';
    active: boolean;
    maxLife?: number;
    maxStamina?: number;
    burnout: number;
    story?: string;
    timeout?: string; // ISO datetime string when timeout expires
    timeoutType?: string; // "HOSPITAL" or "JAIL"
}

export enum GameActionType {
    HACKING = 'hacking',
    WORK = 'work',
    TRAIN = 'training',
    MARKET = 'market',
    HOSPITAL = 'hospital',
    JAIL = 'jail'
}

export interface GameAction {
    id: string;
    type: GameActionType;
    title: string;
    description: string;
    stamina: number;
    money: number;
    moneyVariation: number;
    hp?: number;
    hpVariation?: number;
    xp: number;
    xpVariation: number;
    requiredStrength?: number;
    requiredIntelligence?: number;
    requiredCharisma?: number;
    requiredStealth?: number;
    textFile: string;
    actionImage: string;
    failureChance: number;
    canBeArrested?: boolean;
    lostHpFailure?: number;
    lostHpFailureVariation?: number;
    recommendedMaxLevel?: number;
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
                    nextLevelExperience: 100,
                    life: 100,
                    stamina: 100,
                    money: 500,
                    availablePoints: 0,
                    intelligence: 80,
                    charisma: 25,
                    strength: 10,
                    stealth: 5,
                    hacking: 0,
                    work: 0,
                    focus: 'both',
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
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8080/dirty-code';
        try {
            const token = await api.getToken();
            if (!token) return [];

            const response = await fetch(`${baseUrl}/v1/actions/type/${type}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                console.warn(`Failed to fetch actions of type ${type}: ${response.status}`);
                return [];
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching actions of type ${type}:`, error);
            return [];
        }
    },

    performAction: async (actionId: string, count: number = 1): Promise<{
        success: boolean;
        avatar: Avatar;
        timesExecuted?: number;
        variations?: {
            experience?: number;
            life?: number;
            stamina?: number;
            money?: number;
        }
    }> => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8080/dirty-code';
        try {
            const token = await api.getToken();

            const response = await fetch(`${baseUrl}/v1/actions/${actionId}/perform?times=${count}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Falha ao executar ação.');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Error performing action:', error);
            throw error;
        }
    },
    createAvatar: async (data: any) => {
        const { createAvatarAction } = await import('@/app/actions/avatar');
        return await createAvatarAction(data);
    },
    updateAvatar: async (data: any) => {
        const { updateAvatarAction } = await import('@/app/actions/avatar');
        return await updateAvatarAction(data);
    },
    increaseAttribute: async (attribute: string) => {
        const { increaseAttributeAction } = await import('@/app/actions/avatar');
        return await increaseAttributeAction(attribute);
    },

    getRanking: async (): Promise<Avatar[]> => {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8080/dirty-code';
        try {
            const token = await api.getToken();

            const response = await fetch(`${baseUrl}/v1/avatars/ranking`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch ranking');
            return await response.json();
        } catch (error) {
            console.error('Error fetching ranking:', error);
            return [];
        }
    },

    leaveTimeout: async (): Promise<{ success: boolean; avatar: Avatar; message?: string }> => {
        const { leaveTimeoutAction } = await import('@/app/actions/avatar');
        return await leaveTimeoutAction();
    },

    buyFreedom: async (): Promise<{ success: boolean; avatar: Avatar; message?: string }> => {
        const { buyFreedomAction } = await import('@/app/actions/avatar');
        return await buyFreedomAction();
    },

    checkNameAvailability: async (name: string): Promise<{ available: boolean }> => {
        const { checkAvatarNameAction } = await import('@/app/actions/avatar');
        return await checkAvatarNameAction(name);
    }
};
