<template>

    <nav class="flex items-center justify-between border-gray-200 px-5 mx-5 pt-5 sm:px-0">

        <div class="-mt-px flex w-0 flex-1">

            <a
              href="#"
              @click.prevent="prevPage"
              :class="{'text-gray-400': !hasPrevPage, 'text-gray-500 hover:text-gray-700': hasPrevPage}"
              class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-15 font-medium"
              aria-disabled="!hasPrevPage"
            >
              <ArrowLongLeftIcon class="mr-3 h-5 w-5" aria-hidden="true" /> Anterior

            </a>

        </div>

        <div class="hidden md:-mt-px md:flex">
          
            <template v-if="showFirstEllipsis">

                <a
                  v-for="page in firstPages"
                  :key="page"
                  @click.prevent="goToPage(page)"
                  :class="{'border-indigo-500 text-indigo-600': page === currentPage, 'border-transparent cursor-pointer text-gray-500 hover:text-gray-700': page !== currentPage}"
                  class="inline-flex items-center border-t-2 px-4 pt-4 text-15 font-medium"
                  :aria-current="page === currentPage ? 'page' : undefined"
                >
                  {{ page }}
                </a>

                <span class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-15 font-medium text-gray-500">...</span>

            </template>

            <template v-for="page in visiblePages" :key="page">
              
                <a
                  @click.prevent="goToPage(page)"
                  :class="{'border-indigo-500 text-indigo-600': page === currentPage, 'border-transparent cursor-pointer text-gray-500 hover:text-gray-700': page !== currentPage}"
                  class="inline-flex items-center border-t-2 px-4 pt-4 text-15 font-medium"
                  :aria-current="page === currentPage ? 'page' : undefined"
                >
                  {{ page }}
                </a>

            </template>

            <template v-if="showLastEllipsis">

                <span class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-15 font-medium text-gray-500">...</span>

                <a
                  v-for="page in lastPages"
                  :key="page"
                  @click.prevent="goToPage(page)"
                  :class="{'border-indigo-500 text-indigo-600': page === currentPage, 'border-transparent cursor-pointer text-gray-500 hover:text-gray-700': page !== currentPage}"
                  class="inline-flex items-center border-t-2 px-4 pt-4 text-15 font-medium"
                  :aria-current="page === currentPage ? 'page' : undefined"
                >
                  {{ page }}
                </a>

            </template>

        </div>

        <div class="-mt-px flex w-0 flex-1 justify-end">

            <a
              href="#"
              @click.prevent="nextPage"
              :class="{'text-gray-400': !hasNextPage, 'text-gray-500 hover:text-gray-700': hasNextPage}"
              class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-15 font-medium"
              aria-disabled="!hasNextPage"
            > Próxima
              
              <ArrowLongRightIcon class="ml-3 h-5 w-5" aria-hidden="true" />

            </a>
        </div>

    </nav>

</template>

<script setup>
import { computed } from 'vue'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  currentPage: Number,
  totalPages: Number
})

const emit = defineEmits(['update:currentPage'])

const hasPrevPage = computed(() => props.currentPage > 1)
const hasNextPage = computed(() => props.currentPage < props.totalPages)

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}

const prevPage = () => {
  if (hasPrevPage.value) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (hasNextPage.value) {
    emit('update:currentPage', props.currentPage + 1)
  }
}

const visiblePageRange = 7
const halfRange = Math.floor(visiblePageRange / 2)

const visiblePages = computed(() => {
  let start = Math.max(1, props.currentPage - halfRange)
  let end = Math.min(props.totalPages, props.currentPage + halfRange)

  if (props.currentPage - halfRange <= 0) {
    end = Math.min(visiblePageRange, props.totalPages)
  }
  if (props.currentPage + halfRange > props.totalPages) {
    start = Math.max(1, props.totalPages - visiblePageRange + 1)
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const firstPages = computed(() => {
  if (props.currentPage > 4) {
    return [1, 2, 3, 4]
  }
  return []
})

const lastPages = computed(() => {
  if (props.currentPage < props.totalPages - 3) {
    return [props.totalPages - 3, props.totalPages - 2, props.totalPages - 1, props.totalPages]
  }
  return []
})

const showFirstEllipsis = computed(() => props.currentPage > 5)
const showLastEllipsis = computed(() => props.currentPage < props.totalPages - 4)
</script>
