<template>
  <v-row justify="center">
    <v-dialog v-model="isVisible" persistent width="1024">
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
                        :rules="titleRules"
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
                        v-if="fields.Attachments !== null"
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

            <v-btn color="primary" variant="elevated" rounded @click="submit()">
              {{ submitButtonLabel }}
            </v-btn>

            <v-btn
              color="primary"
              variant="elevated"
              rounded
              @click="send('CANCEL')"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { useTaskStore } from "@/stores/TaskStore.js";
import { useTasksMachine } from "@/machines/TasksMachine.js";
import { useParentTaskStore } from "@/stores/ParentTaskStore.js";
import { useExperienceTypeStore } from "@/stores/ExperienceTypeStore.js";
import { useSkillStore } from "@/stores/SkillStore.js";
import DateField from "@/components/fields/DateField.vue";
import AttachmentField from "@/components/fields/AttachmentField.vue";
import { storeToRefs } from "pinia";
import { ref, toRaw } from "vue";
import { cloneDeep, isEqual } from "lodash";

export default {
  components: {
    DateField,
    AttachmentField,
  },
  setup() {
    const taskStore = useTaskStore(),
      parentTaskStore = useParentTaskStore(),
      experienceTypeStore = useExperienceTypeStore(),
      skillStore = useSkillStore(),
      { data: parentTaskComboData } = storeToRefs(parentTaskStore),
      { data: experienceTypeComboData } = storeToRefs(experienceTypeStore),
      { data: skillComboData } = storeToRefs(skillStore),
      { state, send } = useTasksMachine(),
      taskform = ref(null);

    experienceTypeStore.fetch();
    skillStore.fetch();

    return {
      taskStore,
      taskform,
      parentTaskComboData,
      experienceTypeComboData,
      skillComboData,
      state,
      send,
    };
  },
  data() {
    return {
      fields: {
        Attachments: null,
        ExpirationDate: null,
        DueDate: null,
        ExperienceType: "",
        Instructions: "",
        ParentTaskID: null,
        Skills: [],
        Title: "",
      },
      loadingParentTasks: false,

      // Validation rule for Title field
      titleRules: [(v) => Boolean(v) || "Title is required"],
    };
  },
  computed: {
    task() {
      const selected = this.state.context.selected;

      return selected && selected.length > 0 ? selected[0].value : null;
    },
    isVisible() {
      return ["editing", "adding"].some(this.state.matches);
    },
    editMode() {
      return this.state.matches("editing");
    },
    dialogTitle() {
      return this.editMode ? "Edit Task" : "Add Task";
    },
    submitButtonLabel() {
      return this.editMode ? "Update" : "Add";
    },
  },
  watch: {
    taskform() {
      const me = this;

      if (me.state.matches("editing")) {
        me.reset();
        me.loadForm();
      } else if (this.state.matches("adding")) {
        me.reset();
      }
    },
  },
  methods: {
    loadForm() {
      const me = this;

      if (me.task) {
        // clone the task so we aren't editing the properties of the reactive original
        const taskClone = cloneDeep(toRaw(me.task));

        for (const field in me.fields) {
          if (Object.prototype.hasOwnProperty.call(me.fields, field)) {
            me.fields[field] = taskClone[field];
          }
        }
      }
    },
    submit() {
      const me = this;

      me.$refs.taskform.validate().then((result) => {
        if (result.valid && result.valid === true) {
          if (me.editMode) {
            me.update();
          } else {
            me.create();
          }
        }
      });
    },
    create() {
      const me = this;

      me.taskStore.create(this.fields).then((result) => {
        if (result && result.success === true) {
          me.reset();
          me.send({ type: "SUCCESS" });
        } else {
          me.send({ type: "FAIL", message: result.message });
        }
      });
    },
    update() {
      const me = this,
        changes = me.getRecordChanges();

      if (Object.keys(changes).length > 0) {
        const payload = Object.assign({ ID: me.task.ID }, changes);

        me.taskStore.update(payload).then((result) => {
          me.reset();
          // this.dialog = false;
          if (result && result.success === true) {
            me.send({ type: "SUCCESS" });
          } else {
            me.send({ type: "FAIL", message: result.message });
          }
        });
      } else {
        me.send({
          type: "TOAST",
          message: "task unmodified: no changes to save",
          color: "warning",
        });
      }
    },
    reset() {
      const me = this;

      if (me.$refs.taskform) {
        me.$refs.taskform.reset();
      }
    },
    getRecordChanges() {
      const me = this,
        fields = me.fields,
        task = me.task,
        // get the fields where the form fields differ from the original record
        changes = Object.fromEntries(
          Object.entries(fields).filter(
            ([key, val]) => key in task && !isEqual(task[key], val)
          )
        );

      // Convert skills to an array of string skill codes
      if (changes.Skills) {
        changes.Skills = changes.Skills.map((skill) => skill.Code);
      }

      return changes;
    },
  },
};
</script>
