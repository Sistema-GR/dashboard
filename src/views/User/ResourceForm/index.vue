<template>
  <Whiteboard title="Formulário de Recurso" :isSidebarMinimized="isSidebarMinimized">
    <!-- Alerta superior no topo -->
   <div class="bg-blue-100 text-black flex items-center gap-4 px-6 pl-20 py-4 w-full mx-auto mb-6">
     <!-- Ícone de exclamação -->
    <svg class="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="transparent"/>
    <path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" />
    </svg>

    <!-- Texto -->
    <div class="flex flex-col">
    <span class="font-semibold text-15 sm:text-base">Não recebeu?</span>
    <RouterLink to="criteria">
      <span class="text-blue-700 underline text-15 hover:text-blue-800">
        Clique aqui e veja o detalhamento
      </span>
    </RouterLink>
    </div>
    </div>


        <div class="justify-center w-full max-w px-20 ml-40 mx-40">
      <div class="flex flex-col w-full space-y-6 py-4">

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-15">Nome completo</label>
          <span class="text-gray-700 text-15 border border-gray-300 rounded-[10px] px-3 py-2">Tom Cock Harris</span>
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-15">E-mail</label>
          <span class="text-gray-700 text-15 border border-gray-300 rounded-[10px] px-3 py-2">tom.harris@example.com</span>
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-15">CPF</label>
          <span class="text-gray-700 text-15 border border-gray-300 rounded-[10px] px-3 py-2">123.456.789-00</span>
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-15">Matrícula</label>
          <span class="text-gray-700 text-15 border border-gray-300 rounded-[10px] px-3 py-2">u04444</span>
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-15">Unidade de atuação</label>
          <span class="text-gray-700 text-15 border border-gray-300 rounded-[10px] px-3 py-2">Abdon Batista</span>
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-15">Descrição</label>
          <textarea
            v-model="description"
            class="w-full border border-gray-300 rounded-[10px] p-2 text-15 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
            placeholder="Descreva o motivo do recurso aqui..."
          ></textarea>
          <p v-if="errors.description" class="text-red-500 text-15 mt-1">{{ errors.description }}</p>
        </div>

        <div class="flex flex-col gap-1">
          <label class="font-semibold text-15">Documentos</label>
          <input
            type="file"
            @change="handleFileUpload"
            multiple
            class="block w-full text-15 text-gray-500 
                   file:mr-4 file:py-2 file:px-4 
                   file:border-1 file:border-gray-300 
                   file:rounded-[10px] file:text-15 file:font-semibold 
                   file:bg-blue-50 file:text-blue-700 
                   hover:file:bg-blue-100"
          />
          <p v-if="errors.files" class="text-red-500 text-15 mt-1">{{ errors.files }}</p>
        </div>

        <!-- Lista de arquivos -->
        <div v-if="files.length > 0" class="mt-2">
          <div class="mb-2">
            <h3 class="font-semibold text-15 sm:text-base">Arquivos Anexados:</h3>
          </div>

          <div class="flex flex-col gap-2 rounded-[10px] p-2">
            <div
              v-for="(file, index) in files"
              :key="index"
              class="flex items-center justify-between text-15 text-blue-500"
            >
              <div class="flex items-center gap-2">
                <PaperClipIcon class="w-5 h-5 text-gray-500" />
                <span class="underline">{{ file.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <ArrowDownTrayIcon class="w-6 h-6 text-gray-700 cursor-pointer" @click="downloadFile(file)" />
                <XMarkIcon class="w-5 h-5 text-red-500 cursor-pointer" @click="removeFile(index)" />
              </div>
            </div>
          </div>
        </div>

        <!-- Texto legal -->
        <div class="space-y-4">
          <p class="font-medium text-15 text-start">
            Este formulário é destinado à interposição de recursos por parte dos profissionais vinculados à Secretaria de Educação de Joinville, referente à Gratificação por Resultados, conforme estabelecido pela Lei nº 9.214/2022 e pelo Decreto Municipal nº 49.309/2022.
            <br><br>
            O período para submissão de recursos neste formulário é de 17/05/2024 a 16/06/2024, encerrando-se às 23h59 do último dia.
          </p>

          <p class="font-bold text-15 text-start">
            Atenção: Para a validação do recurso, é imprescindível anexar documentos que justifiquem e comprovem as alegações, incluindo eventuais divergências nos dados utilizados no cálculo da Gratificação por Resultados. O envio de documentos falsos ou informações inverídicas está sujeito à responsabilização administrativa, civil e criminal, conforme legislação vigente.
          </p>
        </div>

        <!-- Termos de aceite -->
        <div class="flex flex-col items-start gap-2">
          <div class="flex flex-row items-center gap-2">
            <input 
              type="checkbox" 
              id="terms" 
              v-model="termsAccepted" 
              class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" 
            />
            <label for="terms" class="text-15">
              Declaro que li e aceito os termos acima.
            </label>
          </div>
          <p v-if="errors.termsAccepted" class="text-red-500 text-15">{{ errors.termsAccepted }}</p>
        </div>

        <!-- Botão enviar -->
        <div class="flex justify-end mt-4">
          <PrimaryButton customColor="bg-[#4168b5] px-8 py-4 shadow-md hover:shadow-lg max-w-36" value="Enviar"/>
        </div>

      </div>
    </div>
  </Whiteboard>
</template>


<script>
import { inject, ref } from 'vue';
import { ArrowDownTrayIcon, PaperClipIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import { useRouter } from 'vue-router';

export default {
    name: "ResourceForm",
    components: { Whiteboard, PrimaryButton, ArrowDownTrayIcon, PaperClipIcon, XMarkIcon },

    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized');
        const files = ref([]);
        const description = ref('');
        const termsAccepted = ref(false);
        const errors = ref({});
        const router = useRouter();

        const handleFileUpload = (event) => {
            files.value = Array.from(event.target.files);
        };

        const removeFile = (index) => {
            files.value.splice(index, 1);
        };

        const validateForm = () => {
            errors.value = {};

            if (!description.value) {
                errors.value.description = 'A descrição é obrigatória.';
            }
            if (!files.value.length) {
                errors.value.files = 'É necessário anexar pelo menos um documento.';
            }
            if (!termsAccepted.value) {
                errors.value.termsAccepted = 'Você deve aceitar os termos.';
            }

            return Object.keys(errors.value).length === 0;
        };

        const submitForm = () => {
            if (validateForm()) {
                router.push('/user/sucess');
            }
        };

        return {
            isSidebarMinimized, files, description, termsAccepted, errors, handleFileUpload, removeFile, submitForm,
        };
    }
};
</script>
