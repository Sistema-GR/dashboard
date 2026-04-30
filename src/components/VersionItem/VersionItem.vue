<template>
  <li class="relative group">
    <!-- Indicador de Ponto na Timeline -->
    <div 
      class="absolute left-[-29px] top-6 w-4 h-4 rounded-full border-4 border-white z-10 transition-transform group-hover:scale-125"
      :class="version.is_finalized ? 'bg-[#3459a2] shadow-[0_0_0_2px_rgba(37,99,235,0.2)]' : 'bg-amber-500 shadow-[0_0_0_2px_rgba(245,158,11,0.2)]'"
    ></div>

    <div class="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200">
      
      <div class="flex-grow">
        <div class="flex items-center gap-3">
          <span class="text-sm font-mono font-bold text-[#3459a2] bg-blue-50 px-2 py-0.5 rounded">
            v{{ version.version_number }}
          </span>
          <h3 class="text-base font-bold text-gray-800">
            {{ version.is_finalized ? 'Versão Oficial' : 'Rascunho em Edição' }}
          </h3>
          <span 
            :class="version.is_finalized ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'" 
            class="text-[10px] uppercase font-black px-2 py-0.5 rounded-md tracking-wider"
          >
            {{ version.is_finalized ? 'Finalizado' : 'Draft' }}
          </span>
        </div>
        
        <div class="flex items-center gap-4 mt-2 text-gray-400">
          <div class="flex items-center gap-1 text-xs">
            <CalendarIcon class="h-3.5 w-3.5" />
            {{ version.created_at }}
          </div>
          <div v-if="version.children?.length" class="flex items-center gap-1 text-xs">
            <ArrowsRightLeftIcon class="h-3.5 w-3.5" />
            {{ version.children.length }} ramificações
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="mt-4 sm:mt-0 flex items-center gap-2">
        <!-- Visualizar -->
        <button
          v-if="version.is_finalized"
          @click="$emit('go-to-view', version.id)"
          class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100"
        >
          <EyeIcon class="h-4 w-4" />
          Visualizar
        </button>

        <!-- Criar Nova (A partir de uma finalizada) -->
        <button
          v-if="version.is_finalized"
          @click="$emit('create-new-version', version.id)"
          class="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#3459a2] hover:bg-[#002a4d] rounded-xl transition-all shadow-sm hover:shadow-blue-200"
        >
          <PlusIcon class="h-4 w-4" />
          Novo Rascunho
        </button>

        <!-- Editar (Se for rascunho) -->
        <button
          v-if="!version.is_finalized"
          @click="$emit('go-to-edit', version.id)"
          class="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-all shadow-sm shadow-amber-100"
        >
          <PencilSquareIcon class="h-4 w-4" />
          Continuar Edição
        </button>
      </div>
    </div>
    
    <!-- Ramificações (Recursivo) -->
    <ul v-if="version.children && version.children.length > 0" class="version-tree-branch ml-10 mt-6 space-y-6">
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
import { 
  CalendarIcon, 
  EyeIcon, 
  PlusIcon, 
  PencilSquareIcon,
  ArrowsRightLeftIcon
} from '@heroicons/vue/24/outline';

defineProps({
  version: Object,
});

defineEmits(['create-new-version', 'go-to-edit', 'go-to-view']);
</script>

<style scoped>
/* Conector curvo para ramificações */
.version-tree-branch {
  position: relative;
}

.version-tree-branch::before {
  content: '';
  position: absolute;
  left: -25px;
  top: -24px;
  width: 2px;
  height: calc(100% + 24px);
  background-color: #e5e7eb; /* cor da linha vertical (gray-200) */
}

/* Esconde a linha que sobra no último item do nível */
li:last-child > .version-tree-branch::before {
  height: 24px; 
}

/* O "braço" horizontal que liga a linha vertical ao nodo do filho */
.version-tree-branch > li::after {
  content: '';
  position: absolute;
  left: -25px;
  top: 24px;
  width: 15px;
  height: 2px;
  background-color: #e5e7eb;
}
</style>