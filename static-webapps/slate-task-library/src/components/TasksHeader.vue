<template>
  <v-col cols="12" sm="8">
    <h1>Task Library</h1>
  </v-col>
  <v-col cols="12" sm="2">
    <v-btn icon="mdi-plus" color="primary" />
    <v-btn :disabled="task === null" icon="mdi-pencil" color="primary" />
    <DeleteConfirmation :task="task" @delete-confirmed="deleteTask" />
  </v-col>
</template>

<script>
import DeleteConfirmation from "./DeleteConfirmation.vue";
import { useTaskDataTableStore } from "@/stores/TaskDataTableStore.js";
import { storeToRefs } from "pinia";

export default {
  components: { DeleteConfirmation },
  emits: ["delete-confirmed"],
  setup() {
    const taskDataTableStore = useTaskDataTableStore(),
      { selected } = storeToRefs(taskDataTableStore);

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
    deleteTask(task) {
      this.$emit("delete-confirmed", task);
    },
  },
};
</script>
