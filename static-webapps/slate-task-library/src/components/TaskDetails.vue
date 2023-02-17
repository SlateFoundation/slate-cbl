<template v-if="data">
  <v-card>
    <v-card-item>
      <v-card-title>Task Details</v-card-title>
    </v-card-item>
    <v-card-item>
      <v-card-subtitle>Attachments</v-card-subtitle>
      <v-card-text>
        <ul>
          <li v-for="attachment in data.Attachments" :key="attachment.ID">
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
      <v-card-text> {{ data.Instructions }}</v-card-text>
    </v-card-item>
  </v-card>
</template>

<script>
import { isProxy, toRaw } from "vue";

export default {
  props: {
    item: Object,
  },
  computed: {
    data() {
      const item = this.item;

      return item && isProxy(item.value) ? toRaw(item.value) : null;
    },
  },
};
</script>
