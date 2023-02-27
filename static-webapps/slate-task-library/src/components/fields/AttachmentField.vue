<template>
  <div class="v-field__field">
    <!-- Label and 'add' button -->
    <span class="label">
      <label>Attachments: </label>
      <v-btn size="x-small" rounded="pill" @click="addAttachment"
        >add link</v-btn
      >
    </span>

    <!-- Attachment list -->
    <ul class="pt-2">
      <li v-for="(item, key) in inputVal" :key="key" cols="12">
        <span>
          <v-icon icon="mdi-file-document-outline"></v-icon>
          <a :href="item.URL" target="_blank">{{ item.Title }}</a>
        </span>
        <span>
          <v-icon
            icon="mdi-pencil-circle"
            @click="editAttachment(key)"
          ></v-icon>
          <v-icon
            icon="mdi-close-circle"
            @click="removeAttachment(key)"
          ></v-icon>
        </span>
      </li>
    </ul>
  </div>

  <!-- Add Attachment Dialog -->
  <v-dialog v-model="dialog" width="auto" min-width="500px">
    <v-form ref="form" validate-on="submit">
      <v-card>
        <v-card-title class="text-h5"> {{ dialogTitle }} </v-card-title>
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
            color="green-darken-1"
            variant="text"
            @click="submitAttachment"
          >
            {{ submitButtonLabel }}
          </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="cancel">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: Array,
    label: String,
  },
  emits: ["update:modelValue"],
  data() {
    return {
      dialog: false,
      editKey: false,
      fields: {
        Title: null,
        URL: null,
      },
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
      return this.editKey !== false && Number.isInteger(this.editKey);
    },
    dialogTitle() {
      return this.editMode ? "Edit Attachment" : "Add Attachment";
    },
    submitButtonLabel() {
      return this.editMode ? "Update" : "Add";
    },
  },
  methods: {
    addAttachment() {
      const me = this;

      me.reset();
      me.editKey = false;
      me.dialog = true;
    },
    editAttachment(key) {
      const me = this,
        attachment = me.modelValue[key];

      me.reset();
      me.editKey = key;
      me.fields.Title = attachment.Title;
      me.fields.URL = attachment.URL;
      me.dialog = true;
    },
    submitAttachment() {
      const me = this;

      if (me.editMode) {
        me.updateAttachment();
      } else {
        me.createAttachment();
      }
    },
    createAttachment() {
      const me = this;

      if (me.$refs.form) {
        me.$refs.form.validate().then((result) => {
          if (result.valid === true) {
            me.inputVal = me.modelValue.concat([this.createBlankRecord()]);
            me.dialog = false;
            me.reset();
          }
        });
      }
    },
    updateAttachment() {
      const me = this,
        attachment = me.modelValue[this.editKey];

      attachment.Title = me.fields.Title;
      attachment.URL = me.fields.URL;
      me.dialog = false;
      me.reset();
    },
    removeAttachment(key) {
      const me = this,
        inputValClone = me.inputVal.slice(0);

      inputValClone.splice(key, 1);
      me.inputVal = inputValClone;
    },
    cancel() {
      const me = this;

      me.dialog = false;
      me.reset();
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
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
    createBlankRecord() {
      const me = this;

      return {
        Class: "Slate\\CBL\\Tasks\\Attachments\\Link",
        Status: "normal",
        Title: me.fields.Title,
        URL: me.fields.URL,
      };
    },
  },
};
</script>

<style>
.v-field__field {
  flex-wrap: wrap;
}
ul {
  flex: 0 0 100%; /* flex-grow, flex-shrink, flex-basis */
}
li {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
li > span {
  align-self: end;
}
.label {
  flex: 0 0 100%; /* flex-grow, flex-shrink, flex-basis */
}
</style>
