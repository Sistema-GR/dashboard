<template>
     <button 
        v-bind="$attrs"
        :class="`flex w-full items-center justify-center px-2 py-4 text-white rounded-[10px] font-bold ${customColor}`">
        {{ value }}
    </button>
</template>


<script>
export default {
    name: "PrimaryButton",
    inheritAttrs: false,
    props: {
      customColor: {
        type: String,
        required: false,
        default: '', 
      },
      value: {
        type: String,
        required: true,
      },
    },
};
</script>
