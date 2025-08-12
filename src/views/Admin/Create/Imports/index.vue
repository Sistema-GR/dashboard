<template>
  <Whiteboard title="Importações" :isSidebarMinimized="isSidebarMinimized">     
    <div class="w-full space-y-10">      
      <!-- FileInput para upload dos arquivos em .csv -->
      <FileInput Label="Importar Arquivos em .CSV"
      @taUpando="loadingUpdate"
      @uploaded="onUnifiedUploaded"/>
    </div>
    <Loading v-if="isUploading" />
  </Whiteboard>
</template>

<script>
import { inject } from 'vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import FileInput from '@/components/Inputs/FileInput.vue';
import Loading from '@/components/Loading/Loading.vue';

export default {
  components: { FileInput, Whiteboard, Loading },
  
  data() {
    return {     
      isSidebarMinimized: null,
      isUploading: false,
    };
  },

  created() {
    this.isSidebarMinimized = inject('isSidebarMinimized');
  },

  methods: {
    onUnifiedUploaded({ manifest }) {
      console.log('Unified upload manifest', manifest);
      this.isUploading = false;
      this.$router.push({ path: '/admin/dashboard' });
    },
    loadingUpdate(valor) {
      this.isUploading = valor;      
    },
  },
};
</script>