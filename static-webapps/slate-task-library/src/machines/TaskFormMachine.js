/* eslint-disable one-var */
import { assign, createMachine, sendParent } from "xstate";
import { toRaw } from "vue";

const TaskFormMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBUCGsDWAxA9gJwFsBZVAYwAsBLAOzADoBJCAGzAGIAzfAumygF0qpmlAF5gA2gAYAuolAAHHLAGUc1eSAAeiALQBGAEwBWOgHYpADkOWpANkt2ALMf1mANCACeiM-qfmAMxSRk4AnIF2gUYAvjGeaJi4hCQUNPQASmCoEF5spKjUpGDMdFyE0nJIIEoqguqaOghO+lLmUoaGYWF2Ya5mznaePgitHXRSxtbdYSH6lk5xCejY3KlUtHRZOXnlPLAArgBGBAKVmrWqDdVNgXd0xoOGZoHG3Wadw75SgXSGdnYpGZXCFDPpeksQIlVikyBtMtlcmxUHg0gA3ej8FbnaqXeoaG56fT6MJ0Sy2cF+Gx9Jx3L4ISxGOh9H5OXrOWb6SHQ5LEOHpLaIvIHago9GY7GyC7KK4E0BNAxdCb6Yyqx4k7pOJyGenGAZ0cKAlWdOxufSBbkrXnrAXbJGkZjqCWYHGKGX4xpE810UJhJwdKROCkmel2Gx-QLdMN64xdEmWpJrfmbABqwkoEFQgmoUDYECdvGoaJwGHoaPTmf4kiluPdajl2l8gTM5g+ERcxkDJP0oc6f3mHXNhikHU6CZhfLSqYrWZoubAeDw+DoCmYWb2dHLIkr1aqbrq9c9CFjv0DljCjMskYc9NspnPs1cr3+rUM4+tyfoAGVjqd+Nnc1dGo62ueVEB6SwHjMRwh07TpLHpCwAlcQFwnsDoFgteIoStJMp2-X8BAAtgJH0PdgIPUDGwQC82kCSwpjCLoFm1QInEQuxTCkWYHHJFoaUsd88PhOgAGE8GyYj802Ghi1LOgAEEFEocTJN3aVKIbJp-FaP4bDueYLDeMJELCFsMNNf0mO6WJsJ5YSBVU2cczzAtZJLeglJUiSs0kMiNNlI8dMMB4NReV5+J7bxwMCELIxQ1wGKcD5BLs3DYXwsSfOIhclzwFc134DcvKcqsgLxQ9CRoswW3BEkg0MejGuBW99TBPU22NZszCEjKRIAVQUSs51cmSiw8xTlMGndypArTEH8KwI1ecFZiDFwopGTtTD8EcgWBMJWhcRY0sTPqBWm5zc2k+h3PkrzLrK-za00oKWjaWNYxHBwphqwJ6X9EKYOiBZHgGeZesnAahquthcuXVd124SbKEe9SXsCqqzNMSlzVij4g0iXUwXMfjYtizoCchm1NgU1EqDREabsLOTPOUunxVm16qt0Zs-gvc8jDDMxCYWVrTHCNDjCDUERepz9FPpyhGZc5m7rZygOYZvzyIqqiFVpdoHHmfw+gYyZ6VacEyU49ljDYg631Oicac8pWVfnRcEcK4r2fd9H90xsDRl+SwBljWxDpaYEr0tlU7DoSMdO1INem1eXMv60V3aZtzxvuqbqC15WA4ooPqN0FxmUaqPAVsfT-npLpapeAZr2cD5jAzgbs-RXOxtZlGs+LjFSN1uaj10WNE+iMwbLMlPY3peidupBjI0MVieudj9M97hmRvh-LEaK5GHqL-2ufLppTBMFVAxF01m2cTbEEJxOfk7AYTGcIM4mw6gOAIBwE0PZc6tAAoeh5i0fQDwTBzzDCYYyxgm7cToHYVu6pXAkk7KlZYZ0oYCiYKwSBlVg680iGSNkpodKtHBuxaKCA-C-D6BEMEAwgTfW7raIUpD9YLWCDPGqzwIhsT1AhRhGD7z-HCG8EWPwATcOnNuK6fD5rHnGJ3boJovpRFDJxcwAJAxglZFEJ2+CXYKx-CcIic41FHjnpBNwh15iHRCDVRC4x-iAlVMCc0fo7BKPoKVOxGMoHB2JHqZkvRoLRD2jVIYjCBiQW4txFwkQ7juKCXQR6oTA7hOopElh8FuivApiLXU9FmSsKYvXGqAxskjzyWXApCpYoBH9B8ZsPw2JakcJbB+zIzz8QDDI7JWcxQHxzPYnmGS4F6h6J0VU3QUGMNpHFZsh0LALB6PRbJAARJ0MyIkWATv4QEERHGtG6KGWY6DnjPG1PbHoZl-4xCAA */
    id: "TaskFormMachine",
    predictableActionArguments: true,
    initial: "Idle",
    context: {
      task: null,
      form: null,
      fields: null,
      store: null,
    },
    states: {
      Idle: {
        entry: "notify",
        on: {
          "form.initialize": {
            target: "Ready",
            actions: "initialize",
          },
        },
      },

      Ready: {
        entry: ["notify", "loadForm"],
        on: {
          "cancel.form": {
            target: "Done",
          },
          "form.submit": {
            target: "Validating",
          },
          "archive.task": {
            target: "Archiving",
          },
          "unarchive.task": {
            target: "Unarchiving",
          },
          "clone.task": {
            actions: ["assignTask", "loadForm"],
            target: "Ready",
          },
        },
      },

      Validating: {
        entry: "notify",
        invoke: {
          id: "validate",
          src: "validate",
          onDone: [
            {
              target: "Submitting",
              cond: "isFormValid",
            },
          ],
          onError: {
            target: "Ready",
            actions: "toastValidationFailure",
          },
        },
      },

      Submitting: {
        always: [
          {
            cond: "isEditingMode",
            target: "Updating",
          },
          { target: "Creating" },
        ],
      },

      Creating: {
        entry: "notify",
        invoke: {
          id: "ApiCreate",
          src: "create",
          onDone: [
            {
              target: "Done",
              actions: "toastSuccess",
              cond: "opSuccess",
            },
            {
              target: "Ready",
              actions: "toastFailure",
            },
          ],
          onError: {
            target: "Ready",
            actions: "toastFailure",
          },
        },
      },

      Updating: {
        entry: "notify",
        invoke: {
          id: "ApiUpdate",
          src: "update",
          onDone: [
            {
              target: "Done",
              actions: "toastSuccess",
              cond: "opSuccess",
            },
            {
              target: "Ready",
              actions: "toastFailure",
            },
          ],
          onError: {
            target: "Ready",
            actions: "toastFailure",
          },
        },
      },

      Archiving: {
        entry: "notify",
        invoke: {
          id: "ApiArchive",
          src: "archive",
          onDone: [
            {
              target: "Ready",
              actions: ["log", "toastSuccess"],
              cond: "opSuccess",
            },
            {
              target: "Ready",
              actions: ["log", "toastFailure"],
            },
          ],
          onError: {
            target: "Ready",
            actions: ["log", "toastFailure"],
          },
        },
      },

      Unarchiving: {
        entry: "notify",
        invoke: {
          id: "ApiUnArchive",
          src: "unarchive",
          onDone: [
            {
              target: "Ready",
              actions: "toastSuccess",
              cond: "opSuccess",
            },
            {
              target: "Ready",
              actions: "toastFailure",
            },
          ],
          onError: {
            target: "Ready",
            actions: "toastFailure",
          },
        },
      },

      Done: {
        type: "final",
        data: (context, event) => event.data,
      },
    },
  },
  {
    actions: {
      notify: sendParent({ type: "child.transition" }),

      // Initialize context with form reference, fields and task
      initialize: assign({
        form: (_, event) => event.form,
        fields: (_, event) => event.fields,
        task: (_, event) => event.task,
      }),

      loadForm: (context) => {
        const task = context.task,
          fields = context.fields;

        if (task) {
          for (const field in fields) {
            if (Object.prototype.hasOwnProperty.call(fields, field)) {
              if (Object.prototype.hasOwnProperty.call(task, field)) {
                fields[field] = task[field];
              }
            }
          }
        }
      },

      assignTask: assign({
        task: (_, event) => event.task,
      }),

      // User Notifications
      toastSuccess: sendParent((_, event) => ({
        type: "send.toast",
        message: successMessages[event.type] || "operation successful",
      })),

      toastFailure: sendParent((context, event) => ({
        type: "send.toast",
        message: context.store.getErrorMessage(event.data),
        color: "error",
      })),

      toastValidationFailure: sendParent(() => ({
        type: "send.toast",
        message: "Please correct any form errors and try again",
        color: "warning",
      })),
    },
    services: {
      validate: (context) => context.form.validate(),
      create: (context) =>
        context.store.create({
          ...toRaw(context.fields),
          ...context.store.blankRecord,
        }),
      update: (context) =>
        context.store.update({ ID: context.task.ID, ...toRaw(context.fields) }),
      archive: (context) =>
        context.store.update({ ID: context.task.ID, Status: "archived" }),
      unarchive: (context) =>
        context.store.update({ ID: context.task.ID, Status: "private" }),
    },
    guards: {
      opSuccess: (_, event) => event.data.success || event.data?.data?.success,
      isFormValid: (_, event) => event.data.valid,
      isEditingMode: (context) => context.task?.ID,
    },
  }
);

const successMessages = {
  "done.invoke.ApiCreate": "task created successfully",
  "done.invoke.ApiUpdate": "task updated successfully",
  "done.invoke.ApiArchive": "task archived successfully",
  "done.invoke.ApiUnarchive": "task unarchived successfully",
};

export { TaskFormMachine };
