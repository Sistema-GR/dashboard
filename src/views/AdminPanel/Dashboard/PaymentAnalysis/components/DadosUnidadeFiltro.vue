<template>
  <div class="flex flex-row flex-reversewrap justify-center items-center gap-4 px-10 w-full py-2 bg-blue-100" style="min-height:56px;">
    <select
      :value="filters.motivo"
      @change="updateFilter('motivo', $event.target.value)"
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    >
      <option value="">Motivo de não recebimento</option>
      <option value="recebe">Recebe</option>
      <option value="frequencia">Frequência</option>
      <option value="tempo_atuacao">Tempo de atuação</option>
      <option value="mais_criterio_individual">Mais de 1 critério individual</option>
      <option value="estagiario">Estagiário</option>
      <option value="nao_recebe_valor_total">Não recebe valor total por mais de 1 critério individual</option>
      <option value="formacao">Formação</option>
      <option value="atividades">Atividades</option>
      <option value="null">null</option>
    </select>
    
    <select
      :value="filters.unidade"
      @change="updateFilter('unidade', $event.target.value)"
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    >
      <option value="">Nome unidade</option>
      <option v-for="unit in availableUnits" :key="unit.id" :value="unit.id">{{ unit.nome }}</option>
    </select>
    
    <select
      :value="filters.situacao"
      @change="updateFilter('situacao', $event.target.value)"
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    >
      <option value="">Situação</option>
      <option value="null">null</option>
      <option value="ativo">Ativo</option>
      <option value="inativo">Inativo</option>
    </select>
    
    <select
      :value="filters.grupoGR"
      @change="updateFilter('grupoGR', $event.target.value)"
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    >
      <option value="">Grupos GR</option>
      <option value="-">-</option>
      <option value="grupo_i">Grupo I</option>
      <option value="grupo_ii">Grupo II</option>
      <option value="grupo_iii">Grupo III</option>
      <option value="grupo_iv">Grupo IV</option>
      <option value="grupo_v">Grupo V</option>
    </select>
    
    <select
      :value="filters.grupoRefATP"
      @change="updateFilter('grupoRefATP', $event.target.value)"
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    >
      <option value="">Grupo de ref/ATPs</option>
      <option value="null">null</option>
      <option value="claudia">Claudia</option>
      <option value="leila">Leila</option>
      <option value="marcelo">Marcelo</option>
      <option value="nara">Nara</option>
      <option value="r1">R1</option>
      <option value="u1">U1</option>
      <option value="u2">U2</option>
      <option value="u3">U3</option>
      <option value="u4">U4</option>
      <option value="u5">U5</option>
      <option value="u6">U6</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'DadosUnidadeFiltro',
  props: {
    filters: {
      type: Object,
      required: true
    },
    availableUnits: {
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