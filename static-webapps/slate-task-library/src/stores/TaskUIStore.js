import { defineStore } from "pinia";

export const useTaskUIStore = defineStore("taskUIStore", {
  state: () => ({
    selected: [],
    editFormVisible: false,
    snackbar: false,
    snackbarMsg: false,
  }),
  actions: {
    toast(message) {
      this.snackbar = true;
      this.snackbarMsg = message;
    },
  },
});
