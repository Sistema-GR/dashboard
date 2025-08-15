<template>
  <div class="px-4 sm:px-10 mb-6">
    <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
      Recursos respondidos
    </div>
    <div class="bg-white p-6 rounded-b-[10px] shadow-md">
      <div class="text-center">
        <div class="text-4xl font-bold text-gray-800 mb-2">{{ stats.total }}</div>
        <div class="text-gray-600 mb-4">{{ getPercentage(stats.respondidos, stats.total) }}% dos recursos respondidos</div>
        <div class="w-full bg-gray-200 h-2 rounded-full">
          <div 
            class="bg-green-500 h-2 rounded-full transition-all duration-300" 
            :style="`width: ${getPercentage(stats.respondidos, stats.total)}%`"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportSummary',
  props: {
    stats: {
      type: Object,
      required: true
    }
  },
  methods: {
    getPercentage(value, total) {
      return total > 0 ? ((value / total) * 100).toFixed(1) : 0
    }
  }
}
</script>