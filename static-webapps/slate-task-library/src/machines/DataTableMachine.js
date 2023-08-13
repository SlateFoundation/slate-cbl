/* eslint-disable one-var */
import {
  assign,
  createMachine,
  forwardTo,
  interpret,
  raise,
  spawn,
} from "xstate";
import { useActor } from "@xstate/vue";

import { ToastMachine } from "@/machines/ToastMachine.js";
import { TaskFormMachine } from "@/machines/TaskFormMachine.js";
import { LoginFormMachine } from "@/machines/LoginFormMachine.js";
import { ApiDeleteMachine } from "@/machines/ApiDeleteMachine.js";

// import { logTransition } from "./logTransition.js";

const DataTableMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBECGAXVAVVAjANmALKoDGAFgJYB2YAdAJISEDENl6lq+lAXmAG0ADAF1EoAA4B7WB0pTq4kAA9EAWgCsQjXQAsAZg0AOAIxCAbOZNH9+gJwAaEAE91AJnMB2OneMmrQp52Rrq6duYAvhFOaJg4BMRkVLR0AEpgqBDOLLBghKTodABOUgDuwmJIINKynApKqghBdCZuWqGhRnaenkbmTq4Iah7evqYBQSFhkdEgsdh4hCQUNPTpmdkQcHlgBcVlFUo1cvVVjZ4mPv6eQkYanm0m+kJuA+rXLZYaT0ZCzxYmKIxDALBLLZJrDJZHI7Pa0ZSFErlURHGQnRRnRBmFomXTmZ76NqhNwXIxvIbmOx0Ux2NxGNwMul9TwzYFxRaJFYpdbQ3L5QoSIpgABu8gArrB9sjKpI0XUMaBGmp-HQguYbKZfrp-F5yW4qfo+nTrEJup5tUJdEC5iD4kskqs0lDsqQFAAzShQMVCugSVAwQ5VY7yhrqMKjb4GDSWay2Rwud7mIQ+YnmXSM3Q9bTW+Z2zkQp0bFiu6ger0+ngAWw4gdltXkCpUYd8dA8dh+dlunfT5LUlOpJlp9MZRmZrJt7LBDu5zuL7s93vosCkRUKuGcteqcoboaGWh0+P0D0zd30lO0et0dG0+tH4V+fkNOdtHPBjp52SkEjA1DoW0wlD4LAm7BjumJDDcya6H0Zi-PqbgGLovb6j4BJ3BYPR9Nqz6TvaXKQkWpD4DI9D-qggHASiQbbqcirqDcRhXCEQhPISlj6EhCZNPoLSWoY2h3AyLHjrmr7TgRvLoCu9DEZkIE0Y2Sr6legS-HYhj2EmprklYLQaM8ZjmBo+qBE8Gg4aCeEFh+LCZBAdAcGAlbyfWtFNnubg8X8wTBOqdidupeqmnQhrmPq4QIWYZhWrMolTvhhbQpAHAOegTkueiu7DFodAaFozz6YS7YaN0epGN4RlMmahhuBZeZvjORZbIQaWpelVF1pl4GMbi2oeGelKeZ49zkoOVIaNqIRaJ5XiBPodViQlAAyUiZDQUAsBACj0DQwpSAA1jJq0QBlIbgcqfS5UVVh2JmDL3JxgzDFeHE3MNvTldGtWxS+8UFita3UBtYBFCURS+vgGBuiulZ0LJJ0dVurmKe8dzUpYylCF26mEqNjGMvY2gcV0WP6Qtf2OgAghAEDrZt20OdQe2HXQpBChggiI6BblKpNPhaSYE2Qbd5KGDoJLGQhSYnm05NWVTNN0yDYMQ1DMOs+zaWnWBdFDHz+q2Jm+nWFYI1cbogQ4nlfxaCYrTpjFbKWfmCu00DLBLQA8pTyAAGKe6kRDazz6heJctL6RcFuZrinhBQaRr+WFFrRXLLspNTbsbQAwqkACilNYHnwcoxSIQ+Dc0FHuanhHho5J4smt2DoShinoLacNfQmd09nlMAHLZ3nS0l1lxneMT6k9MZ9z1+bNyqoO6q2LXeLmvNP24en9B57TnDu1tKS7Qd9BihIEAc6P52Dle4RY6EWNdDjrxcUelwlevxhZkZeWd+JdC7zkO7ZWK5VboGhkUWGZ8L5ay5gpLKN9Ww40mHcXQfg47m0HKqaO9JowWAsOZTezsu4AL3nTL2Pt-aByvrrNQfNQi+G6MbGCZtBh5XMNefSLFgj0isGeP+CVAH7w2gAVQAArIELsXOByMsrQVbF4OkVhBZJl6C-QYjcUwt1CLXYILIBEFiEb3AeQ8R4yK6rQsIIVaQeHTDY74o5yTsM4c8NwY1fiUiMAYx0yAdjCPpkfJmJ8-x+M5jKJGFj3LDB4t8ISLIhyTE8mVKkgsqo9Bqt4lIviWpK1BqAiQkNwHq2amAWB4Tual2GG4akaD9JMLxJmC2c9Bi2B0Kk7oRlWjFX0UQ+q-9smlLpsgPOABlLAqRPYAE0aHuTcC8FoNwTDvQMGFQIGCNEoTxCSTpktPK4kyfQAZ-i+6D2HjMxocyOE9FCCbHhvQTCjRKovO+xJMz2A3rMagUgtjwCqHFeWtBUSyPOsNDh7ZmKsQ8PiR66gxZ6D8GFCaPk7AHMYMwMAQLIlKnVBw-i54bBGW0A8riypQh6CPBxYwaZ0nqlRR+TFZ1aEkmTJ0rGYUYKeWaViDinwmkISJPoJZqKAZZwZTrKJCF8ZGXxN8boK82i9ljj4TyaDLR33VN9J2fSEo9yBmKkOFI5l6FuC8fUuJBaGFFgyakONbCmDccSQhWrFqGLIXq6iwKmWWFbP4COtxBwAhhQgaC1S25JgZIaBkVhUVHPWvq0urQWUzTmRhAKHg9QPBaOCvKFwHjhRilEIAA */
    id: "DataTableMachine",
    predictableActionArguments: true,
    initial: "Idle",
    context: {
      selected: [],
      store: null,
      sortBy: [],
      itemsPerPage: 20,
      page: 1,
      detailsIsVisible: false,
      toaster: null,
      // logTransition: true,
    },
    // These actions can be performed in any state
    on: {
      "send.toast": { actions: forwardTo((context) => context.toaster) },
      "remove.toast": { actions: forwardTo((context) => context.toaster) },
    },
    states: {
      Idle: {
        on: {
          initialize: {
            target: "Loading",
            actions: ["setStoreReference", "spawnToastMachine"],
          },
        },
      },

      Ready: {
        // entry: "log",
        invoke: {
          src: "addKeyListener",
        },
        on: {
          "test.auth": {
            target: "Unauthenticated",
          },

          // Selection events
          "select.row": {
            actions: "doSelectRow",
          },
          "deselect.row": {
            actions: "doDeselectRow",
          },
          "select.next.row": {
            cond: "canSelectNext",
            actions: "doSelectNextRow",
          },
          "select.previous.row": {
            cond: "canSelectPrevious",
            actions: "doSelectPreviousRow",
          },

          // Paging events
          "configure.page": {
            target: "Loading",
            actions: "setPage",
          },

          "configure.limit": {
            target: "Loading",
            actions: "setLimit",
          },

          "configure.sort.by": {
            target: "Loading",
            actions: "setSortBy",
          },

          // Details pane
          "open.details": {
            actions: "doOpenDetails",
          },

          "close.details": {
            actions: "doCloseDetails",
          },

          // Data Operations
          "store.load": {
            target: "Loading",
          },

          "add.item": {
            target: "Adding",
            actions: "deselect",
          },

          "edit.item": {
            target: "Editing",
          },

          "delete.item": "Deleting",
        },
      },

      Loading: {
        invoke: {
          id: "ApiRead",
          src: "storeLoad",
          onDone: [
            {
              target: "Ready",
              cond: "opSuccess",
            },
            {
              target: "Ready",
              actions: "toastAPIFailure",
            },
          ],
          onError: [
            {
              target: "Unauthenticated",
              cond: "authFailure",
            },
            {
              target: "Ready",
              actions: "toastAPIFailure",
            },
          ],
        },
      },

      Adding: {
        invoke: {
          id: "form",
          src: TaskFormMachine,
          data: {
            store: (context) => context.store,
            task: { Status: "shared", Attachments: [] },
          },
          onDone: "Ready",
          onError: "Ready",
        },
        on: {
          "form.initialize": { actions: forwardTo("form") },
          "form.submit": { actions: forwardTo("form") },
          "cancel.form": { actions: forwardTo("form") },
        },
      },

      Editing: {
        entry: "setTask",
        invoke: {
          id: "form",
          src: TaskFormMachine,
          data: {
            store: (context) => context.store,
          },
          onDone: "Ready",
          onError: "Ready",
        },
        on: {
          "form.initialize": { actions: forwardTo("form") },
          "form.submit": { actions: forwardTo("form") },
          "cancel.form": { actions: forwardTo("form") },
          "archive.task": { actions: forwardTo("form") },
          "unarchive.task": { actions: forwardTo("form") },
        },
      },

      Deleting: {
        entry: "setTask",
        invoke: {
          id: "delete",
          src: ApiDeleteMachine,
          data: {
            store: (context) => context.store,
            task: (context) => context.task,
          },
          onDone: "Ready",
          onError: "Ready",
        },
        on: {
          "destroy.item": { actions: forwardTo("delete") },
          "cancel.delete": { actions: forwardTo("delete") },
        },
      },

      // Login: {
      Unauthenticated: {
        invoke: {
          id: "loginform",
          src: LoginFormMachine,
          data: {
            store: (context) => context.store,
          },
          onDone: "Loading",
          onError: "Ready",
        },
        on: {
          "form.open": { actions: forwardTo("loginform") },
          "form.submit": { actions: forwardTo("loginform") },
          "form.cancel": { target: "Ready" },
        },
      },
    },
  },
  {
    actions: {
      // Initialization actions
      setStoreReference: assign({
        store: (_, evt) => evt.store,
      }),
      spawnToastMachine: assign({
        toaster: () => spawn(ToastMachine),
      }),
      setTask: assign({
        task: (context, event) => event.task,
      }),

      // Paging actions
      setPage: assign((ctx, evt) => {
        ctx.store.setOffset((evt.page - 1) * ctx.store.limit);
        return { page: evt.page };
      }),
      setLimit: assign((ctx, evt) => {
        ctx.store.setLimit(evt.limit);
        return { itemsPerPage: evt.limit };
      }),
      setSortBy: assign((ctx, evt) => {
        ctx.store.setSortBy(evt.sort[0] || null);
        return {
          sortBy: evt.sort,
        };
      }),

      // Selection actions
      doSelectRow: assign({
        selected: (_, evt) => [evt.index],
      }),
      doDeselectRow: assign({
        selected: null,
      }),
      doSelectNextRow: assign({
        selected: (ctx) => [ctx.selected[0] + 1],
      }),
      doSelectPreviousRow: assign({
        selected: (ctx) => [ctx.selected[0] - 1],
      }),

      // Details panel actions
      doOpenDetails: assign({
        detailsIsVisible: true,
      }),
      doCloseDetails: assign({
        detailsIsVisible: false,
      }),

      // API load error notification
      toastAPIFailure: raise((context, event) => ({
        type: "send.toast",
        message: context.store.getErrorMessage(event.data),
        color: "error",
      })),
    },
    services: {
      // Load the store
      storeLoad: (context) => context.store.load(),

      // Monitor up and down keys to adjust selection in Ready state
      addKeyListener: () => (send) => {
        const listener = (event) => {
          if (event.code === "ArrowUp") {
            send({ type: "select.previous.row" });
          } else if (event.code === "ArrowDown") {
            send({ type: "select.next.row" });
          }
        };

        document.addEventListener("keydown", listener, false);
        return () => {
          document.removeEventListener("keydown", listener);
        };
      },
    },
    guards: {
      // API Load success
      opSuccess: (_, event) => event.data?.data?.success,

      // API Authorization Failure
      authFailure: (_, event) => event.data.response.status == 401,

      // Ensure there is a selection and it is not the last row
      canSelectNext: (context) =>
        Array.isArray(context.selected) &&
        context.selected.length > 0 &&
        context.selected[0] < context.store.data.length - 1,

      // Ensure there is a selection and it is not the first row
      canSelectPrevious: (context) =>
        Array.isArray(context.selected) &&
        context.selected.length > 0 &&
        context.selected[0] > 0,
    },
  }
);

// Create a service
// const service = interpret(DataTableMachine).onTransition(logTransition).start();
const service = interpret(DataTableMachine).start();

// Create a hook for this service which returns an actor.
export const useDataTableMachine = () => useActor(service);
