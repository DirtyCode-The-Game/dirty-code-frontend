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
    temporaryStrength?: number;
    temporaryIntelligence?: number;
    temporaryCharisma?: number;
    temporaryStealth?: number;
    statusCooldown?: string;
    hacking: number;
    work: number;
    focus: 'work' | 'hacking' | 'both';
    active: boolean;
    story?: string;
    timeout?: string; // ISO datetime string when timeout expires
    timeoutType?: string; // "HOSPITAL" or "JAIL"
    timeoutCost?: number; // Cost to buy freedom from timeout
    wantedLevel?: number; // 0 to 100
    drStrangeVisible?: boolean;
    actionPurchases?: AvatarActionPurchase[];
}

export interface AvatarActionPurchase {
    actionId: string;
    purchaseCount: number;
    currentPrice: number;
}

export enum GameActionType {
    HACKING = 'HACKING',
    WORK = 'WORK',
    TRAINING = 'TRAINING',
    MARKET = 'MARKET',
    STORE = 'STORE',
    HOSPITAL = 'HOSPITAL',
    JAIL = 'JAIL',
    SPECIAL_STATUS_SELLER = 'SPECIAL_STATUS_SELLER'
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
    temporaryStrength?: number;
    temporaryIntelligence?: number;
    temporaryCharisma?: number;
    temporaryStealth?: number;
    actionCooldown?: string;
    specialAction?: string;
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
                    wantedLevel: 60,
                    drStrangeVisible: true,
                },
            },
        };
    },

    _tokenCache: null as string | null,
    _tokenExpiry: 0,

    getToken: async (): Promise<string | null> => {
        const now = Date.now();
        if (api._tokenCache && now < api._tokenExpiry) {
            return api._tokenCache;
        }

        try {
            const tokenRes = await fetch('/api/auth/token');
            if (tokenRes.status === 403) {
              window.location.href = '/';
              return null;
            }
            if (!tokenRes.ok) return null;
            const { token } = await tokenRes.json();
            
            api._tokenCache = token;
            api._tokenExpiry = now + 50 * 1000; // Cache por 50 segundos (tokens costumam durar 60s)
            
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
            if (response.status === 403 || response.status === 500) {
              window.location.href = '/';
              return [];
            }
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

            if (response.status === 403 || response.status === 500) {
              window.location.href = '/';
              throw new Error('Sessão expirada');
            }
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
            if (response.status === 403 || response.status === 500) {
              window.location.href = '/';
              throw new Error('Sessão expirada');
            }
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
