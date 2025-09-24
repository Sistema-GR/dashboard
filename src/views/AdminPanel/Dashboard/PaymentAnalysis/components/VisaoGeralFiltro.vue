<template>
  <div class="flex flex-row justify-center items-center gap-4 px-10 w-full py-2 bg-blue-100">
    <select
      :value="filters.situacao"
      @change="updateFilter('situacao', $event.target.value)"
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    >
      <option value="">Situação</option>
      <option value="ativo">Ativo</option>
      <option value="inativo">Inativo</option>
    </select>
    
    <select
      :value="filters.faixaPagamento"
      @change="updateFilter('faixaPagamento', $event.target.value)"
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    >
      <option value="">Faixas de Pagamento</option>
      <option value="nao_recebe">Não recebe nada</option>
      <option value="ate_1000">Até R$ 1.000</option>
      <option value="1000_2000">De R$ 1.000 a R$ 2.000</option>
      <option value="2000_4000">De R$ 2.000 a R$ 4.000</option>
      <option value="4000_6000">De R$ 4.000 a R$ 6.000</option>
      <option value="mais_6000">Mais que R$ 6.000</option>
    </select>

    <select
      :value="filters.grupos"
      @change="updateFilter('grupos', $event.target.value)"
      class="border border-gray-300 rounded-[10px] w-full px-4 py-1 bg-white focus:outline-none max-w-[220px] h-8"
    >
      <option value="">Grupos</option>
      <option value="grupo_i">Grupo I</option>
      <option value="grupo_ii">Grupo II</option>
      <option value="grupo_iii">Grupo III</option>
      <option value="grupo_iv">Grupo IV</option>
      <option value="grupo_v">Grupo V</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'VisaoGeralFiltro',
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