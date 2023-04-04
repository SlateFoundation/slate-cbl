<template>
  <div class="v-field__field">
    <!-- Label and 'add' button -->
    <span class="label">
      <label>Attachments: </label>
      <v-btn size="x-small" rounded="pill" @click="send('ADD')">add link</v-btn>
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
          <a :href="item.URL" target="_blank">{{ item.Title || item.URL }}</a>
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
                @click="send({ type: 'EDIT', idx: key })"
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
                @click="send({ type: 'REMOVE', idx: key })"
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
                @click="send({ type: 'RESTORE', idx: key })"
              ></v-btn></template
          ></v-tooltip>
        </span>
      </li>
    </ul>
  </div>

  <!-- Add Attachment Dialog -->
  <v-dialog v-model="dialog" width="auto" min-width="500px">
    <v-form ref="attachmentform">
      <v-card>
        <v-card-title v-if="state.matches('adding')" class="text-h5"
          >Add Attachment</v-card-title
        >
        <v-card-title v-if="state.matches('editing')" class="text-h5"
          >Edit Attachment</v-card-title
        >
        <v-card-text>
          <v-text-field v-model="fields.Title" label="Title"></v-text-field>
          <v-text-field
            v-model="fields.URL"
            label="URL *"
            :rules="urlRules"
          ></v-text-field>
          <small>* indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="state.matches('adding')"
            color="primary"
            variant="elevated"
            rounded
            @click="create"
          >
            Add
          </v-btn>
          <v-btn
            v-if="state.matches('editing')"
            color="primary"
            variant="elevated"
            rounded
            @click="update"
          >
            Update
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            rounded
            @click="send({ type: 'CANCEL' })"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { useAttachmentFieldMachine } from "@/machines/AttachmentFieldMachine.js";

export default {
  props: {
    modelValue: Array,
    label: String,
  },
  emits: ["update:modelValue"],
  setup() {
    const { state, send } = useAttachmentFieldMachine();

    return {
      state,
      send,
    };
  },
  data() {
    return {
      fields: this.state.context.fields,

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
    dialog() {
      return ["editing", "adding"].some(this.state.matches);
    },
  },
  watch: {
    state(state) {
      if (state.changed) {
        this.inputVal = state.context.value;
        if (this.dialog) {
          this.fields = state.context.fields;
        }
      }
    },
    modelValue(val) {
      // Initialize when form loads and component receives an initial modelValue
      this.send({ type: "INIT", value: val });
    },
  },
  unmounted() {
    this.send({ type: "RESET" });
  },
  methods: {
    create() {
      const me = this;

      // validate the form and create the attachment
      me.$refs.attachmentform.validate().then((validation) => {
        if (validation.valid && validation.valid === true) {
          me.send("CREATE");
        }
      });
    },
    update() {
      const me = this;

      // validate the form and create the attachment
      me.$refs.attachmentform.validate().then((validation) => {
        if (validation.valid && validation.valid === true) {
          me.send("UPDATE");
        }
      });
    },
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
