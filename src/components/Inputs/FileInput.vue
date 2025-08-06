<template>
  <div class="unified-upload">
    <label class="block mb-2 text-sm font-medium">Upload CSV files</label>

    <!-- Drag & Drop / Click area -->
    <div
      class="border-2 border-dashed rounded p-6 text-center cursor-pointer"
      :class="{
        'border-blue-500 bg-blue-50': isDragOver,
        'opacity-50 pointer-events-none': isUploading
      }"
      @click="$refs.fileInput.click()"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        multiple
        accept=".csv,text/csv"
        @change="onFileInputChange"
      />
      <div>
        <p class="mb-1">Drag and drop CSV files here, or click to browse</p>
        <p class="text-xs text-gray-500">Only `.csv` files are accepted. Max files: {{ maxFiles }}</p>
      </div>
    </div>

    <!-- Preview list -->
    <div class="mt-4 space-y-2">
      <div
        v-for="(f, idx) in files"
        :key="f.id"
        class="p-3 border rounded flex items-start gap-3"
      >
        <div class="flex-1">
          <div class="flex items-baseline justify-between">
            <div>
              <div class="font-medium">{{ f.name }}</div>
              <div class="text-xs text-gray-500">
                {{ humanSize(f.size) }} • mapped: <strong>{{ f.mappedKey || '—' }}</strong>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                Hash: <code class="text-xs">{{ f.hash || 'computing...' }}</code>
              </div>
            </div>

            <div class="text-right">
              <div v-if="f.error" class="text-sm text-red-600">{{ f.error }}</div>
              <div v-else-if="isUploading">
                <div class="text-xs">Progress</div>
                <progress :value="f.progress" max="100" class="w-40"></progress>
                <div class="text-xs">{{ f.progress }}%</div>
              </div>
            </div>
          </div>

          <div v-if="f.preview" class="mt-2 text-xs text-gray-600">
            {{ f.preview }}
          </div>
        </div>

        <div class="flex flex-col items-end gap-2">
          <button
            class="px-3 py-1 rounded border text-sm"
            @click="removeFile(idx)"
            :disabled="isUploading"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="mt-4 flex items-center gap-3">
      <button
        class="px-4 py-2 rounded bg-blue-600 text-white"
        :disabled="files.length === 0 || isUploading"
        @click="uploadAll"
      >
        {{ isUploading ? 'Uploading...' : 'Upload all as unified request' }}
      </button>

      <button
        class="px-4 py-2 rounded border"
        :disabled="files.length === 0 || isUploading"
        @click="clearAll"
      >
        Clear
      </button>

      <div v-if="uploadResult" class="text-sm text-green-600">
        {{ uploadResult }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAccessToken } from '@/service/token.js';

/*
Props:
- endpoint (string) default '/csv/process/unified-upload/'
- maxFiles: optional maximum files allowed
- expectedFiles: array of { key: 'funcionarios', patterns: ['funcionario','funcionarios','employees'] } used to auto-map filename -> key.
- tokenProvider: optional function to return Bearer token (if you have custom auth).
*/

