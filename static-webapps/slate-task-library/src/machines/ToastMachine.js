/* eslint-disable one-var */
import { createMachine, interpret, assign } from "xstate";
import { useActor } from "@xstate/vue";
import { logTransition } from "./logTransition.js";

export const ToastMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBUD2BDWAXAsugxgBYCWAdmAHTEQA2YAxMgPICCAysgNoAMAuoqAAOqWMSzFUpASAAeiALQBGAEwUAzBo2LuANjXbl3ABxqANCACeiRUYCsFAOxOHdxQE5ji20aMBfX+ZomLgEJOQUWBjYZFCMrBw8-EggwqLiktJyCMq29or5ig4ALHZGbkXKbrbmVghGFD5l3GrKRoZubkY2-oFRIURklJHBMfQAqgByzOxcfNKpYhJSyVnyymrqHjrrikUqJtwOyjXWbhS5uQ7NRbbF+hX+ASCkqBBw0kHYeAPk8yKLGRWCnWqh0YJ0DlsBj2HR0JwQ8hcFB0+W4nRsDiqFSKPRAn36YUo1DofzSS0yChsRWR4Mh0Pcbjhlms+nOFxyaiMOj2ajcuPx30JET6MVJAOWoCyux0DR8bgZ7mUlVsx2ZCEUrIuUOUEMOuS5j18QA */
    id: "ToastMachine",
    predictableActionArguments: true,
    initial: "idle",
    context: {
      toastIsVisible: false,
      toastMessage: null,
      toastColor: "info",
      toastTimeout: 4000,
      logTransition: false,
    },
    states: {
      idle: {
        on: {
          "send.toast": {
            target: "toasting",
            actions: "toast",
          },
        },
      },

      toasting: {
        on: {
          "send.toast": {
            target: "toasting",
            actions: "toast",
          },
          "remove.toast": {
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
