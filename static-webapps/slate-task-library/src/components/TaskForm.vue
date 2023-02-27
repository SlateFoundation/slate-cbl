<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <v-card>
        <v-form ref="form">
          <v-card-title>
            <span class="text-h5">Create Task</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6" sm="12" md="6">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="fields.Title"
                        label="Title *"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="fields.ParentTaskID"
                        :items="['0-17', '18-29', '30-54', '54+']"
                        label="Subtask of"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="fields.ExperienceType"
                        :items="ExperienceTypeComboData"
                        label="Type of Experience"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="fields.Skills"
                        :items="SkillComboData"
                        label="Skills"
                        return-object
                        chips
                        closable-chips
                        multiple
                      >
                        <template #chip="{ props, item }">
                          <v-chip v-bind="props" :text="item.raw.Code"></v-chip>
                        </template>
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="6" sm="12" md="6">
                  <v-row>
                    <v-col cols="6" sm="12" md="6">
                      <DateField
                        v-model="fields.DueDate"
                        label="Due Date"
                      ></DateField>
                    </v-col>
                    <v-col cols="6" sm="12" md="6">
                      <DateField
                        v-model="fields.ExpirationDate"
                        label="Expiration Date"
                      ></DateField>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="fields.Instructions"
                        label="Instructions"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <AttachmentField
                        v-model="fields.Attachments"
                        label="Attachments"
                      ></AttachmentField>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
            <small>* indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="save">
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { useTaskStore } from "@/stores/TaskStore.js";
import { useTaskUIStore } from "@/stores/TaskUIStore.js";
import { useExperienceTypeStore } from "@/stores/ExperienceTypeStore.js";
import { useSkillStore } from "@/stores/SkillStore.js";
import DateField from "@/components/fields/DateField.vue";
import AttachmentField from "@/components/fields/AttachmentField.vue";
import { storeToRefs } from "pinia";

export default {
  components: {
    DateField,
    AttachmentField,
  },
  setup() {
    const taskStore = useTaskStore(),
      taskUIStore = useTaskUIStore(),
      experienceTypeStore = useExperienceTypeStore(),
      skillStore = useSkillStore(),
      { selected, editFormVisible: dialog } = storeToRefs(taskUIStore),
      { data: ExperienceTypeComboData } = storeToRefs(experienceTypeStore),
      { data: SkillComboData } = storeToRefs(skillStore);

    experienceTypeStore.fetch();
    skillStore.fetch();

    return {
      selected,
      taskStore,
      dialog,
      ExperienceTypeComboData,
      SkillComboData,
    };
  },
  data() {
    return {
      fields: {
        Attachments: [],
        ExpirationDate: null,
        DueDate: null,
        ExperienceType: "",
        Instructions: "",
        ParentTaskID: null,
        Skills: [],
        Title: "",
      },
    };
  },
  watch: {
    dialog: {
      handler: "onDialogToggle",
    },
  },
  methods: {
    load() {
      const me = this;

      me.reset();

      for (const field in me.fields) {
        if (Object.prototype.hasOwnProperty.call(me.fields, field)) {
          me.fields[field] = me.selected[0].value[field];
        }
      }
    },
    save() {
      this.taskStore.create(this.fields).then(() => {
        this.reset();
        this.dialog = false;
      });
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
    },
    onDialogToggle() {
      const me = this;

      if (me.selected && me.selected.length > 0) {
        me.load();
      } else {
        me.reset();
      }
    },
  },
};
</script>
