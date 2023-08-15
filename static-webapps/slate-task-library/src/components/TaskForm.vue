<template>
  <v-row justify="center">
    <v-dialog v-model="dialogVisible" persistent width="1024">
      <v-card>
        <!-- Task Form -->
        <v-form ref="taskform" :disabled="isDisabled">
          <v-card-title>
            <!-- Add task form header -->
            <div v-if="parent.matches('Adding')">
              <v-container>
                <v-row>
                  <v-col cols="4">
                    <span class="text-h5">Add Task</span>
                  </v-col>
                  <v-col cols="8" class="pa-0">
                    <CloneTaskField
                      :disabled="isDisabled"
                      @clone-request="
                        (task) => send({ type: 'clone.task', task })
                      "
                    />
                  </v-col>
                </v-row>
              </v-container>
            </div>

            <!-- Edit task form header -->
            <div v-if="parent.matches('Editing')">
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
                    <v-col v-if="isNotParentTask" cols="12">
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
            <small v-if="parent.matches('Adding')" class="ml-6"
              >* indicates required field</small
            >
            <!-- Archive task button -->
            <span v-if="parent.matches('Editing')">
              <v-btn
                v-if="task.Status !== 'archived'"
                :disabled="isDisabled"
                color="primary"
                variant="elevated"
                rounded
                @click="send({ type: 'archive.task' })"
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
                @click="send({ type: 'unarchive.task' })"
              >
                Un-Archive Task
              </v-btn>
            </span>
            <v-spacer></v-spacer>

            <!-- Dummy shared switch for add form - status disabled, but on -->
            <v-switch
              v-if="parent.matches('Adding')"
              v-model.lazy="switchOn"
              label="Share with other teachers"
              color="primary"
              value="on"
              disabled
              hide-details
            ></v-switch>

            <!-- v-model.lazy="dummy" -->

            <!-- Shared switch -->
            <v-switch
              v-if="parent.matches('Editing')"
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
              v-if="parent.matches('Adding')"
              :disabled="isDisabled"
              color="primary"
              variant="elevated"
              rounded
              @click="send({ type: 'form.submit' })"
            >
              Create
            </v-btn>

            <!-- Update task button -->
            <v-btn
              v-if="parent.matches('Editing')"
              :disabled="isDisabled"
              color="primary"
              variant="elevated"
              rounded
              @click="send({ type: 'form.submit' })"
            >
              Update
            </v-btn>

            <!-- Cancel form button -->
            <v-btn
              color="primary"
              variant="elevated"
              rounded
              @click="send({ type: 'cancel.form' })"
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
import { useDataTableMachine } from "@/machines/DataTableMachine.js";
import { ref, isProxy, toRaw } from "vue";
import { useActor } from "@xstate/vue";

// Field components
import AttachmentField from "@/components/fields/AttachmentField.vue";
import DateField from "@/components/fields/DateField.vue";
import CloneTaskField from "@/components/fields/CloneTaskField.vue";
import ExperienceTypeField from "@/components/fields/ExperienceTypeField.vue";
import ParentTaskField from "@/components/fields/ParentTaskField.vue";
import SkillsField from "@/components/fields/SkillsField.vue";

export default {
  components: {
    AttachmentField,
    DateField,
    ExperienceTypeField,
    ParentTaskField,
    SkillsField,
    CloneTaskField,
  },
  props: {
    formMachine: Object,
  },
  setup(props) {
    const taskStore = useTaskStore(),
      { state: parent } = useDataTableMachine(),
      { state, send } = useActor(parent.value.children.form),
      taskform = ref(null);

    return {
      taskStore,
      taskform,
      parent,
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

      // dummy model for the dialog - visibility is controlled by v-if on component
      dialogVisible: true,

      // dummy model for the status switch in adding mode
      switchOn: ["on"],
    };
  },
  computed: {
    task() {
      const selected = this.parent.context.selected;

      if (selected && selected.length > 0) {
        const task = this.taskStore.data[selected[0]];

        if (isProxy(task)) {
          return toRaw(task);
        }
      }
      return null;
    },
    isReady() {
      return this.state.matches("Ready");
    },
    isDisabled() {
      return !this.isReady;
    },
    isNotParentTask() {
      return !(this.task?.SubTasks?.length > 0);
    },
  },
  watch: {
    // the form can not be loaded until it is available in the DOM, so watch the ref and initialize when it becomes available
    taskform() {
      const me = this,
        { task, taskform: form, fields } = me;

      me.send({
        type: "form.initialize",
        task: me.parent.matches("Editing") ? task : null,
        form,
        fields,
      });
    },
  },
  methods: {
    cloneRequest(task, ClonedTaskID) {
      console.log(task, ClonedTaskID);
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
  },
};
</script>
