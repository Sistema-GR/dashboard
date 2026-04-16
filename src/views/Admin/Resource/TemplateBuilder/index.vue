<template>
  <Whiteboard title="Templates de Resposta">

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="flex items-center justify-between px-4 sm:px-10 pt-8 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-[10px] bg-[#EEF3FD] text-[#3459A2] flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 tracking-tight">Templates de Resposta</h1>
          <p class="text-sm text-gray-400 mt-0.5">Gerencie os modelos de resposta em PDF</p>
        </div>
      </div>

      <button
        @click="openCreateModal"
        class="flex items-center gap-2 bg-[#3459A2] hover:bg-[#2a4a8a] text-white text-sm font-semibold px-4 py-2 rounded-[10px] shadow-md transition-colors duration-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Novo Template
      </button>
    </div>

    <!-- ── Template Grid ───────────────────────────────────────────────────── -->
    <div class="px-4 sm:px-10 pb-10">

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center gap-3 py-20 text-gray-400">
        <div class="w-5 h-5 border-2 border-gray-200 border-t-[#3459A2] rounded-full animate-spin"></div>
        <span class="text-sm">Carregando templates...</span>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="templates.length === 0"
        class="flex flex-col items-center gap-3 py-20 text-center"
      >
        <div class="text-gray-300">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
        </div>
        <p class="text-base font-semibold text-gray-700">Nenhum template criado</p>
        <p class="text-sm text-gray-400 max-w-xs">Crie o primeiro template para começar a gerar respostas em PDF.</p>
        <button
          @click="openCreateModal"
          class="mt-2 bg-[#3459A2] hover:bg-[#2a4a8a] text-white text-sm font-semibold px-4 py-2 rounded-[10px] transition-colors duration-200"
        >
          Criar Template
        </button>
      </div>

      <!-- Cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="template in templates"
          :key="template.id"
          class="flex flex-col bg-white border border-gray-200 rounded-[14px] p-5 gap-2 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
        >
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-[#3459A2] bg-[#EEF3FD] px-2 py-1 rounded-md">
              Template
            </span>
            <div class="flex gap-1">
              <button
                @click="openEditModal(template)"
                title="Editar"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-150"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button
                @click="confirmDelete(template)"
                title="Excluir"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-150"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/>
                  <path d="M10,11v6"/><path d="M14,11v6"/>
                  <path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6"/>
                </svg>
              </button>
            </div>
          </div>

          <h3 class="text-base font-semibold text-gray-900 leading-tight">{{ template.titulo }}</h3>
          <p v-if="template.descricao" class="text-sm text-gray-600 leading-snug">{{ template.descricao }}</p>
          <p v-else class="text-sm text-gray-400 italic">Sem descrição</p>

        </div>
      </div>
    </div>

    <!-- ── Create / Edit Modal ─────────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/45 backdrop-blur-sm"

      >
        <div class="bg-white rounded-[14px] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-modal-in">

          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <h2 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Editar Template' : 'Novo Template' }}</h2>
            <button
              @click="closeModal"
              class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors duration-150"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Modal body -->
          <div class="p-6 overflow-y-auto flex-1 flex flex-col gap-5">

            <!-- Título + Descrição -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Título <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.titulo"
                  type="text"
                  class="border border-gray-200 rounded-[10px] px-3 py-2 text-sm text-gray-800 bg-white outline-none focus:border-[#3459A2] focus:ring-2 focus:ring-[#3459A2]/10 transition"
                  placeholder="Ex: Resposta de Indeferimento Padrão"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wide text-gray-500">Descrição</label>
                <input
                  v-model="form.descricao"
                  type="text"
                  class="border border-gray-200 rounded-[10px] px-3 py-2 text-sm text-gray-800 bg-white outline-none focus:border-[#3459A2] focus:ring-2 focus:ring-[#3459A2]/10 transition"
                  placeholder="Quando usar este template..."
                />
              </div>
            </div>

            <!-- Editor + Sidebar -->
            <div class="grid grid-cols-1 sm:grid-cols-[1fr_240px] gap-4 items-start">

              <!-- Editor section -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Corpo do Template <span class="text-red-500">*</span>
                </label>

                <div
                  v-if="editor"
                  class="border border-gray-200 rounded-[10px] overflow-hidden focus-within:border-[#3459A2] focus-within:ring-2 focus-within:ring-[#3459A2]/10 transition"
                >
                  <!-- Toolbar -->
                  <div class="flex flex-wrap items-center gap-1 px-2.5 py-2 bg-gray-50 border-b border-gray-200">

                    <select
                      @change="setFontSize($event)"
                      class="border border-gray-200 rounded-md px-1.5 py-1 text-xs text-gray-500 bg-white cursor-pointer outline-none"
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

                    <!-- Bold -->
                    <button
                      @click="editor.chain().focus().toggleBold().run()"
                      title="Negrito (Ctrl+B)"
                      :class="editor.isActive('bold') ? 'bg-[#EEF3FD] text-[#3459A2] border-[#3459A2]/25' : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:border-gray-200 hover:text-gray-800'"
                      class="w-[30px] h-7 flex items-center justify-center rounded-md border text-sm cursor-pointer transition-all duration-100"
                    ><strong>N</strong></button>

                    <!-- Italic -->
                    <button
                      @click="editor.chain().focus().toggleItalic().run()"
                      title="Itálico (Ctrl+I)"
                      :class="editor.isActive('italic') ? 'bg-[#EEF3FD] text-[#3459A2] border-[#3459A2]/25' : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:border-gray-200 hover:text-gray-800'"
                      class="w-[30px] h-7 flex items-center justify-center rounded-md border text-sm cursor-pointer transition-all duration-100"
                    ><em>I</em></button>

                    <!-- Underline -->
                    <button
                      @click="editor.chain().focus().toggleUnderline().run()"
                      title="Sublinhado (Ctrl+U)"
                      :class="editor.isActive('underline') ? 'bg-[#EEF3FD] text-[#3459A2] border-[#3459A2]/25' : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:border-gray-200 hover:text-gray-800'"
                      class="w-[30px] h-7 flex items-center justify-center rounded-md border text-sm cursor-pointer transition-all duration-100"
                    ><span class="underline">S</span></button>

                    <div class="w-px h-5 bg-gray-200 mx-1"></div>

                    <!-- Align left -->
                    <button
                      @click="editor.chain().focus().setTextAlign('left').run()"
                      title="Alinhar à esquerda"
                      :class="editor.isActive({ textAlign: 'left' }) ? 'bg-[#EEF3FD] text-[#3459A2] border-[#3459A2]/25' : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:border-gray-200 hover:text-gray-800'"
                      class="w-[30px] h-7 flex items-center justify-center rounded-md border cursor-pointer transition-all duration-100"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
                      </svg>
                    </button>

                    <!-- Align center -->
                    <button
                      @click="editor.chain().focus().setTextAlign('center').run()"
                      title="Centralizar"
                      :class="editor.isActive({ textAlign: 'center' }) ? 'bg-[#EEF3FD] text-[#3459A2] border-[#3459A2]/25' : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:border-gray-200 hover:text-gray-800'"
                      class="w-[30px] h-7 flex items-center justify-center rounded-md border cursor-pointer transition-all duration-100"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
                      </svg>
                    </button>

                    <!-- Align right -->
                    <button
                      @click="editor.chain().focus().setTextAlign('right').run()"
                      title="Alinhar à direita"
                      :class="editor.isActive({ textAlign: 'right' }) ? 'bg-[#EEF3FD] text-[#3459A2] border-[#3459A2]/25' : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:border-gray-200 hover:text-gray-800'"
                      class="w-[30px] h-7 flex items-center justify-center rounded-md border cursor-pointer transition-all duration-100"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
                      </svg>
                    </button>

                    <div class="w-px h-5 bg-gray-200 mx-1"></div>

                    <!-- Bullet list -->
                    <button
                      @click="editor.chain().focus().toggleBulletList().run()"
                      title="Lista com marcadores"
                      :class="editor.isActive('bulletList') ? 'bg-[#EEF3FD] text-[#3459A2] border-[#3459A2]/25' : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:border-gray-200 hover:text-gray-800'"
                      class="w-[30px] h-7 flex items-center justify-center rounded-md border cursor-pointer transition-all duration-100"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
                        <circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>
                      </svg>
                    </button>

                    <!-- Ordered list -->
                    <button
                      @click="editor.chain().focus().toggleOrderedList().run()"
                      title="Lista numerada"
                      :class="editor.isActive('orderedList') ? 'bg-[#EEF3FD] text-[#3459A2] border-[#3459A2]/25' : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:border-gray-200 hover:text-gray-800'"
                      class="w-[30px] h-7 flex items-center justify-center rounded-md border cursor-pointer transition-all duration-100"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
                        <path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
                      </svg>
                    </button>
                  </div>

                  <!-- TipTap area -->
                  <EditorContent :editor="editor" class="min-h-[280px] px-4 py-3.5 bg-white" />
                </div>
              </div>

              <!-- Variables sidebar -->
              <div class="sm:order-none order-first bg-gray-50 border border-gray-200 rounded-[10px] p-3.5 flex flex-col gap-2.5">
                <div class="flex items-center gap-1.5 font-bold text-gray-500 uppercase tracking-widest text-[11px]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Variáveis
                </div>
                <p class="text-gray-400 text-[11px] leading-snug -mt-1">Clique para inserir no texto:</p>

                <template v-for="(group, gi) in variableGroups" :key="gi">
                  <div class="flex flex-col gap-1">
                    <div class="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-0.5">
                      {{ group.title }}
                    </div>
                    <div
                      v-for="v in group.vars"
                      :key="v.key"
                      @click="insertVariable(v.key)"
                      title="Clique para inserir"
                      class="flex flex-col gap-0.5 cursor-pointer px-2 py-1.5 rounded-md border border-transparent hover:bg-[#EEF3FD] hover:border-[#3459A2]/20 transition-all duration-100"
                    >
                      <code class="font-mono text-[11px] font-semibold text-[#3459A2] break-all">{{ wrapVar(v.key) }}</code>
                      <span class="text-[11px] text-gray-400 leading-snug">{{ v.label }}</span>
                    </div>
                  </div>
                </template>
              </div>

            </div>
          </div>

          <!-- Modal footer -->
          <div class="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              @click="closeModal"
              class="bg-white text-gray-500 border border-gray-200 rounded-[10px] px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors duration-150"
            >
              Cancelar
            </button>
            <button
              @click="saveTemplate"
              :disabled="saving"
              class="flex items-center gap-2 bg-[#3459A2] hover:bg-[#2a4a8a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-[10px] transition-colors duration-200"
            >
              <span v-if="saving" class="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
              {{ saving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Template') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Delete Confirm Modal ────────────────────────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/45 backdrop-blur-sm"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-white rounded-[14px] shadow-2xl w-full max-w-[440px] flex flex-col animate-modal-in">
          <div class="px-6 py-5 border-b border-gray-100">
            <h2 class="text-lg font-bold text-red-600">Excluir Template</h2>
          </div>
          <div class="px-6 py-5">
            <p class="text-sm text-gray-600 leading-relaxed">
              Tem certeza que deseja excluir o template
              <strong class="text-gray-900">{{ templateToDelete?.titulo }}</strong>?
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <div class="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100">
            <button
              @click="showDeleteModal = false"
              class="bg-white text-gray-500 border border-gray-200 rounded-[10px] px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors duration-150"
            >
              Cancelar
            </button>
            <button
              @click="deleteTemplate"
              :disabled="deleting"
              class="bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-[10px] transition-colors duration-200"
            >
              {{ deleting ? 'Excluindo...' : 'Excluir' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Toast ──────────────────────────────────────────────────────────── -->
    <div class="fixed bottom-6 right-6 z-[2000]">
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 translate-x-4"
        leave-active-class="transition-all duration-200 ease-in"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-if="toast.show"
          :class="toast.type === 'success'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200'"
          class="flex items-center gap-2.5 px-4 py-3 rounded-[10px] text-sm font-medium shadow-lg max-w-sm border"
        >
          <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ toast.message }}
        </div>
      </Transition>
    </div>

  </Whiteboard>
</template>

<script>
import { ref, reactive, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import { Mark, Extension, mergeAttributes } from '@tiptap/core'
import { apiClient } from '@/service/apiService'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'

// ─── Font Size Extension ──────────────────────────────────────────────────
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [{
      types: ['textStyle'],
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el) => el.style.fontSize || null,
          renderHTML: (attrs) => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
        },
      },
    }]
  },
  addCommands() {
    return {
      setFontSize:   (size) => ({ chain }) => chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize: ()     => ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    }
  },
})

