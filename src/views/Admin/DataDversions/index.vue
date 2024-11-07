<template>
    <Whiteboard title="Painel do Usuário" :isSidebarMinimized="isSidebarMinimized">
        <div class="flex w-full p-2">
            <h1 class="">Selecione a versão que será exibida no painel para todos os usuários</h1>
        </div>
        <div class="flex flex-col py-0 space-x-4 p-2 w-full pb-10 lg:flex-row">
            <!-- Coluna Cálculo a Ativar -->
            <div class="flex flex-col w-full items-center px-10">
                <h2 class="font-semibold text-lg mb-2 border-b-2 w-full text-center my-2 leading-10">Cálculo</h2>
                <div 
                    v-for="(versao, index) in versoesCalculo" 
                    :key="index"
                    class="flex flex-col w-full border-2 mt-3 rounded-md shadow-sm p-3 hover:bg-gray-100 hover:transition-all hover:duration-200"
                >
                    <div class="flex w-full justify-between">
                        <p>{{ versao.nome }}</p>
                        <Toggle 
                            class="scale-75"
                            :modelValue="versao.ativa" 
                            @update:modelValue="() => handleToggle('calculo', index)" 
                        />
                    </div>
                    <div class="flex w-full justify-between mt-1">
                        <p class="text-gray-400">{{ versao.descricao }}</p>
                        <p class="text-gray-900">{{ versao.data }}</p>
                    </div>
                </div>
            </div>

            <div class="border"></div>

            <!-- Coluna Recurso a Ativar -->
            <div class="flex flex-col w-full items-center px-10">
                <h2 class="font-semibold text-lg mb-2 border-b-2 w-full text-center my-2 leading-10">Recurso</h2>
                <div 
                    v-for="(versao, index) in versoesRecurso" 
                    :key="index"
                    class="flex flex-col w-full border-2 mt-3 rounded-md shadow-sm p-3 hover:bg-gray-100 hover:transition-all hover:duration-200"
                >
                    <div class="flex w-full justify-between">
                        <p>{{ versao.nome }}</p>
                        <Toggle 
                            class="scale-75"
                            :modelValue="versao.ativa" 
                            @update:modelValue="() => handleToggle('recurso', index)" 
                        />
                    </div>
                    <div class="flex w-full mt-1 gap-1">
                       <FolderIcon class="w-5 h-auto stroke-gray-400" />
                       <p class="text-gray-400">{{ versao.nome }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Confirmação -->
        <div v-if="showConfirmation" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div class="bg-white p-5 rounded-md shadow-lg max-w-sm w-full text-center">
                <h3 class="text-lg font-semibold mb-4">Deseja realmente alterar a versão ativa?</h3>
                <div class="flex justify-around">
                    <button @click="confirmToggle" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Sim</button>
                    <button @click="cancelToggle" class="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Não</button>
                </div>
            </div>
        </div>

        
    </Whiteboard>
</template>

<script>
import { inject, ref } from 'vue';
import { FolderIcon } from "@heroicons/vue/24/outline";
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Toggle from '@/components/Toggle/Toggle.vue';

export default {
    name: "Ativos",
    components: { Whiteboard, Toggle, FolderIcon },
    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized');
        
        const versoesCalculo = ref([
            { nome: 'Primeira Versão', descricao: 'Descrição: primeira versão realizada em 2024', data: '01/06/2024', ativa: false },
            { nome: 'Segunda Versão', descricao: 'Descrição: segunda versão realizada em 2024', data: '01/07/2024', ativa: false },
            { nome: 'Terceira Versão', descricao: 'Descrição: terceira versão realizada em 2024', data: '01/08/2024', ativa: false },
            { nome: 'Quarta Versão', descricao: 'Descrição: quarta versão realizada em 2024', data: '01/09/2024', ativa: false }
        ]);

        const versoesRecurso = ref([
            { nome: 'Recurso 1', descricao: 'Primeira Versão', ativa: false },
            { nome: 'Recurso 2', descricao: 'Segunda Versão', ativa: false }
        ]);

        const showConfirmation = ref(false);
        const pendingVersion = ref({ type: null, index: null });

        const handleToggle = (type, index) => {
            const versoes = type === 'calculo' ? versoesCalculo : versoesRecurso;
            if (!versoes.value[index].ativa) {
                pendingVersion.value = { type, index };
                showConfirmation.value = true;
            }
        };

        const confirmToggle = () => {
            const { type, index } = pendingVersion.value;
            const versoes = type === 'calculo' ? versoesCalculo : versoesRecurso;

            // Desativa todas as versões do mesmo tipo
            versoes.value.forEach((v, i) => v.ativa = i === index);

            showConfirmation.value = false;
        };

        const cancelToggle = () => {
            showConfirmation.value = false;
            pendingVersion.value = { type: null, index: null };
        };

        return {
            isSidebarMinimized,
            versoesCalculo,
            versoesRecurso,
            showConfirmation,
            handleToggle,
            confirmToggle,
            cancelToggle,
        };
    },
};
</script>
