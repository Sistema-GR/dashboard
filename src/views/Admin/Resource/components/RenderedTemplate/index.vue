<template>
  <div
    class="p-4 border rounded-md bg-white prose max-w-none"
    v-html="templateHtmlStructure"
    @input="handleInput"
  ></div>
</template>

<script setup>
import { computed, defineProps, defineModel, watch, nextTick } from 'vue';

const props = defineProps({
  htmlContent: { type: String, required: true },
  resourceData: { type: Object, required: true }
});

const formModel = defineModel({ type: Object, required: true });

const templateHtmlStructure = computed(() => {
  console.log("Calculando ESTRUTURA HTML (deve acontecer apenas uma vez por template)");
  if (!props.htmlContent) return '';

  const context = {
    nome_completo: `<strong>${props.resourceData.nome_completo || ''}</strong>`,
    matricula: `<strong>${props.resourceData.matricula || ''}</strong>`,
    cpf: `<strong>${props.resourceData.cpf || ''}</strong>`,
    descricao: `<div class="quote">"${props.resourceData.descricao || ''}"</div>`,
    created_at_formatado: `<strong>${new Date(props.resourceData.created_at).toLocaleDateString()}</strong>`,
  };

  const regex = /{{\s*(\w+)\s*}}/g;

  return props.htmlContent.replace(regex, (match, variableName) => {
    if (context[variableName]) {
      return context[variableName];
    }

    return `<textarea
      class="inline-block w-auto mx-1 px-2 py-1 text-sm border rounded-md bg-gray-100 focus:outline-blue-500 focus:bg-white align-middle"
      rows="1"
      style="resize: none;"
      placeholder="[${variableName.replace(/_/g, ' ')}]"
      data-variable-name="${variableName}"
    ></textarea>`;
  });
});

watch(() => templateHtmlStructure.value, async (html) => {
  await nextTick(); 
  console.log("Estrutura HTML renderizada, preenchendo valores...");
  
  const textareas = document.querySelectorAll('textarea[data-variable-name]');
  textareas.forEach(textarea => {
    const variableName = textarea.dataset.variableName;
    if (formModel.value[variableName]) {
      textarea.value = formModel.value[variableName];
      autoResize(textarea); 
    }
  });
});


const handleInput = (event) => {
  const target = event.target;
  if (target && target.tagName === 'TEXTAREA' && target.dataset.variableName) {

    formModel.value[target.dataset.variableName] = target.value;
    autoResize(target);
  }
};

const autoResize = (element) => {
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
};

</script>