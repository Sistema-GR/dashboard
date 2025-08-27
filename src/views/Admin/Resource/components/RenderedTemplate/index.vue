<template>
  <div
    class="p-4 border rounded-md bg-white prose max-w-none"
    v-html="templateSkeleton"
    @input="handleInput"
    @change="handleInput"
    @click.stop
  ></div>
</template>

<script setup>
import { computed, defineProps, defineModel, watch, nextTick } from 'vue';
import logoUrl from '@/assets/images/logo_prefeitura.png'; 

const props = defineProps({
  htmlContent: { type: String, required: true },
  resourceData: { type: Object, required: true }
});

const formModel = defineModel({ type: Object, required: true });

const templateSkeleton = computed(() => {
  if (!props.htmlContent) return '';

  const context = {
    nome_completo: `<strong>${props.resourceData.nome_completo || ''}</strong>`,
    matriculas: `<strong>${(props.resourceData.matriculas || []).join(', ')}</strong>`,
    cpf: `<strong>${props.resourceData.cpf || ''}</strong>`,
    descricao: `<div class="quote">"${props.resourceData.descricao || ''}"</div>`,
    created_at_formatado: `<strong>${new Date(props.resourceData.created_at).toLocaleDateString()}</strong>`,
    url_logo: logoUrl, 
  };

  const regex = /{{\s*(\w+)\s*}}/g;

  return props.htmlContent.replace(regex, (match, variableName) => {
    if (context[variableName]) {
      if (variableName === 'url_logo') {
        return context[variableName];
      }
      return context[variableName];
    }
    
    if (variableName === 'decisao_dropdown') {
      const options = [
        { value: 'deferido', text: 'Deferido' },
        { value: 'indeferido', text: 'Indeferido' },
        { value: 'parcialmente_deferido', text: 'Deferido Parcialmente' },
      ];
      const optionsHtml = options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('');
      return `<select data-variable-name="decisao" class="..."><option value="" disabled selected>Selecione...</option>${optionsHtml}</select>`;
    }

    if (variableName === 'unidade_responsavel_dropdown') {
      const options = [
        { value: 'UPL', text: 'UPL' },
        { value: 'UGP', text: 'UGP' },
        { value: 'Formação', text: 'Formação' },
        
      ];
      const optionsHtml = options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('');
      return `<select data-variable-name="unidade_responsavel" class="..."><option value="" disabled selected>Selecione...</option>${optionsHtml}</select>`;
    }

    return `<textarea
      data-variable-name="${variableName}"
      class="inline-block ..."
      rows="1"
      placeholder="[${variableName.replace(/_/g, ' ')}]"
    ></textarea>`;
  });
});

watch(templateSkeleton, async () => {
  await nextTick(); 
  
  const formElements = document.querySelectorAll('[data-variable-name]');
  formElements.forEach(element => {
    const variableName = element.dataset.variableName;
    if (formModel.value[variableName]) {
      element.value = formModel.value[variableName];
      if (element.tagName === 'TEXTAREA') autoResize(element);
    }
  });
}, { immediate: true }); 

const handleInput = (event) => {
  const target = event.target;
  if (target && target.dataset.variableName) {
    formModel.value[target.dataset.variableName] = target.value;
    if (target.tagName === 'TEXTAREA') autoResize(target);
  }
};

const autoResize = (element) => {
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
};

</script>