import { defineStore } from "pinia";

export const useTaskDataTableStore = defineStore("taskDataTableStore", {
  state: () => ({
    selected: [],
  }),
});
