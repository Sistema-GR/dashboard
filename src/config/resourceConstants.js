export const MOTIVOS_RECURSO = [
    { 
        text: "Falta", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600",
        svgClass: "h-1.5 w-1.5 fill-gray-400"
    },
    { 
        text: "Formação", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700",
        svgClass: "h-1.5 w-1.5 fill-red-500"
    },
    { 
        text: "Impostos", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800",
        svgClass: "h-1.5 w-1.5 fill-yellow-500"
    },
    { 
        text: "Mudança de matrícula/Unidade", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700",
        svgClass: "h-1.5 w-1.5 fill-green-500"
    },
    { 
        text: "Carga horária", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700",
        svgClass: "h-1.5 w-1.5 fill-blue-500"
    },
    { 
        text: "Grupo", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700",
        svgClass: "h-1.5 w-1.5 fill-indigo-500"
    },
    { 
        text: "Tempo de atuação", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700",
        svgClass: "h-1.5 w-1.5 fill-purple-500"
    },
    { 
        text: "Esclarecimento", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700",
        svgClass: "h-1.5 w-1.5 fill-pink-500"
    },
    { 
        text: "Discordância", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600",
        svgClass: "h-1.5 w-1.5 fill-gray-400"
    },
    { 
        text: "Pagamento Indevido", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700",
        svgClass: "h-1.5 w-1.5 fill-red-500"
    },
    { 
        text: "Local", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800",
        svgClass: "h-1.5 w-1.5 fill-yellow-500"
    },
    { 
        text: "Alega atuação em outra etapa", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700",
        svgClass: "h-1.5 w-1.5 fill-green-500"
    },
    { 
        text: "Atividades", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700",
        svgClass: "h-1.5 w-1.5 fill-blue-500"
    },
    { 
        text: "Mais de um critério", 
        badgeClass: "inline-flex items-center gap-x-1.5 rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700",
        svgClass: "h-1.5 w-1.5 fill-indigo-500"
    }
];

export const DEFAULT_MOTIVO = MOTIVOS_RECURSO[0];

export const STATUS_DEFINITIONS = {
    'aguardando_envio': {
        label: 'Aguardando Envio',
        colorKey: 'blue',
    },
    'analise_pendente': {
        label: 'Análise Pendente',
        colorKey: 'purple',
    },
    'aguardando_resposta': {
        label: 'Aguardando Resposta',
        colorKey: 'pink',
    },
    'respondido': {
        label: 'Respondido',
        colorKey: 'orange',
    },
};
