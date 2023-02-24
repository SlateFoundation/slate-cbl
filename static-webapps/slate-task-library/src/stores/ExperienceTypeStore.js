import { defineStore } from "pinia";

export const useExperienceTypeStore = defineStore("experienceTypeStore", {
  state: () => ({
    path: "/cbl/tasks/*experience-types",
  }),
  actions: {
    transformData(data) {
      return data.map((item, index) => ({ title: item, value: index }));
    },
  },
});
