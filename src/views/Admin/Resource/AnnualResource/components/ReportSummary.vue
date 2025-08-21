<template>
  <div class="flex flex-col w-full px-10 py-10">
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
            <div class="bg-[#3459A2] text-white text-center font-bold text-lg p-3 rounded-t-[10px]">
        Recursos respondidos
      </div>
      <div class="bg-blue-50 px-3 pt-2 pb-1 rounded-b-[8px]">
        <div class="flex flex-row items-center justify-between mb-1">
          <span class="text-[22px] font-bold text-gray-800 leading-none">{{ stats.respondidos }}</span>
          <span class="text-[12px] text-gray-600">{{ getPercentage(stats.respondidos, stats.total) }}% dos recursos respondidos</span>
        </div>
        <div class="relative w-full h-[4px] bg-[#B7E0E7] rounded-full">
          <div
            class="absolute left-0 top-0 h-[4px] bg-[#5DBB63] rounded-full"
            :style="`width: calc(${getPercentage(stats.respondidos, stats.total)}% - 8px); min-width:0; max-width:100%;`"
          ></div>
          <div
            class="absolute top-0 h-[4px] bg-[#D9534F] rounded-r-full"
            :style="`right:0; width:8px; left:calc(${getPercentage(stats.respondidos, stats.total)}% - 8px); min-width:0; max-width:8px;`"
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