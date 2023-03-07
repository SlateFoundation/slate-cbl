<template>
  <v-row justify="center">
    <v-dialog v-model="isVisible" persistent width="1024">
      <v-card>
        <v-form ref="taskform">
          <v-card-title>
            <div v-if="state.matches('adding')">
              <span class="text-h5">Add Task</span>
            </div>
            <div v-if="state.matches('editing')">
              <v-container>
                <v-row>
                  <v-col>
                    <span class="text-h5">Edit Task</span>
                  </v-col>
                  <v-col v-if="task.ClonedTask">
                    <span class="text-sm-body-2">Cloned From: </span>
                    <span class="text-subtitle-2">
                      {{ task.ClonedTask.Title }}</span
                    >
                  </v-col>
                </v-row>
              </v-container>
            </div>
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
                    <v-col v-if="isNotParentTask(fields.Subtasks)" cols="12">
                      <ParentTaskField
                        v-model="fields.ParentTaskID"
                        label="Subtask of"
                      ></ParentTaskField>
                    </v-col>
                    <v-col cols="12">
                      <ExperienceTypeField
                        v-model="fields.ExperienceType"
                      ></ExperienceTypeField>
                    </v-col>
                    <v-col cols="12">
                      <SkillsField v-model="fields.Skills"></SkillsField>
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

            <v-btn
              v-if="state.matches('adding')"
              color="primary"
              variant="elevated"
              rounded
              @click="create()"
            >
              Add
            </v-btn>

            <v-btn
              v-if="state.matches('editing')"
              color="primary"
              variant="elevated"
              rounded
              @click="update()"
            >
              Update
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
import AttachmentField from "@/components/fields/AttachmentField.vue";
import DateField from "@/components/fields/DateField.vue";
import ExperienceTypeField from "@/components/fields/ExperienceTypeField.vue";
import ParentTaskField from "@/components/fields/ParentTaskField.vue";
import SkillsField from "@/components/fields/SkillsField.vue";
import { ref, isProxy, toRaw } from "vue";
import { cloneDeep, isEqual } from "lodash";

export default {
  components: {
    AttachmentField,
    DateField,
    ExperienceTypeField,
    ParentTaskField,
    SkillsField,
  },
  setup() {
    const taskStore = useTaskStore(),
      { state, send } = useTasksMachine(),
      taskform = ref(null);

    return {
      taskStore,
      taskform,
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
        ExperienceType: null,
        Instructions: "",
        ParentTaskID: null,
        Skills: [],
        Title: "",
      },

      // Validation rule for Title field
      titleRules: [(v) => Boolean(v) || "Title is required"],
    };
  },
  computed: {
    task() {
      const selected = this.state.context.selected;

      return selected && selected.length > 0 ? selected[0] : null;
    },
    isVisible() {
      return ["editing", "adding"].some(this.state.matches);
    },
  },
  watch: {
    taskform() {
      const me = this;

      if (me.state.matches("editing")) {
        me.reset();
        me.loadForm(me.task);
      } else if (me.state.matches("adding")) {
        me.reset();
        me.loadForm({ Attachments: [] });
      }
    },
  },
  methods: {
    loadForm(task) {
      const me = this;

      if (task) {
        // clone the task so we aren't editing the properties of the reactive original
        const taskClone = isProxy(task) ? cloneDeep(toRaw(task)) : task;

        for (const field in me.fields) {
          if (Object.prototype.hasOwnProperty.call(me.fields, field)) {
            if (Object.prototype.hasOwnProperty.call(taskClone, field)) {
              me.fields[field] = taskClone[field];
            }
          }
        }
      }
    },
    create() {
      const me = this;

      // validate the form
      me.$refs.taskform.validate().then((validation) => {
        if (validation.valid && validation.valid === true) {
          // create the task
          me.taskStore.create(this.fields).then((result) => {
            if (result && result.success === true) {
              me.reset();
              me.send({ type: "SUCCESS", updatedID: result.data.ID });
            } else {
              me.send({ type: "FAIL", message: result.message });
            }
          });
        }
      });
    },
    update() {
      const me = this;

      // validate the form
      me.$refs.taskform.validate().then((validation) => {
        if (validation.valid && validation.valid === true) {
          // get any changes made to the records
          const changes = me.getRecordChanges();

          // create a payload object with changes and the ID of the task
          if (Object.keys(changes).length > 0) {
            const payload = Object.assign({ ID: me.task.ID }, changes);

            // update the task
            me.taskStore.update(payload).then((result) => {
              if (result && result.success === true) {
                me.reset();

                me.send({ type: "SUCCESS", updatedID: result.data.ID });
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
        }
      });
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
    isNotParentTask() {
      return !(this.task.SubTasks && this.task.SubTasks.length > 0);
    },
  },
};
</script>
