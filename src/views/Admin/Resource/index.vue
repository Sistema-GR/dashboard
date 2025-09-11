<template>
    <Whiteboard title="Recurso" class="!overflow-visible overflow-y-auto z-40 relative" >


<!-- Header com botão de relatórios -->
        <div class="flex justify-end items-center px-4 sm:px-10 py-4 margin-between-sections gap-3">
          
          <button 
            @click="navigateToAnnualReports" 
            class="bg-[#3459A2] hover:bg-[#2a4a8a] text-white px-4 py-2 rounded-[10px] transition-colors duration-200 flex items-center gap-2 font-medium shadow-md"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
            </svg>
            Relatórios Anuais
          </button>
          <button 
              @click="navigateToVersionManager"
              :disabled="!activeCalculusId"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-[10px] transition-colors duration-200 flex items-center gap-2 font-medium shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
              <!-- Ícone de versionamento (opcional, mas legal) -->
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
              Gerenciar Versões do Cálculo
          </button>
        </div>

        <div class="w-full py-8 pt-2 px-6 sm:px-10">
          <div class="grid grid-cols-1 gap-5 xl:gap-10 lg:grid-cols-2 xl:grid-cols-4">
            <Block 
              title="Aguardando Resposta" 
              :number="countByStatus('aguardando_resposta')" 
              :isActive="selectedStatus === 'aguardando_resposta'"
              :colorKey="STATUS_DEFINITIONS['aguardando_resposta'].colorKey"
              @click="setStatusFilter('aguardando_resposta')" 
            />  
            <Block 
              title="Análise Pendente" 
              :number="countByStatus('analise_pendente')" 
              :isActive="selectedStatus === 'analise_pendente'"
              :colorKey="STATUS_DEFINITIONS['analise_pendente'].colorKey"
              @click="setStatusFilter('analise_pendente')" 
            />
            <Block 
              title="Aguardando Envio" 
              :number="countByStatus('aguardando_envio')" 
              :isActive="selectedStatus === 'aguardando_envio'"
              :colorKey="STATUS_DEFINITIONS['aguardando_envio'].colorKey"
              @click="setStatusFilter('aguardando_envio')" 
            />
            <Block 
              title="Respondido" 
              :number="countByStatus('respondido')" 
              :isActive="selectedStatus === 'respondido'"
              :colorKey="STATUS_DEFINITIONS['respondido'].colorKey"
              @click="setStatusFilter('respondido')" 
            />
          </div>
        </div>

         <div v-if="activeStatusStyle.label" class="w-full">
            <div class="flex items-center justify-center p-4 rounded-t-lg" :class="activeStatusColorClass">
                <p class="text-20 font-bold text-white" :class="activeStatusStyle.textColor">
                    {{ activeStatusStyle.label }}
                </p>
            </div>
        </div>

        <div class="py-5 w-full space-y-4 px-4 sm:px-10">
            <infoCard 
              v-for="recurso in filteredRecursos" 
              :key="recurso.id" 
              :recurso="recurso"
              @status-updated="handleStatusUpdate"              
            />
          <div v-if="!filteredRecursos.length && !isLoading" class="text-center text-gray-500 py-10">
            Nenhum recurso encontrado.
          </div>
          <div v-if="isLoading" class="text-center text-gray-500 py-10">
            Carregando recursos...
          </div>
        </div>
    </Whiteboard>
  </template>
  
<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Block from '@/views/Admin/Resource/components/Block/index.vue'
import infoCard from '@/views/Admin/Resource/components/infoCard/index.vue'
import AnnualReportsDashboard from '@/views/Admin/Resource/AnnualResource/AnnualReportsDashboard.vue'
import { FunnelIcon } from "@heroicons/vue/24/outline";
import axios from 'axios';
import { STATUS_DEFINITIONS } from '@/config/resourceConstants.js';

export default {
    name: "Recurso",
    components: { Whiteboard, Block, infoCard, FunnelIcon, AnnualReportsDashboard },

    setup() {
        const router = useRouter()
        const recursos = ref([])
        const selectedStatus = ref('aguardando_resposta')
        const isLoading = ref(true)
        const activeCalculusId = ref(null)

        async function fetchActiveCalculusInfo() {
            try {
                const response = await axios.get('/csv/calculus/get-active-for-admin/', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                activeCalculusId.value = response.data.calculus_id;
            } catch (error) {
                console.error("Não foi possível obter informações do cálculo ativo:", error);

            }
        }

        async function fetchRecursos() {
            isLoading.value = true;
            try {
                const response = await axios.get('/recursos/admin/todos/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                recursos.value = response.data;
            } catch (error) {
                console.error('Erro ao buscar recursos:', error);
                if (error.response && error.response.status === 403) {
                    alert("Você não tem permissão para visualizar esta página.");
                }
            } finally {
                isLoading.value = false;
            }
        }

        onMounted(() => {
            fetchRecursos();
            fetchActiveCalculusInfo();
        });

        function navigateToVersionManager() {
            if (activeCalculusId.value) {
                router.push({ name: 'versionmanager', params: { id: activeCalculusId.value } });
            } else {
                alert("A informação do cálculo ativo não pôde ser carregada. Não é possível gerenciar versões.");
            }
        }


        const filteredRecursos = computed(() => {
            if (!recursos.value) return [];
            return recursos.value.filter(r => r.status === selectedStatus.value);
        });
        
        const countByStatus = (status) => {
            if (!recursos.value) return 0;
            return recursos.value.filter(r => r.status === status).length;
        };

        function setStatusFilter(status) {
            selectedStatus.value = status;
        }
        
        async function handleStatusUpdate({ recursoId, newStatus }) {
            try {
                const index = recursos.value.findIndex(r => r.id === recursoId);
                if (index === -1) {
                    console.error("Recurso não encontrado na lista local.");
                    return;
                }
                
                const response = await axios.patch(`/recursos/${recursoId}/`, { status: newStatus }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                recursos.value[index] = response.data;
            } catch (error) {
                console.error("Erro ao atualizar o status:", error);
            }
        }

        const navigateToAnnualReports = () => {
            router.push('/admin/recursos/relatorios-anuais')
        }

        const activeStatusStyle = computed(() => {
            return STATUS_DEFINITIONS[selectedStatus.value] || {};
        });
        
        const activeStatusColorClass = computed(() => {
            const colorKey = activeStatusStyle.value.colorKey;
            const colorMap = {
                blue: 'bg-[#6fa3ef]',
                purple: 'bg-[#6668d4]',
                pink: 'bg-[#f16d91]',
                orange: 'bg-[#ff8051]',
                teal: 'bg-[#6cc69d]',
                gray: 'bg-gray-500'
            };
            return colorMap[colorKey] || colorMap['gray'];
        });

        return {
            recursos,
            isLoading,
            selectedStatus,
            filteredRecursos,
            countByStatus,
            setStatusFilter,
            handleStatusUpdate,
            navigateToAnnualReports,
            activeStatusStyle,
            STATUS_DEFINITIONS,
            activeStatusColorClass,
            activeCalculusId,
            navigateToVersionManager,
        }
    },
}
</script>