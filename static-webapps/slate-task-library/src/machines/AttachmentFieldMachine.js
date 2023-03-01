import { createMachine, assign } from "xstate";

const AttachmentFieldMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEEAuqCGBjAFgWzADtUAxASzABsIBZbHMwsAOjIkrAGIBJAOW4AqAbQAMAXUSgADgHtYZVGRmFJIAB6IAtAGYAbACZmu48f0iAnAHYALAFZdAGhABPRJcPmrI69YAc17W0ARnNfAF8wpzRMXAJicipaekYWNg5OAFEAEUFRCSQQWXlFZVUNBCC9Zm19XyD9e30avU8nVwRLS2r3ESDba10RW28RfQio9Ho40gpqOlwU1nYuZCysvNUihSUVAvLK3WZrS21zW07R-UtdSzatE+7hvybjesrxkGipohnE+YYmEt0gAlDI0ADyADUMhsClsSrtQOVNAMgkZjJYRCIaiIbGc7ghNL5fMwsViQsTbH1tL5bB8vrEfgk5slAWkuKCAMoCcGg2HSOTbUp7LQ1NFkrG2bSWcx9SoEzRBXS2aqBQKWfxS0LmemTRnxWZJBaAyDbQhQTgAVQACllkAIYeJNoKEWUtFLmCczuZauYRLprErzASgjLSb41X67J1OrpdTF8EzDf9FqbFObOABhZC8TMZAAy-MKLp2bsJVOYEcC1n0xj8umJ2gJwTRDTJFP0AQbccinz1iYNf1ZLAwEAgjAtmdB9sd+QFxVLIsJ12YSpuQTqWts9kcLi0QV6zE8nkxZjlxh1H0IMggcFUDIHvxZxrAzoXwqR7u0KpMNwMZmsERiQVBouguYlAJMIZLwmBNpmZI0AVSZY3yFRF1C0Pwul-a59AAoDgz3CpAKOSoTmGMUG2seNvkHZ8kOYNMJ1Q10lz6ElzGlHxzF0HifQjAl9A3I4ZRCa5ZVsTxfB7WDaKfRDFlHcdzRYxdPwqWwOK46w+N42omyIxVMWYK4gM3UzURkvs4KTIcX2YJgAHcAAJYEwVAwGcoJVI-DDCU7QxfwMCwbHsbEFQ9C8AwjKsdyVCIIiAA */

  /** @xstate-layout N4IgpgJg5mDOIC5QEEAuqCGBjAFgWzADtUAxASzABsIBZbHMwsAOjIkrAGIBJAOW4AqAbQAMAXUSgADgHtYZVGRmFJIAB6IAtACYAnAGZmI4yICM2gBzaArNe0AWADQgAnlr2nm++6d3bTAOw+Fvb6AGz6AL6RzmiYuATE5FS09IwsAE5gGBAunACiACKCohJIILLyisqqGgimYczWFvoWbfoBIaY+AfrObgjWAcy6IvYBBvpmQ9b22tGx6PSJpBTUdLjpzFk5eciFhaWqlQpKKuV12oY+psb6+rq64+NX-Vr6ptbMNq32YboBEQGCZhBYgOLLIirFIbBhMbbZXKcABK+RoAHkAGr5I7lE7Vc6gOqaVqNPxzIJhNoBIYWN4ITSmFrMMLjVkiD5hBqWexgiEJKHJdZpeE7JGogDKAnRqNx0jkpxqF3eFkaIlm9gM9msugsDScrncjQCn1MnNZgOs+itfKWAqSa1Sm1FiLykvywnExwVBNq7n02hGYSpVqelpE2npJMezACYU6weaFl1BlBMXBdvwgsdsK2kFOhCgnAAqgAFQrIAQ4r14n1nP31P4sywTGm6OwtNpR7yxwKtbpWzqatOLeJZh0wkUsfOKQucADCyF48-yABk5RU60qiYgGo1vICxrMHA9dPTPo07EN4+Y2tZWfN0-zx9Dhc6WDkIIwi-PUZXq2U8pVPWyqNhYTTWhyATaBGNifJGhoMjBIixuE2jxtYxh+Noj6jpCE5vnCH4QF+c6Lsua4bviIE7vUwZeOMxjanMoSPN2qrMEy3TAmEIgtNE6aEDIEBwKoz4rEKTpEd6wHbuoWjjF8Qx6FymG6kMphRvYFjDOhCYPA4MEAlET6ZhJOZTqw7BgDJiqEvJDIUk00G6KpQIWBp3ZmAxHkBJ0nSzKYDS2mO5mTu+CK7LZvqgYy6HMDp0H2PY6ras0vhRiERgfNamHNDBeghfhr5SXmX6zlA0U0Q5e5NLYAbaf46rmAhAwcehEZ6phjV+bhGahdm4VEcwn7flVcl1LVthWg4Vi3NYLVeZ43geTpBh+OYgQCZEQA */
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
