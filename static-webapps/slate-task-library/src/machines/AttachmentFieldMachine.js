/* eslint-disable one-var */
import { createMachine, interpret, assign } from "xstate";
import { useActor } from "@xstate/vue";
import { logTransition } from "./logTransition.js";

const AttachmentFieldMachine = createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QEEAuqCGBjAFgWzADtUAxASzABsIBZbHMwsAOjIkrAGIBJAOW4AqAbQAMAXUSgADgHtYZVGRmFJIAB6IAtAEYAbAFZmATgBMI-ab0iAzLoAcegDQgAnom0nrzbdv0iDAOzaACy6ntoBAL6RzmiYuATE5FS09IwsAE5gGBAunACiACKCohJIILLyisqqGgh6hiIBJrphAbrBwQFGus5u9f7MYdb+QSImdp0BUTEgcfSJpBTUdLjpzFk5eciFhaWqlQpKKuV1RiLM+sE9+vraNvrNwfp9iCY9zMF24yPWAdadEz6aKxdALIhLFKrBhMDbZXKcABK+RoAHkAGr5fblQ7VE6gOrBEzMX4dMIdERGSYBV4IHRGbQk4LmERfEyhAEiOwguZghIQ5IrNKwzYI5EAZQEqOR2OkciONVOiGCXgiAOuRim1hCTlcWgZzDs1mNQQZYVM1m5s3m-KSy1SaxF8LyEvywnEB3leNqWgiRmMYU8ugBPkpYVphn0wa+IQsdnZd10PJt+AF9uh60gR0IUE4AFUAAqFZACLEenFe44++q3YyTe7GqlGkzaWlmOwkozWBnBPTfFqTZN81N2qHClhZxQ5zgAYWQvBn+QAMrKKpXFQT3K1jD5tKZrl1dAFzLTLd4o81dOYJnp2UnrcPFoKHTCWDkIIxczPkSWy2U5VUVZKnSXzGCqnSslcTT-NYbYfF8Pw2P8gLAg+8QjpCQqOm+EAftOc4Lsuq64kBm50nowQkvo3x2MG4zISYp57swZhdkYFr6BMARGtEsyEDIEBwKoKZPum46eoBG7qFo6rMCI8nyT08a0VGLx6nSJjcYazJ3CE5jTPuQ7oaJY7Yaw7BgBJCr4tJGkfApin2BMBgGLS2h-CxrIAt0fznH496gsZaama+cJbFZ3rAZoJjEvG1HaHYdwOL4zRuR5ZjgT53QsgFvJBaOWGhZOn4RaRtnvP6XatL2mnuXosHqe5ASeSqAKakY7R2O0RnggVL7rO+JUVpJNl1Jo3bMEERJ+LVnHnDS6mtZNRLuZpzzBtRvGREAA */
      id: "AttachmentFieldMachine",
      predictableActionArguments: true,
      initial: "idle",
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
