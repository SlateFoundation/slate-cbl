import { defineStore } from "pinia";

export const useSkillStore = defineStore("skillStore", {
  state: () => ({
    path: "/cbl/skills",
    extraParams: {
      summary: true,
    },
  }),

  actions: {
    transformData(data) {
      return data.map(function (item) {
        return {
          title: `${item.Code} - ${item.Descriptor}`,
          Code: item.Code,
        };
      });
    },
  },
});
