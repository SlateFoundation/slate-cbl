import { defineStore } from "pinia";

export const useCloneTaskStore = defineStore("cloneTaskStore", {
  state: () => ({
    path: "/cbl/tasks",
    limit: 30,
    sortBy: { key: "Title", order: "asc" },
    includes: [
      "Attachments",
      "Creator",
      "ParentTask",
      "Skills",
      "ClonedTask",
      "SubTasks",
    ],
    extraParams: {
      q: "",
    },
  }),
  actions: {
    // TODO: add this to API plugin?
    clearData() {
      this.data = [];
    },
  },
});
