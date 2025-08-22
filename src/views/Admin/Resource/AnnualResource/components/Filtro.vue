<template>
  <div class="flex flex-row flex-wrap justify-center items-center gap-4 px-10 w-full py-2 bg-blue-100" style="min-height:56px;">
    <!-- <input
      :value="filters.year"
      @input="updateFilter('year', $event.target.value)"
      placeholder="Ano"
      type="number"
      class="border border-gray-300 rounded-[10px] px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    /> -->
    <select
      :value="filters.unidade_atuacao"
      @change="updateFilter('unidade_atuacao', $event.target.value)"
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    >
      <option value="">Unidade de atuação</option>
      <option v-for="unit in availableUnits" :key="unit.id" :value="unit.id">{{ unit.nome }}</option>
    </select>
    <select
      :value="filters.categoria"
      @change="updateFilter('categoria', $event.target.value)"
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
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
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    >
      <option value="">Equipe Responsável</option>
      <option value="UPL">UPL</option>
      <option value="UGP">UGP</option>
      <option value="formacao_juliano">Formação Juliano</option>
      <option value="formacao">Formação</option>
      <option value="formacao_aurea">Formação Áurea</option>
    </select>
    <select
      :value="filters.responsavel"
      @change="updateFilter('responsavel', $event.target.value)"
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    >
      <option value="">Responsável</option>
      <option v-for="admin in availableAdmins" :key="admin.id" :value="admin.id">
        {{ admin.first_name }} {{ admin.last_name }}
      </option>
    </select>
    <select
      :value="filters.conclusao"
      @change="updateFilter('conclusao', $event.target.value)"
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    >
      <option value="">Conclusão</option>
      <option value="deferido">Deferido</option>
      <option value="indeferido">Indeferido</option>
      <option value="parcialmente_deferido">Parcialmente Deferido</option>
    </select>
  </div>
</template>

<script>
import TextInput from '@/components/Inputs/TextInput.vue'

export default {
  name: 'Filtro',
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