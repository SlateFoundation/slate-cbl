import { assign, createMachine, sendParent } from "xstate";
import { isProxy, toRaw } from "vue";
import { cloneDeep, isEqual } from "lodash";

const ApiUpdateMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFUAOECGAXMBZDAxgBYCWAdmAHQkQA2YAxANoAMAuoqKgPawlYluZTiAAeiALQBGFgBYAzJQCcUgKwAOdavlz5U2QBoQAT0RSAbOuUsATDYDsLe6tnqZ62QF9PRtJhz4xORUkPzkUAwAMgDyAIIAIgBi0QBKuKwcSCA8fAJCIuII0iyq9pSysqpq6jbydrJyRqYINurmlHL29uYVqg6qSvZePiB+2HiEpBSUoQJkEQDCsQByCwCikRkiOWH5WYUSSnKUjkrm8pZtTvKGJojy8qrKUh42LOYu6o+q3r7o44EpiEIGF5gxkAAFeKxAAqay2WR2eWE+0k3SsXXO5nMNik3QuNiaZnMZQadkcNnOZIqv1G-wCk2ClAAbhhaDRsOEGBAhFRyMzuABrKis9n+MAIri8XYo0AHC6KNS2JytPTmKSEu4IfTtPF6FhOJxDBy0sYMoLTUUcuYRMAAJzt3DtlFQtGwADMnQBbFls60S9jbaXIgqSLEdFj6NwPNqyBxElpPDT2Sl2AaqbSlcym+kTC1UACu9K5POm-KFVFiqBIZoDmSluUEsrEZg1ynsXwulSkShsDXMCZe7TaqgNva0aYUOfFgKZRf8Jd51DIAuFlCrNdzTCk9eywaboe1akoDgNJXOpzVCdaZRcXXUJQN-Xs04BjOm885YPtjudro93rrtWtaSnujZ7HKiBuJQNywTiZxOGoA5ajYSbqCm3QNDqSiyEM3gjGQ3AQHAIi1rOFBBuBzYHBqx5tA4bgGj2GhKAmEjqs8DhYb2PbdD8Ixke+fJ0GAlEyoe0gWGU9EdjIkZKCxg4kuUtiUuYyo1Hxr7mkCMwgjaYkhqiRQ4YolR9nYjyyCS6iDgo1h2Diqg9CSLCaNpea6VaC7zIZB7Gex8hKMod43BqOgXMhzRSDoDmUlIMWyC84UeeRhbFr5iL7hBLZFNUlBVE46hHDU8joXGg6xUcdjFUlD4xalQmUKWolZVREkXE8GrnIMAxKEc3QJvIQzlK49h4nGw32Dh+GeEAA */
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
            target: "updating",
            actions: "prepareUpdates",
          },
          onError: {
            target: "editing",
            actions: "toastValidationFailure",
          },
        },
      },

      updating: {
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
