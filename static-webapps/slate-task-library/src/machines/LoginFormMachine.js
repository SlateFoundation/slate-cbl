import { createMachine, sendParent } from "xstate";

const LoginFormMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBkD2UCWA7AYqgTgLYCyAhgMYAW2YAdMXLKTAMQBmBhtqADmFgG0ADAF1EoHqlgYALhlRZxIAB6IAtAEYAHAFZaAJi1aA7EOP7jGgJwahQrQBoQAT0Ta9QgCyfrWzwGZ9DX0bAF9QpzRMXE4yKhp6RmYwdk5aclIscjAAG2ExJBBJaTkFJVUETSshWitLO30zTy1-IQA2J1cETys9T3aTY2MdIR1jfy1wyPRsPCI46iw6ACUwUghnVKJaWABXACNCWXylYtl5RUKK4y1aTx02wOM23rGgxxc3XVovHys-QLBaptKYgKKzWIURYrNYbLZcDJZXInQpnUqXUAVfyeWh+TxtHT+IZGbwaZ6dRD3Nq4mzGTz6NoaRnPSYRMEzGLzKEJACCuxklH4cgyciwUBYEAUdGwADdUABrOg8ngYcGCUSnKTnMpXSneXF+f5aDT4+n6QkUhDGu5WW3jfzWDQ6EwaUFquYkblLWh8gVCjAi7DiyXe2UKpUqtUCDQFCRa9HlPXGWhktppuo6Or+f7GS2NDS0HTaBkTRktDSutnuyHxb2+wVYYWkUXisD4fAEWg8HLNjjbZWqjkouMlC6J7r6qwO3Q+WzOoT6PNaKwplqmQx1cwhN0cj0LXn8htNlssNsd-BdnsyPtcAdRmOa0c6zFJ3EBB0PIQmnQMy0TfS4v4rSZoSozaAS4RslgqAQHASjVlytZgI+2oYio6j+A8Kb6ESOFtMM+JWB0nyVNSdh2K0djWEIgT6Du0R7l6dAMLATAwChCa6pUrS3MEuH+PhOiEcRXTuD83j6I07Q-gJjz0RCiHQrQqzrF0I6oeOaj6g6hjYroTo-pmniWmJvy+AEQQhO08mcp6SE+oe-qBmKHFjlxQR6IyJotG0QQZouJG2LcAnOp4xh1HU1jOjZjH2QAIlKrnPuhCDjCuzxjESOk2L+gVfnc4UaAJwzGqYxqQaEQA */
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