export default {
  name: 'UnifiedUpload',
  props: {
    endpoint: {
      type: String,
      default: '/csv/process/unified-upload/',
    },
    baseUrl: {
      type: String,
      default: '', // if your project uses a base url, set it; index.vue can pass it.
    },
    maxFiles: {
      type: Number,
      default: 50,
    },
    // default expected files mapping — customize as needed
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
    // Optional function prop to obtain token. If not provided, falls back to getAccessToken import or localStorage
    tokenProvider: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      files: [], // { id, file, name, size, mappedKey, hash, progress, error, preview }
      isDragOver: false,
      isUploading: false,
      uploadResult: '',
    };
  },
  methods: {
    onDragOver() {
      if (!this.isUploading) this.isDragOver = true;
    },
    onDragLeave() {
      this.isDragOver = false;
    },
    async onDrop(e) {
      this.isDragOver = false;
      const dropped = Array.from(e.dataTransfer.files || []);
      await this.addFiles(dropped);
    },
    async onFileInputChange(e) {
      const chosen = Array.from(e.target.files || []);
      e.target.value = null; // reset
      await this.addFiles(chosen);
    },
    async addFiles(fileList) {
      if (!fileList || fileList.length === 0) return;

      const allowed = fileList.filter(f => this.isCsvFile(f));
      const rejected = fileList.filter(f => !this.isCsvFile(f));

      if (rejected.length > 0) {
        rejected.forEach(r => {
          this.files.push({
            id: this.makeId(),
            file: r,
            name: r.name,
            size: r.size,
            mappedKey: null,
            hash: null,
            progress: 0,
            error: 'Rejected: not a .csv file',
            preview: null,
          });
        });
      }

      const toAdd = allowed.slice(0, Math.max(0, this.maxFiles - this.files.length));
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
        this.files.push(entry);

        // compute hash asynchronously, don't block UI
        this.computeHash(f)
          .then(h => {
            const idx = this.files.findIndex(x => x.id === id);
            if (idx !== -1) this.$set(this.files[idx], 'hash', h);
          })
          .catch(err => {
            const idx = this.files.findIndex(x => x.id === id);
            if (idx !== -1) this.$set(this.files[idx], 'error', 'Hash failed');
            console.error('hash error', err);
          });
      }
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
      this.files.splice(index, 1);
    },

    clearAll() {
      if (this.isUploading) return;
      this.files = [];
    },

    makeId() {
      return Math.random().toString(36).slice(2, 10);
    },

    humanSize(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    },

    async computeHash(file) {
      // returns hex SHA-256
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    },

    async getAuthToken() {
      // prefer tokenProvider if provided
      if (this.tokenProvider) {
        try {
          const t = await this.tokenProvider();
          if (t) return t;
        } catch (e) {
          // fallback
        }
      }

      // try common global getAccessToken if available
      if (typeof window !== 'undefined' && window.getAccessToken) {
        try {
          const t = await window.getAccessToken();
          if (t) return t;
        } catch (e) {}
      }

      // fallback localStorage
      const t = localStorage.getItem('token') || localStorage.getItem('access_token');
      return t || null;
    },

    /**
     * uploadAll
     * - builds a manifest with file metadata (name, mappedKey, hash)
     * - appends each file to FormData (key: file_<mappedKey> or file_<idx>)
     * - sends single POST to baseUrl + endpoint
     */
    async uploadAll() {
      if (this.files.length === 0) return;
      if (this.isUploading) return;

      // ensure all hashes are computed before uploading (or at least give a short timeout)
      const missingHash = this.files.filter(f => !f.hash && !f.error);
      if (missingHash.length > 0) {
        // wait for outstanding hash computations but not indefinitely
        await this.waitForHashes(5000); // wait up to 5s for remaining hashes
      }

      this.isUploading = true;
      this.uploadResult = '';
      // reset progress
      this.files.forEach(f => (f.progress = 0));

      const form = new FormData();
      const manifest = [];

      // append files with clear keys
      this.files.forEach((f, idx) => {
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
      form.append('count', String(this.files.length));

      const token = await getAccessToken();
      //const token = await this.getAuthToken();
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      //if (token) headers['Authorization'] = `Bearer ${token}`;

      // If you use a base URL, use it. Otherwise axios will use default base.
      const url = (this.baseUrl || '') + this.endpoint;

      try {
        // Provide a single onUploadProgress and map progress to files proportionally by bytes
        const totalBytes = this.files.reduce((s, f) => s + (f.size || 0), 0) || 1;

        await axios.post(url, form, {
          headers,
          onUploadProgress: (progressEvent) => {
            const loaded = progressEvent.loaded;
            // Map loaded bytes proportionally to files
            let cumulative = 0;
            for (const f of this.files) {
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
        //await axios.get(`${this.BASE_URL}/process/all-files/`, {
        //  headers: { 'Authorization': `Bearer ${token}` },
        //});

        //console.log("Todos os arquivos processados com sucesso!");
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
      }
    },

    async waitForHashes(timeoutMs = 5000) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const pending = this.files.some(f => !f.hash && !f.error);
        if (!pending) return;
        // short sleep
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, 200));
      }
    },
  },
};
</script>

<style scoped>
.unified-upload input[type='file'] {
  display: none;
}
</style>
