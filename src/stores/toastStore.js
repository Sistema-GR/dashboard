import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    visible: false,
    message: '',
    type: 'success', // success, error, warning
    duration: 3000,
  }),
  actions: {
    show(message, type = 'success', duration = 3000) {
      this.message = message
      this.type = type
      this.duration = duration
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    success(message, duration = 3000) {
      this.show(message, 'success', duration)
    },
    error(message, duration = 3000) {
      this.show(message, 'error', duration)
    },
    warning(message, duration = 3000) {
      this.show(message, 'warning', duration)
    },
  },
})
