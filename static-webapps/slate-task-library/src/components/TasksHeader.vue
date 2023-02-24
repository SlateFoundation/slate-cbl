<template>
  <v-col cols="12" sm="8">
    <h1>Task Library</h1>
  </v-col>
  <v-col cols="12" sm="2">
    <v-btn icon="mdi-plus" color="primary" @click="createTask(task)" />
    <v-btn
      :disabled="task === null"
      icon="mdi-pencil"
      color="primary"
      @click="editTask(task)"
    />
    <DeleteConfirmation :task="task" @delete-confirmed="deleteTask" />
  </v-col>
</template>

<script>
import DeleteConfirmation from "./DeleteConfirmation.vue";
import { useTaskUIStore } from "@/stores/TaskUIStore.js";
import { storeToRefs } from "pinia";

export default {
  components: { DeleteConfirmation },
  emits: ["delete-confirmed"],
  setup() {
    const taskUIStore = useTaskUIStore(),
      { selected } = storeToRefs(taskUIStore);

    return {
      selected,
    };
  },
  computed: {
    task() {
      const selected = this.selected;

      return selected && selected.length > 0 ? selected[0].value : null;
    },
  },
  methods: {
    createTask() {
      const taskUIStore = useTaskUIStore();

      taskUIStore.editFormVisible = true;
    },
    editTask() {
      const taskUIStore = useTaskUIStore();

      taskUIStore.editFormVisible = true;
    },
    deleteTask(task) {
      this.$emit("delete-confirmed", task);
    },
  },
};
</script>
