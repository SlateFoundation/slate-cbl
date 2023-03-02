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
import { useTaskUIStore } from "@/stores/TaskUIStore.js";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const taskStore = useTaskStore(),
      taskUIStore = useTaskUIStore(),
      { selected } = storeToRefs(taskUIStore);

    return { selected, taskStore, taskUIStore };
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    task() {
      const selected = this.selected;

      return selected && selected.length > 0 ? selected[0].value : null;
    },
    title() {
      return this.task ? this.task.Title : "";
    },
  },
  methods: {
    confirmDelete() {
      this.taskStore.destroy(this.task.ID).then((result) => {
        this.selected = [];
        this.dialog = false;
        console.log(result);
        if (result && result.success === true) {
          this.taskUIStore.toast("task deleted successfully");
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
