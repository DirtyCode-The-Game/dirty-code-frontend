export interface ChangelogItem {
    version: string;
    title: string;
    date: string;
    items: string[];
}

export const CHANGELOG_DATA: ChangelogItem[] = [
    {
        version: "0.2.2",
        title: "Social & Risco: Evolução do Helldit e Refinamento de UI",
        date: "18/01/2026",
        items: [
            "Helldit: Adicionado seletor de emojis para maior expressividade nas comunicações.",
            "Helldit: Suporte completo para interpretação de caracteres Unicode (emojis) nas mensagens.",
            "Helldit: Corrigida conversão de '<3' para emoji de coração.",
            "Helldit: Divisores de data automáticos para melhor organização das mensagens.",
            "Helldit: Formatação amigável de datas (Hoje, Ontem).",
            "API de Avatares: Novo endpoint para consulta de dados públicos.",
            "Correção de Bug: Resolvido loop de redirecionamento no onboarding.",
            "Estabilização: Melhorias na sincronização de estado e cookies.",
            "Perfis em Tooltip: Visualize informações dos hackers apenas passando o mouse no chat.",
            "Sistema de Risco: Ações com mais de 50% de chance de falha agora possuem punições triplicadas (HP e Tempo de Prisão).",
            "UI: Adicionado feedback visual (alerta 'Punição 3x') e tooltips para ações de alto risco.",
            "UI: Cards de ação agora exibem explicitamente as punições em caso de falha (HP e Tempo de Prisão).",
            "UI: Adicionada exibição de custos/ganhos de HP direto no card (ex: cafés do mercadinho).",
            "UI: Valores que possuem variação randômica agora exibem o símbolo '≈' para indicar que são aproximados.",
            "Backend: Implementada validação centralizada de HP. Qualquer ação que resulte em vida <= 0 envia o avatar automaticamente para o hospital.",
            "Novas Ações: Adicionada a ação 'Suporte do Banco (Áudio)' (Hacking).",
            "Novas Ações: Adicionada a ação 'Sultão da Turquia' (Hacking).",
            "Novas Ações: Adicionada a ação 'Pitbrad do Caralivro' (Hacking).",
        ]
    },
    {
        version: "0.2.1",
        title: "Experiência Aprimorada: Batch Actions, Helldit Persistente e Nova UI",
        date: "17/01/2026",
        items: [
            "Cache de abas: Implementação do sistema de cache no GameContext para tornar a navegação entre as páginas de ações instantânea e as atualizações transparentes.",
            "Batch Actions: Suporte a execução parcial de ações. Se a stamina ou o dinheiro acabar durante um lote, o jogo executa até o limite disponível.",
            "Batch Actions: Isolamento do seletor de quantidade por aba/categoria, mantendo o valor ao navegar entre elas.",
            "Batch Actions: Removido seletor de quantidade na página de Prisão por não haver ações executáveis no local.",
            "Validação de Dinheiro: Agora as ações verificam se você tem saldo antes de tentar executá-las.",
            "Feedback de Erro: Melhorias nas mensagens de erro ao comprar liberdade no hospital e prisão.",
            "Helldit: Helldit agora pode ser utilizado mesmo quando o usuário estiver preso ou no hospital.",
            "Helldit: Conexão persistente para mensagens instantâneas sem tempo de carregamento ao trocar de abas.",
            "UI/UX: Ajustado layout dos cards de menu para exibir ícones ao lado dos títulos, melhorando o aproveitamento de espaço.",
            "Onboarding: Adicionada validação de nome de usuário com mensagens satíricas caso o nome já esteja em uso.",
            "Backend: Implementado endpoint de verificação de disponibilidade de nome de avatar.",
            "Simulação: Adição de 5 avatares simulados (bots) com níveis variados para popular o ranking inicial no ambiente local."
        ]
    },
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
