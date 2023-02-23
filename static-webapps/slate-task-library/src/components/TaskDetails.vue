<template>
  <v-card v-if="task">
    <v-card-item>
      <v-card-title>Task Details</v-card-title>
    </v-card-item>
    <v-card-item>
      <v-card-subtitle>Attachments</v-card-subtitle>
      <v-card-text>
        <ul>
          <li v-for="attachment in task.Attachments" :key="attachment.ID">
            <span class="title"
              ><a :href="attachment.URL">{{ attachment.Title }}</a></span
            >
          </li>
        </ul>
      </v-card-text>
      <hr />
    </v-card-item>
    <v-card-item>
      <v-card-subtitle>Instructions</v-card-subtitle>
      <v-card-text> {{ task.Instructions }}</v-card-text>
    </v-card-item>
  </v-card>
</template>

<script>
import { useTaskDataTableStore } from "@/stores/TaskDataTableStore.js";
import { storeToRefs } from "pinia";

export default {
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
};
</script>
