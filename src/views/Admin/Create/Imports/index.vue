<template>
  <Whiteboard title="Importações" :isSidebarMinimized="isSidebarMinimized">     
    <div class="w-full space-y-10">      
      <!-- FileInput para upload dos arquivos em .csv -->
      <FileInput Label="Importar Arquivos em .CSV"
      @uploaded="onUnifiedUploaded"/>
      <Loading v-if="isUploading" />
    </div>
  </Whiteboard>
</template>

<script>
import { inject, ref, computed } from 'vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import FileInput from '@/components/Inputs/FileInput.vue';
import Loading from '@/components/Loading/Loading.vue';

const fileInputRef = ref(null);
const isUploading = computed(() => fileInputRef.value?.isUploading ?? false);

export default {
  components: { FileInput, Whiteboard, Loading },

  data() {
    return {     
      isSidebarMinimized: null,
    };
  },

  created() {
    this.isSidebarMinimized = inject('isSidebarMinimized');
  },

  methods: {
    onUnifiedUploaded({ manifest }) {
      console.log('Unified upload manifest', manifest);
    },
  },
};
</script>