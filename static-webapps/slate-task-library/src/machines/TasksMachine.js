/* eslint-disable one-var */
import { createMachine, interpret, assign } from "xstate";
import { useActor } from "@xstate/vue";
import { logTransition } from "./logTransition.js";

const TasksMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBUCGsDWsCyqDGAFgJYB2YAxMgPICCAysgNoAMAuoqAA4D2sRALkW4kOIAB6IAbABYArADoA7JNmTJigJzNtc6QBoQAT0QBGAMzN5J2RrPSNJgEyKTkx9MUBfTwbSYc+MRk5ACqAHLU9Exsojx8gsKiEggylrbMigAcmY7ZrmYmBsYIFtLyZpnWGioZ7pLMkt6+6Fi4hKRg8kQQADYUAJJh-dHsSCBxAkIiY8kAtCaKZvKSZpKZ2pImGtWbskWIjttKiorS9XaZbjJNIH6tgR3yAE5gqBCG5HQAogAyXwDCI1ivEmiRmiGk0ksC1UBWY+Vssn0RkQZhc8mkuQ0LlkmWkq1ksi8PluLQC7TIz1e73IABEvt8-oCWKMuCCEtNQMl8dDLswzKplCZpNl9ghHPD5Kp1LCbIpce4bndyUFOi83h8aLTaSzgfEpklEPNHEsNI5cpkzI5VK4TmKPAoKpJbOo7IpDo4lWS2qqqRryF9acNdWMJhzDeKTlYHNkTVD3bkxbJVuUZWatBKYV7-D7Hur3vIIGB+KgiD1YP8erxIOQqAAFL5henIGj9H50ENs-VgrkHRRShyuWTMWQmfnO9xiq2SDGQ5gaORIrYmEzZ+4UtXUwyF4ul8tUThgEjkf4-KjfZut9ud8bsg3g8XMTJWa0r90WQVTxwzyFQheE6Rl1XEllVzSk3ggUgoE+EJ-n+BkOxiUM7x7cQIXkSoYzkOxHGFGQNDFGp5G-a1v1kdwJRONcVUeCCoPIAAxK8bzDe9ewQWZ3BMKUbDkTNzUUflMkI4diLcJFcW2NwzWosDOjokhoP+Ggwngn4WJQzk0I4k0NCUdRKgaIlzCJYSUQQX95A0UdAMA50TEyCTZIeSlIEmRSYLghCNO7LTkgWfsx3xVxsgFZxkWKIiSPIlQKIyYlmhzFzOjcwQPKYtsfNBPyIRyeRmG-ex3VHBY8T2cyovEsi4qokDvWS+RUvo5TVN+LLwwfCpoQK2x30OSozOKEUymMxZRwzdZZG8EkSG4It4DGUDkr1bKI04zI9MJf9+OcZgIsQaorDMCp43MDanCmuqko3LpejAFaOvY+Z0RWNYdFHCVk0UMVcIUbZ7CfE0RxsY7nJu-Nii7VaH04ywoVC+wRWqCxlDFBylhWE6oTOBwcTB30IZ3EsywrKtYEgB62O0px+2dZNkeUZM7H2kpNAw7RCWHEd51Bq71wJrcib3WADyPSnUP846pRULZVnceUNrMH70XME7Fk0BcLEaPmaPAiBIMU8Wco46wljMazjvi61KiTLJlm2dZVc2HJtcS-nHiaw3kN8iMuvKFc7AKTEtkuJMbCUNF8KyLXbGmzwgA */
    id: "TasksMachine",
    initial: "idle",
    predictableActionArguments: true,
    context: {
      selected: [],
      updatedID: null,
      formIsVisible: false,
      toastIsVisible: false,
      toastMessage: null,
      toastColor: "info",
      toastTimeout: 4000,
      logTransition: false,
    },
    // These actions can be performed in any state
    on: {
      TOAST: {
        actions: "toast",
      },
      UNTOAST: {
        actions: "untoast",
      },
    },
    states: {
      idle: {
        on: {
          INIT: {
            target: "ready",
          },
        },
      },

      ready: {
        on: {
          SELECT: {
            actions: "select",
          },

          DESELECT: {
            actions: "deselect",
          },

          ADD: {
            target: "adding",
            actions: "deselect",
          },

          EDIT: {
            target: "editing",
          },
        },

        // Child states for the details pane
        initial: "detailsOpen",
        states: {
          detailsClosed: {
            on: {
              OPENDETAILS: {
                target: "detailsOpen",
              },
            },
          },
          detailsOpen: {
            on: {
              CLOSEDETAILS: {
                target: "detailsClosed",
              },
            },
          },
        },
      },

      adding: {
        on: {
          SUCCESS: {
            actions: "onCreateSuccess",
            target: "ready",
          },
          FAIL: {
            actions: "onFail",
            target: "adding",
          },
          CANCEL: {
            target: "ready",
          },
        },
      },

      editing: {
        on: {
          SUCCESS: {
            actions: "onUpdateSuccess",
            target: "ready",
          },
          FAIL: {
            actions: "onFail",
            target: "editing",
          },
          CANCEL: {
            target: "ready",
          },
        },
      },
    },
  },
  {
    actions: {
      select: assign((context, event) => ({
        updatedID: null,
        selected: [event.row],
      })),
      deselect: assign(() => ({
        selected: [],
      })),
      onCreateSuccess: assign((context, event) => ({
        updatedID: event.updatedID,
        toastIsVisible: true,
        toastMessage: "task created successfully",
        toastColor: "info",
      })),
      onUpdateSuccess: assign((context, event) => ({
        updatedID: event.updatedID,
        toastIsVisible: true,
        toastMessage: "task updated successfully",
        toastColor: "info",
      })),
      onFail: assign((context, event) => ({
        toastIsVisible: true,
        toastMessage: event.message,
        toastColor: "error",
      })),
      toast: assign((context, event) => ({
        toastIsVisible: true,
        toastMessage: event.message,
        toastColor: event.color ? event.color : "info",
        toastTimeout: event.timeout ? event.timeout : 4000,
      })),
      untoast: assign(() => ({
        toastIsVisible: false,
        toastMessage: null,
        toastColor: "info",
        toastTimeout: 4000,
      })),
    },
  }
);

// Create a service
const service = interpret(TasksMachine).onTransition(logTransition).start();

// Create a custom service hook for this machine, that takes the service previously created.
export const useTasksMachine = () => useActor(service);
