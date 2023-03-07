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
      ID: -2, // todo: necessary? current task manager does this
      Class: "Slate\\CBL\\Tasks\\ExperienceTask",
      Status: "shared",
    },
  }),
});
