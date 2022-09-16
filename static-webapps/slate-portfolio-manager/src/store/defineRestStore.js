import { defineStore } from 'pinia';
import querystring from 'querystring';
import Vue from 'vue';

import client from './client';

const noop = (a) => a;

export default ({
  id, baseURL, actions = {}, getters = {}, fromServer = noop,
}) => {
  const pending = {};
  const makeUrl = (target) => {
    let url = baseURL;
    if (target) {
      if (typeof target === 'object') {
        url += baseURL.includes('?') ? '&' : '?';
        url += querystring.stringify(target);
      } else {
        url += target;
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
      get(target) {
        this.fetch(target);
        return this.$state.response[makeUrl(target)];
      },
      fetch(target) {
        const url = makeUrl(target);
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
            set({ loading: false, response: fromServer(response) });
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

      refetch(target) {
        const url = makeUrl(target);
        Vue.set(this.$state.response, url, null);
        return this.fetch(target);
      },
    },
  });
};
