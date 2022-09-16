import { defineStore } from 'pinia';

export default defineStore('ui', {
  state: () => ({
    sidebarIsOpen: false,
  }),
  actions: {
    toggleSidebar() {
      this.$state.sidebarIsOpen = !this.$state.sidebarIsOpen;
    },
  },
});
