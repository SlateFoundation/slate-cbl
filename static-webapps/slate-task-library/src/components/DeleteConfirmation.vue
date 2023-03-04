<template>
  <v-dialog v-model="dialog" persistent width="auto">
    <template #activator="{ props }">
      <v-btn
        :disabled="task === null"
        icon="mdi-trash-can-outline"
        color="primary"
        v-bind="props"
      />
    </template>
    <v-card>
      <v-card-title class="text-h5"> Delete Task </v-card-title>
      <v-card-text>{{ title }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="confirmDelete">
          Delete
        </v-btn>
        <v-btn color="primary" variant="text" @click="dialog = false">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useTaskStore } from "@/stores/TaskStore.js";
import { useTasksMachine } from "@/machines/TasksMachine.js";

export default {
  props: {
    task: Object,
  },
  setup() {
    const taskStore = useTaskStore(),
      { send } = useTasksMachine();

    return { taskStore, send };
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    title() {
      return this.task ? this.task.Title : "";
    },
  },
  methods: {
    confirmDelete() {
      const me = this;

      me.taskStore.destroy(me.task.ID).then((result) => {
        me.dialog = false;
        if (result && result.success === true) {
          me.send("DESELECT");
          me.send({
            type: "TOAST",
            message: "task deleted successfully",
            color: "success",
          });
        } else {
          me.send({
            type: "TOAST",
            message: "result.message",
            color: "error",
          });
        }
      });
    },
  },
};
</script>

<style>
button {
  margin-left: 1em;
}
</style>
