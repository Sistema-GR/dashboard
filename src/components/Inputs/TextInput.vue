<template>
  <div :class="`flex flex-col justify-center w-full gap-2 ${containerClassName}`">
    <!-- Adicionando a prop labelClass para customizar o estilo do label -->
    <label v-if="label" :for="inputId" :class="`text-amber-50 ${labelClass}`">{{ label }}</label>

    <div role="input-container" :class="inputContainerClass">
      <input
        :id="inputId"
        :disabled="disabled"
        :placeholder="placeholder"
        :type="type"
        v-model="internalValue"

        v-bind="$attrs"
        class="bg-transparent appearance-none h-full border-none outline-none w-full"
      />
    </div>

    <div v-if="error" class="text-15 font-medium text-label text-red-600 truncate">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  id: String,
  placeholder: {
    type: String,
    default: '',
  },
  containerClassName: String,
  error: String,
  label: String,
  disabled: Boolean,
  type: {
    type: String,
    default: 'text', 
  },
  success: Boolean,
  info: Boolean,
  warning: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  // Adicionando a prop labelClass
  labelClass: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const internalValue = computed({
  get() {
    if (props.modelValue === null || props.modelValue === undefined) {
      return '';
    }
    // Sempre converte o valor recebido (incluindo booleanos) para uma String para o input.
    return String(props.modelValue);
  },
  set(newValue) {
    // Quando o usuário digita, o novo valor é emitido para o componente pai.
    emit('update:modelValue', newValue);
  }
});

function updateInput(event) {
  emit('update:modelValue', event.target.value);
}

const inputId = computed(() => props.id || `${props.type}-${Math.random()}`);

const inputContainerClass = computed(() => {
  return `${props.disabled ? 'disabledClass' : 'enabledClass'}
    flex flex-row items-center justify-between bg-white space-x-2 px-2 py-3 w-full rounded-[10px] border border-neutral-cold-100
    ${props.error ? 'border-2 border-red-600' : ''}
    ${props.success ? 'border-2 border-green-600' : ''}
    ${props.info ? 'border-2 border-blue-600' : ''}
    ${props.warning ? 'border-2 border-yellow-400' : ''}`;
});
</script>
