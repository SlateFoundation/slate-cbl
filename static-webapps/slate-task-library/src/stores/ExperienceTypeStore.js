import { defineStore } from "pinia";

export const useExperienceTypeStore = defineStore("experienceTypeStore", {
  state: () => ({
    path: "/cbl/tasks/*experience-types",
  }),
});
