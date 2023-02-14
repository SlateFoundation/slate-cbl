import { defineStore } from "pinia";

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    data: [],
    limit: 20,
    offset: 0,
    total: 0,
    loading: false,
  }),
  getters: {
    totalCount: (state) => {
      return state.tasks.length;
    },
  },
  actions: {
    async fetchTasks() {
      this.loading = true;


      const url =
        "http://localhost:2190/cbl/tasks?include_archived=false&offset=0&limit=20&include=Attachments%2CCreator%2CParentTask%2CSkills%2CClonedTask";

      const res = await fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include", // include, *same-origin, omit
        headers: {
          "Accept": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      });
      const json = await res.json();

      console.log(json);

      this.data = json.data;
      this.total = json.total;
      this.loading = false;
    },
  },
});
