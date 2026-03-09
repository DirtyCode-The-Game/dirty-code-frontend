export interface ChangelogItem {
    version: string;
    title: string;
    date: string;
    items: string[];
}

export const CHANGELOG_DATA: ChangelogItem[] = [
    {
        version: "0.3.0",
        title: "Configuração inicial do PWA e adição de 8 novas atividades.",
        date: "31/01/2026",
        items: [
            "Working: 4 novas atividades para execução entre nivel 20 e 30~.",
            "Hacking: 4 novas atividades para execução entre nivel 20 e 30~.",
            "FrontEnd: Configuração inicial do PWA.",
        ]
    },
    {
        version: "0.2.9",
        title: "Conversão de imagens para WEBP e redução drastica de chamadas entre back e front.",
        date: "31/01/2026",
        items: [
            "Bugfix: Redução drastica de chamadas entre back e front.",
            "Bugfix: Ajustadas ações com presos variaveis para exibir os preços corretamente.",
            "FrontEnd: Conversão de todas imagens para WEBP.",
            "Dr. Hoo Lee Sheet: Ajustado bug que não calculava a chance de falha das seringas" +
            "Dr. Hoo Lee Sheet: Redução do custo base das seringas para 100000.",
            "Backend/FrontEnd: Simplificação do cálculo de preços dinâmicos, agora feito exclusivamente no backend.",
            "Backend/FrontEnd: Otimização da execução de ações para retornar e atualizar o valor da ação em tempo real via 'variations', eliminando necessidade de recarregar a lista."
        ]
    },
    {
        version: "0.2.8",
        title: "Sistema de 'PROCURADO' e melhorias visuais.",
        date: "30/01/2026",
        items: [
            "GameMechanic: Implementado o conceito de 'PROCURADO', representado por estrelas acima do saldo do jogador.",
            "UI: Adicionado componente WantedStars para exibição visual do nível de procurado (1-5 estrelas).",
            "UI: Integração do sistema de estrelas no UserProfileCard.",
            "UI: Ajustado posicionamento das estrelas de procurado para não afetar o alinhamento central do dinheiro.",
            "API: Renomeado \`wanted\` para \`wantedLevel\` (0-100) na interface Avatar para compatibilidade com backend real.",
            "Backend: Adicionado \`wantedLevel\` (0-100) no model Avatar, DTO AvatarResponseDTO e migração DB (V3).",
            "GameMechanic: Removido cálculo frontend de freedomCost (500*level); agora usa timeoutCost do backend em Avatar. Backend: Adicionado campo/migração V4__add_timeout_cost_to_avatar.sql e mapeamento em AvatarResponseDTO.",
            "UX: Acordeões (Work, Hacking, Training): agora usuário pode minimizar todos quando não locked pelo nível, persistindo estado fechado.",
            "UX: JailPage agora exibe ações JAIL mesmo quando o usuário não está preso (para reduzir wantedLevel voluntariamente).",
            "GameMechanic: Nova ação JAIL 'Trabalho Voluntário': custa 5% respeito total + 50 HP, recompensa -50 wantedLevel.",
            "UX: JailPage agora permite executar ações JAIL durante detenção (Trabalho Voluntário visível).",
            "Backend: Migração DB V5 + lógica special em performAction + timeout conditional permite ações locais durante timeout.",
            "Security: Alterado redirect automático de 403 de '/logout' para '/' (root), pois rota /logout não existe.",
            "UI: Exibição explícita de '-5% Respeito' no card da ação 'Trabalho Voluntário' para melhor clareza.",
            "UI: Reaproveitada a correção que remove o highlight/borda branca ao abrir a modal de onboarding (focus:outline-none).",
            "Conteúdo: Adicionados textos de sucesso irônicos para a ação 'Trabalho Voluntário' (limpeza de pracinha sob supervisão policial).",
            "UX: Melhoria na imersão do sistema de ações da prisão."
        ]
    },
    {
        version: "0.2.7",
        title: "Novas tarefas e melhorias de UX.",
        date: "29/01/2026",
        items: [
            "GameMechanic: Adicionadas novas ações e tarefas em diversas categorias.",
            "UX: Implementada persistência do estado dos acordeões (Work, Hacking, Training) via cookies.",
            "UX: Restrição de nível para abertura de abas de atividades, garantindo progressão lógica.",
            "UX: Notificação visual (ponto pulsante) no Helldit quando há novas mensagens não lidas.",
            "Security: Limpeza completa de dados locais (localStorage e cookies) ao realizar logout.",
            "UI: Refinamentos visuais na OnboardingModal e remoção de artefatos gráficos.",
            "UI: Destaque visual aprimorado para a seleção de avatar no onboarding.",
            "Code: Centralização da lógica de títulos e foco do avatar em utilitários globais.",
            "Cleanup: Remoção de comentários redundantes e limpeza geral do código-fonte.",
            "UX: Garantia de que dados locais 'morram' automaticamente após um período de inatividade, aumentando a segurança em dispositivos compartilhados.",
            "UI: Adicionados indicadores de carregamento (Spinner) em todas as páginas de atividades (Work, Hacking, Training, Market, Pichow, Hospital, Jail).",
            "UX: Implementadas mensagens de carregamento personalizadas e bem-humoradas para melhorar a experiência do usuário durante a espera.",
            "UI: Padronização das cores dos Spinners de acordo com a temática de cada página."
        ]
    },
    {
        version: "0.2.6",
        title: "Reformulação do onboarding e pequenas melhorias.",
        date: "29/01/2026",
        items: [
            "UX: Onboarding se tornou uma modal e não uma pagina a parte, tornando a transação entre criar personagem e jogar mais suave.",
            "UI: Adicionando loading na execução das tarefas.",
            "UI: Removido o refresh de pagina ao sair da prisão/hospital.",
            "Dr. Hoo Lee Sheet: Não aparece mais para quem esta internado no hospital.",
            "UI: Os valores de recompensa e custo exibidos nos cards de ação agora se ajustam automaticamente ao limite máximo que o avatar pode executar (baseado em Stamina e Dinheiro), caso o valor do batch seja superior.",
        ]
    },{
        version: "0.2.5",
        title: "Novo Sistema: Dr. Hoo Lee Sheet",
        date: "28/01/2026",
        items: [
            "Dr. Hoo Lee Sheet: Implementada lógica de visibilidade (10% de chance) controlada pelo backend com recálculo a cada 10 minutos.",
            "Dr. Hoo Lee Sheet: Implementados preços dinâmicos que aumentam 50% a cada compra, com persistência individual por avatar.",
            "Dr. Hoo Lee Sheet: Adicionado novo componente DrStrange.tsx com movimento aleatório e opção de fixar posição.",
        ]
    },
    {
        version: "0.2.4",
        title: "Bugfixes e ajustes na UI.",
        date: "27/01/2026",
        items: [
            "UI: Redução de 15% no tamanho vertical do card do usuário (UserProfileCard) para melhor aproveitamento de tela.",
            "UI: Ajuste de paddings, gaps e tamanhos de ícones/avatares para um layout mais compacto.",
            "UI: Redução significativa do espaço entre a barra superior (Topbar) e o card do usuário.",
            "UI: Redução do espaço entre o card do usuário e o conteúdo das tarefas.",
            "UI: Adicionando os valores dos batchs nos cookies.",
            "UX: O menu de navegação lateral/inferior agora é fixo (sticky) junto com o card do usuário, facilitando a navegação em páginas longas.",
            "Layout: Otimização de containers e espaçamentos no dashboard principal.",
            "Bugfix: Corrigida impossibilidade de usar a tecla de espaço e selecionar texto nos inputs de onboarding.",
            "Infra: Atualização do HeroUI para a versão 2.8.7.",
            "Bugfix: Melhoria na estabilidade dos componentes de UI.",
            "UI: Removido o contorno (focus ring) branco indesejado nos campos de entrada (Input e Textarea) ao focar.",
            "UI: Ajustado seletor de quantidade de ações (batch field) para aceitar valores entre 0 e 99 em todas as abas.",
            "UX: A página agora volta para o topo automaticamente ao trocar de aba no dashboard."
        ]
    },
    {
        version: "0.2.3",
        title: "Pequenos ajustes de UI, rework completo da aba de treinamentos.",
        date: "24/01/2026",
        items: [
            "GameMechanic: Rework completo da aba de treinamentos.",
            "GameMechanic: Adicionados atributos temporários.",
            "UI: Aplicada mascara de valor em todas as exibições de dinheiro do sistema.",
            "UI: Adicionada exibição de ganhos de status temporários na aba de treinamento.",
            "UI: Adicionadas mais imagens para o usuario. Valeu @orafael93.",
            "UI: Adicionando loja de itens 'pichow'.",
        ]
    },
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
