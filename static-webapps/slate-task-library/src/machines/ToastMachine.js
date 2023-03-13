/* eslint-disable one-var */
import { createMachine, interpret, assign } from "xstate";
import { useActor } from "@xstate/vue";
import { logTransition } from "./logTransition.js";

export const ToastMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBUD2BDWAXAsugxgBYCWAdmAHTEQA2YAxMgPICCAysgNoAMAuoqAAOqWMSzFUpASAAeiACwBmCgDY1KgOwBGbgCYdugKz6ANCACeiLUooBOe-d27b8gBzyPugL5ezaTLgEJOQUWBjYZFD0AKoAcszsXHzSwqLiktJyCFqGrqpqGtzcinqK7opmltlqFBrOWioNSq4qroryPr4gpKgQcNL+2HhEZGApImISUkiyiAC0KpXzKhRFRYqGSvIaGu26ij5+4YEjIdR042lTmQq6SwiuWhTyDq723IYNum2HIIMnwUoYQCkUukwyMyy8juFkQukaFEUSJKrncWg07nkKk6XiAA */
    id: "ToastMachine",
    initial: "idle",
    context: {
      toastIsVisible: false,
      toastMessage: null,
      toastColor: "info",
      toastTimeout: 4000,
      logTransition: true,
    },
    states: {
      idle: {
        on: {
          TOAST: {
            target: "toasting",
            actions: "toast",
          },
        },
      },

      toasting: {
        on: {
          UNTOAST: {
            target: "idle",
            actions: "untoast",
          },
        },
      },
    },
  },
  {
    actions: {
      toast: assign((context, event) => ({
        toastIsVisible: true,
        toastMessage: event.message,
        toastColor: event.color ? event.color : "info",
        toastTimeout: event.timeout ? event.timeout : 4000,
      })),
      untoast: assign(() => ({
        toastIsVisible: false,
        toastMessage: null,
        toastColor: "info",
        toastTimeout: 4000,
      })),
    },
  }
);

// Create a service
const service = interpret(ToastMachine).onTransition(logTransition).start();

// Create a custom service hook for this machine, that takes the service previously created.
export const useToastMachine = () => useActor(service);
