import { defineStore } from 'pinia';

export default defineStore('ui', {
  state: () => ({ alert: null, confirm: null }),
  actions: {
    alert(options) {
      this.$state.alert = options;
    },
    confirm(body, action) {
      // convenience function for quickly adding a yes/no alert
      this.alert({
        body,
        actions: [
          {
            text: 'Cancel',
            class: 'btn btn-secondary',
            click: () => this.alert(null),
          },
          {
            text: 'Confirm',
            click: () => {
              this.alert(null);
              action();
            },
          },
        ],
      });
    },
  },
});
