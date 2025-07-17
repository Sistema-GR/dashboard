<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">{{ Label }}</label>
    <input
      class="block w-5/6 border border-gray-200 shadow-sm rounded-lg text-sm file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4 dark:file:bg-blue-500 dark:file:text-white file:cursor-pointer"
      type="file"
      @change="onFileChange"
    />
  </div>
</template>

<script>
export default {
  name: 'FileInput',
  props: {
    Label: {
      type: String,
      required: true,
      default: 'Upload File',
    },
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      this.$emit('file-change', file); 
    },

  handleFileUpload(event) {
      const file = event.target.files[0];
      this.$emit('change', { target: { files: [file] } });
    },
    setFile(file) {
      this.$emit('change', { target: { files: [file] } });
    },
  },
};
</script>
