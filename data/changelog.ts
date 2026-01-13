export interface ChangelogItem {
    version: string;
    title: string;
    date: string;
    items: string[];
}

export const CHANGELOG_DATA: ChangelogItem[] = [
    {
        version: "0.2.0",
        title: "Batch actions e melhorias em user e action cards",
        date: "11/01/2026",
        items: [
            "Distribuição de pontos: Agora pode ser feita via user card.",
            "Actions: Adicionadas várias novas actions.",
            "Actions em batch: Adicionada a possibilidade e perfomar actions em batchs.",
            "Formula de exp: Adicionada nova formula de calculo de exp de forma que tenha uma curva mais gradual.",
            "Titulos: Adicionados titulos relacionados ao level, titulos levam em consideração actions performadas pelo usuario."
        ]
    },
    {
        version: "0.1.3",
        title: "Sistema de Timeouts: Hospital & Prisão",
        date: "10/01/2026",
        items: [
            "Level up: Agora nosso sistema de respeito/experiência funciona!",
            "Hospital: Implementado sistema de internação quando HP chega a zero.",
            "Prisão: Nova página de Prisão! Ações ilegais agora podem te mandar pra cadeia.",
            "Comprar Liberdade: Pague para sair do hospital ou prisão antes do tempo.",
            "Lock Inteligente: Não consegue realizar ações enquanto estiver no hospital ou prisão."
        ]
    },
    {
        version: "0.1.2",
        title: "Ranking & Notícias",
        date: "08/01/2026",
        items: [
            "Ranking Global: Veja quem são os 10 maiores criminosos.",
            "Notícias, implementação da aba de notícias, esta que você está vendo.",
            "Correções de bugs e melhorias de performance."
        ]
    },
    {
        version: "0.1.1",
        title: "Primeiros Passos",
        date: "07/01/2026",
        items: [
            "Melhorias no Helldit, nosso local de comunicação do jogo. [Valeu Filipe!]",
            "Inicio do sistema de Ações do Avatar."
        ]
    },
    {
        version: "0.1.0",
        title: "O Início",
        date: "04/01/2026",
        items: [
            "Lançamento da versão Alpha.",
            "Estrutura base do projeto.",
            "Configuração do ambiente de desenvolvimento.",
            "Sistema de Login com Google.",
            "Criação de Avatar.",
            "TopBar responsiva.",
        ]
    }
];

export const CURRENT_VERSION = CHANGELOG_DATA[0].version;
