import { createMachine, sendParent } from "xstate";
const ApiDeleteMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBEwBswBcwFkCGAxgBYCWAdmAHQkQYDEA2gAwC6ioADgPawmYlcy7EAA9EAWgBMARgAslAGxKA7NIDM0yZLUBWNbICcAGhABPRLLWKDCg9IAcCyTu0KmB2QF9PJ1Bmz4xORUBIIAZiQATgC25FB0AMIAggByCQCiADLMbEgg3Lz8gsJiCOI2lGoKsm6y0jpKTDom5gjSbpRMXUz1OrLO9l4+IH5YuISkFJShZBExcXTI6QDKACoASgDyAJo5wgV8AkJ5pdWUNvbKavaSTArKSg4tiNIGlDXKynU3ctLqOt5fOgxoFJlQIHBMJEuKYFhBBFRyAA3LgAayoSQ4JFQsChML2eQORWOoFKsku50cTUkblUaiYkmeCB09kozm69jkyi00m5gJGwICE2ClAhuOhsLI8XhU2RaIxWJxeNMDGkuU4PEOxROFgMTDZn2U7kkHmqvKZ9WUnR0DQa-Ve9xq-NGQqCUzFyoWYEi0MilA4aDwmDCXBilEx2MhEoJGsKRxKiD6Vsc0ju9wMOgZ2iZ5Wk1ksClTgxtVQM3mGZC4YuELvGbrA+01xITZWuCkqMic90kdQc9hzvLer0s9ia7i7n2dgrrYOotAbhKb8Z1reuHfaNO5vfs-bMFkklAdBjUV2cSlsHin-hnIpmc1iUsbce1pIkqYP3S6CjUGlTslkygWqytgKPYGY6O+9i6M4V4gsK7pRjCcRPlqJKiC8BhvD+P6OGoGaYXcTI6NYtjuOOHiXGosGurOMoLrGqEtp2bJaLcvL1PodSAXuCA9gehapkWTD2H07Tlp4QA */
    id: "DeleteMachine",
    initial: "idle",
    context: {
      store: null,
      task: null,
    },
    states: {
      idle: {
        always: {
          target: "confirming",
        },
      },

      confirming: {
        entry: "notify",
        on: {
          CANCEL: { target: "done" },
          DESTROY: { target: "destroying" },
        },
      },

      destroying: {
        entry: "notify",
        invoke: {
          id: "ApiDestroy",
          src: "destroy",
          data: {
            task: (context) => context.task,
          },
          onDone: [
            {
              target: "done",
              actions: "toastSuccess",
              cond: "opSuccess",
            },
            {
              target: "confirming",
              actions: "toastFailure",
            },
          ],
          onError: {
            target: "confirming",
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
      toastSuccess: sendParent({
        type: "TOAST",
        message: "task deleted successfully",
      }),
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
      destroy: (context) =>
        new Promise((resolve, reject) => {
          context.store.destroy(context.task.ID).then((result) => {
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

export { ApiDeleteMachine };
