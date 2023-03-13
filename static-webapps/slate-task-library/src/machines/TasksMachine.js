/* eslint-disable one-var */
import { createMachine, interpret, assign, forwardTo } from "xstate";
import { useActor } from "@xstate/vue";
import { isProxy, toRaw } from "vue";
import { cloneDeep } from "lodash";
import { logTransition } from "./logTransition.js";
import { useTaskStore } from "@/stores/TaskStore.js";
import { useToastMachine } from "@/machines/ToastMachine.js";
import { create, read, update, destroy } from "@/machines/APIMachines.js";

const toaster = useToastMachine();

const TasksMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBUCGsDWsCyqDGAFgJYB2YAxMgPICCAysgNoAMAuoqAA4D2sRALkW4kOIAB6IAtAEZm0gGwA6AJzKArMoAsmgOwAOPdLU61AGhABPKdIDMS+cx3Sdj6cubzpAJhsBfX+ZomDj4xGTkAKoActT0TGyiPHyCwqISCDLMXsyK+l6aHkZeytJ65lYI+YpeXibyNqqaeszKdv6B6Fi4hKRgikQQADYUAJJRI-HsSCBJAkIi0+mS8rW5Op7MzHo2hsZmltZOKsryzTvKzXqe7SBBXaG9igBOYKgQFuR0AKIAMl8AwpNErw5qlFtY1EobBomj4rvJ5BdNOVDtJjqdmOdLtcArdOiEemRnq93uQACJfb5-QEsKZcEEpBagJY7NG1dYuVS2TTqFEZZxo1QYrFbTyaG53AlhPovN4fH60Mm04HJeZpKSeNS5NRqfLFWoXOR85bKRQ2GxbWylEw6TRqPy4yXdaXEuXkGhkpUJaazRnqjKac2KSHKHReHVqLKhhR8mpKZj2jS1UpqUqGCX452PWWkr5kibKn0MtXgjIaM2GVQlWQKHVlA6VINePS65z1GxNC5eDPBLNEnMfCl-ZBfQv01Vg5nWU3FGzZBStWR2UPGxFmi2GGzW4x2h0dXsPfskiyKCBgfioIiDWD-Qa8SDkKgABS+UQpyBoIx+dDHM2Lk-EKRNHDRRHHteRdROAxdGRBtbUUbRNGkZDzTsPQbR7e5CRlY9T3PS9ryoTgwBIch-gVb530-b9f19EspwyfJNGDJCkK3ZxoU0eRYIqeDEOQ2xzVODDHUzQ8+jvN5SCgcgIGEPpSAAN24DA+gAM3PQhaP-JlAIyeoZyEnR3D0QNMXkY0vFA9QLRKdDm3kTlMKlR5JIgaTyDAJ4nm4J5FE4QZUH4NTfIAW0UDT+C071x1BXSlnqPRqgcO1mGA6RAzsPlkKshN6gFOxAw0aRnL7Po3nckgZIVD0ADEqAAJWwbSJ3ijUbB0BCPC3TZTlkbjYwKUDNjSrxETkBzu1Eg9sMUCqPP+BqvhoEcWri-1JFTJRtEaaEti8bwbD5AobEUUzdFkSFEoTUrxLmiBKpk-4aCif5fjWv1S0kfROo0dwkPWSErh4xAOyUVM7HNFwE2hPc8Rml1FNQQYBiC6SojAAB3WT5P6EhlNUxQkZRiAgrAD76L076wwQ7QFANQGDD5NRtmDCN3GyCCwNu2bidRwQqox7GvJ8vyAqCkKnnCvnSf4cmYr-VqNqcJKjA8NKNDULjPGO0oEK0WxikXBRHB5l08FlAWZLkoklJUvoaE4Ih-kt+W6UV9avoKHIDD0EoxsjRwsj5cbqlKLYnAckT9yw83LY8kXfP8wLgrCxRHed12KYApY9BqXJTIxdkTiyuCE0UE2DCXKsSum2PHkgAQGrAABHABXOB+HIGqyXqprs7ahBDGDOc0rkVo4UxWMIOqK4riTW0-a1s2G-c-hm-bzuyJet6fgH-1SmY7ICguC59C4-RYznWfdRqbRbIuOGnTuxurciJ8yRW0cFbonOpC0FQHZZDaB8CsRwOhjr2grjoYyKxUzqATGoFeRJX4LR3u9H+OkD6mWqGPU+6FC6XwbA0HIQN8r4I7E-MSvNkb8w8jbBS+N7ZE1obLN2KpPYMQUJ1REfsWg8ghpiesFRPCmg7HaBwjgtBZHkMgvoMs0ZVU8t5JO4tU5SxYSTMm+9SzGW1GGDKDRkJaFUJA06chPAQW8DoOczY5GKDbpwWW9DcZ20JhnCITjtGYKVl9GoWpwymWQtxEwSFlAh1DGaYoAoYGpnyFQhGjxHHOKUYnMWKdJbhQ8V4uWOiGLZByFsZQPgOqlHDOsLwfIXBakroYTENda4xxckSPAwg1JECltJMkYBhhy23q9DB7tf6DxkDOCeFjFzmRXA2SQSUpHNFFLIGyxl7GtJIO0zpVVum9IoBSBgDUqAAE08l6TVmsYwHZIypj9tCVcYiNxWnQjue09izywH4D5CwLjbZMPcU7bp7zPknKWNkM0WgHm1jStxCyZcWKGD9tI0U5pXmd0+QnFR6SJZpwzgCj53ALDAsQM2HIc5A4HTtMYkwxoabIW2LYE4ljCr+FxCQbgbzRDP2whwz6DFZkuALlxZoxd6gwoqJIcMpoeQYhtMYWwaV7EDGGNyymSx9Baj+mlXQBgLHGgyjORy9QXBQ2BsoexA5lV-wDDY0CJg7CQVOKZW0q4kp2E8A0a51oOxmtwmeC8V4bx3lgJAC1Iy5zMWjIJaMOw87ZVWAs2V58Wahj0N6uUeE-WEWIrpYZG0tymhrEZHw9MIENjcBXc0wMjDgvUGNexblpIho2s0Tq6hthqo7GlLQxpmKuqMBDecLYdT2PmlVRtXt1Bs0XFxVoqZUx8ihghBwS6a3hhkfYhRVshZjt5W6s0+htgIlDFGI6DZ7T5o8CcIwgZzqNPhvXFp8dR1Fl8byjQ4M9iXWKRBHYId9AV0RJGPaOoMq3s5S6V+G8O7vO3VTFsZoEQdW4lBZsVLiGOGDE4SEOx-HQnsagp9sUeVU3gmlcRLQ32qCZsQvOoF2RjS0NoFopq67NPkawxRUAYNLHcNULWCIahWkwyWiosqzq1B5PqBymJ7HJI41xol1RoTwoPWAuwHhf2qwA5iK5qYkKrLaR00KXSennjAPJhA-UzrGWkRoep2hhHWE8OuS0W4nm2heSxsqeFAX4obc+zhpyJ1LyaAoRyCYuIhzRBsTkchoRhkcuKZlQA */
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
            target: "editRequest",
          },

          DELETE: "confirmingDelete",
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
          id: "fetch",
          src: read,
          onDone: {
            target: "ready",
            actions: "fetchComplete",
          },
          onError: {
            target: "ready",
            actions: "toastFailure",
          },
        },
      },

      adding: {
        on: {
          LOADFORM: {
            actions: "loadForm",
            target: "adding",
          },
          CREATE: {
            actions: "prepareRecord",
            target: "validatingNew",
          },
          CANCEL: {
            target: "ready",
          },
        },
      },

      validatingNew: {
        invoke: {
          id: "validate",
          src: "validate",
          onDone: {
            target: "creating",
          },
          onError: {
            target: "adding",
            actions: "toastValidationFailure",
          },
        },
      },

      creating: {
        invoke: {
          id: "ApiCreate",
          src: create,
          data: {
            fields: (context) => context.fields,
            task: (context) => context.task,
          },
          onDone: {
            target: "ready",
            actions: "toastCreateSuccess",
          },
          onError: {
            target: "adding",
            actions: "toastFailure",
          },
        },
      },

      editRequest: {
        // TODO: make sure attachment field is disabling properly - use this code
        // after: {
        //   3000: { target: "editing" },
        // },
        on: {
          LOADFORM: {
            actions: "loadForm",
            target: "editing",
          },
          CANCEL: {
            target: "ready",
          },
        },
      },

      editing: {
        on: {
          UPDATE: {
            actions: "prepareRecord",
            target: "validating",
          },
          CANCEL: {
            target: "ready",
          },
        },
      },

      validating: {
        invoke: {
          id: "validate",
          src: "validate",
          onDone: {
            target: "updating",
          },
          onError: {
            target: "editing",
            actions: "toastValidationFailure",
          },
        },
      },

      updating: {
        invoke: {
          id: "ApiUpdate",
          src: update,
          data: {
            fields: (context) => context.fields,
            task: (context) => context.task,
          },
          onDone: {
            target: "ready",
            actions: "toastUpdateSuccess",
          },
          onError: {
            target: "editing",
            actions: "toastFailure",
          },
        },
      },

      confirmingDelete: {
        on: {
          CANCEL: "ready",
          DESTROY: "destroying",
        },
      },

      destroying: {
        invoke: {
          id: "ApiDestroy",
          src: destroy,
          data: {
            task: (context) => context.task,
          },
          onDone: {
            target: "ready",
            actions: "toastDestroySuccess",
          },
          onError: {
            target: "confirmingDelete",
            actions: "toastFailure",
          },
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
      fetchComplete: (context, event) => {
        if (!event.data || !event.data.success) {
          context.toaster.send({
            type: "TOAST",
            message: "data could not be loaded",
            color: "error",
          });
        }
      },
      prepareRecord: (context) => {
        console.log(" prepareRecord! ", context.taskForm);
      },
      setUpdatedID: () =>
        assign((context, event) => ({
          updatedID: event.updatedID,
        })),
      loadForm: assign((context, event) => {
        const task = event.task,
          fields = event.fields;

        if (task) {
          // clone the task so we aren't editing the properties of the reactive original
          const taskClone = isProxy(task) ? cloneDeep(toRaw(task)) : task;

          for (const field in fields) {
            if (Object.prototype.hasOwnProperty.call(fields, field)) {
              if (Object.prototype.hasOwnProperty.call(taskClone, field)) {
                fields[field] = taskClone[field];
              }
            }
          }
        }
        console.log(event.taskForm);
        return { taskForm: event.taskForm, fields, task };
      }),
      toastCreateSuccess: (context) => {
        context.toaster.send({
          type: "TOAST",
          message: "task created successfully",
        });
      },
      toastUpdateSuccess: (context) => {
        context.toaster.send({
          type: "TOAST",
          message: "task updated successfully",
        });
      },
      toastDestroySuccess: (context) => {
        context.toaster.send({
          type: "TOAST",
          message: "task deleted successfully",
        });
      },
      toastFailure: (context, event) => {
        console.log(event);
        const message =
          event.data && event.data.message
            ? event.data.message
            : "An unexpected error has occurred";

        context.toaster.send({
          type: "TOAST",
          message: message,
          color: "error",
        });
      },
      toastValidationFailure: (context) => {
        context.toaster.send({
          type: "TOAST",
          message: "Please correct any form errors and try again",
          color: "warning",
        });
      },
    },
    services: {
      // TODO:  Can this be more concise?
      //        validate returns a promise, do we need to wrap it in one?
      validate: (context) =>
        new Promise((resolve, reject) => {
          context.taskForm.validate().then((validation) => {
            if (validation.valid && validation.valid === true) {
              resolve();
            } else {
              reject();
            }
          });
        }),
    },
  }
);

// Create a service
const service = interpret(TasksMachine).onTransition(logTransition).start();

// Create a custom service hook for this machine, that takes the service previously created.
export const useTasksMachine = () => useActor(service);
