<template>
  <div class="v-field__field">
    <!-- Label and 'add' button -->
    <span class="label">
      <label>Attachments: </label>
      <v-btn size="x-small" rounded="pill" @click="service.send('ADD')"
        >add link</v-btn
      >
    </span>

    <!-- Attachment list -->
    <ul class="attachments">
      <li
        v-for="(item, key) in inputVal"
        :key="key"
        cols="12"
        class="attachment"
      >
        <span class="link">
          <v-icon icon="mdi-file-document-outline"></v-icon>
          <a :href="item.URL" target="_blank">{{ item.Title }}</a>
        </span>
        <span class="removed">
          <i v-if="item.Status === 'removed'">(removed)</i>
        </span>
        <span class="actions">
          <v-tooltip text="edit">
            <template #activator="{ props }">
              <v-btn
                icon="mdi-pencil"
                size="20"
                class="tinybutton"
                color="primary"
                rounded
                v-bind="props"
                @click="service.send('EDIT', { idx: key })"
              >
              </v-btn> </template
          ></v-tooltip>
          <v-tooltip text="remove">
            <template #activator="{ props }">
              <v-btn
                v-if="item.Status === 'normal'"
                icon="mdi-close"
                size="20"
                class="tinybutton"
                color="primary"
                rounded
                v-bind="props"
                @click="service.send('REMOVE', { idx: key })"
              ></v-btn></template
          ></v-tooltip>
          <v-tooltip text="restore">
            <template #activator="{ props }">
              <v-btn
                v-if="item.Status === 'removed'"
                icon="mdi-restore"
                size="20"
                class="tinybutton"
                color="primary"
                rounded
                v-bind="props"
                @click="service.send('RESTORE', { idx: key })"
              ></v-btn></template
          ></v-tooltip>
        </span>
      </li>
    </ul>
  </div>

  <!-- Add Attachment Dialog -->
  <v-dialog v-model="dialog" width="auto" min-width="500px">
    <v-form ref="attachmentform" validate-on="blur">
      <v-card>
        <v-card-title class="text-h5"> {{ dialogTitle }} </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="context.fields.Title"
            label="Title"
          ></v-text-field>
          <v-text-field
            v-model="context.fields.URL"
            label="URL *"
            :rules="urlRules"
          ></v-text-field>
          <small>* indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="current.matches('adding')"
            color="green-darken-1"
            variant="text"
            @click="service.send('CREATE')"
          >
            Add
          </v-btn>
          <v-btn
            v-if="current.matches('editing')"
            color="green-darken-1"
            variant="text"
            @click="service.send('UPDATE')"
          >
            Update
          </v-btn>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="service.send('CANCEL')"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { interpret } from "xstate";
import AttachmentFieldMachine from "@/machines/AttachmentFieldMachine.js";

export default {
  props: {
    modelValue: Array,
    label: String,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      // Interpret the machine and store it in data
      service: interpret(AttachmentFieldMachine),

      // Start with the machine's initial state
      current: AttachmentFieldMachine.initialState,

      // Start with the machine's initial context
      context: AttachmentFieldMachine.context,

      // Validation rules for URL field
      urlRules: [
        (v) => Boolean(v) || "URL is required",
        (v) =>
          this.isValidURL(v) ||
          "URL must be in a valid format, eg. http://google.com",
      ],
    };
  },
  computed: {
    inputVal: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
    editMode() {
      return this.current.matches("editing");
    },
    dialogTitle() {
      return this.editMode ? "Edit Attachment" : "Add Attachment";
    },
    dialog() {
      return ["editing", "adding"].some(this.current.matches);
    },
  },
  mounted() {
    this.service.send({ type: "INIT", value: this.modelValue });
  },
  created() {
    // Start service on component creation
    this.service
      .onTransition((state) => {
        // Update the current state component data property with the next state
        this.current = state;
        // Update the context component data property with the updated context
        this.context = state.context;

        if (state.changed) {
          this.inputVal = state.context.value;
        }
      })
      .start();
  },
  methods: {
    isValidURL(urlString) {
      let givenURL;

      try {
        givenURL = new URL(urlString);
      } catch (error) {
        return false;
      }
      return givenURL.protocol === "http:" || givenURL.protocol === "https:";
    },
  },
};
</script>

<style scoped>
.v-field__field {
  flex-wrap: wrap; /* class already has display: flex; */
}
.label {
  flex: 0 0 100%; /* flex-grow, flex-shrink, flex-basis */
}
ul {
  width: 100%;
  padding: 0;
}
li {
  display: flex;
  align-items: right;
  width: 100%;
  margin-top: 4px;
}

li > span.link {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  -ms-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  min-width: 0;
}
li > span.removed {
  width: 80px;
  text-align: right;
}
li > span.actions {
  text-align: right;
  width: 60px;
}
.tinybutton {
  font-size: 8px;
  margin-left: 8px;
}
</style>
