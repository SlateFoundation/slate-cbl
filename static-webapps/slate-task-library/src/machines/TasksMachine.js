/* eslint-disable one-var */
import { createMachine, interpret, assign } from "xstate";
import { useActor } from "@xstate/vue";
import { logTransition } from "./logTransition.js";

const TasksMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBUCGsDWsCyqDGAFgJYB2YAxMgPICCAysgNoAMAuoqAA4D2sRALkW4kOIAB6IArAE5JAOmkAOAOzSAjGulKAbMuYAWADQgAnogBMi+fpuTzzScrV7pyyQF93xtJhz5iZOQAqgBy1PRMbKI8fILCohIIkor6CgDMzNqa2uYazBrGZgj65uZypaVpksxpaWrmqtqe3uhYuISkYHJEEAA2FACSIQOR7EggMQJCIuOJamnScjL22tpapczmroUW0mULycrm+spH0jXNID5t-p1yAE5gqBAm5HQAogAy7wDCo9G8KbxWaIAC0imYSzSWwW5jSqlqaiMpgs1Tkq10NXqpxs0ku1z8HTIDyeL3IABF3h9vn8WGMuIC4jNQIloWo5Li9NoUslJLVlDsEOY0Ri9HUGspcfjWoSAl1Hs9XjRyeS6QDYtMEhZlHJmK5csc0msFooUoL9Lp0m4jatMnyHNLfO05STFeR3uSRmrxpMmVqhfU5FYZGkLQ5LNDzXpdcxYxbpNpHIpao6bkSus8IKQoG8gj8flS6N6GRrgSywalTZoLRpocLJM5Bdp9GklpJ2-lctoqvoPF4rjLnXdM9nyAAxGgDT7FiaMzUghCgtSmmPcrQLE6m7YohDaAxB02KDRORSJ5ep2XDiBZkg5n40EIF6dRH1zsviMFWDk2fTMCEySRu1Pc1Az-Wp9FNLJVAgi8h2JSAplvXN80LGdfXncsEE0VtTlOU0aiNC07CbFs2w7eo1G7SRe1g254KzQQkInKc0LfZkP2KTQ5COUonCcPY6jUEjW3bciux7PsWidOiugQxi7wfJ9WNLdjWUsOQ6mkCCVCPTEWxAsowNDSDnC0xRPH7EhuAgOBRAJOCwHVIFVLBOFtFXRR1y05QtwFHd5jKHjSmkBZuUyJFaPTbo+kc18VP9eoRPbPdlByHyW1KQUNnKCoDkTVK9TSSKXQVF4nL9BdErIlK0pSaFkSKeFIR-aitKqPlZCaft7JkuQR1vcqMI40Eqjbc4FgMRRzGbPZBUAxZPJkTQEQ0ZxiruOTs0G99Emm+RT1rNQ-1Sk85rWINZHUVwQtW5QLPcIA */
    id: "TasksMachine",
    initial: "idle",
    predictableActionArguments: true,
    context: {
      selected: [],
      formIsVisible: false,
      toastIsVisible: false,
      toastMessage: null,
      toastColor: "info",
      toastTimeout: 4000,
      logTransition: true,
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
        selected: [event.row],
      })),
      deselect: assign(() => ({
        selected: [],
      })),
      onCreateSuccess: assign(() => ({
        toastIsVisible: true,
        toastMessage: "task created successfully",
        toastColor: "info",
      })),
      onUpdateSuccess: assign(() => ({
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
      })),
    },
  }
);

// Create a service
const service = interpret(TasksMachine).onTransition(logTransition).start();

// Create a custom service hook for this machine, that takes the service previously created.
export const useTasksMachine = () => useActor(service);
