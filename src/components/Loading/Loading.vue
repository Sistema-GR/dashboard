<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg">
        <svg
          aria-hidden="true"
          class="w-16 h-16 text-blue-600 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="mt-4 text-lg font-semibold text-gray-800">Carregando...</p>
        <p class="mt-1 text-sm text-gray-500">Aguarde um momento, estamos preparando tudo para você.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Loading",
  };
  </script>
  