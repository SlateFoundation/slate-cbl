<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <v-card>
        <v-form ref="taskform">
          <v-card-title>
            <span class="text-h5">{{ dialogTitle }} </span>
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
                      <v-autocomplete
                        v-model="fields.ParentTaskID"
                        :items="parentTaskComboData"
                        item-title="Title"
                        item-value="ID"
                        label="Subtask of"
                        no-data-text="type at least 3 characters to search tasks"
                        clearable
                        :loading="loadingParentTasks"
                        :custom-filter="
                          () => {
                            return true;
                          }
                        "
                        @update:search="queryParentTasks"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="fields.ExperienceType"
                        :items="experienceTypeComboData"
                        label="Type of Experience"
                        item-title="Title"
                        item-value="ID"
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="fields.Skills"
                        :items="skillComboData"
                        label="Skills"
                        item-title="title"
                        item-value="Code"
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
            <v-btn color="blue-darken-1" variant="text" @click="cancel">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="submit">
              {{ submitButtonLabel }}
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
import { useParentTaskStore } from "@/stores/ParentTaskStore.js";
import { useExperienceTypeStore } from "@/stores/ExperienceTypeStore.js";
import { useSkillStore } from "@/stores/SkillStore.js";
import DateField from "@/components/fields/DateField.vue";
import AttachmentField from "@/components/fields/AttachmentField.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";

export default {
  components: {
    DateField,
    AttachmentField,
  },
  setup() {
    const taskStore = useTaskStore(),
      taskUIStore = useTaskUIStore(),
      parentTaskStore = useParentTaskStore(),
      experienceTypeStore = useExperienceTypeStore(),
      skillStore = useSkillStore(),
      { selected, editFormVisible: dialog } = storeToRefs(taskUIStore),
      { data: parentTaskComboData } = storeToRefs(parentTaskStore),
      { data: experienceTypeComboData } = storeToRefs(experienceTypeStore),
      { data: skillComboData } = storeToRefs(skillStore),
      taskform = ref(null);

    experienceTypeStore.fetch();
    skillStore.fetch();

    return {
      selected,
      taskStore,
      dialog,
      taskform,
      parentTaskComboData,
      experienceTypeComboData,
      skillComboData,
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
      editKey: false,
      loadingParentTasks: false,
    };
  },
  computed: {
    task() {
      return this.selected[0].value;
    },
    editMode() {
      return this.selected && this.selected.length;
    },
    dialogTitle() {
      return this.editMode ? "Edit Task" : "Add Task";
    },
    submitButtonLabel() {
      return this.editMode ? "Update" : "Add";
    },
  },
  watch: {
    taskform: {
      handler: "onTaskformToggle",
    },
  },
  methods: {
    load() {
      const me = this,
        parentTaskStore = useParentTaskStore(),
        parentTask = me.selected[0].value.ParentTask;

      /**
       *  TODO: we need the combo store to contain the value of the current parent task, but there's probably a better way to do this.
       *  can we query api by the parent task ID?
       */
      if (parentTask && parentTask.Title) {
        parentTaskStore.extraParams = {
          q: parentTask.Title,
        };
        parentTaskStore.fetch();
      }

      for (const field in me.fields) {
        if (Object.prototype.hasOwnProperty.call(me.fields, field)) {
          me.fields[field] = me.selected[0].value[field];
        }
      }
    },
    submit() {
      const me = this;

      if (me.editMode) {
        me.update();
      } else {
        me.create();
      }
    },
    create() {
      this.taskStore.create(this.fields).then((result) => {
        this.reset();
        this.dialog = false;
        if (result && result.success === true) {
          this.toast("task created successfully");
        }
      });
    },
    toast(msg) {
      const taskUIStore = useTaskUIStore();

      taskUIStore.toast(msg);
    },
    update() {
      const me = this,
        fields = me.fields,
        task = me.task,
        changes = Object.fromEntries(
          Object.entries(fields).filter(
            ([key, val]) => key in task && task[key] !== val
          )
        );

      // Convert skills to an array of string skill codes
      if (changes.Skills) {
        changes.Skills = changes.Skills.map((skill) => skill.Code);
      }

      if (Object.keys(changes).length !== 0) {
        const payload = Object.assign({ ID: task.ID }, changes);

        this.taskStore.update(payload).then((result) => {
          this.reset();
          this.dialog = false;
          if (result && result.success === true) {
            this.toast("task updated successfully");
          }
        });
      }
      this.reset();
      this.dialog = false;
    },
    cancel() {
      const me = this;

      me.dialog = false;
    },
    reset() {
      if (this.$refs.taskform) {
        this.$refs.taskform.reset();
      }
    },
    onTaskformToggle() {
      const me = this;

      if (me.editMode) {
        me.load();
      } else {
        me.reset();
      }
    },
    queryParentTasks(query) {
      const parentTaskStore = useParentTaskStore();

      if (query && query.length > 2 && !this.loadingParentTasks) {
        parentTaskStore.extraParams = { q: query };

        parentTaskStore.fetch().then(() => {
          this.loadingParentTasks = false;
        });
      }
    },
  },
};
</script>
