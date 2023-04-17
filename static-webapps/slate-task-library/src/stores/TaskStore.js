import { defineStore } from "pinia";

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    path: "/cbl/tasks",
    limit: 20,
    includes: [
      "Attachments",
      "Creator",
      "ParentTask",
      "Skills",
      "ClonedTask",
      "SubTasks",
    ],
    extraParams: {
      // eslint-disable-next-line camelcase
      include_archived: false,
    },
    blankRecord: {
      Class: "Slate\\CBL\\Tasks\\ExperienceTask",
      Status: "shared",
    },
  }),

  actions: {
    prepareRecord(record) {
      if (record.Skills) {
        if (Array.isArray(record.Skills) && record.Skills.length > 0) {
          record.Skills = record.Skills.map((skill) => skill.Code);
        } else {
          delete record.Skills;
        }
      }

      return record;
    },
  },
});
