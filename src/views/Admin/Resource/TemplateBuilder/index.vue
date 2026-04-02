<template>
  <Whiteboard title="Templates de Resposta" class="!overflow-visible overflow-y-auto z-40 relative">
    <!-- Header Navigation -->
    <div class="flex justify-between items-center px-4 sm:px-10 py-4">
      <button 
        @click="navigateBack" 
        class="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>
      <h2 class="text-2xl font-bold text-gray-800">{{ editingId ? 'Editar Template' : 'Novo Template' }}</h2>
      <div class="w-20"></div>
    </div>

    <!-- Main Content -->
    <div class="px-4 sm:px-10 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column: Input Form -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-md p-6 space-y-4">
          <!-- Template Title -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Título do Template *
            </label>
            <input 
              v-model="form.titulo" 
              type="text" 
              placeholder="Ex: Decision Letter, Financial Report"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              :disabled="isLoading"
            />
            <p v-if="form.titulo" class="text-xs text-gray-500 mt-1">{{ form.titulo.length }}/255 caracteres</p>
          </div>

          <!-- Template Description -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Descrição (Opcional)
            </label>
            <textarea 
              v-model="form.descricao" 
              placeholder="Descreva quando este template deve ser usado..."
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              :disabled="isLoading"
            ></textarea>
            <p v-if="form.descricao" class="text-xs text-gray-500 mt-1">{{ form.descricao.length }}/500 caracteres</p>
          </div>

          <!-- Plain Text Content


          <textarea 
              v-model="form.plaintext_content" 
              rows="12"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-mono text-sm resize-none"
              :disabled="isLoading"
            >
          </textarea>
  
          -->

          <!-- ACTUAL Plain text content -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Corpo do Template <span class="text-red-500">*</span>
            </label>
            <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              Conteúdo do Template (Plain Text) *
              <span class="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">Use [[campo]] para variáveis</span>
            </label>

            <div
                v-if="editor"
                class="border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition"
            >
              <div class="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
                        <select
                          class="border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-600 bg-white outline-none cursor-pointer"
                          @change="setFontSize($event)"
                        >
                          <option value="">Tamanho</option>
                          <option value="10pt">10pt</option>
                          <option value="11pt">11pt</option>
                          <option value="12pt">12pt</option>
                          <option value="14pt">14pt</option>
                          <option value="16pt">16pt</option>
                          <option value="18pt">18pt</option>
                          <option value="24pt">24pt</option>
                        </select>

                        <div class="w-px h-5 bg-gray-200 mx-1"></div>

                        <button
                          class="w-8 h-7 flex items-center justify-center rounded-md text-sm font-bold transition-colors"
                          :class="editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
                          @click="editor.chain().focus().toggleBold().run()"
                          title="Negrito"
                        >N</button>

                        <button
                          class="w-8 h-7 flex items-center justify-center rounded-md text-sm italic font-semibold transition-colors"
                          :class="editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
                          @click="editor.chain().focus().toggleItalic().run()"
                          title="Itálico"
                        >I</button>

                        <button
                          class="w-8 h-7 flex items-center justify-center rounded-md text-sm font-semibold underline transition-colors"
                          :class="editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
                          @click="editor.chain().focus().toggleUnderline().run()"
                          title="Sublinhado"
                        >S</button>

                        <div class="w-px h-5 bg-gray-200 mx-1"></div>

                        <button
                          class="w-8 h-7 flex items-center justify-center rounded-md transition-colors"
                          :class="editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
                          @click="editor.chain().focus().toggleBulletList().run()"
                          title="Lista com marcadores"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
                            <circle cx="4" cy="6" r="1.2" fill="currentColor"/><circle cx="4" cy="12" r="1.2" fill="currentColor"/><circle cx="4" cy="18" r="1.2" fill="currentColor"/>
                          </svg>
                        </button>

                        <button
                          class="w-8 h-7 flex items-center justify-center rounded-md transition-colors"
                          :class="editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'"
                          @click="editor.chain().focus().toggleOrderedList().run()"
                          title="Lista numerada"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
                            <path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
                          </svg>
                        </button>
              </div>
                <EditorContent
                  :editor="editor"
                  v-model="form.plaintext_content" 
                  class="min-h-[260px] max-h-[600px] overflow-y-auto px-4 py-3 text-sm text-gray-800
                    [&.tiptap]:outline-none
                    [&_.tiptap_p]:mb-2
                    [&.tiptap_ul]:list-disc [&.tiptap_ul]:pl-5
                    [&.tiptap_ol]:list-decimal [&.tiptap_ol]:pl-5"
                />
            </div>
          </div>

          <!-- Field Name Rules Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
            <p class="font-semibold mb-2">Regras para nomes de campo:</p>
            <ul class="list-disc list-inside space-y-1 text-xs">
              <li>Comece com letra ou underscore: a-z, A-Z, _</li>
              <li>Contenha apenas alfanuméricos e underscore: [[nome_campo_1]]</li>
              <li>Exemplos válidos: [[nome]], [[cpf]], [[matricula_principal]]</li>
              <li>Exemplos inválidos: [[123nome]], [[campo-nome]], [[campo nome]]</li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t">
            <button 
              @click="previewTemplate" 
              :disabled="!form.plaintext_content || isLoading"
              class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Visualizar
            </button>
            <button 
              @click="saveTemplate" 
              :disabled="!form.titulo || !form.plaintext_content || isLoading"
              class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ isLoading ? 'Salvando...' : 'Salvar Template' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Preview & Info -->
      <div class="space-y-6">
        <!-- Error Messages -->
        <div v-if="error" class="bg-red-50 border border-red-300 rounded-lg p-4">
          <p class="text-sm font-semibold text-red-900 mb-2">Erro:</p>
          <ul v-if="Array.isArray(error)" class="list-disc list-inside text-sm text-red-700 space-y-1">
            <li v-for="(err, idx) in error" :key="idx">{{ err }}</li>
          </ul>
          <p v-else class="text-sm text-red-700">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-50 border border-green-300 rounded-lg p-4">
          <p class="text-sm font-semibold text-green-900">✓ {{ successMessage }}</p>
        </div>

        <!-- Fields Summary -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Campos Detectados</h3>
          <div v-if="extractedFields.length > 0" class="space-y-3">
            <div class="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <span class="text-2xl font-bold text-blue-600">{{ extractedFields.length }}</span>
              <span class="text-gray-700">campo(s) editável(is)</span>
            </div>
            <div class="space-y-2">
              <p class="text-xs font-semibold text-gray-600 uppercase">Nomes dos campos:</p>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="field in extractedFields" 
                  :key="field"
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {{ field }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6 text-gray-500">
            <p>Nenhum campo detectado ainda.</p>
            <p class="text-xs mt-2">Use [[nome_campo]] no texto para criar campos editáveis.</p>
          </div>
        </div>

        <!-- HTML Preview -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-800">Preview HTML</h3>
            <button
              v-if="showPreview"
              @click="showPreview = false"
              class="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Fechar Preview
            </button>
          </div>
          
          <div v-if="showPreview && previewHtml" class="space-y-4">
            <!-- HTML Code -->
            <div class="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
              <pre class="text-gray-100 text-xs font-mono whitespace-pre-wrap break-words">{{ previewHtml }}</pre>
            </div>
            
            <!-- Live Preview -->
            <div class="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-96 overflow-auto">
              <p class="text-xs font-semibold text-gray-600 mb-3 uppercase">Renderização ao vivo:</p>
              <div class="space-y-3" v-html="previewHtml"></div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <p>Clique em "Visualizar" para ver o preview HTML</p>
          </div>
        </div>

        <!-- Existing Templates -->
        <div v-if="existingTemplates.length > 0" class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Templates Existentes</h3>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <button
              v-for="template in existingTemplates"
              :key="template.id"
              @click="loadTemplate(template)"
              class="w-full text-left px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition text-sm"
            >
              <p class="font-semibold text-gray-800">{{ template.titulo }}</p>
              <p v-if="template.descricao" class="text-xs text-gray-600 mt-1">{{ template.descricao }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Whiteboard>
</template>

<script setup>
import { apiClient } from '@/service/apiService'
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'

import { Extension } from '@tiptap/core'
import { TextStyle } from '@tiptap/extension-text-style'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

//name: 'TemplateBuilder'
const router = useRouter()

// Form state
const form = ref({
  titulo: '',
  descricao: '',
  plaintext_content: ''
})

// UI state
const isLoading = ref(false)
const error = ref(null)
const successMessage = ref(null)
const showPreview = ref(false)
const previewHtml = ref('')
const extractedFields = ref([])
const existingTemplates = ref([])
const editingId = ref(null)

onBeforeUnmount(() => editor.value?.destroy())

// FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [{
      types: ['textStyle'],
      attributes: {
        fontSize: {
          default: null,
          parseHTML: el => el.style.fontSize || null,
          renderHTML: attrs => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
        },
      },
    }]
  },
  addCommands() {
    return {
      setFontSize:   size => ({ chain }) => chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize: ()   => ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    }
  },
})

