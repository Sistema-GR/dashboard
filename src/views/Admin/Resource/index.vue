<template>
    <Sidebar :route="'admin'" @update:isSidebarMinimized="handleSidebarMinimized" class="z-50"/>
    <Whiteboard title="Recurso" class="!overflow-visible overflow-y-auto z-40 relative" :isSidebarMinimized="isSidebarMinimized">

        <div class="w-full py-8 px-4 sm:px-10">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
              title="Fora do Prazo" 
              :number="countByStatus('fora_do_prazo')" 
              :isActive="selectedStatus === 'fora_do_prazo'"
              :colorKey="STATUS_DEFINITIONS['fora_do_prazo'].colorKey"
              @click="setStatusFilter('fora_do_prazo')" 
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
import { ref, provide, computed, onMounted } from 'vue'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Block from '@/views/Admin/Resource/components/Block/index.vue'
import infoCard from '@/views/Admin/Resource/components/infoCard/index.vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import { FunnelIcon } from "@heroicons/vue/24/outline";
import axios from 'axios';
import { STATUS_DEFINITIONS } from '@/config/resourceConstants.js';

export default {
    name:"Recurso",
    components: {Whiteboard, Block, infoCard, FunnelIcon, Sidebar},

    setup() {
    const isSidebarMinimized = ref(false)
    const recursos = ref([])
    const selectedStatus = ref('aguardando_resposta')
    const isLoading = ref(true)

    async function fetchRecursos() {
          isLoading.value = true;
          try {
            const response = await axios.get('/recursos/admin/todos/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
              });
                console.log("--- DADOS RECEBIDOS DA API EM Resource.vue ---", response.data);
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

    onMounted(fetchRecursos);

    function handleSidebarMinimized(value) {
        isSidebarMinimized.value = value
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

    provide('isSidebarMinimized', isSidebarMinimized)

    return {
      isSidebarMinimized,
      handleSidebarMinimized,
      recursos,
      isLoading,
      selectedStatus,
      filteredRecursos,
      countByStatus,
      setStatusFilter,
      handleStatusUpdate,
      activeStatusStyle,
      STATUS_DEFINITIONS,
      activeStatusColorClass
    }
  }
}

</script>