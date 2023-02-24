import { defineStore } from "pinia";
import axios from "axios";

export const useSkillStore = defineStore("skillStore", {
  state: () => ({
    data: [],
  }),
  actions: {
    async fetch() {
      this.loading = true;

      await axios
        .get(
          this.getRequestUrl("/cbl/skills?summary=true"),
          this.getRequestHeaders()
        )
        .then(({ data: res }) => {
          console.log(res);
          this.data = res.data.map(function (item) {
            return {
              title: `${item.Code} - ${item.Descriptor}`,
              value: item.ID,
              Code: item.Code,
              Descriptor: item.Descriptor,
            };
          });
          console.log(this.data);
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
