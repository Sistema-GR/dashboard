<template>
  <div class="flex flex-row flex-wrap items-center gap-4 w-full px-2 py-2 bg-blue-100" style="min-height:56px;">
    <input
      :value="filters.year"
      @input="updateFilter('year', $event.target.value)"
      placeholder="Ano"
      type="number"
      class="border border-gray-300 rounded-full px-4 py-1 bg-white focus:outline-none min-w-[100px] max-w-[120px] h-8"
    />
    <select
      :value="filters.unidade_atuacao"
      @change="updateFilter('unidade_atuacao', $event.target.value)"
      class="border border-gray-300 rounded-full px-4 py-1 bg-white focus:outline-none min-w-[120px] max-w-[180px] h-8"
    >
      <option value="">Unidade</option>
      <option v-for="unit in availableUnits" :key="unit.id" :value="unit.id">{{ unit.nome }}</option>
    </select>
    <select
      :value="filters.categoria"
      @change="updateFilter('categoria', $event.target.value)"
      class="border border-gray-300 rounded-full px-4 py-1 bg-white focus:outline-none min-w-[120px] max-w-[180px] h-8"
    >
      <option value="">Categoria</option>
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
    <select
      :value="filters.equipe_responsavel"
      @change="updateFilter('equipe_responsavel', $event.target.value)"
      class="border border-gray-300 rounded-full px-4 py-1 bg-white focus:outline-none min-w-[120px] max-w-[180px] h-8"
    >
      <option value="">Equipe</option>
      <option value="UPL">UPL</option>
      <option value="UGP">UGP</option>
      <option value="formacao_juliano">Formação Juliano</option>
      <option value="formacao">Formação</option>
      <option value="formacao_aurea">Formação Áurea</option>
    </select>
    <select
      :value="filters.responsavel"
      @change="updateFilter('responsavel', $event.target.value)"
      class="border border-gray-300 rounded-full px-4 py-1 bg-white focus:outline-none min-w-[120px] max-w-[180px] h-8"
    >
      <option value="">Responsável</option>
      <option v-for="admin in availableAdmins" :key="admin.id" :value="admin.id">
        {{ admin.first_name }} {{ admin.last_name }}
      </option>
    </select>
    <select
      :value="filters.status"
      @change="updateFilter('status', $event.target.value)"
      class="border border-gray-300 rounded-full px-4 py-1 bg-white focus:outline-none min-w-[120px] max-w-[180px] h-8"
    >
      <option value="">Status</option>
      <option value="pendente">Pendente</option>
      <option value="em_analise">Em Análise</option>
      <option value="respondido">Respondido</option>
    </select>
    <select
      :value="filters.conclusao"
      @change="updateFilter('conclusao', $event.target.value)"
      class="border border-gray-300 rounded-full px-4 py-1 bg-white focus:outline-none min-w-[120px] max-w-[180px] h-8"
    >
      <option value="">Conclusão</option>
      <option value="deferido">Deferido</option>
      <option value="indeferido">Indeferido</option>
      <option value="parcialmente_deferido">Parcialmente Deferido</option>
    </select>
    <select
      :value="filters.periodo"
      @change="updateFilter('periodo', $event.target.value)"
      class="border border-gray-300 rounded-full px-4 py-1 bg-white focus:outline-none min-w-[120px] max-w-[180px] h-8"
    >
      <option value="">Período</option>
      <option value="ultimo_mes">Último mês</option>
      <option value="ultimo_trimestre">Último trimestre</option>
      <option value="ultimo_semestre">Último semestre</option>
      <option value="ultimo_ano">Último ano</option>
    </select>
    <div class="flex items-end gap-2 ml-2">
      <button 
        @click="$emit('clear-filters')" 
        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-full transition-colors duration-200 font-medium h-8 min-w-[80px]"
      >
        Limpar
      </button>
      <button 
        @click="$emit('export-data')" 
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full transition-colors duration-200 font-medium h-8 min-w-[80px]"
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