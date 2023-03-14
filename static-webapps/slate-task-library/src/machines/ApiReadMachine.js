import { createMachine, sendParent } from "xstate";
const ApiReadMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCUwEMIFk0GMAWAlgHZgB0BEANmAMQDaADALqKgAOA9rAQC4EdFWIAB6IAtAA4ALKQDM8gEwB2AGxSArAEZ1KzUqkAaEAE9ECqbNLqGNmwoCc6+ZqkqAvm6OoM2fMTKUHBjEUDQQAmTEAG4cANZkAIJsBN4QjCxIIJzcfAJCogjmEnIWSuoKDLI6SkoKKkamhRZWtnaOzlIeXuhYuIQkpIHBRKHhA9FxicmpdJoZ7Fy8-IKZBQrWpCpVUppb5eoSso4NiLKVpJoMUhU2KgxK9vYKXSCpvv0BQRAhNGAATn8OH9SGxKGgeAAzIEAW1ISRSPXSQmySzyq1ODGKCk0EjKSkxDyc9hOCE0l1IUke9gkB3MDCe8g8nhARA4EDgQjefX8yMWuRWoAKYnMlnksj0KgkEjqEk0snqJjMClIVPsSgkKlU8qlnWZXL84yoYF5OWW+XEmkccmcqilMrlCsa5mVrRsu1xd0OL31H0GXxCJtRApEiDJmxUEfU+nVUZqapJ2M0FwjamUmhuSkZep6738pDGxsyKP55oQ6g2Yqkssp6kc9wTUgYpDKrq2ChpsiZbiAA */
    id: "ReadMachine",
    initial: "idle",
    context: {
      store: null,
      task: null,
    },
    states: {
      idle: {
        always: {
          target: "loading",
        },
      },

      loading: {
        entry: "notify",
        invoke: {
          id: "ApiRead",
          src: "load",
          onDone: [
            {
              target: "done",
              cond: "opSuccess",
            },
            {
              target: "done",
              actions: "toastFailure",
            },
          ],
          onError: {
            target: "done",
            actions: "toastFailure",
          },
        },
      },

      done: {
        type: "final",
        data: (context, event) => event.data,
      },
    },
  },
  {
    actions: {
      notify: sendParent({ type: "NOTIFY" }),
      toastFailure: sendParent((context, event) => {
        const message =
          event.data && event.data.message
            ? event.data.message
            : "An unexpected error has occurred";

        return {
          type: "TOAST",
          message: message,
          color: "error",
        };
      }),
    },
    services: {
      load: (context) =>
        new Promise((resolve, reject) => {
          context.store.fetch().then((result) => {
            if (result.success) {
              resolve({ success: result.success, message: result.message });
            } else {
              reject({ success: result.success, message: result.message });
            }
          });
        }),
    },
    guards: {
      opSuccess: (context, event) => event.data.success,
    },
  }
);

export { ApiReadMachine };
