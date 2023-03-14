import { assign, createMachine, sendParent } from "xstate";
import { isProxy, toRaw } from "vue";
import { cloneDeep, isEqual } from "lodash";

const ApiUpdateMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFUAOECGAXMBZDAxgBYCWAdmAHQkQA2YAxANoAMAuoqKgPawlYluZTiAAeiALQBWAJwtKADhYAWBQDYA7HLU6WCgDQgAnog0BGSlLUK5ZhVakarAJgC+rw2kw58xclUh+cigGABkAeQBBABEAMXCAJVxWDiQQHj4BIRFxBAk1FUoAZiLlM2U9UqkFDWdDEwQ7BUpzZSKZKU7lKWdus3dPdGw8QlIKSkCBMhCAYUiAORmAUVCUkQyg7LTciT7LGXUzGVUFZWcWIvrEZyLm6qkWKTMnXRY3DxAvYd8xgIgg6YMZAABWikQAKks1mkNllhNtJEUzFJKDopKUFAojgdnDIrggNPIWNZbEU1E9NO9Bt4Rn5xgA3DC0GjYYIMCBCKjkencADWVEZzJp0K4vE28NAuRslBkBSxLDM5WUMnOl2MiFUinaGiRSg6LA0yg0A0+Qx8o38lEFLKmITAACd7dx7ZRULRsAAzZ0AWytTJtYBF6TFcJykjszkUcmUanaFQOHSk+Ik5haMbMxNj6ix5JNX3NdKoBHtYFZgI5425fKokVQJHzgfY6xDgglYkQVjUlD0MiK6NOHQ0Ovx0vRZjUFVuahkcippppP0txdLtvZnOoZB5-MotfrZsDZlSosyrbDCCszVuGZuFyNMeU+KO8mcSsVBXOFTaef3i-Gy7LdqOs6rrulgXr2r6u4NkGsKngi56lJQ3TKN0ZK9rUqjJqmhoFCqyqaOSTjuB8ZDcBAcAiA2v5gM2J5bJKkgaGokZOM8sYFG0jwaMmyIyJQvRqIq6Jkj0WLfguFqVnQNEwi29HtnkrQtE8TFkioRRcfihLdtYNjmM4ziyL0RTid8kl-ACUC0eKZ67HIxRlJ+g5vKoSbqggMaWLpvY6BOfbkmopkFr8fpCgB1mhvBEh2F2pxFOYlL9qU+IlF5mIqjcsgxgqQW0iF-62hFcEMQguLKKiLBvM4ChIj05IGO5qUXiqjxHEOQ6BR8VHmZQFYyceNnwTUMqnIJMhaEO3QTvizhDpQQkYj0XRlMRrhAA */
    id: "UpdateMachine",
    initial: "idle",
    context: {
      store: null,
      form: null,
      fields: null,
      task: null,
      updates: null,
    },
    states: {
      idle: {
        always: {
          target: "editing",
        },
      },

      editing: {
        entry: "notify",
        on: {
          LOADFORM: { actions: "loadForm" },
          CANCEL: { target: "done" },
          UPDATE: { target: "validating" },
        },
      },

      validating: {
        entry: "notify",
        invoke: {
          id: "validate",
          src: "validate",
          onDone: {
            target: "creating",
            actions: "prepareUpdates",
          },
          onError: {
            target: "editing",
            actions: "toastValidationFailure",
          },
        },
      },

      creating: {
        entry: "notify",
        invoke: {
          id: "ApiUpdate",
          src: "update",
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
              target: "editing",
              actions: "toastFailure",
            },
          ],
          onError: {
            target: "editing",
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
        message: "task updated successfully",
      }),
      toastValidationFailure: sendParent(() => ({
        type: "TOAST",
        message: "Please correct any form errors and try again",
        color: "warning",
      })),
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
      loadForm: assign((context, { form, fields, task }) => {
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
        return { form, fields, task };
      }),
      prepareUpdates: assign((context) => {
        const fields = context.fields,
          task = context.task,
          // get the fields where the form fields differ from the original record
          updates = Object.fromEntries(
            Object.entries(fields).filter(
              ([key, val]) => key in task && !isEqual(task[key], val)
            )
          );

        if (updates.Skills) {
          updates.Skills = updates.Skills.map((skill) => skill.Code);
        }

        return { updates };
      }),
    },
    services: {
      validate: (context) =>
        new Promise((resolve, reject) => {
          context.form.validate().then((validation) => {
            if (validation.valid && validation.valid === true) {
              resolve();
            } else {
              reject();
            }
          });
        }),
      update: (context) =>
        new Promise((resolve, reject) => {
          // create a payload object with changes and the ID of the task
          if (Object.keys(context.updates).length > 0) {
            const payload = Object.assign(
              { ID: context.task.ID },
              context.updates
            );

            context.store.update(payload).then((result) => {
              if (result.success) {
                resolve({
                  success: result.success,
                  data: result.data,
                  message: result.message,
                });
              } else {
                reject({
                  success: result.success,
                  message: result.message,
                });
              }
            });
          } else {
            resolve({ success: false, message: "no updated attempted" });
          }
        }),
    },
    guards: {
      opSuccess: (context, event) => event.data.success,
    },
  }
);

export { ApiUpdateMachine };
