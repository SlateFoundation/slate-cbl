import { defineStore } from 'pinia'

export const useUi = defineStore('ui', {
  state: () => ({
    sidebarIsOpen: false,
  }),
  actions: {
    toggleSidebar() {
      this.$state.sidebarIsOpen = !this.$state.sidebarIsOpen
    }
  }
})