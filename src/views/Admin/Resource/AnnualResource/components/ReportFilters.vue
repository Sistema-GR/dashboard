<template>
  <div class="flex flex-wrap gap-4 px-4 sm:px-10 py-6 bg-gray-50 rounded-[10px] mx-4 sm:mx-10 mb-6">
    <TextInput
      :modelValue="filters.year"
      @update:modelValue="updateFilter('year', $event)"
      placeholder="2025"
      label="Ano"
      labelClass="text-gray-700"
      containerClassName="min-w-[150px]"
      type="number"
    />
    
    <div class="flex flex-col gap-2 min-w-[200px]">
      <label class="text-gray-700">Unidade de Atuação</label>
      <select 
        :value="filters.unidade_atuacao" 
        @change="updateFilter('unidade_atuacao', $event.target.value)"
        class="border border-gray-300 rounded-[10px] px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todas as unidades</option>
        <option v-for="unit in availableUnits" :key="unit.id" :value="unit.id">{{ unit.nome }}</option>
      </select>
    </div>
    
    <div class="flex flex-col gap-2 min-w-[200px]">
      <label class="text-gray-700">Categoria</label>
      <select 
        :value="filters.categoria" 
        @change="updateFilter('categoria', $event.target.value)"
        class="border border-gray-300 rounded-[10px] px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todas as categorias</option>
        <option value="formacao">Formação</option>
        <option value="discordancia_regras">Discordância das regras estabelecidas</option>
        <option value="faltas">Faltas</option>
        <option value="tempo_atuacao">Tempo de atuação</option>
        <option value="mais_criterios">Mais de um critério</option>
        <option value="esclarecimento">Esclarecimento</option>
        <option value="pagamento_indevido">Pagamento indevido</option>
        <option value="grupo">Grupo</option>
        <option value="atividades">Atividades</option>
        <option value="alega_atuacao_outra_etapa">Alega atuação em outra etapa</option>
      </select>
    </div>

    <div class="flex flex-col gap-2 min-w-[200px]">
      <label class="text-gray-700">Equipe Responsável</label>
      <select 
        :value="filters.equipe_responsavel" 
        @change="updateFilter('equipe_responsavel', $event.target.value)"
        class="border border-gray-300 rounded-[10px] px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todas as equipes</option>
        <option value="UPL">UPL</option>
        <option value="UGP">UGP</option>
        <option value="formacao_juliano">Formação Juliano</option>
        <option value="formacao">Formação</option>
        <option value="formacao_aurea">Formação Áurea</option>
      </select>
    </div>

    <div class="flex flex-col gap-2 min-w-[200px]">
      <label class="text-gray-700">Responsável</label>
      <select 
        :value="filters.responsavel" 
        @change="updateFilter('responsavel', $event.target.value)"
        class="border border-gray-300 rounded-[10px] px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos os responsáveis</option>
        <option v-for="admin in availableAdmins" :key="admin.id" :value="admin.id">
          {{ admin.first_name }} {{ admin.last_name }}
        </option>
      </select>
    </div>

    <div class="flex flex-col gap-2 min-w-[200px]">
      <label class="text-gray-700">Status</label>
      <select 
        :value="filters.status" 
        @change="updateFilter('status', $event.target.value)"
        class="border border-gray-300 rounded-[10px] px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos os status</option>
        <option value="pendente">Pendente</option>
        <option value="em_analise">Em Análise</option>
        <option value="respondido">Respondido</option>
      </select>
    </div>

    <div class="flex flex-col gap-2 min-w-[200px]">
      <label class="text-gray-700">Conclusão</label>
      <select 
        :value="filters.conclusao" 
        @change="updateFilter('conclusao', $event.target.value)"
        class="border border-gray-300 rounded-[10px] px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todas as conclusões</option>
        <option value="deferido">Deferido</option>
        <option value="indeferido">Indeferido</option>
        <option value="parcialmente_deferido">Parcialmente Deferido</option>
      </select>
    </div>

    <div class="flex flex-col gap-2 min-w-[200px]">
      <label class="text-gray-700">Período</label>
      <select 
        :value="filters.periodo" 
        @change="updateFilter('periodo', $event.target.value)"
        class="border border-gray-300 rounded-[10px] px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todo o período</option>
        <option value="ultimo_mes">Último mês</option>
        <option value="ultimo_trimestre">Último trimestre</option>
        <option value="ultimo_semestre">Último semestre</option>
        <option value="ultimo_ano">Último ano</option>
      </select>
    </div>

    <div class="flex items-end gap-2">
      <button 
        @click="$emit('clear-filters')" 
        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-[10px] transition-colors duration-200 font-medium"
      >
        Limpar Filtros
      </button>
      <button 
        @click="$emit('export-data')" 
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-[10px] transition-colors duration-200 font-medium"
      >
        Exportar
      </button>
    </div>
  </div>
</template>

<script>
import TextInput from '@/components/Inputs/TextInput.vue'

export default {
  name: 'ReportFilters',
  components: { TextInput },
  props: {
    filters: {
      type: Object,
      required: true
    },
    availableUnits: {
      type: Array,
      default: () => []
    },
    availableAdmins: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:filters', 'filter-change', 'clear-filters', 'export-data'],
  methods: {
    updateFilter(key, value) {
      const updatedFilters = { ...this.filters, [key]: value }
      this.$emit('update:filters', updatedFilters)
      this.$emit('filter-change')
    }
  }
}
</script>