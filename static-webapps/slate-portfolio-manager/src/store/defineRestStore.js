import { defineStore } from 'pinia';
import querystring from 'querystring';
import Vue from 'vue';

import client from './client';

export default ({
  name, baseUrl, actions = {}, getters = {},
}) => {
  const pending = {};
  const makeUrl = (query) => {
    let url = baseUrl;
    pending[url] = pending[url] || [];
    if (query) {
      url += baseUrl.includes('?') ? '&' : '?';
      url += querystring.stringify(query);
    }
    return url;
  };

  return defineStore(name, {
    baseUrl,
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
            console.log('response', response);
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
