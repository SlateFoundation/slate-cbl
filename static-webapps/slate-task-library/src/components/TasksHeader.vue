<template>
  <v-col cols="12" sm="8">
    <h1>Task Library</h1>
  </v-col>
  <v-col cols="12" sm="2">
    <v-btn icon="mdi-plus" color="primary" @click="send({ type: 'ADD' })" />
    <v-btn
      :disabled="task === null"
      icon="mdi-pencil"
      color="primary"
      @click="send({ type: 'EDIT' })"
    />
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
  },
};
</script>
