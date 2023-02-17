import { defineStore } from "pinia";

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    data: [],
    limit: 20,
    offset: 0,
    total: 0,
    sortBy: null,
    order: "asc",
    loading: false,
  }),
  getters: {
    totalCount: (state) => state.tasks.length,
  },
  actions: {
    async fetchTasks() {
      this.loading = true;

      const sort = this.getEncodedSortBy(),
        offset = this.getEncodedOffset(),
        hostname = "http://localhost:2190",
        path = "/cbl/tasks",
        include = "Attachments%2CCreator%2CParentTask%2CSkills%2CClonedTask",
        url = `${hostname}${path}?include_archived=false&offset=${this.offset}&limit=${this.limit}&include=${include}${sort}${offset}`,
        res = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "include", // include, *same-origin, omit
          headers: {
            Accept: "application/json",
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }),
        json = await res.json();

      console.log(json);

      this.data = json.data;
      this.total = json.total;
      this.loading = false;
    },
    setSortBy: function (sortBy) {
      this.sortBy = sortBy;
    },
    setOffset: function (offset) {
      console.log(offset);
      this.offset = offset;
    },
    setLimit: function (limit) {
      this.limit = limit;
    },
    getEncodedSortBy: function () {
      const sort = this.sortBy;

      if (sort) {
        return `&sort=${sort.key}&dir=${sort.order.toUpperCase()}`;
      }
      return "";
    },
    getEncodedOffset: function () {
      const offset = this.offset;

      if (offset > 0) {
        return `&offset=${offset}`;
      }
      return "";
    },
  },
});
