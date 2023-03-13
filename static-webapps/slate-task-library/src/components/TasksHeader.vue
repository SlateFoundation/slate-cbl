<template>
  <v-col cols="5">
    <h1>Task Library</h1>
  </v-col>

  <v-col cols="5" class="text-right">
    <!-- Add task button -->
    <v-btn icon="mdi-plus" color="primary" @click="send({ type: 'ADD' })" />

    <!-- Edit task button -->
    <v-btn
      :disabled="!isTaskSelected"
      icon="mdi-pencil"
      color="primary"
      @click="send({ type: 'EDIT' })"
    />

    <!-- Delete task Button -->
    <v-btn
      :disabled="!isTaskSelected"
      icon="mdi-trash-can-outline"
      color="primary"
      @click="send({ type: 'DELETE' })"
    />

    <!-- Delete confirmation component -->
    <DeleteConfirmation :task="task" />
  </v-col>
</template>

<script>
import DeleteConfirmation from "./DeleteConfirmation.vue";
import { useTasksMachine } from "@/machines/TasksMachine.js";

export default {
  components: { DeleteConfirmation },
  setup() {
    const { state, send } = useTasksMachine();

    return {
      state,
      send,
    };
  },
  computed: {
    task() {
      const selected = this.state.context.selected;

      return selected && selected.length > 0 ? selected[0] : null;
    },
    isTaskSelected() {
      return this.task !== null;
    },
  },
};
</script>
