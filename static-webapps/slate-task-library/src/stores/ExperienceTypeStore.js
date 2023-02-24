import { defineStore } from "pinia";
import axios from "axios";

export const useExperienceTypeStore = defineStore("experienceTypeStore", {
  state: () => ({
    data: [],
  }),
  actions: {
    async fetch() {
      this.loading = true;

      await axios
        .get(
          this.getRequestUrl("/cbl/tasks/*experience-types"),
          this.getRequestHeaders()
        )
        .then(({ data: res }) => {
          this.data = res.data.map(function (item, index) {
            return { title: item, value: index };
          });
          this.loading = false;
        });
    },

    getRequestUrl: function (path) {
      const hostname = "http://localhost:2190";

      return `${hostname}${path}`;
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
