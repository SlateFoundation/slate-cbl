<template>
  <v-dialog v-model="dialog" persistent width="auto">
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
          @click="send({ type: 'DESTROY' })"
        >
          Delete
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          rounded
          :disabled="isDeleting"
          @click="send({ type: 'CANCEL' })"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useTasksMachine } from "@/machines/TasksMachine.js";

export default {
  props: {
    task: Object,
  },
  setup() {
    const { state, send } = useTasksMachine();

    return { state, send };
  },
  computed: {
    dialog() {
      return this.state.matches("deleting");
    },
    title() {
      return this.task ? this.task.Title : "";
    },
    isDeleting() {
      return (
        this.state.matches("deleting") &&
        this.state.children.delete.state.matches("destroying")
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
