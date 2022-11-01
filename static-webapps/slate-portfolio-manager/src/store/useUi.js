import { defineStore } from 'pinia';

export default defineStore('ui', {
  state: () => ({ alert: null, confirm: null }),
  actions: {
    alert(options) {
      if (options && !options.actions) {
        options.actions = [{ text: 'Close', click: () => this.alert(null) }];
      }
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
              Promise.resolve(action()).catch((error) => {
                let message = `Uncaught exception: ${error.message}`;
                if (error.response && error.response.data.message) {
                  message = `The server returned an error: ${error.response.data.message}`;
                }
                this.alert({ body: message });
                throw error;
              });
            },
          },
        ],
      });
    },
  },
});
