<template>
  <v-row>
    <v-col cols="12" sm="8">
      <h1>Task Library</h1>
    </v-col>
    <v-col cols="12" sm="2">
      <v-btn icon="mdi-plus" color="primary" />
      <v-btn :disabled="task === null" icon="mdi-pencil" color="primary" />
      <DeleteConfirmation :task="task" @delete-confirmed="deleteTask" />
    </v-col>
  </v-row>
</template>

<script>
import DeleteConfirmation from "./DeleteConfirmation.vue";

export default {
  components: { DeleteConfirmation },
  props: {
    task: Object,
  },
  emits: ["delete-confirmed"],
  methods: {
    deleteTask(task) {
      this.$emit("delete-confirmed", task);
    },
  },
};
</script>
