<template>
  <div class="space-y-5">
    <label class="text-15 font-medium">{{ Label }}</label>
    <!-- Drag & Drop / Click area -->
    <div class="border-2 border-dashed rounded-[10px] p-6 text-center cursor-pointer transition-colors duration-200"

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
    <!-- Preview list -->
   <ul v-if="previewFiles.length" class="mt-4 space-y-1 text-sm text-gray-700">
      <li
        v-for="(file, index) in previewFiles"
        :key="index"
        class="flex items-center justify-between bg-gray-100 p-2 rounded"
      >
        <span>
          {{ file.name }} ({{ formatSize(file.size) }}) -
          <span
            :class="file.mappedKey ? 'text-blue-700' : 'text-orange-600'"
            class="font-semibold"
          >
            {{ getMappedLabel(file.mappedKey) }}
          </span>
        </span>
        <button
          class="text-red-500 hover:text-red-700 text-xs font-bold ml-2"
          @click="removeFile(index)"
        >
          Remove
        </button>
      </li>
    </ul>
    <!-- Controls -->
    <div class="mt-4 flex items-center gap-3">
      <button
        class="px-4 py-2 rounded bg-blue-600 text-white"
        :disabled="previewFiles.length === 0 || isUploading"
        @click="uploadAll"
      >
        {{ isUploading ? 'Enviando...' : 'Enviar' }}
      </button>

      <button
        class="px-4 py-2 rounded border"
        :disabled="previewFiles.length === 0 || isUploading"
        @click="clearAll"
      >
        Limpar
      </button>

      <div v-if="uploadResult" class="text-sm text-green-600">
        {{ uploadResult }}
      </div>

      <div class="text-red-500" v-if="errorMessage">{{ errorMessage }}</div>
    </div>    
  </div>
</template>

<script>
import axios from 'axios';
import { getAccessToken } from '@/service/token.js';

