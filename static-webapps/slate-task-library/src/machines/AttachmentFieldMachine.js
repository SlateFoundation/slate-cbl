/* eslint-disable one-var */
import { createMachine, interpret, assign } from "xstate";
import { useActor } from "@xstate/vue";
import { logTransition } from "./logTransition.js";

const AttachmentFieldMachine = createMachine(
    {
      id: "AttachmentFieldMachine",
      initial: "idle",
      predictableActionArguments: true,
      context: {
        value: [],
        fields: {
          Title: null,
          URL: null,
          Status: "normal",
        },
        logTransition: false,
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
            EDIT: {
              target: "editing",
              actions: "editItem",
            },

            ADD: {
              target: "adding",
              actions: "addItem",
            },

            REMOVE: {
              target: "ready",
              actions: "removeItem",
            },

            RESTORE: {
              target: "ready",
              actions: "restoreItem",
            },

            RESET: {
              target: "idle",
              actions: "resetContext",
            },
          },
        },

        editing: {
          on: {
            UPDATE: {
              target: "ready",
              actions: "updateItem",
            },
            CANCEL: "ready",
          },
        },

        adding: {
          on: {
            CREATE: {
              target: "ready",
              actions: "createItem",
            },
            CANCEL: "ready",
          },
        },
      },
    },
    {
      actions: {
        initialize: assign((context, event) => ({ value: event.value })),
        addItem: assign(() => ({
          fields: {
            Title: null,
            URL: null,
          },
          key: -1,
        })),
        editItem: assign((context, event) => ({
          fields: {
            Title: context.value[event.idx].Title,
            URL: context.value[event.idx].URL,
          },
          key: event.idx,
        })),
        removeItem: (context, event) => {
          const attachment = context.value[event.idx];

          Object.assign(attachment, { Status: "removed" });
        },
        restoreItem: (context, event) => {
          const attachment = context.value[event.idx];

          Object.assign(attachment, { Status: "normal" });
        },
        updateItem: (context) => {
          const attachment = context.value[context.key];

          Object.assign(attachment, context.fields);
        },
        createItem: assign((context) => ({
          value: context.value.concat([
            Object.assign(
              {
                Class: "Slate\\CBL\\Tasks\\Attachments\\Link",
                Status: "normal",
              },
              context.fields
            ),
          ]),
        })),
        resetContext: assign(() => ({
          value: [],
          fields: {
            Title: null,
            URL: null,
            Status: "normal",
          },
        })),
      },
    }
  ),
  // Create a service
  service = interpret(AttachmentFieldMachine)
    .onTransition(logTransition)
    .start();

// Create a custom service hook for this machine, that takes the service previously created.
export const useAttachmentFieldMachine = () => useActor(service);
