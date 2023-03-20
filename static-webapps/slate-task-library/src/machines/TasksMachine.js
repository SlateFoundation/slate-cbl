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
    /** @xstate-layout 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 */
    id: "TasksMachine",
    initial: "idle",
    predictableActionArguments: true,
    context: {
      selected: [],
      updatedID: null,
      store: null,
      detailsIsVisible: false,
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

          OPENDETAILS: {
            actions: "openDetails",
          },

          CLOSEDETAILS: {
            actions: "closeDetails",
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
      select: assign({
        updatedID: null,
        selected: (context, event) => [event.row],
      }),
      deselect: assign({
        selected: [],
      }),
      openDetails: assign({
        detailsIsVisible: true,
      }),
      closeDetails: assign({
        detailsIsVisible: false,
      }),
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
