<template>
  <v-card v-if="task">
    <v-card-item>
      <v-card-title>Task Details</v-card-title>
    </v-card-item>
    <v-card-item>
      <v-card-subtitle>Attachments</v-card-subtitle>
      <v-card-text>
        <ul>
          <li v-for="attachment in activeAttachments" :key="attachment.ID">
            <span class="title"
              ><a :href="attachment.URL">{{ attachment.Title }}</a></span
            >
          </li>
        </ul>
      </v-card-text>
      <v-divider />
    </v-card-item>
    <v-card-item>
      <v-card-subtitle>Instructions</v-card-subtitle>
      <v-card-text> {{ task.Instructions }}</v-card-text>
    </v-card-item>
  </v-card>
</template>

<script>
import { useTaskUIStore } from "@/stores/TaskUIStore.js";
import { storeToRefs } from "pinia";

export default {
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
    activeAttachments() {
      const attachments = this.task.Attachments;

      return (
        attachments && attachments.filter((item) => item.Status !== "removed")
      );
    },
  },
};
</script>