export default {
  name: "FileInput",
  props: {
    Label: {
      type: String,
      required: true,
      default: "Importar Arquivos em .CSV",
    },
    endpoint: {
      type: String,
      default: '/csv/process/unified-upload/',
    },
    baseUrl: {
      type: String,
      default: window.__VUE__API_BASE_URL || 'http://10.203.3.46:8000',
    },
    isUploading: {
      type: Boolean,
      default: false,
    },
    maxFiles: {
      type: Number,
      default: 14,
    },
    expectedFiles: {
      type: Array,
      default: () => [
        { key: 'funcionarios', label: '1. Funcionários', patterns: ['funcionario', 'funcionarios', 'employees'] },
        { key: 'demissoes', label: '2. Demissões', patterns: ['demissao', 'demissoes'] },
        { key: 'frequencia', label: '3. Frequência', patterns: ['frequenciaXD'] },
        { key: 'atividades', label: '4. Atividades', patterns: ['atividade', 'atividades'] },
        { key: 'formacoes', label: '5. Formações', patterns: ['formacoes', 'formacao'] },
        { key: 'dias_nao_contabilizados', label: '6. Dias Não Contabilizados', patterns: ['dias_nao', 'nao_contabilizados'] },
        { key: 'motivos_infrequencia', label: '7. Motivos de Infrequência', patterns: ['motivos_infrequencia'] },
        { key: 'etapas_metas_ue', label: '8. Metas por Unidade Escolar', patterns: ['etapas_metas'] },
        { key: 'ues_perc_gr', label: '9. Percentual de Gratificação por UE', patterns: ['ues_perc_gr'] },
        { key: 'tipo_local', label: '10. Tipo de Local', patterns: ['local', 'tipo_local'] },
        { key: 'definicao_etapas', label: '11. Definição de Etapas (Professores)', patterns: ['definicao_etapas'] },
        { key: 'aprender_mais', label: '12. Aprender Mais (Reforço)', patterns: ['aprender'] },
        { key: 'dados_gerais', label: '13. Dados Gerais (Unidades)', patterns: ['gerais', 'dados'] },
        { key: 'funcao_grupo_etapas', label: '14. Função, Grupo e Etapas', patterns: ['funcao_grupo_etapas'] },  
      ],
    },
  },
  data() {
    return {
      previewFiles: [], // { id, file, name, size, mappedKey, hash, progress, error, preview }
      isDragging: false,
      isUploading: false,
      uploadResult: '',
      errorMessage: '',
    };
  },
  methods: {
    // Drag events
    onDragOver() {
      if (!this.isUploading) this.isDragging = true;
    },
    onDragLeave() {
      this.isDragging = false;
    },
    async onDrop(event) {
      this.isDragging = false;
      const files = Array.from(event.dataTransfer.files || []);
      await this.validateAndAddFiles(files);
    },

    // Seleção manual
    async onFileChange(event) {
      const files = Array.from(event.target.files || []);
      event.target.value = ""; // Reset input for re-selection
      await this.validateAndAddFiles(files);
    },    
    
    // Validar arquivos (apenas .csv)
    async validateAndAddFiles(fileList) {
      if (!fileList || fileList.length === 0) return;

      const allowed = fileList.filter(f => this.isCsvFile(f));
      if (allowed.length < fileList.length) {
        alert("Alguns arquivos foram ignorados por não serem no formato .csv");
      }      

      const toAdd = allowed.slice(0, Math.max(0, this.maxFiles - this.previewFiles.length));
      for (const f of toAdd) {
        const id = this.makeId();
        const mapped = this.autoMapFilename(f.name);
        const preview = `${f.name}`;
        const entry = {
          id,
          file: f,
          name: f.name,
          size: f.size,
          mappedKey: mapped,
          hash: null,
          progress: 0,
          error: null,
          preview,
        };
        this.previewFiles.push(entry);

        this.computeHash(f)
          .then(h => {
            const idx = this.previewFiles.findIndex(x => x.id === id);
            if (idx !== -1) {
              this.previewFiles[idx].hash = h;
            }
          })
          .catch(err => {
            const idx = this.previewFiles.findIndex(x => x.id === id);
            if (idx !== -1) {
              this.previewFiles[idx].error = 'Hash failed';
            }
            console.error('hash error', err);
          });
      }
      this.$emit("file-change", this.previewFiles);
    },

    isCsvFile(file) {
      const name = (file && file.name) ? file.name.toLowerCase() : '';
      // accept .csv by extension primarily
      return name.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel';
    },

    autoMapFilename(filename) {
      const name = filename.toLowerCase();
      for (const def of this.expectedFiles) {
        for (const p of def.patterns) {
          if (name.includes(p.toLowerCase())) return def.key;
        }
      }
      return null; // not mapped
    },

    removeFile(index) {
      if (this.isUploading) return;
      this.previewFiles.splice(index, 1);
      this.$emit("file-change", this.previewFiles);
    },

    clearAll() {
      if (this.isUploading) return;
      this.previewFiles = [];
    },

    makeId() {
      return Math.random().toString(36).slice(2, 10);
    },

    formatSize(size) {
      const kb = size / 1024;
      return kb > 1024 ? (kb / 1024).toFixed(2) + " MB" : kb.toFixed(2) + " KB";
    },

    openFileDialog() {
      this.$refs.fileInput.click();
    },

    async computeHash(file) {
      // returns hex SHA-256
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    },

    async waitForHashes(timeoutMs = 5000) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const pending = this.previewFiles.some(f => !f.hash && !f.error);
        if (!pending) return;
        // short sleep
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, 200));
      }
    },
    /**
     * uploadAll
     * - builds a manifest with file metadata (name, mappedKey, hash)
     * - appends each file to FormData (key: file_<mappedKey> or file_<idx>)
     * - sends single POST to baseUrl + endpoint
     */
    async uploadAll() {
      if (this.previewFiles.length === 0) return;
      if (this.isUploading) return;

      // ensure all hashes are computed before uploading (or at least give a short timeout)
      const missingHash = this.previewFiles.filter(f => !f.hash && !f.error);
      if (missingHash.length > 0) {
        // wait for outstanding hash computations but not indefinitely
        await this.waitForHashes(5000); // wait up to 5s for remaining hashes
      }

      this.isUploading = true;
      this.$emit('isUploading', true);
      this.uploadResult = '';
      // reset progress
      this.previewFiles.forEach(f => (f.progress = 0));

      const form = new FormData();
      const manifest = [];

      // append files with clear keys
      this.previewFiles.forEach((f, idx) => {
        const key = f.mappedKey ? f.mappedKey : `unmapped_${idx}`;
        const formKey = key; // use raw key, like 'funcionarios'
        form.append(formKey, f.file, f.name);

        manifest.push({
          formKey,
          mappedKey: f.mappedKey,
          originalName: f.name,
          size: f.size,
          hash: f.hash,
        });
      });

      // metadata
      form.append('manifest', JSON.stringify(manifest));

      // add any other metadata needed
      form.append('count', String(this.previewFiles.length));

      const token = await getAccessToken();
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // If you use a base URL, use it. Otherwise axios will use default base.
      const url = (this.baseUrl || '') + this.endpoint;

      try {
        await axios.post(url, form, {
          headers,
          onUploadProgress: (progressEvent) => {
            const loaded = progressEvent.loaded;
            // Map loaded bytes proportionally to files
            let cumulative = 0;
            for (const f of this.previewFiles) {
              const prevCumulative = cumulative;
              cumulative += f.size || 0;
              // approximate file progress based on loaded bytes
              const start = prevCumulative;
              const end = cumulative;
              let pct = 0;
              if (loaded >= end) pct = 100;
              else if (loaded <= start) pct = 0;
              else pct = Math.round(((loaded - start) / (end - start)) * 100);
              f.progress = Math.min(100, Math.max(0, pct));
            }
          },
        });

        this.uploadResult = 'Upload successful';
        // you can emit an event with manifest and response if the parent wants to act
        this.$emit('uploaded', { manifest });
      } catch (err) {
        console.error('Upload failed', err);
        this.uploadResult = 'Upload failed. See console.';
        // try to set errors on files if available
        if (err.response && err.response.data) {
          // if backend returns per-file info you can parse it here
        }
      } finally {
        this.isUploading = false;
        this.$emit('isUploading', false);
      }
    },
    getMappedLabel(mappedKey) {
      if (!mappedKey) {
        return 'Não mapeado';
      }
      const mapping = this.expectedFiles.find(ef => ef.key === mappedKey);
      return mapping ? mapping.label : 'Mapeamento desconhecido';
    },
  },
};
</script>