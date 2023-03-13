/* eslint-disable one-var */
import { createMachine, assign } from "xstate";
import { useTaskStore } from "@/stores/TaskStore.js";
import { cloneDeep, isEqual } from "lodash";
import { isProxy, toRaw } from "vue";

const create = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMBOYCGAXMA6AlhADZgDEA2gAwC6ioADgPaz5b6MB2dIAHogBy4AnADZ+AdgCM-ACxDRAVkr8ATABoQAT0QBaSTNwBmIQtmUVFkYesqFAXzsa0mHLmfZ8HKKQic8ngDdGAGs8AEF6fABhdGwwKlokECYWNk5uPgQZGUlcSnzzcUNxFSkRGQ1tBB1xcSNrQxl+Q0oFIUkW-gcnWNd3Ni9SMFRURlRceiJsADMxgFtcCOje+JpuFNZ2LiTM7MEG4o7rcQVDfhFKxEl83BE7kSFDFRF88pMHRxAORgg4bn6wOtmJt0jtdCo5HkCipKNdTiZKBUtLpJOVcM1rEoTuI7jJrN0QACCMRAUkNmltqBMjoYbkCuZYa1jEokVU9CJbvcSjJbIYlCISgSif1PFAgakthlEDChMJ5PJaidmmJxJdqqjOXdubz+eIhStcL4OKSGMCKVKECJrprue0FKYSmqFLhTDZ+CYFA92uYPnYgA */
    id: "create",
    initial: "idle",
    context: {
      store: null,
      updates: null,
      fields: null,
      task: null,
    },
    states: {
      idle: {
        entry: "initialize",
        always: {
          target: "creating",
          actions: "compileUpdates",
        },
      },

      creating: {
        invoke: {
          id: "ApiCreate",
          src: "create",
          onDone: {
            target: "done",
          },
          onError: {
            target: "done",
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
      initialize: assign((context, event) => ({
        store: useTaskStore(),
        form: event.form,
      })),
      compileUpdates: assign((context) => {
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
      create: (context) =>
        new Promise((resolve, reject) => {
          const task = context.fields,
            // clone the task so we can add fields without affecting original
            taskClone = isProxy(task) ? cloneDeep(toRaw(task)) : task;

          if (taskClone.Skills) {
            taskClone.Skills = taskClone.Skills.map((skill) => skill.Code);
          }

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
  }
);

const read = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCcwEMIDoCWEA2YAxANoAMAuoqAA4D2s2ALtrQHZUgAeiAtAGykAnJj4AmACwBmABwDJ80QHZJAGhABPXqUyCpAVnlDJpMaUV7pAX0trUGTHloZsrKIQhswOVgDdaAay8AMzBGAGMACzJKJBA6BmY2Dm4EHlFJRR1FUgBGPkVZQUkcnMk9NU1UxT5MRRzxcT4cvWzBOvEc61t0LEdnV0IwZGRaZExqPDRGINGAW0wQ8KiKDnimFnZYlLSMzGMy0nFqk2lmvgrEaXFMaTaFPL1RQVJJcWsbEFZaCDgOOwhVvR1kktrwrpJMEpJE9BKI4aI9C0Lqk8tdRPVGvU9IJBDl0m8Pv8cPgwICEhtkrxFII9JDlDD4QikRpeAidPpxLkDoI+OI9F0QES+hAXFAycDNqBtnoXpCjiU9HicbJziyUdI9k86npeS0+EU8QKiR5WKTYmtEpKuFSau0DDlpKRFY6XsieBD9WVjHiHU0ZLp3pYgA */
    id: "read",
    initial: "idle",
    context: {
      store: null,
      result: null,
    },
    states: {
      /**
       * Idle calls initialize upon entry then performs an eventless transition to loading
       * https://xstate.js.org/docs/guides/transitions.html#eventless-always-transitions
       */
      idle: {
        entry: "initialize",
        always: {
          target: "loading",
        },
      },

      loading: {
        invoke: {
          id: "fetch",
          //   src: (context, event) => context.store.fetchPromise(),
          src: "loadStore",
          onDone: {
            target: "done",
          },
          onError: {
            target: "done",
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
      initialize: assign(() => ({
        store: useTaskStore(),
      })),
    },
    services: {
      loadStore: (context) =>
        new Promise((resolve, reject) => {
          context.store.fetch().then((result) => {
            if (result.success) {
              resolve({ success: result.success, message: result.message });
            } else {
              reject({ success: result.success, message: result.message });
            }
          });
        }),
    },
  }
);

const update = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDMwBcDGALAdASwgBswBiAbQAYBdRUABwHtY808GA7WkAD0QoBoQATz4BfUYNSZchBgEMIedlBIQOYfOwBuDANYap2SjSQhGzVhy68EAJgDsANhz2AzAE4ArF48VP9gA57QRE7AEZXHDDbTwoKW1sAFntE1wDXW3FJdGwcWQUlFTAAJ2KGYpw6Qjk0ZHKAWxxDLGMucxY2TlMbB3scRIpHW0dXV3sKMPcKdxDEALCcWLj4xM8w+zWk8QkQdgYIOC5mtqYOq27EAFpPSJH49cdkz09bd0dZhEugxeWVtY3ooksiBmvgiGAThZOtYrp4cHdbA8ni83mEPvZ3DgEu51ispqMccDQflFMpIWcuqAbAEcKNRsMwv4POskh9EX0whREriBmEhmFVkScrg1OwIaZ2pZKTxENzEv0xi8KBkPK4+R8wt8HBQAqtEgMMYl3NtREA */
    id: "update",
    initial: "idle",
    context: {
      store: null,
      updates: null,
      fields: null,
      task: null,
    },
    states: {
      idle: {
        entry: "initialize",
        always: {
          target: "updating",
          actions: "compileUpdates",
        },
      },

      updating: {
        invoke: {
          id: "ApiUpdate",
          src: "update",
          onDone: {
            target: "done",
          },
          onError: {
            target: "done",
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
      initialize: assign((context, event) => ({
        store: useTaskStore(),
        form: event.form,
      })),
      compileUpdates: assign((context) => {
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
  }
);

const destroy = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDMwBcDGALAdASwgBswBiAbQAYBdRUABwHtY808GA7WkAD0QoBoQATz4BfUYNSZchBgEMIedlBIQOYfOwBuDANYap2SjSQhGzVhy68EAJgDsANhz2AzAE4ArF48VP9gA57QRE7AEZXHDDbTwoKW1sAFntE1wDXW3FJdGwcWQUlFTAAJ2KGYpw6Qjk0ZHKAWxxDLGMucxY2TlMbB3scRIpHW0dXV3sKMPcKdxDEALCcWLj4xM8w+zWk8QkQdgYIOC5mtqYOq27EAFpPSJH49cdkz09bd0dZhEugxeWVtY3ooksiBmvgiGAThZOtYrp4cHdbA8ni83mEPvZ3DgEu51ispqMccDQflFMpIWcuqAbAEcKNRsMwv4POskh9EX0whREriBmEhmFVkScrg1OwIaZ2pZKTxENzEv0xi8KBkPK4+R8wt8HBQAqtEgMMYl3NtREA */
    id: "update",
    initial: "idle",
    context: {
      store: null,
      task: null,
    },
    states: {
      idle: {
        entry: "initialize",
        always: {
          target: "destroying",
        },
      },

      destroying: {
        invoke: {
          id: "ApiDestroy",
          src: "destroy",
          onDone: {
            target: "done",
          },
          onError: {
            target: "done",
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
      initialize: assign((context, event) => ({
        store: useTaskStore(),
        form: event.form,
      })),
    },
    services: {
      destroy: (context) =>
        new Promise((resolve, reject) => {
          context.store.destroy(context.task).then((result) => {
            if (result.success) {
              resolve({ success: result.success, message: result.message });
            } else {
              reject({ success: result.success, message: result.message });
            }
          });
        }),
    },
  }
);

export { create, read, update, destroy };
