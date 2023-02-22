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
        .then(({ data }) => {
          this.data = data.data;
          this.total = data.total;
          this.loading = false;
        });
    },
    async destroy(taskID) {
      this.loading = true;

      axios
        .post(
          this.getRequestUrl("/cbl/tasks/destroy"),
          { data: [{ ID: taskID }] },
          this.getRequestHeaders()
        )
        .then(({ data }) => {
          if (data.success === true) {
            this.data = this.data.filter((rec) => rec.ID !== taskID);
          }
        });

      this.loading = false;
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
