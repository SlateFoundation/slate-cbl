import { createMachine, sendParent } from "xstate";
const ApiDeleteMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBEwBswBcwFkCGAxgBYCWAdmAHQCSEGAxANoAMAuoqAA4D2sJmJbmQ4gAHogDMAJgCslABxSpATikBGAOwyVKjQBoQAT0QAWNcwVbmzNWpkbmEtcoC+Lg6gzZ8xclQDCQgBmJABOALbkUPQEeGQE6JQQ6FhgLOxIIDx8AkIi4ggayhKUzMUaAGzaMvIa8spqBsYIsvKUUhIaJsoaEiYdfRpuHinehKQUlIFkIRFR9MmwmKHchpT8YOHpItn8gsKZBSYVGpQSMmYamtqqPU2ImiaUJjXSyibMZsxKUsMgnqkfBMqKglitDPMIEIqOQAG7cADWVAAgpwSKDlqttpldrkDqACtI5IodNcdHcjIh5Gpnso6cVtJVOp0-gCxr5JhjwZDoesyPCkZRUei4JjDIw1BkuLw9nlDpJZAolKoybd9JSWlInspXioPl8fqzRrhxn5KFzVvMwKEVqFKJw0HhMEFuBEhWiLeK2DsZXj8gricr1Fpyermk5Tg0KtHtPJmDITo43O4QGRuIsRGyTRywD6cvt-QgALQVe7FuT0ytVukSI1ebPAmh0XM430F+UINTU571Go1SrHEzyExlj7KSwyay2eyOZx1wGmybTWaRMhQPOy-FiRAVJzPExFYM3XRljpyDpdHp9AbHGTz9mNz1RDd+jv9MvmGmaKNqW-yCrKPI94NmayDQi+7YEogOolIBygVMwtQVIOw4fmUlDITUUjUkSEiYcmLhAA */
    id: "DeleteMachine",
    predictableActionArguments: true,
    initial: "Idle",
    context: {
      store: null,
      task: null,
    },
    states: {
      Idle: {
        always: {
          target: "Confirming",
        },
      },

      Confirming: {
        entry: "notify",
        on: {
          "cancel.delete": { target: "Done" },
          "destroy.item": { target: "Destroying" },
        },
      },

      Destroying: {
        entry: "notify",
        invoke: {
          id: "ApiDestroy",
          src: "destroy",
          data: {
            task: (context) => context.task,
          },
          onDone: [
            {
              target: "Done",
              actions: "toastSuccess",
              cond: "opSuccess",
            },
            {
              target: "Confirming",
              actions: "toastFailure",
            },
          ],
          onError: {
            target: "Confirming",
            actions: "toastFailure",
          },
        },
      },

      Done: {
        type: "final",
        data: (_, event) => event.data,
      },
    },
  },
  {
    actions: {
      notify: sendParent({ type: "child.transition" }),
      toastSuccess: sendParent({
        type: "send.toast",
        message: "task deleted successfully",
      }),
      toastFailure: sendParent((context, event) => ({
        type: "send.toast",
        message: context.store.getErrorMessage(event.data),
        color: "error",
      })),
    },
    services: {
      destroy: (context) => context.store.destroy(context.task.ID),
    },
    guards: {
      opSuccess: (_, event) => event.data?.data?.success,
    },
  }
);

export { ApiDeleteMachine };
