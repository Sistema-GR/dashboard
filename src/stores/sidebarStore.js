import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isSidebarMinimized: false,
    isVisible: true,
    reportPage: 'Report'
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized
    },
    setSidebarMinimized(val) {
      this.isSidebarMinimized = val
    },
    setVisible(val) {
      this.isVisible = val
    },
    setReportPage(val) {
      this.reportPage = val
    }
  }
})