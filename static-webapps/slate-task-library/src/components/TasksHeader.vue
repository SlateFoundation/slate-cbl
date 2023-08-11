<template>
  <v-col cols="5">
    <h1>Task Library</h1>
  </v-col>

  <!-- TODO: remove this button - it is for testing -->
  <v-col cols="5" class="text-right">
    <v-btn
      icon="mdi-login-variant"
      color="primary"
      @click="send({ type: 'test.auth' })"
    />

    <!-- Add task button -->
    <v-btn
      icon="mdi-plus"
      color="primary"
      @click="send({ type: 'add.item' })"
    />

    <!-- Edit task button -->
    <v-btn
      :disabled="!isTaskSelected"
      icon="mdi-pencil"
      color="primary"
      @click="send({ type: 'edit.item' })"
    />

    <!-- Delete task Button -->
    <v-btn
      :disabled="!isTaskSelected"
      icon="mdi-trash-can-outline"
      color="primary"
      @click="send({ type: 'delete.item', task })"
    />

    <!-- Delete confirmation component -->
    <DeleteConfirmation :task="task" />
  </v-col>
</template>

<script>
import DeleteConfirmation from "./DeleteConfirmation.vue";
import { useDataTableMachine } from "@/machines/DataTableMachine.js";

export default {
  components: { DeleteConfirmation },
  setup() {
    const { state, send } = useDataTableMachine();

    return {
      state,
      send,
    };
  },
  computed: {
    task() {
      const selected = this.state.context.selected,
        store = this.state.context.store;

      if (Array.isArray(selected) && selected.length > 0) {
        return store.data[selected[0]];
      }

      return null;
    },
    isTaskSelected() {
      return this.task !== null;
    },
  },
};
</script>
