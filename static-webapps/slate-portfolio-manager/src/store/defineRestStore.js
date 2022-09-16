import { defineStore } from 'pinia';
import querystring from 'querystring';
import Vue from 'vue';

import client from './client';

export default ({
  id, baseURL, actions = {}, getters = {},
}) => {
  const pending = {};
  const makeUrl = (query) => {
    let url = baseURL;
    if (query) {
      url += baseURL.includes('?') ? '&' : '?';
      if (typeof query === 'object') {
        url += querystring.stringify(query);
      } else {
        url += query;
      }
    }
    pending[url] = pending[url] || [];
    return url;
  };

  return defineStore(id, {
    baseURL,
    state: () => ({ response: {}, loading: {}, error: {} }),
    getters,
    actions: {
      ...actions,
      get(query) {
        this.fetch(query);
        return this.$state.response[makeUrl(query)];
      },
      fetch(query) {
        const url = makeUrl(query);
        if (this.$state.response[url]) {
          // already fetched, use that
          return Promise.resolve(this.$state.response);
        }

        if (this.$state.error[url]) {
          // already failed, use that
          return Promise.reject(this.$state.error);
        }

        if (this.$state.loading[url]) {
          // ajax call in progress, throw it on the queue
          return new Promise((resolve, reject) => pending[url].push([resolve, reject]));
        }

        const set = (data) => {
          Object.entries(data).forEach(([key, value]) => {
            Vue.set(this.$state[key], url, value);
          });
        };
        // get the login and see
        set({ loading: true });
        return client.get(url)
          .then((response) => {
            set({ loading: false, response });
            pending[url].forEach(([resolve]) => resolve(response));
            pending[url] = [];
            return response;
          })
          .catch((error) => {
            set({ loading: false, error });
            pending[url].forEach(([_, reject]) => reject(error));
            pending[url] = [];
            throw error;
          });
      },

      refetch(query) {
        const url = makeUrl(query);
        Vue.set(this.$state.response, url, null);
        return this.fetch(query);
      },
    },
  });
};
