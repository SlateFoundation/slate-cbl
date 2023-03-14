<template>
  <v-row justify="center">
    <v-dialog v-model="isVisible" persistent width="1024">
      <v-card>
        <!-- Task Form -->
        <v-form ref="taskform" :disabled="isDisabled">
          <v-card-title>
            <!-- Add task form header -->
            <div v-if="state.matches('adding')">
              <v-container>
                <v-row>
                  <v-col cols="4">
                    <span class="text-h5">Add Task</span>
                  </v-col>
                  <v-col cols="8" class="pa-0">
                    <CloneTaskField @clone-request="cloneRequest" />
                  </v-col>
                </v-row>
              </v-container>
            </div>

            <!-- Edit task form header -->
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

          <!-- Form fields -->
          <v-card-text class="pb-0">
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
          </v-card-text>

          <!-- Form actions footer -->
          <v-card-actions>
            <small v-if="state.matches('adding')" class="ml-6"
              >* indicates required field</small
            >
            <!-- Archive task button -->
            <span v-if="state.matches('editing')">
              <v-btn
                v-if="task.Status !== 'archived'"
                :disabled="isDisabled"
                color="primary"
                variant="elevated"
                rounded
                @click="archive"
              >
                Archive Task
              </v-btn>

              <!-- Unarchive task button -->
              <v-btn
                v-if="task.Status === 'archived'"
                :disabled="isDisabled"
                color="primary"
                variant="elevated"
                rounded
                @click="unarchive"
              >
                Un-Archive Task
              </v-btn>
            </span>
            <v-spacer></v-spacer>

            <!-- Dummy shared checkbox for add form - status disabled, but on -->
            <v-switch
              v-if="state.matches('adding')"
              v-model.lazy="dummy"
              label="Share with other teachers"
              color="primary"
              value="on"
              disabled
              hide-details
            ></v-switch>

            <!-- Shared checkbox -->
            <v-switch
              v-if="state.matches('editing')"
              v-model="fields.Status"
              label="Share with other teachers"
              color="primary"
              true-value="shared"
              false-value="private"
              hide-details
            ></v-switch>

            <v-spacer></v-spacer>

            <!-- Create task button -->
            <v-btn
              v-if="state.matches('adding')"
              :disabled="isDisabled"
              color="primary"
              variant="elevated"
              rounded
              @click="send({ type: 'CREATE' })"
            >
              Create
            </v-btn>

            <!-- Update task button -->
            <v-btn
              v-if="['editRequest', 'editing'].some(state.matches)"
              :disabled="isDisabled"
              color="primary"
              variant="elevated"
              rounded
              @click="send({ type: 'UPDATE' })"
            >
              Update
            </v-btn>

            <!-- Cancel form button -->
            <v-btn
              color="primary"
              variant="elevated"
              rounded
              @click="send({ type: 'CANCEL' })"
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
import CloneTaskField from "@/components/fields/CloneTaskField.vue";
import ExperienceTypeField from "@/components/fields/ExperienceTypeField.vue";
import ParentTaskField from "@/components/fields/ParentTaskField.vue";
import SkillsField from "@/components/fields/SkillsField.vue";
import { ref, isProxy, toRaw } from "vue";
import { cloneDeep } from "lodash";

export default {
  components: {
    AttachmentField,
    DateField,
    ExperienceTypeField,
    ParentTaskField,
    SkillsField,
    CloneTaskField,
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
        Status: null,
      },

      // flag set if this task is the result of cloning
      ClonedTaskID: null,

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
      return ["editRequest", "editing", "adding"].some(this.state.matches);
    },
    isDisabled() {
      return !["editing", "adding"].some(this.state.matches);
    },
    dummy() {
      return ["on"];
    },
  },
  watch: {
    taskform() {
      const me = this;

      if (me.state.matches("editing")) {
        me.reset();
        me.send({
          type: "LOADFORM",
          task: me.task,
          form: me.taskform,
          fields: me.fields,
        });
      } else if (me.state.matches("adding")) {
        me.reset();
        me.send({
          type: "LOADFORM",
          task: { Attachments: [] },
          form: me.taskform,
          fields: me.fields,
        });
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
    archive() {
      const me = this,
        payload = Object.assign({ ID: me.task.ID, Status: "archived" });

      // update the task
      me.taskStore.update(payload).then((result) => {
        if (result && result.success === true) {
          me.reset();
          me.send({ type: "SUCCESS", updatedID: result.data.ID });
        } else {
          me.send({ type: "FAIL", message: result.message });
        }
      });
    },
    unarchive() {
      const me = this,
        payload = Object.assign({ ID: me.task.ID, Status: "private" });

      // update the task
      me.taskStore.update(payload).then((result) => {
        if (result && result.success === true) {
          me.reset();
          me.send({ type: "SUCCESS", updatedID: result.data.ID });
        } else {
          me.send({ type: "FAIL", message: result.message });
        }
      });
    },
    reset() {
      const me = this;

      if (me.$refs.taskform) {
        me.$refs.taskform.reset();
      }
    },
    cloneRequest(task, ClonedTaskID) {
      if (task) {
        // Remove ParentTaskId on any clones
        delete task.ParentTaskID;

        // Set the Cloned Task ID
        this.ClonedTaskID = ClonedTaskID;

        this.loadForm(task);
      } else {
        this.ClonedTaskID = null;
      }
    },
    isNotParentTask() {
      return !(
        this.task &&
        this.task.SubTasks &&
        this.task.SubTasks.length > 0
      );
    },
  },
};
</script>
