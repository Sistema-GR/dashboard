<template>
  <li class="relative">
    
    <div class="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-gray-200 rounded-lg shadow-sm">
    
      <div class="flex-grow">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-bold text-gray-800">Versão {{ version.version_number }}</h3>
          <span :class="getStatusClass(version.status)" class="text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {{ version.status_display }}
          </span>
        </div>
        <p class="text-sm text-gray-500 mt-1">Criado em: {{ new Date(version.created_at).toLocaleString() }}</p>
      </div>

      <div class="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center gap-2">
        <PrimaryButton
          v-if="['PUBLISHED', 'ARCHIVED'].includes(version.status)"
          value="Criar Versão a partir Daqui"
          @click="$emit('create-new-version', version.id)"
          customColor="bg-blue-600 hover:bg-blue-700"
        />
        <template v-if="version.status === 'DRAFT'">
          <PrimaryButton
            value="Editar Rascunho"
            @click="$emit('go-to-edit', version.id)"
            customColor="bg-green-600 hover:bg-green-700"
          />
        </template>
        <PrimaryButton
          v-if="version.status === 'ARCHIVED'"
          value="Visualizar Versão"
          @click="$emit('go-to-view', version.id)"
          customColor="bg-gray-500 hover:bg-gray-600"
        />
      </div>
    </div>
    
    <ul v-if="version.children && version.children.length > 0" class="version-tree pl-8 pt-4">
      <VersionItem
        v-for="child in version.children"
        :key="child.id"
        :version="child"
        @create-new-version="$emit('create-new-version', $event)"
        @go-to-edit="$emit('go-to-edit', $event)"
        @go-to-view="$emit('go-to-view', $event)"
      />
    </ul>
  </li>
</template>

<script setup>
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';

defineProps({
  version: Object,
});

defineEmits(['create-new-version', 'go-to-edit', 'go-to-view']);

const getStatusClass = (status) => {
  const classes = {
    PUBLISHED: 'bg-green-100 text-green-800',
    DRAFT: 'bg-yellow-100 text-yellow-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
  };
  return classes[status] || 'bg-gray-100';
};
</script>

<style>
.version-tree {
  list-style: none;
  padding-left: 2rem;
}

.version-tree li {
  position: relative;
  padding-bottom: 1rem;
}

.version-tree li:last-child {
  padding-bottom: 0;
}

.version-tree li::before {
  content: '';
  position: absolute;
  top: 1.5rem;
  left: -1rem;
  width: 1rem;
  height: 2px;
  background-color: #cbd5e1; 
}

.version-tree li::after {
  content: '';
  position: absolute;
  top: 0;
  left: -1rem; 
  width: 2px;
  height: 100%;
  background-color: #cbd5e1;
}

.version-tree li:last-child::after {
  height: 1.5rem;
}

.version-tree-root > li::before,
.version-tree-root > li::after {
  display: none;
}
</style>