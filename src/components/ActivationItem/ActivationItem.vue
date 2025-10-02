<template>
  <div class="border-b last:border-b-0">
    <!-- Linha principal da versão -->
    <div class="flex items-center p-4 hover:bg-gray-50">
      <div class="flex-grow pl-4" :style="{ paddingLeft: `${depth * 24}px` }">
        <p class="font-semibold text-gray-800">{{ version.nome }}</p>
        <p class="text-sm text-gray-500">{{ version.descricao }}</p>
        <p class="text-xs text-gray-400">Criado em: {{ formatDate(version.data) }}</p>
      </div>
      <div class="w-24 text-center">
        <span v-if="version.ativa" class="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Ativo</span>
        <span v-else class="inline-flex px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inativo</span>
      </div>
      <div class="w-24 flex justify-center">
        <Toggle
          class="scale-90"
          :modelValue="version.ativa"
          @update:modelValue="() => $emit('toggle-version', version)"
        />
      </div>
    </div>

    <!-- Seção recursiva para os filhos -->
    <div v-if="version.children && version.children.length > 0">
      <ActivationItem
        v-for="child in version.children"
        :key="child.id"
        :version="child"
        :depth="depth + 1"
        @toggle-version="$emit('toggle-version', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import Toggle from '@/components/Toggle/Toggle.vue';

defineProps({
  version: Object,
  depth: {
    type: Number,
    default: 0
  }
});

defineEmits(['toggle-version']);

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR');
};
</script>