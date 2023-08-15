<template>
  <v-dialog v-model="isVisible" persistent width="auto">
    <v-card class="confirmationDialog">
      <v-card-title class="text-h5"> Delete Task </v-card-title>
      <v-card-text>{{ title }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="elevated"
          rounded
          :disabled="isDeleting"
          :loading="isDeleting"
          @click="send({ type: 'destroy.item' })"
        >
          Delete
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          rounded
          :disabled="isDeleting"
          @click="send({ type: 'cancel.delete' })"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDataTableMachine } from "@/machines/DataTableMachine.js";

export default {
  props: {
    task: Object,
  },
  setup() {
    const { state, send } = useDataTableMachine();

    return { state, send };
  },
  computed: {
    isVisible() {
      return this.state.matches("Deleting");
    },
    title() {
      return this.task ? this.task.Title : "";
    },
    isDeleting() {
      return (
        this.state.matches("Deleting") &&
        this.state.children.delete?.state.matches("Destroying")
      );
    },
  },
};
</script>

<style scoped>
.confirmationDialog {
  min-width: 300px;
}
button {
  margin-left: 1em;
}
</style>
