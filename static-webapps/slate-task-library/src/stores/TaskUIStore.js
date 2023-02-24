import { defineStore } from "pinia";

export const useTaskUIStore = defineStore("taskUIStore", {
  state: () => ({
    selected: [],
    editFormVisible: false,
  }),
});
