<template>

    <button 
        type="button" 
        :class="`rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${customClass}`">
        {{ label }}
    </button>

</template>

<script>
export default {
    name: "SecondaryButton", 
    inheritAttrs: false,
    props: {
      label: {
        type: String,
        required: true,
        default: 'default Title'
      },
      customClass: {
        type: String,
        default: ''
      }
    }
}
</script>
