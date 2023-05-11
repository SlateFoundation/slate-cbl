/* eslint-disable one-var */
import { assign, createMachine, sendParent } from "xstate";
import { toRaw } from "vue";

const TaskFormMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBUCGsDWAxA9gJwFsBZVAYwAsBLAOzADoBJCAGzAGIAzfAumygF0qpmlAF5gA2gAYAuolAAHHLAGUc1eSAAeiAGwAOACx1DU3QCYArLoCMhmwHZL+gMwAaEAE9Elly7qOllJSVgCcUg6G+gC+0R5omLiEJBQ09ABKYKgQnmykqNSkYMx0XITSckggSiqC6po6CDbmhsbmulKGls5hFg4e3gj6+lJ0+uahNrpRNlJGug6x8ejY3ClUtHSZ2bllPLAArgBGBAIVmjWq9VWNza107Z3d45ahfQOIruZ0LhM2oaEjHYvksQAlVskyBsMlkcmxUHhUgA3ej8FbnKqXOoaG6fLp0Bz6GwuUIuJyWRyGdxeRCAhw-VwuXQuIIuKShXyg8FJYhQtJbWG5A7UBHI1Ho2QXZRXHGgRrjekUqS+ToAibWD4IczKgkAvU2Zrs6wuLkrHnrfnbOGkZjqcWYDGKaXYhqIWYOGwEhwdYZWBwOFnmTW6UL0hwtUMGUPBeymxJrPmbABqwkoEFQgmoUDYEDtvGoSJwGHoSNT6f4kklmOdall2jdLTaHS6PVe7xpQ09hj1gKJE30C1CcYhvNSybLGZo2bAeDw+DoCmYGb2dFLInLlcqTtqtddTX7DyC7OZZgccyDHYDoR+Z4HETZc30iziYLNCbH9AAysdTvxM9nHWqGtrjlN1wjoXw7g5KlTFCVpNWaAMAksexJkMM9DHMGxh3NRMvx-AR-zYCQbC3ICdxA+smnAyCIxQlxYPgjtZifB4yQpX50OZGwYhfbl32hOgAGE8CyIjc02GhC2LOgAEEFEoESxM3KUKLrRoDGMUwLGsOxAlcBDTDDKZNMmEYyWwvi30hD9hNEycsxzPMpKLeh5MU+yKxIsisV3XEEE0kwzCsWx7CcAzmKkFkxkZcwjHDLohys+MbMEpSHOnWd50XZduDkhT0q8qttxlPdAu0kK9PC6lBgNOKxnsXQFmcFx9F8Z9lhS0dBIAVQUcspycySC1c-LKD6jdAN8yiNKMIKdNC-SardI86GakJTAmKkphwgT+QmjKhvoFyZPcg6vNI1TSv88rgt0sKWoQ8wsLGYJgiajkWnGXbUv2-rDpnOc8AXJd+BXM7-qKnzgPUvQ5oq+6loQlw7AJFquhGJrMN0H7uv5WTESoJFBok46RtOhSCbFKaYbK+G7sW6rgwmAI-BR7VtS6XGLU2KmiZJ5zybcynCcoFFvKul0bvphaqsey8oggo8JnDIkmo618up5tzReJxzAey0HwZF6nivI67QICmXKoeiLBgHek3g+pqbGNSzOpHbW6B6kVdYF4bpOF8bqD5sWVOrNS6a0hm5btxArGMB8pFmJqPuVXiPdw2yfdFfnHNJ-NA7Gn3Q-Fy6I4tqjbtl23loQBj6SsL4qUHZwOW5vDvd95FBoN4GcrBvKzpD3Xw5KqXLerm2kY7VpRiw1OG9JXxLFiF9qBwCA4E0fjftoSW-MtgBaXRNRPjvbKYVgD5mxAon8VOXeTlUDU1Clr3CewWrJaYLAvwSrSDHHofKisx8SGAMESSwWEeLtE1E4T0z1WRzGTiMduyVPadxTOuDKN9YZNFZGtTojwuhxW7JYeB5h6TsgBPFX4HRHD-35N+E4hEpx4L3JhTUwwxhOGCNAqkwQ7BMM2IVdhFcJ5UVMJYB4BhnrmDJOED0NgEKdH0HQOk3Y2qtEcKGER9BzriOAbfeuAIAihlJK1FB0YKHMQUcYT+jgFjOySpnPavM-ZZg4f5UwidtH2GVFQhip8OxNW+J0KYHo4pRPDPoruucxZGPNpIxoFkNEOEmISEMrh-iGE1NqUYfD+FsmegadBbi970AACJ2m8ZbV2UUiHYyeGQjkhlOhrQ5J-ewrgIhr2iEAA */
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
        exit: "resetForm",
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
        entry: "resetForm",
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

      // TODO: why doesn't this work?
      resetForm: (context) => {
        context.form.reset();
      },

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
      toastSuccess: sendParent((_, event) => {
        let message;

        switch (event.type) {
          case "done.invoke.ApiCreate":
            message = "task created successfully";
            break;
          case "done.invoke.ApiUpdate":
            message = "task updated successfully";
            break;
          case "done.invoke.ApiArchive":
            message = "task archived successfully";
            break;
          case "done.invoke.ApiUnarchive":
            message = "task unarchived successfully";
            break;
          default:
            message = "operation successful";
        }

        return {
          type: "send.toast",
          message,
        };
      }),

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

export { TaskFormMachine };
