import { defineStore } from "pinia";
import axios from "axios";

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    data: [],
    limit: 20,
    offset: 0,
    total: 0,
    sortBy: null,
    order: "asc",
    loading: false,
    includes: ["Attachments", "Creator", "ParentTask", "Skills", "ClonedTask"],
  }),
  getters: {
    totalCount: (state) => state.tasks.length,
  },
  actions: {
    async fetchTasks() {
      this.loading = true;

      axios
        .get(this.getRequestUrl("/cbl/tasks"), this.getRequestHeaders())
        .then(({ data: res }) => {
          this.data = res.data;
          this.total = res.total;
          this.loading = false;
        });
    },
    async create(task) {
      this.loading = true;
      const payload = Object.assign(
        {
          ID: -2, // todo: necessary?
          Class: "Slate\\CBL\\Tasks\\ExperienceTask",
          Status: "shared",
        },
        task
      );

      await axios
        .post(
          this.getRequestUrl("/cbl/tasks/save"),
          {
            data: [payload],
          },
          this.getRequestHeaders()
        )
        .then(({ data: res }) => {
          this.loading = false;
          this.data.unshift(res.data[0]);
          return { success: res.success, data: res.data };
        });
    },
    async destroy(taskID) {
      this.loading = true;

      await axios
        .post(
          this.getRequestUrl("/cbl/tasks/destroy"),
          { data: [{ ID: taskID }] },
          this.getRequestHeaders()
        )
        .then(({ data: res }) => {
          this.loading = false;
          this.data = this.data.filter((rec) => rec.ID !== taskID);
          return { success: res.success };
        });
    },
    setSortBy: function (sortBy) {
      this.sortBy = sortBy;
    },
    setOffset: function (offset) {
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
    getRequestUrl: function (path) {
      const sort = this.getEncodedSortBy(),
        offset = this.getEncodedOffset(),
        hostname = "http://localhost:2190",
        include = encodeURIComponent(this.includes.join(","));

      return `${hostname}${path}?include_archived=false&offset=${this.offset}&limit=${this.limit}&include=${include}${sort}${offset}`;
    },
    getRequestHeaders: function () {
      return {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
    },
  },
});