// ─── TemplateVar Mark ─────────────────────────────────────────────────────
const TemplateVar = Mark.create({
  name: 'templateVar',
  spanning: false,
  exitable: true,
  addAttributes() {
    return {
      varKey: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-var-key'),
        renderHTML: (attrs) => ({ 'data-var-key': attrs.varKey }),
      },
    }
  },
  parseHTML()  { return [{ tag: 'span[data-var-key]' }] },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { class: 'tpl-var' }), 0]
  },
})

export default {
  name: 'TemplateRespostaView',
  components: { Whiteboard, EditorContent },

  setup() {
    // ─── State ────────────────────────────────────────────────────────────
    const templates        = ref([])
    const loading          = ref(true)
    const showModal        = ref(false)
    const showDeleteModal  = ref(false)
    const isEditing        = ref(false)
    const saving           = ref(false)
    const deleting         = ref(false)
    const templateToDelete = ref(null)
    const editingId        = ref(null)
    const form  = reactive({ titulo: '', descricao: '' })
    const toast = reactive({ show: false, message: '', type: 'success' })
    let toastTimer = null
    
    const wrapVar    = (key) => `{{ ${key} }}`
    
    // ─── Variable groups ──────────────────────────────────────────────────
    const variableGroups = [
      {
        title: 'Dados do Requerente',
        vars: [
          { key: 'nome_completo',        label: 'Nome completo do requerente' },
          { key: 'matriculas',           label: 'Matrículas (separadas por vírgula)' },
          { key: 'cpf',                  label: 'CPF do requerente' },
          { key: 'descricao',            label: 'Descrição do recurso' },
          { key: 'created_at_formatado', label: 'Data de abertura do recurso' },
        ],
      },
      {
        title: 'Campos de Decisão',
        vars: [
          { key: 'decisao_dropdown',             label: 'Decisão (Deferido / Indeferido…)' },
          { key: 'unidade_responsavel_dropdown',  label: 'Unidade responsável' },
        ],
      }
    ]

    // ─── TipTap ───────────────────────────────────────────────────────────
    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        FontSize,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TemplateVar,
      ],
      content: '',
      editorProps: { attributes: { class: 'tiptap-editor' } },
    })

    onBeforeUnmount(() => editor.value?.destroy())

    // ─── Helpers ──────────────────────────────────────────────────────────
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'

    const showToast = (message, type = 'success') => {
      clearTimeout(toastTimer)
      Object.assign(toast, { message, type, show: true })
      toastTimer = setTimeout(() => { toast.show = false }, 3500)
    }

    const editorHtmlToTemplate = (html) => {
      const div = document.createElement('div')
      div.innerHTML = html
      div.querySelectorAll('span[data-var-key]').forEach((el) => {
        el.replaceWith(`{{ ${el.getAttribute('data-var-key')} }}`)
      })
      return div.innerHTML
    }

    const templateToEditorHtml = (html) =>
      html.replace(/{{\s*(\w+)\s*}}/g, (_, key) =>
        `<span data-var-key="${key}" class="tpl-var">{{ ${key} }}</span>`
      )

    const insertVariable = (key) => {
      if (!editor.value) return
      editor.value.chain().focus().insertContent([
        { type: 'text', text: `{{ ${key} }}`, marks: [{ type: 'templateVar', attrs: { varKey: key } }] },
        { type: 'text', text: '\u00a0' },
      ]).run()
    }

    const setFontSize = (event) => {
      const size = event.target.value
      size
        ? editor.value?.chain().focus().setFontSize(size).run()
        : editor.value?.chain().focus().unsetFontSize().run()
      event.target.value = ''
    }

    // ─── API ──────────────────────────────────────────────────────────────
    const API = '/recursos/templates/'

    const fetchTemplates = async () => {
      loading.value = true
      try {
        const { data } = await apiClient.get(API)
        templates.value = Array.isArray(data) ? data : (data.results ?? [])
      } catch {
        showToast('Erro ao carregar templates.', 'error')
      } finally {
        loading.value = false
      }
    }

    const openCreateModal = () => {
      isEditing.value = false
      editingId.value = null
      form.titulo     = ''
      form.descricao  = ''
      editor.value?.commands.setContent('')
      showModal.value = true
    }

    const openEditModal = (template) => {
      isEditing.value = true
      editingId.value = template.id
      form.titulo     = template.titulo
      form.descricao  = template.descricao || ''
      editor.value?.commands.setContent(templateToEditorHtml(template.corpo_html))
      showModal.value = true
    }

    const closeModal = () => { showModal.value = false }

    const saveTemplate = async () => {
      if (!form.titulo.trim())              return showToast('O título é obrigatório.', 'error')
      if (!editor.value?.getText().trim())  return showToast('O corpo do template não pode estar vazio.', 'error')

      saving.value = true
      const payload = {
        titulo:     form.titulo.trim(),
        descricao:  form.descricao.trim(),
        corpo_html: editorHtmlToTemplate(editor.value.getHTML()),
      }

      try {
        if (isEditing.value) {
          const { data } = await apiClient.put(`${API}${editingId.value}/`, payload)
          const idx = templates.value.findIndex((t) => t.id === editingId.value)
          if (idx !== -1) templates.value[idx] = data
          showToast('Template atualizado com sucesso!')
        } else {
          const { data } = await apiClient.post(API, payload)
          templates.value.unshift(data)
          showToast('Template criado com sucesso!')
        }
        closeModal()
      } catch (err) {
        showToast(err.response?.data?.titulo?.[0] || 'Erro ao salvar template.', 'error')
      } finally {
        saving.value = false
      }
    }

    const confirmDelete = (template) => {
      templateToDelete.value = template
      showDeleteModal.value  = true
    }

    const deleteTemplate = async () => {
      deleting.value = true
      try {
        await apiClient.delete(`${API}${templateToDelete.value.id}/`)
        templates.value = templates.value.filter((t) => t.id !== templateToDelete.value.id)
        showToast('Template excluído.')
        showDeleteModal.value = false
      } catch {
        showToast('Erro ao excluir template.', 'error')
      } finally {
        deleting.value = false
      }
    }

    fetchTemplates()

    return {
      templates, loading, showModal, showDeleteModal,
      isEditing, saving, deleting, templateToDelete,
      form, toast, editor, variableGroups,
      formatDate, openCreateModal, openEditModal,
      closeModal, saveTemplate, confirmDelete,
      deleteTemplate, insertVariable, setFontSize, wrapVar,
    }
  },
}
</script>

<style>
/* ── TipTap: must be global (não pode ser scoped) ─────────────────────── */
.tiptap-editor {
  min-height: 260px;
  outline: none;
  font-size: 0.95rem;
  line-height: 1.65;
  color: #1a1e27;
}
.tiptap-editor p       { margin: 0 0 0.6em; }
.tiptap-editor ul,
.tiptap-editor ol      { padding-left: 1.4em; margin: 0.4em 0; }
.tiptap-editor li      { margin-bottom: 0.25em; }
.tiptap-editor p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
  float: left;
  height: 0;
}

/* Variable chip */
.tpl-var {
  display: inline;
  font-family: 'Courier New', monospace;
  font-size: 0.82em;
  background: #EEF3FD;
  color: #3459A2;
  border: 1px solid rgba(52, 89, 162, 0.25);
  border-radius: 4px;
  padding: 1px 5px;
  user-select: all;
}

/* Modal animation */
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to   { opacity: 1; transform: none; }
}
.animate-modal-in { animation: modal-in 0.18s ease both; }
</style>