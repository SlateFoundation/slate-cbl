/* eslint-disable one-var */
import { assign, createMachine, interpret, forwardTo } from "xstate";
import { useActor } from "@xstate/vue";
import { logTransition } from "./logTransition.js";
import { useTaskStore } from "@/stores/TaskStore.js";
import { useToastMachine } from "@/machines/ToastMachine.js";
import { ApiCreateMachine } from "@/machines/ApiCreateMachine.js";
import { ApiReadMachine } from "@/machines/ApiReadMachine.js";
import { ApiUpdateMachine } from "@/machines/ApiUpdateMachine.js";
import { ApiDeleteMachine } from "@/machines/ApiDeleteMachine.js";

const toaster = useToastMachine();

const TasksMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBUCGsDWsCyqDGAFgJYB2YAxMgPICCAysgNoAMAuoqAA4D2sRALkW4kOIAB6IAtAEZm0gGwA6AJzKArMoAsmgOwAOPdLU61AGhABPKdIDMS+cx3Sdj6cubzpAJhsBfX+ZomDj4xGTkAKoActT0TGyiPHyCwqISCDLMXsyK+l6aHkZeytJ65lYI+YpeXibyNqqaeszKdv6B6Fi4hKRgikQQADYUAJJRI-HsSCBJAkIi0+mSujYq2so6qg2q8maW1k4qyvLNNnrKzXqe7SBBXaG9igBOYKgQFuR0AKIAMl8AwpNErw5qlFlIbNJpLlNGoDHZpE0fF5ygdoTtTudLtcArdOiEemRnq93uQACJfb5-QEsKZcEEpBagJYKPSKK5qZhZZQ1WFyHSojLOdHHTEXZhXFo3O4EsJ9F5vD4-Whk2nA5LzNJSeS1XI6TxZeQ6LxqbIC-YZBwqfInWSbDTaNTS-HdOXExXkGhk1UJaazRlay1eNn6XYStRqTT5ZyCozKRTyWH1LmJyMNLzO4Kux4K0lfMkTNV+hma8EZHRHepRxH6kxeIyxnSaRTaWqR+pGmxR+SZ+6E+Ukj4Uv7IL5F+kasHM6zx4o2bIKVqyOwbQWSeTxmw2CW2UomJtqPy4mXZom5iyKCBgfioIiDWD-Qa8SDkKgABS+UQpyBoIx+dHHGYSyncQpCjNRFEcQ9dmKE49F0TRBSbFttChWwtxOfde1lHNB0va9b3vKhODAEhyH+ZVvm-X9-0A-1S2nDJ8mbSNEV3ZwbHbRCLWQ7RNDQrc7D0LDjxdB4iSfN5SCgcgIGEPpSAAN24DA+kkiA6OAplQMtSFFFYpwl00DCUQtGwKxqAx9W8VRHC0J1RKzcS1O4KSSBksAniebgnkUThBlQfgADMfIAW0UdTNMnbSlmTdkTGYdsPAKeR5DXNl8laZgux0fUHBcI8Oic-tFDeCBpNk+T+hIZTVMUPAFX4MAotBGKwNhFtEWYJpEv5E40otLwjVyes9BqU05yyHRsNPPoyoqzzvN8-zApCp5woa14mpagMy2WbQYR0czzJqIaNEFLc2URY5xSrdxlBm5zSogcr3PIZUvQAMSoAAlbAdoYnTJGaJQox8Nxuq0RMBoqOMEyTDw5FhdxD0ekr5re-4fq+GhRwBkCljGrxINkYzZGcUVTIqLd4yhZpvEMdNpscvs3QxmT-hoKJ-l+fG2vLFoWxqS7HFDXZBSjNlEvyZoahKY09DRt1IDmN65KJJSVL6ABXTgIEC5rfQnVrA0kE0lGMZF1GMLQCm4iohorY1SnGuXt0KvFiuV8rBDexafL8gLgrCxRdf17ajaA6LTZNCCUbDKMuSjTQYcQS7FGujcQa7e6lceFXfZkj6yW+v6+cDWQchaWxDThGpctThA4dTXZzmY4SLjzokC4qiI3zJXGx0j+iCesRwVHqNQDRKCVISpxBJcg01OSjTZvE8TQu76HvMa5nmfnLss0P03cN0S2xNm6i6DEglPDDjJtuQcorWceK9hkLyqNZqrX8I-w26RRxNmWGoawIxZCnqKF2sZmycUcCDfUZwahGC3n-a8C0vIBxWsHdaaCI6AJHvzHwCZvAKHrNkLcsg9gVFSpBLIegp5Qjgq4VB790FvQpAwH6VAACah9GImmJhGNQLsJTZSMMaCW0JcpCRKGcMaFxpCsLAB-CqnNua82HlpQMtQlDO3MtlOBpR7ZSAXAmNseU7alA2P4XEJBuBXngNME8zl1TAMYsDFwJNuqQn5JTNcXYILZA0KUWQxRahKJZjhDWQwwBuN2h4k08ZNhaB5McBwwk1wmidolOR7g9CCVQeeeJgMlgrEgiYOwppRTwSbGuE4ig7CeHNufMaPYomzXdO8fCN47wPifLASAJTR4ZHnM2DYUIaZOHkfPJuupmiJScPoWE5x9BFLwleXpRESLaUIabSEtM5AYWNJCHU5pYa00uomOMxl1BDVQepaSwz+bA3HuoAp+hDx2y0GuWBqUjAiPnHIBhEZUHs2eabfquRIQFJ8JGDQwZBTBiUKUTiqUYJXHnM-T2r9u4+yecWaOe1PAkwaPBcJPg6wmMqLlFsh4uz02NE2dQyjVHuQhUfE0QsWhaESsmVK1DrBVBTq4e0cheoOX8EAA */
    id: "TasksMachine",
    initial: "idle",
    predictableActionArguments: true,
    context: {
      selected: [],
      updatedID: null,
      store: null,
      taskForm: null,
      fields: null,
      task: null,
      formValid: false,
      formIsVisible: false,
      toaster: toaster,
      logTransition: true,
    },
    // These actions can be performed in any state
    on: {
      // Toast actions forward these events to the toast machine
      TOAST: { actions: forwardTo(toaster) },
      UNTOAST: { actions: forwardTo(toaster) },
    },
    states: {
      idle: {
        on: {
          INIT: {
            target: "ready",
            actions: "initialize",
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

          LOAD: {
            target: "loading",
          },

          ADD: {
            target: "adding",
            actions: "deselect",
          },

          EDIT: {
            target: "editing",
          },

          DELETE: "deleting",
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

      loading: {
        invoke: {
          id: "load",
          src: ApiReadMachine,
          data: {
            store: (context) => context.store,
          },
          onDone: "ready",
          onError: "ready",
        },
      },

      adding: {
        entry: "setTask",
        invoke: {
          id: "create",
          src: ApiCreateMachine,
          data: {
            store: (context) => context.store,
            task: { Status: "shared", Attachments: [] },
          },
          onDone: "ready",
          onError: "ready",
        },
        on: {
          LOADFORM: { actions: forwardTo("create") },
          CREATE: { actions: forwardTo("create") },
          CANCEL: { actions: forwardTo("create") },
        },
      },

      editing: {
        entry: "setTask",
        invoke: {
          id: "update",
          src: ApiUpdateMachine,
          data: {
            store: (context) => context.store,
          },
          onDone: "ready",
          onError: "ready",
        },
        on: {
          LOADFORM: { actions: forwardTo("update") },
          UPDATE: { actions: forwardTo("update") },
          CANCEL: { actions: forwardTo("update") },
        },
      },

      deleting: {
        entry: "setTask",
        invoke: {
          id: "delete",
          src: ApiDeleteMachine,
          data: {
            store: (context) => context.store,
            task: (context) => context.task,
          },
          onDone: "ready",
          onError: "ready",
        },
        on: {
          DESTROY: { actions: forwardTo("delete") },
          CANCEL: { actions: forwardTo("delete") },
        },
      },
    },
  },
  {
    actions: {
      initialize: assign(() => ({
        store: useTaskStore(),
      })),
      select: assign((context, event) => ({
        updatedID: null,
        selected: [event.row],
      })),
      deselect: assign(() => ({
        selected: [],
      })),
      setTask: assign((context, event) => ({
        task: event.task,
      })),
    },
  }
);

// Create a service
const service = interpret(TasksMachine, { devTools: true })
  .onTransition(logTransition)
  .start();
// const service = interpret(TasksMachine).start();

// Create a custom service hook for this machine, that takes the service previously created.
export const useTasksMachine = () => useActor(service);
