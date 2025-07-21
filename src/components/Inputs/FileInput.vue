<!-- VERSÃO ANTIGA E FUNCIONAL ---
<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">{{ Label }}</label>
    <input
      class="block w-5/6 border border-gray-200 shadow-sm rounded-lg text-sm file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4 dark:file:bg-blue-500 dark:file:text-white file:cursor-pointer"
      type="file"
      multiple
      @change="onFileChange"
    />
  </div>
</template>

<script>
export default {
  name: 'FileInput',
  props: {
    Label: {
      type: String,
      required: true,
      default: 'Upload Files',
    },
  },
  methods: {
    onFileChange(event) {
      const files = Array.from(event.target.files); // Converte FileList para um array
      this.$emit('file-change', files); // Emitir todos os arquivos selecionados
    },
    setFiles(files) {
      this.$emit('change', { target: { files } });
    },
  },
};
</script>-->
<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">{{ Label }}</label>

    <!-- Drop Zone -->
    <div
      class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200"
      :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
      @click="openFileDialog"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <p class="text-gray-600">
        Arraste os arquivos aqui ou <span class="text-blue-500 font-semibold">procurar</span>
      </p>
      <input
        class="hidden"
        type="file"
        multiple
        accept=".csv"
        ref="fileInput"
        @change="onFileChange"
      />
    </div>

    <!-- Preview Selected Files -->
    <ul v-if="previewFiles.length" class="mt-4 space-y-1 text-sm text-gray-700">
      <li
        v-for="(file, index) in previewFiles"
        :key="index"
        class="flex items-center justify-between bg-gray-100 p-2 rounded"
      >
        <span>{{ file.name }} ({{ formatSize(file.size) }})</span>
        <button
          class="text-red-500 hover:text-red-700 text-xs font-bold ml-2"
          @click="removeFile(index)"
        >
          Remove
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FileInput",
  props: {
    Label: {
      type: String,
      required: true,
      default: "Upload CSV Files",
    },
  },
  data() {
    return {
      isDragging: false,
      previewFiles: [],
    };
  },
  methods: {
    // Seleção manual
    onFileChange(event) {
      const files = Array.from(event.target.files);
      this.validateAndAddFiles(files);
      event.target.value = ""; // Reset input for re-selection
    },

    // Drag events
    onDragOver() {
      this.isDragging = true;
    },
    onDragLeave() {
      this.isDragging = false;
    },
    onDrop(event) {
      this.isDragging = false;
      const files = Array.from(event.dataTransfer.files);
      this.validateAndAddFiles(files);
    },

    // Validar arquivos (apenas .csv)
    validateAndAddFiles(files) {
      const validFiles = files.filter((file) => file.name.toLowerCase().endsWith(".csv"));
      if (validFiles.length < files.length) {
        alert("Alguns arquivos foram ignorados por não serem no formato .csv");
      }
      this.previewFiles.push(...validFiles);
      this.$emit("file-change", this.previewFiles);
    },

    removeFile(index) {
      this.previewFiles.splice(index, 1);
      this.$emit("file-change", this.previewFiles);
    },

    formatSize(size) {
      const kb = size / 1024;
      return kb > 1024 ? (kb / 1024).toFixed(2) + " MB" : kb.toFixed(2) + " KB";
    },

    openFileDialog() {
      this.$refs.fileInput.click();
    },
  },
};
</script>