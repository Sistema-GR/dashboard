<template>
  <Whiteboard title="Critérios">
    <!-- Estado de Carregamento -->
    <div v-if="isLoading" class="flex justify-center items-center p-10">
      <p class="text-20 font-semibold">Carregando dados dos critérios...</p>
    </div>

    <!-- Estado de Erro -->
    <div v-else-if="errorMessage" class="flex justify-center items-center p-10 bg-red-100 border border-red-400 rounded-lg">
      <p class="text-20 font-semibold text-red-700">{{ errorMessage }}</p>
    </div>

    <!-- Conteúdo Principal -->
    <div v-else class="flex flex-col w-full p-4 sm:px-10">
      <p class="font-semibold text-20 mb-10 text-center">
        Abaixo estão os dados dos critérios a serem verificados para o recebimento da gratificação.
      </p>
      
      <div class="flex flex-col space-y-6">
        <div class="bg-white shadow-xl rounded-[10px] border border-gray-200 overflow-hidden">
          <div v-for="(criterio, index) in criterios" :key="index" class="flex flex-col border-b last:border-b-0">
            <div class="flex items-center justify-between p-4 relative">
              <div class="flex-1">
                <span class="font-semibold text-15">{{ criterio.label }}</span>
              </div>

              <div class="flex-1">
                <span :class="{'text-red-600 font-semibold': !criterio.isApto, 'text-gray-700': criterio.isApto}" class="text-15">{{ criterio.value }}</span>
              </div>
              
              <div class="flex-1">
                <span :class="{'text-red-600 font-semibold': !criterio.isApto, 'text-green-600 font-semibold': criterio.isApto}" class="text-15">{{ criterio.status }}</span>
              </div>

              <div class="flex-shrink-0 ml-4 relative cursor-pointer" @mouseenter="showTooltip(index)" @mouseleave="hideTooltip">
                <QuestionMarkCircleIcon class="h-6 w-6 text-gray-500 cursor-pointer"/>
                <div v-if="activeTooltip === index" class="absolute top-1/2 left-[-12rem] transform -translate-y-1/2 bg-gray-700 text-white text-15 rounded-[10px] p-2 z-10 w-48 text-center">
                  {{ criterio.tooltip }}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { QuestionMarkCircleIcon } from "@heroicons/vue/24/outline";
import axios from 'axios';
import { getAccessToken } from '@/service/token';

export default {
  name: "CritériosDoUsuario",
  components: { Whiteboard, QuestionMarkCircleIcon },
  data() {
    return {
      criterios: [], // Começa vazio, será populado pela API
      isLoading: true,
      errorMessage: null,
      activeTooltip: null
    }
  },
  created() {
    this.fetchCriteriosData(); 
  },
  methods: {
    async fetchCriteriosData() {
      const targetCpfFromStorage = localStorage.getItem('tempTargetCpf');
      this.isLoading = true;
      this.errorMessage = null;

      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Token de autenticação não encontrado.");

        const fetchYear = await axios.get('/csv/opencalc/active-reference-year/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const referenceYear = fetchYear.data.reference_year;

        let payload = { reference: referenceYear };
        if (targetCpfFromStorage) {
            payload.cpf = targetCpfFromStorage;
        }

        const response = await axios.post('/csv/user-get/', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Processa os dados recebidos e popula os critérios
        if (response.data && response.data.length > 0) {
            this.processApiData(response.data[0]); // Usamos o primeiro registro (matrícula) como referência
        } else {
            throw new Error("Nenhum dado de critério foi encontrado para este usuário.");
        }

      } catch (error) {
        console.error('Erro ao buscar dados dos critérios:', error);
        if (error.response && error.response.data && error.response.data.error) {
          this.errorMessage = error.response.data.error;
        } else {
          this.errorMessage = "Não foi possível carregar os dados. Tente novamente mais tarde.";
        }
      } finally {
        this.isLoading = false;
      }
    },

    processApiData(apiData) {
        const newCriterios = [];
        const dados = apiData.dados;

        const cargo = dados.cargo ? dados.cargo.toLowerCase() : '';
        const restrictedRoles = ['estagiario nivel superior', 'secretario', 'diretor executivo'];
        const isAptoCargo = !restrictedRoles.includes(cargo);

        newCriterios.push({
            label: 'Cargo',
            value: dados.cargo ? dados.cargo.charAt(0).toUpperCase() + dados.cargo.slice(1) : 'Não informado',
            isApto: isAptoCargo,
            status: isAptoCargo ? 'Apto' : 'Não Apto',
            tooltip: 'Cargos como Estagiário, Secretário e Diretor Executivo não são elegíveis para a gratificação.'
        });

        // 1. Critério de Frequência
        if (dados.periodos_frequencia && dados.periodos_frequencia.length > 0) {
            dados.periodos_frequencia.forEach(periodo => {
                newCriterios.push({
                    label: `Frequência (Período ${periodo.numero_periodo})`,
                    value: `${Number(periodo.percentual).toFixed(2)}%`,
                    isApto: periodo.apto,
                    status: periodo.apto ? 'Apto' : 'Não Apto',
                    tooltip: 'A frequência mínima necessária para cada período é de 96%.'
                });
            });
        } else {
            // Fallback para o modelo antigo sem períodos
            const freqPercent = apiData.frequencia[0]?.percentual_frequencia !== undefined ? Number(apiData.frequencia[0].percentual_frequencia) : 100;
            const isAptoFreq = freqPercent >= 96;
            newCriterios.push({
                label: 'Frequência',
                value: `${freqPercent.toFixed(2)}%`,
                isApto: isAptoFreq,
                status: isAptoFreq ? 'Apto' : 'Não Apto',
                tooltip: 'A frequência mínima necessária é de 96%.'
            });
        }

        // 2. Critério de Tempo de Atuação
        const isAptoTempo = dados.tempo_atuacao === true;
        newCriterios.push({
            label: 'Tempo de Atuação',
            value: isAptoTempo ? 'Atua há mais de 6 meses' : 'Não atua há mais de 6 meses',
            isApto: isAptoTempo,
            status: isAptoTempo ? 'Apto' : 'Não Apto',
            tooltip: 'Para ser apto, o servidor deve ter pelo menos 6 meses de atuação na rede.'
        });

        // 3. Critério de Formação
        const isAptoFormacao = dados.formacoes === true;
        newCriterios.push({
            label: 'Formação',
            value: `${dados.percentual_formacao.toFixed(2)}%`,
            isApto: isAptoFormacao,
            status: isAptoFormacao ? 'Apto' : 'Não Apto',
            tooltip: 'O critério de formação deve ser cumprido para ser considerado apto.'
        });

        // 4. Critério de Atividades
        const isAptoAtividades = dados.recebe_atividade === true;
        newCriterios.push({
            label: 'Atividades',
            value: `${dados.percentual_atividade.toFixed(2)}%`,
            isApto: isAptoAtividades,
            status: isAptoAtividades ? 'Apto' : 'Não Apto',
            tooltip: 'O critério de atividades deve ser cumprido para ser considerado apto.'
        });

        this.criterios = newCriterios;
    },
    
    showTooltip(index) {
      this.activeTooltip = index;
    },
    hideTooltip() {
      this.activeTooltip = null;
    }
  }
}
</script>