<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-t-[8px] focus:outline-none flex items-center">
      <span class="text-2xl font-bold text-black">Dados Completos</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="p-0">
      <div class="p-6">
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <div class="bg-[#3459A2] text-white text-center font-bold text-lg p-3">
            Dados Completos dos Recursos
          </div>
          <div class="p-6 overflow-x-auto">
            <table class="min-w-full text-sm text-left border-separate border-spacing-y-1">
              <thead>
                <tr class="bg-[#2360a5] text-white">
                  <th class="px-3 py-2 font-bold">Endereço de e-mail</th>
                  <th class="px-3 py-2 font-bold">Nome completo</th>
                  <th class="px-3 py-2 font-bold">Unidade de atuação</th>
                  <th class="px-3 py-2 font-bold">Categoria</th>
                  <th class="px-3 py-2 font-bold">Equipe Responsável</th>
                  <th class="px-3 py-2 font-bold">Responsável</th>
                </tr>
              </thead>
              <tbody class="bg-white text-black">
                <tr v-for="(item, index) in tableData" :key="index" class="hover:bg-gray-50">
                  <td class="px-3 py-2">{{ item.email }}</td>
                  <td class="px-3 py-2">{{ item.nomeCompleto }}</td>
                  <td class="px-3 py-2">{{ item.unidadeAtuacao }}</td>
                  <td class="px-3 py-2">{{ item.categoria }}</td>
                  <td class="px-3 py-2">{{ item.equipeResponsavel }}</td>
                  <td class="px-3 py-2">{{ item.responsavel }}</td>
                </tr>
              </tbody>
            </table>
            
            <!-- Paginação -->
            <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div class="text-sm text-gray-600">
                {{ paginationInfo }}
              </div>
              <div class="flex gap-2">
                <button 
                  @click="previousPage" 
                  :disabled="currentPage === 1"
                  class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <button 
                  @click="nextPage" 
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'DadosCompletos',
  components: {
    ChevronDownIcon
  },
  props: {
    data: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  setup(props) {
    const open = ref(true)
    const currentPage = ref(1)
    const itemsPerPage = ref(100)
    
    // Dados de exemplo baseados na imagem fornecida
    const defaultData = [
      {
        email: 'zeir.saracini@edu.joinville.sc.gov.br',
        nomeCompleto: 'Zeir Fontana Saracini',
        unidadeAtuacao: 'Adhemar Garcia; Raio de Sol',
        categoria: 'Formação',
        equipeResponsavel: 'Formação Áurea',
        responsavel: 'Áurea Vieira'
      },
      {
        email: 'willian.abtibol@edu.joinville.sc.gov.br',
        nomeCompleto: 'Willian Macedo Abtibol',
        unidadeAtuacao: 'Ade Sant\'Anna da Silveira',
        categoria: 'Discordância das regras estabelecidas',
        equipeResponsavel: 'UPL',
        responsavel: 'Juliana'
      },
      {
        email: 'viviane.soares@edu.joinville.sc.gov.br',
        nomeCompleto: 'Viviane Cristina Belegante Soares',
        unidadeAtuacao: 'Zilda Arns Neumann',
        categoria: 'Faltas',
        equipeResponsavel: 'UGP',
        responsavel: 'Jean Romain'
      },
      {
        email: 'vitor.cruz@edu.joinville.sc.gov.br',
        nomeCompleto: 'Vitor Lomeu Dinis da Cruz',
        unidadeAtuacao: 'Eladír Skibinski; Laura Andrade; Max Colin',
        categoria: 'Tempo de atuação',
        equipeResponsavel: 'UGP',
        responsavel: 'Tamires Liandro'
      },
      {
        email: 'vilma.borba@edu.joinville.sc.gov.br',
        nomeCompleto: 'Vilma Alberton de Lima de Borba',
        unidadeAtuacao: 'Estrelinha Brilhante',
        categoria: 'Faltas',
        equipeResponsavel: 'UGP',
        responsavel: 'Jean Romain'
      },
      {
        email: 'veronica.souza@edu.joinville.sc.gov.br',
        nomeCompleto: 'Veronica Maria da Silva de Siqueira de Souza Santos',
        unidadeAtuacao: 'Hans Müller',
        categoria: 'Mais de um critério',
        equipeResponsavel: 'Formação Juliano',
        responsavel: 'Juliano Turmina'
      },
      {
        email: 'veronica.fardim@edu.joinville.sc.gov.br',
        nomeCompleto: 'Verônica Aparecida Fardim',
        unidadeAtuacao: 'Joaquim Félix Moreira',
        categoria: 'Formação',
        equipeResponsavel: 'Formação',
        responsavel: 'Juliano Turmina'
      },
      {
        email: 'vera.gnoatto@edu.joinville.sc.gov.br',
        nomeCompleto: 'Vera Lucia da Silva Gnoatto',
        unidadeAtuacao: 'Valente Simoni',
        categoria: 'Formação',
        equipeResponsavel: 'Formação Áurea',
        responsavel: 'Áurea Vieira'
      },
      {
        email: 'vanessa.silveira@edu.joinville.sc.gov.br',
        nomeCompleto: 'Vanessa da Silveira',
        unidadeAtuacao: 'João Costa',
        categoria: 'Mais de um critério',
        equipeResponsavel: 'UGP',
        responsavel: 'Tamires Liandro'
      }
    ]

    // Usar dados props ou dados padrão
    const allData = computed(() => {
      return props.data && props.data.length > 0 ? props.data : defaultData
    })

    // Dados paginados
    const tableData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return allData.value.slice(start, end)
    })

    // Total de páginas
    const totalPages = computed(() => {
      return Math.ceil(allData.value.length / itemsPerPage.value)
    })

    // Informações de paginação
    const paginationInfo = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value + 1
      const end = Math.min(currentPage.value * itemsPerPage.value, allData.value.length)
      return `${start} - ${end} / ${allData.value.length}`
    })

    // Navegação
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    return {
      open,
      tableData,
      currentPage,
      totalPages,
      paginationInfo,
      nextPage,
      previousPage
    }
  }
}
</script>