import { defineStore } from "pinia";

export const useParentTaskStore = defineStore("parentTaskStore", {
  state: () => ({
    path: "/cbl/tasks",
    limit: 30,
    sortBy: { key: "Created", order: "asc" },
    includes: ["Creator"],
    extraParams: {
      q: "",
    },
  }),
});
