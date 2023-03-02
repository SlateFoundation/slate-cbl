import { defineStore } from "pinia";

export const useTaskUIStore = defineStore("taskUIStore", {
  state: () => ({
    selected: [],
    editFormVisible: false,
    snackbar: false,
    snackbarMsg: false,
    snackbarColor: "info",
  }),
  actions: {
    toast(message, color) {
      this.snackbar = true;
      this.snackbarMsg = message;
      this.snackbarColor = color ? color : "info";
    },
  },
});