const setFontSize = (event) => {
  const size = event.target.value
  size
    ? editor.value?.chain().focus().setFontSize(size).run()
    : editor.value?.chain().focus().unsetFontSize().run()
  event.target.value = ''
}

// TipTap
const editor = useEditor({
  extensions: [StarterKit, Underline, TextStyle, FontSize,
   Placeholder.configure({placeholder: 'VEGETA OLHA BEIM'})
  ],
  content: '',
  onUpdate: ({ editor: editorInstance }) => {
    // Sync editor content with form when user types
    form.value.plaintext_content = editorInstance.getText()
  },
})

const accessToken = localStorage.getItem('accessToken')

// Fetch existing templates from the backend
async function fetchExistingTemplates() {
  try {
    const response = await apiClient.get('/recursos/templates/', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    existingTemplates.value = response.data
  } catch (error) {
    console.error('Erro ao buscar templates:', error)
  }
}

// Extract field names from plain text (DO WE REALLY NEED THIS?)
function extractFieldNamesFromText(text) {
  const pattern = /\[\[([a-zA-Z_][a-zA-Z0-9_]*)\]\]/g
  const matches = []
  let match
  
  while ((match = pattern.exec(text)) !== null) {
    if (!matches.includes(match[1])) {
      matches.push(match[1])
    }
  }
  
  return matches
}

//Convert plain text to HTML (simulating backend logic for preview)
function convertToHtml(plainText) {
  if (!plainText) return ''

  // Escape HTML
  let html = plainText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  // Replace '{{field}}' with input elements
  //html = html.replace(
  //  /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g,
  //  '<input type="text" class="template-field border border-gray-300 rounded px-2 py-1 mx-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" data-field-name="$1" placeholder="$1" />'
  //)

  // Split by blank lines and wrap in paragraphs
  const paragraphs = html.split('\n\n').filter(p => p.trim())
  const wrapped = paragraphs.map(p => `<p class="mb-3">${p}</p>`).join('\n')

  const resposta = `<div class="header">
                        <img src="{{ url_logo }}" alt="Logo da Organização" style="width: 150px; margin-bottom: 20px;">
                        <h1>Resposta a Recurso Administrativo</h1>
                        <h2>GRATIFICAÇÃO DE RESULTADOS 2024</h2>
                    </div>

                    <div class="info-block">
                        <p><strong>Solicitante:</strong> {{ nome_completo }}</p>
                        <p><strong>Matrículas:</strong> {{ matriculas }}</p>
                        <p><strong>Data do recurso:</strong> {{ created_at_formatado }}</p>
                        <p><strong>Razão do recurso:</strong></p>
                        <div class="quote">"{{ descricao }}"</div>
                    </div>\n${wrapped}\n<p>Tendo em mente o acima exposto, e após análise criteriosa, a Unidade de {{ unidade_responsavel_dropdown }} delibera pelo(a) <strong>{{ decisao_dropdown }}</strong> do seu recurso.</p>

                    <div class="footer">
                        <p>Atenciosamente,</p>
                        <br>
                        <p>_________________________</p>
                        <p><strong>Unidade {{ unidade_responsavel_dropdown }}</strong></p>
                    </div>`

  return resposta

}

//Preview the template (client-side conversion)
function previewTemplate() {
  error.value = null
  
  if (!form.value.plaintext_content.trim()) {
    error.value = 'Por favor, preencha o conteúdo do template'
    return
  }

  // Update extracted fields
  extractedFields.value = extractFieldNamesFromText(form.value.plaintext_content)

  // Convert to HTML
  previewHtml.value = convertToHtml(form.value.plaintext_content)
  showPreview.value = true
}

async function saveTemplate() {
  error.value = null
  successMessage.value = null

  // Validate required fields
  if (!form.value.titulo.trim()) {
    error.value = 'Título é obrigatório'
    return
  }

  if (!form.value.plaintext_content.trim()) {
    error.value = 'Conteúdo do template é obrigatório'
    return
  }

  isLoading.value = true

  try {
    // Extract fields for validation
    const fields = extractFieldNamesFromText(form.value.plaintext_content)

    const payload = {
      titulo: form.value.titulo,
      descricao: form.value.descricao || '',
      plaintext_content: previewHtml.value, // Enviamos o HTML convertido para o backend
      preview_only: false
    }

    const response = await apiClient.post(
      '/recursos/templates/converter/',
      payload,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    )

    // Success!
    successMessage.value = `Template "${response.data.titulo}" salvo com sucesso! (${response.data.campo_count} campo(s))`
    
    // Reset form or update template list
    setTimeout(() => {
      fetchExistingTemplates()
      resetForm()
    }, 1500)

  } catch (err) {
    if (err.response?.data?.errors) {
      error.value = err.response.data.errors
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Erro ao salvar o template. Tente novamente.'
    }
    console.error('Erro ao salvar template:', err)
  } finally {
    isLoading.value = false
  }
}

//Load an existing template for editing
function loadTemplate(template) {
  form.value.titulo = template.titulo
  form.value.descricao = template.descricao
  form.value.plaintext_content = '' // We don't have plaintext in stored template, just HTML
  editingId.value = template.id
  
  // Show info about loaded template
  successMessage.value = `Template "${template.titulo}" carregado. (Nota: O conteúdo original em plain text não está disponível)`
  
  setTimeout(() => {
    successMessage.value = null
  }, 3000)
}

//Reset form to initial state
function resetForm() {
  form.value = {
    titulo: '',
    descricao: '',
    plaintext_content: ''
  }
  extractedFields.value = []
  previewHtml.value = ''
  showPreview.value = false
  editingId.value = null
  error.value = null
  successMessage.value = null
}

// Navigate back to resources page
function navigateBack() {
  router.push({ name: 'recurso' })
}

onMounted(() => {
  fetchExistingTemplates()
  // Load initial content into editor if it exists
  if (form.value.plaintext_content && editor.value) {
    editor.value.commands.setContent(form.value.plaintext_content)
  }
})
  
</script>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Smooth transitions for inputs */
input:disabled,
textarea:disabled {
  @apply bg-gray-100 cursor-not-allowed;
}

/* Template field styles in preview */
:deep(.template-container) {
  @apply rounded-lg p-4 bg-gray-50 border border-gray-200;
}

:deep(.template-field) {
  @apply font-semibold text-green-700 bg-green-50;
}

/* TipTap editor content styling */
:deep(.tiptap),
:deep(.tiptap.ProseMirror) {
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  outline: none;
}

/* Animation for success message */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-green-50 {
  animation: slideIn 0.3s ease-out;
}
</style>

<style>
    body {
        font-family: 'Helvetica', 'Arial', sans-serif;
        font-size: 11pt;
        line-height: 1.5;
        color: #333;
    }
    .header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid #333;
        padding-bottom: 10px;
    }
    .header h1 {
        margin: 0;
        font-size: 14pt;
        text-transform: uppercase;
    }
    .header h2 {
        margin: 5px 0 0;
        font-size: 12pt;
        font-weight: normal;
    }
    .info-block {
        border: 1px solid #ccc;
        padding: 15px;
        margin-bottom: 25px;
        border-radius: 5px;
    }
    .info-block p {
        margin: 5px 0;
    }
    .quote {
        background-color: #f5f5f5;
        border-left: 4px solid #ccc;
        padding: 10px;
        margin: 15px 0;
        font-style: italic;
    }
    .footer {
        margin-top: 40px;
        text-align: center;
    }
    /* Chip de variável dentro do editor TipTap */
    .tpl-var {
      font-family: 'Courier New', monospace;
      font-size: 0.82em;
      background-color: #EEF3FD;
      color: #2F6BE0;
      border: 1px solid rgba(47, 107, 224, 0.25);
      border-radius: 4px;
      padding: 1px 5px;
      font-style: normal;
    }

    @keyframes modal-in {
      from { opacity: 0; transform: scale(.96) translateY(8px); }
      to   { opacity: 1; transform: none; }
    }
</style>
