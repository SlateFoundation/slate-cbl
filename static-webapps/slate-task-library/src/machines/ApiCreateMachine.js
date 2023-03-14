import { assign, createMachine, sendParent } from "xstate";
import { isProxy, toRaw } from "vue";
import { cloneDeep } from "lodash";

const ApiCreateMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGEBOYCGAXMBZDAxgBYCWAdmAHQkQA2YAxANoAMAuoqAA4D2sJWEjzKcQAD0QBaAGwAOaZQDMAFkXSATOvkBOAOwBWXboA0IAJ5Tlsyi1u39sxQEYWmlrIC+H02kw58xORUGBAQ5FAMADIA8gCCACIAYtEASrisHEggvPyCwqISCJK6yrqUWvrKTprq+op1sqYWCLqKlLqa2urVHQaKLMpePujYeISkFJQhYWQRyLEAcsgAopEZojkCQiJZhZL60gqKOrosutoa0tVNiNXqlNosFyxOVY76ropDIL6jARPBULhBjIFLLWIAFWW6yymzyO1Ae2U6mU7VkTm0im0GPU2lkslUNyKqkosn02nJsieulkuOU0m+v384yClAAbhhaDRsMCIMIqOQ2TwANZUDlciCjGHcPhbfK7KSaGwU7RWOqtJzoxrmSzWOz2C74xT9TzeH4jZmBSbi7mCWYMMCoVA8VCULi0bAAMxdAFt2ZzbWBpdlZfCCorDKTlMpsdHHMp3MaiZJ1LZKAmWNI6l1bBpdIyLWMrVQCBbefzqGQhaLKLEuCQmUH2BtQ9twwgsdpKNInv1XgcBtjk-Ju6r9JVs85jl8zY3-qzS35y5NBSKqHWG4WmE5MjLcm2FQgE04HrYKSw6uppGoifUbFSjA5jj2r7oGbPC-PJouefbHc7XXdL1fVretG2DOED0RW5lH0UcPlkbRMS6RDpGTVMWHTXMqjxdQsSzd8zTIHgIDgUQ5xZCgW33eVoKKAkFAcWpMR7fFaW1ZoU1kMpHkzfQXHHFQKXfYY-CLAFqDoMBqLlBFxCkc5rCY8k1HcfEtGTGNKA+Oxx1OPECJE80xK-QEZigGSw0PfYyW01RNEMVDdFeZMNEoDFqmQ-jpDfFECxMyixQDSU7Qs2FW1o+SinUGl3J8qlkQJFxamHOCkKQtjuNVUpBg-ALi0oH9QssqCoteTDalqDppATDRB2HBR9UUK8VO4mdRL+QLKD5KjwpouS9jaRCYu86p+nOAx9CJJxmpsQw8KxF50UxLwvCAA */
    id: "CreateMachine",
    initial: "idle",
    context: {
      store: null,
      form: null,
      task: null,
    },
    states: {
      idle: {
        always: {
          target: "adding",
        },
      },

      adding: {
        entry: "notify",
        on: {
          LOADFORM: { actions: "loadForm" },
          CANCEL: { target: "done" },
          CREATE: { target: "validating" },
        },
      },

      validating: {
        entry: "notify",
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
        entry: "notify",
        invoke: {
          id: "ApiCreate",
          src: "create",
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
              target: "adding",
              actions: "toastFailure",
            },
          ],
          onError: {
            target: "adding",
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
        message: "task created successfully",
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
      loadForm: assign((context, { form, fields }) => ({ form, fields })),
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
      create: (context) =>
        new Promise((resolve, reject) => {
          const task = context.fields,
            // clone the task so we can add fields without affecting original
            taskClone = isProxy(task) ? cloneDeep(toRaw(task)) : task;

          if (taskClone.Skills) {
            taskClone.Skills = taskClone.Skills.map((skill) => skill.Code);
          }

          // All new tasks are set to shared
          taskClone.Status = "shared";

          context.store.create(taskClone).then((result) => {
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
        }),
    },
    guards: {
      opSuccess: (context, event) => event.data.success,
    },
  }
);

export { ApiCreateMachine };
