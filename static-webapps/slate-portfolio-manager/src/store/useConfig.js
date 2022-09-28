import { defineStore } from 'pinia';
import ls from 'local-storage-json';

const LS_KEY = 'app_config_storage';

const defaultState = {
  sidebarIsOpen: false,
  enrollmentGridSelection: undefined,
};

const initialState = {
  ...defaultState,
  ...ls.get(LS_KEY),
};

export default defineStore('config', {
  state: () => (initialState),
  actions: {
    set(key, value) {
      this.$state[key] = value;
      ls.set(LS_KEY, this.$state);
    },
    toggleSidebar() {
      this.$state.sidebarIsOpen = !this.$state.sidebarIsOpen;
    },
  },
});
