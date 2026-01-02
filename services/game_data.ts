export type GameAction = {
    id: string;
    title: string;
    description: string;
    energyCost: number; // Positive = consumes, Negative = restores
    moneyReward: number; // Positive = gain, Negative = cost (service)
    risk: number; // 0-100
    reputationReward: number;
    cooldown?: number;
}

export const GAME_ACTIONS: Record<string, GameAction> = {
    // TRABALHAR
    "work-intern": {
        id: "work-intern",
        title: "Estágio não remunerado",
        description: "Você trabalha muito e ganha... experiência.",
        energyCost: 5,
        moneyReward: 0,
        risk: 0,
        reputationReward: 1
    },
    "work-junior": {
        id: "work-junior",
        title: "Dev Júnior Focado",
        description: "Corrigindo bugs que o Senior deixou.",
        energyCost: 15,
        moneyReward: 80,
        risk: 5,
        reputationReward: 2
    },
    "work-freela": {
        id: "work-freela",
        title: "Freelancer Suspeito",
        description: "Cliente quer um clone do Uber por R$ 200.",
        energyCost: 25,
        moneyReward: 200,
        risk: 20,
        reputationReward: 5
    },
    "work-senior": {
        id: "work-senior",
        title: "Senior Architect",
        description: "Mais reuniões do que código.",
        energyCost: 30,
        moneyReward: 500,
        risk: 10,
        reputationReward: 10
    },

    // HACKEAR
    "hack-phishing": {
        id: "hack-phishing",
        title: "Phishing Básico",
        description: "Email do 'Gerente do Banco'. Clássico.",
        energyCost: 10,
        moneyReward: 150,
        risk: 15,
        reputationReward: -2
    },
    "hack-ddos": {
        id: "hack-ddos",
        title: "Ataque DDoS",
        description: "Derrubar o site da padaria rival.",
        energyCost: 35,
        moneyReward: 400,
        risk: 40,
        reputationReward: -5
    },
    "hack-data": {
        id: "hack-data",
        title: "Vazamento de Dados",
        description: "Vender dados de usuários na DeepWeb.",
        energyCost: 50,
        moneyReward: 1500,
        risk: 70,
        reputationReward: -20
    },

    // VIDA NOTURNA (Recuperação)
    "life-coffee": {
        id: "life-coffee",
        title: "Café Preto",
        description: "Combustível de foguete.",
        energyCost: -10, // Restaura 10
        moneyReward: -5, // Custa 5
        risk: 0,
        reputationReward: 0
    },
    "life-energy": {
        id: "life-energy",
        title: "Monster Energy",
        description: "Taquicardia enlatada.",
        energyCost: -30,
        moneyReward: -15,
        risk: 5, // Chance de crash
        reputationReward: 0
    },
    "life-sleep": {
        id: "life-sleep",
        title: "Dormir 8h",
        description: "O que é isso?",
        energyCost: -100,
        moneyReward: 0,
        risk: 0,
        reputationReward: 0
    },

    // EMPREENDER
    "biz-mvp": {
        id: "biz-mvp",
        title: "Lançar MVP",
        description: "Feito com No-Code e orações.",
        energyCost: 50,
        moneyReward: 0,
        risk: 50,
        reputationReward: 20
    },

    // TREINAR
    "train-algo": {
        id: "train-algo",
        title: "Estudar Algoritmos",
        description: "Leetcode Hard até sangrar.",
        energyCost: 20,
        moneyReward: 0,
        risk: 0,
        reputationReward: 2
    },
    "train-framework": {
        id: "train-framework",
        title: "Aprender Framework Novo",
        description: "Mais um JS pra conta.",
        energyCost: 30,
        moneyReward: 0,
        risk: 10, // Chance de burnout mental
        reputationReward: 5
    },
    "train-soft": {
        id: "train-soft",
        title: "Soft Skills",
        description: "Como dizer 'não' para o PM.",
        energyCost: 15,
        moneyReward: 0,
        risk: 0,
        reputationReward: 3
    }
};

export const getActionsByCategory = (category: string) => {
    // Helper simples para filtrar por prefixo
    return Object.values(GAME_ACTIONS).filter(a => a.id.startsWith(category));
};
