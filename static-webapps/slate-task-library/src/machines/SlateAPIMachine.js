/* eslint-disable one-var */
import { createMachine, interpret, assign } from "xstate";
import { useActor } from "@xstate/vue";
import { logTransition } from "./logTransition.js";
import { useTaskStore } from "@/stores/TaskStore.js";

const SlateAPIMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGUA2BDALmAggBQEkBZdAYwAsBLAOzADpKJUwBiAgOQIBUBtABgC6iUAAcA9rEqZKY6sJAAPRAFoAbAA46q7QBYA7AGYD69ar0BGEwBoQATxXm9euue2qDegKyenAJn0AvgE2aFi4hCQUNPQATmDoELYsAMIASgCiOFzp-EJIIOKS0rLySggGOlpOBqp8nhXaegCcejb2CDqVbqqe7j58eny+-kEhGNj4xGRUtHRxCUnpACLcufKFUjJy+WU6TXR8h756Oj3qvnwG5r6ebSqddJ7qRqqnvh6vJ6MgoRMR09E5vFEiwAKp4JZZdJ4HAAcRygnWEk2JR2KiMziaWOevnM9QMFwMdwQylcdD22PMfD66h0AwMQWCIGoYggcHkv3CUyitCRRS2pXR6k8dCxTRxeKMhOJyl8ry0bjpN1e6gG305k0iM3ojGYfJR21AZVJ4roRiutTplya1N8MvM5n2zylOl6TU6FU86vGXK1gPmiX1xUNigc5kqYtVTTlnnMNT0drsKlU5MjVJpdMM3rCmoBs1QYgSNCgQYFaJJDoj2L40Z6cbMifacb4dGdxgq7wdQ1U2b+3O1dFI82k1BL+Q2wcFCEsKbc6icJzO0qT09U+zFkdUvmjTR7TI1-x59Egm1HpdRRsQccq5s8ctUDoJ6muMpTFPF6YMT0zDMZQA */
    id: "SlateAPIMachine",
    initial: "idle",
    predictableActionArguments: true,
    context: {
      store: null,
      itemsPerPage: 20,
      logTransition: true,
    },
    states: {
      idle: {
        on: {
          INIT: {
            target: "ready",
            actions: "initialize",
          },
        },
      },

      ready: {
        on: {
          CREATE: "creating",
          EDIT: "editing",
          UPDATEPAGE: {
            target: "loading",
            actions: "updatePage",
          },
        },
      },

      loading: {
        invoke: {
          id: "fetch",
          //   src: (context, event) => context.store.fetchPromise(),
          src: "loadStore",
          onDone: {
            target: "ready",
            actions: "success",
          },
          onError: {
            target: "ready",
            actions: "failure",
          },
        },
      },
      creating: {},
      editing: {},
    },
  },
  {
    actions: {
      initialize: assign(() => ({
        store: useTaskStore(),
      })),
      success: (context, event) => {
        console.log("success!");
      },
      failure: (context, event) => {
        console.log("failure!");
      },
      updatePage: (context, event) => {
        console.log(event.page);
        console.log(event);
        context.store.setOffset((event.page - 1) * context.itemsPerPage);
      },
    },
    services: {
      loadStore: (context, event) => {
        console.log("loadStore!!!");
        return context.store.fetchPromise();
      },
    },
  }
);

// Create a service
const service = interpret(SlateAPIMachine).onTransition(logTransition).start();

// Create a custom service hook for this machine, that takes the service previously created.
export const useSlateAPIMachine = () => useActor(service);

// invoke: {
//     src: childMachine,
// onError: {
//   actions: (context, event) => {
//     console.log(event.data);
//  {
//    type: ...,
//    data: {
//      message: 'This is some error'
//    }
//  }
//   }
//   invoke: {
//     id: 'retrieveCats',
//     src: (context, event) => fetchCats(),
//     onDone: {
//       target: 'success',
//       actions: assign({ cats: (context, event) => event.data })
//     },
//     onError: {
//       target: 'failure',
//       actions: assign({ errorMessage: (context, event) => event.data })
//     }
//   }
