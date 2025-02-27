<template>
  <v-card v-if="state.context.detailsIsVisible">
    <v-card-item>
      <v-card-title>
        <v-row>
          <v-col>Task Details</v-col>
          <v-col class="text-right">
            <v-btn
              class="mb-1"
              size="x-small"
              icon="mdi-close"
              @click="send({ type: 'close.details' })"
            >
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
    </v-card-item>
    <v-card-item>
      <v-card-subtitle>Attachments</v-card-subtitle>
      <v-card-text>
        <ul>
          <li v-for="attachment in activeAttachments" :key="attachment.ID">
            <span class="title"
              ><a :href="attachment.URL">{{
                attachment.Title || attachment.URL
              }}</a></span
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
import { useDataTableMachine } from "@/machines/DataTableMachine.js";

export default {
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
    activeAttachments() {
      const attachments = this.task.Attachments;

      return (
        attachments && attachments.filter((item) => item.Status !== "removed")
      );
    },
  },
};
</script>
