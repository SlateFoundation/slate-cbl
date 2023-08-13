import { createMachine, sendParent } from "xstate";

const LoginFormMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBkD2UCWA7AYqgTgLYCyAhgMYAW2YAdAEpikQCeAxAGYGG3mlbkwAGwDaABgC6iUAAdUsDABcMqLNJAAPRAHYALADZaAZn0GArACYjARl0AOaxYA0IFoitjadsXaNmAnN5mumL+-roAvhEuaJi43GRUNAxMrJzctLAArgBGhEriUkggcgrKqupaCOZe-gFiFrZ2-kb+YvoubgjWerS6Zr4h1naNutZmUTHo2HhEidRYdACCWYqUYFjKfMpYUGwQqnTYAG6oANbLMhix2IXqpUoqasVVRmK6tKYDZo662v4WKy6TqIBx9MJhfR2bQjYYwyYgG7xOYUBbLVbrTYYbbYPYHRa0E7nS7XaZYETWIqyeSPCovRBvD5fOw-Cx-AFAkEIQEfOqDWzaCxtH4IpGzEio5IrNYbLakHZ7MD4fAEWgyITyrhEWhLK5Iu7FB7lZ6gV7vT79Fm-f6AozA1wMnq0fzWfT6AFGCzaRnafRRaIgLCoCBwdRihKSxb3GnGyqIAC0HQdCETtDE6fTA0GYjMuf0EwD4ZRSQJjGYXWpZSecYQ+i9aZsb0Cnt0gKTXQswQb2h++iMvn+dVFZPF8ylGNl2PluOjVbppsQra51nTxj5flz3n01gBw7io8jdAAIodZ7STZodK1aL6zN7vY4XRZ24gV9Y+v9rCYew5tD5rP6ERAA */
    id: "LoginFormMachine",
    predictableActionArguments: true,
    initial: "Message",
    context: {
      store: null,
    },
    states: {
      Message: {
        on: {
          "form.open": {
            target: "Ready",
          },
          "form.cancel": {
            target: "Done",
          },
        },
      },

      Ready: {
        on: {
          "form.submit": {
            target: "Authenticating",
          },
          "form.cancel": {
            target: "Done",
          },
        },
      },

      Authenticating: {
        entry: "notify",
        invoke: {
          id: "ApiLogin",
          src: "login",
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
          onError: [
            {
              target: "Ready",
              actions: "toastAuthFailure",
              cond: "authFailure",
            },
            {
              target: "Ready",
              actions: "toastFailure",
            },
          ],
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

      // User Notifications
      toastSuccess: sendParent(() => {
        return {
          type: "send.toast",
          message: "login successful",
        };
      }),

      toastFailure: sendParent((context, event) => ({
        type: "send.toast",
        message: context.store.getErrorMessage(event.data),
        color: "error",
      })),

      toastAuthFailure: sendParent(() => ({
        type: "send.toast",
        message: "Sorry! The username or password you entered was incorrect.",
        color: "error",
      })),
    },
    services: {
      login: (context, event) => {
        return context.store.login({
          "_LOGIN[username]": event.fields.Username,
          "_LOGIN[password]": event.fields.Password,
        });
      },
    },
    guards: {
      opSuccess: (_, event) => event.data.success || event.data?.data?.success,
      authFailure: (_, event) => event.data.response.status == 401,
    },
  }
);

export { LoginFormMachine };
