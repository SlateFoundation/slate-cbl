import { createMachine, assign } from "xstate";

const AttachmentFieldMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEEAuqCGBjAFgWzADtUAxASzABsIBZbHMwsAOjIkrAGIBJAOW4AqAbQAMAXUSgADgHtYZVGRmFJIAB6IAtAGYAbACZmu48f0iAnAHYALAFZdAGhABPRJcPmrI69YAc17W0ARnNfAF8wpzRMXAJicipaekYWNg5OAFEAEUFRCSQQWXlFZVUNBCC9Zm19XyD9e30avU8nVwRLS2r3ESDba10RW28RfQio9Ho40gpqOlwU1nYuZCysvNUihSUVAvLK3WZrS21zW07R-UtdSzatE+7hvybjesrxkGipohnE+YYmEt0gAlDI0ADyADUMhsClsSrtQOVNAMgkZjJYRCIaiIbGc7ghNL5fMwsViQsTbH1tL5bB8vrEfgk5slAWkuKCAMoCcGg2HSOTbUp7LQ1NFkrG2bSWcx9SoEzRBXS2aqBQKWfxS0LmemTRnxWZJBaAyDbQhQTgAVQACllkAIYeJNoKEWUtFLmCczuZauYRLprErzASgjLSb41X67J1OrpdTF8EzDf9FqbFObOABhZC8TMZAAy-MKLp2bsJVOYEcC1n0xj8umJ2gJwTRDTJFP0AQbccinz1iYNf1ZLAwEAgjAtmdB9sd+QFxVLIsJ12YSpuQTqWts9kcLi0QV6zE8nkxZjlxh1H0IMggcFUDIHvxZxrAzoXwqR7u0KpMNwMZmsERiQVBouguYlAJMIZLwmBNpmZI0AVSZY3yFRF1C0Pwul-a59AAoDgz3CpAKOSoTmGMUG2seNvkHZ8kOYNMJ1Q10lz6ElzGlHxzF0HifQjAl9A3I4ZRCa5ZVsTxfB7WDaKfRDFlHcdzRYxdPwqWwOK46w+N42omyIxVMWYK4gM3UzURkvs4KTIcX2YJgAHcAAJYEwVAwGcoJVI-DDCU7QxfwMCwbHsbEFQ9C8AwjKsdyVCIIiAA */

  /** @xstate-layout N4IgpgJg5mDOIC5QEEAuqCGBjAFgWzADtUAxASzABsIBZbHMwsAOgCcwMIBPAYgEkAcnwAqAbQAMAXUSgADgHtYZVGXmEZIAB6IAtAGYATADZmAdlPiAHJfEBOA6YN2AjABoQXRAYCsp5nsdxB3E9PWdLZwAWAF9o9zRMXAJicipaekYWdk5eAFEAEREJaSQQBSUVNQ1tBGc9E0MInyMDQ3rbW3dPBHN-QOdvSKNxb3FIoNj49Hpk0gpqOlxMtg5uHmR8-OKNcuVVdVKaupNI0z1bXwsDByNTLt0zvtHIy1ajI2cDOsmQBJmiOZpRYMJgrHI8ABKuRoAHkAGq5balXaVA6gGo6IbOZjvW7iEJOUyRC73BA6azMfH45y2azeAZ6SzeH5-JIA1ILDKg7JrKEAZWEMKhSLkij2VUOukM2Kp+O8AVsAzqpJ0ziM3n8oVCpkskXltNsLOmbJS83SS1BkD2hCgPAAqgAFfLIYSIqQ7MWo6q6eVmc7eeyWWziIyRNWdDyIZymWyUyxa4N68zmIxGxL4dlm4HLK0qG08ADCyAEBdyABkRWVPftvWT6cx46FIsZQ5YjNY9KSwtifFSaa9IvU22n-qagVyWJwIIxbQWoS63SVRRUa5KyaYTGrbuEGRdvO8Vc5xNiOh0rsf6e9DT9CPIIHANKyM2PORawB6VxL0T7TpS+wZXm8bwDEiFUfD8cwrF1EN3hGa8pnTWYOXNEEWDICBKHfZFqy-LRdGJWNZU+QDgNAyNaluMxTmcI8mlscZbFMEcTUBV9ULBbgP3FNE8LJL5xE1BMXjxXU7nI8JNRCS8t0HRkYjiX5jWfViUJzac8ygLivTXAZLGYWwAkiYkjFsEyAM7civj005FUYkyBg6YcFKfJCswnZgpxnLTV2-WpvD0gyiWM0zAws7pVQsZhgmsAZgixVNYmiIA */
  createMachine(
    {
      id: "AttachmentFieldMachine",
      initial: "idle",
      predictableActionArguments: true,
      context: {
        value: [],
        fields: {
          Title: null,
          URL: null,
          Status: "normal",
        },
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
            EDIT: {
              target: "editing",
              actions: "editItem",
            },

            ADD: {
              target: "adding",
              actions: "addItem",
            },

            REMOVE: {
              target: "ready",
              actions: "removeItem",
            },

            RESTORE: {
              target: "ready",
              actions: "restoreItem",
            },

            RESET: {
              target: "idle",
              actions: "resetContext",
            },
          },
        },

        editing: {
          on: {
            UPDATE: {
              target: "ready",
              actions: "updateItem",
            },
            CANCEL: "ready",
          },
        },

        adding: {
          on: {
            CREATE: {
              target: "ready",
              actions: "createItem",
            },
            CANCEL: "ready",
          },
        },
      },
    },
    {
      actions: {
        initialize: assign((context, event) => ({ value: event.value })),
        addItem: assign(() => ({ fields: { Title: null, URL: null } })),
        editItem: assign((context, event) => ({
          fields: {
            Title: context.value[event.idx].Title,
            URL: context.value[event.idx].URL,
          },
          key: event.idx,
        })),
        removeItem: (context, event) => {
          const attachment = context.value[event.idx];

          Object.assign(attachment, { Status: "removed" });
        },
        restoreItem: (context, event) => {
          const attachment = context.value[event.idx];

          Object.assign(attachment, { Status: "normal" });
        },
        updateItem: (context) => {
          const attachment = context.value[context.key];

          Object.assign(attachment, context.fields);
        },
        createItem: assign((context) => ({
          value: context.value.concat([
            Object.assign(
              {
                Class: "Slate\\CBL\\Tasks\\Attachments\\Link",
                Status: "normal",
              },
              context.fields
            ),
          ]),
        })),
        resetContext: assign(() => ({
          value: [],
          fields: {
            Title: null,
            URL: null,
            Status: "normal",
          },
        })),
      },
    }
  );

export default AttachmentFieldMachine;
