<template>
  <div style="flex: 1; text-align: left">
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <template #activator="{ props }">
        <v-btn
          color="grey-darken-1"
          variant="text"
          rounded
          icon="mdi-cog"
          v-bind="props"
          :disabled="loading"
        ></v-btn>
      </template>

      <v-card min-width="300" prepend-icon="mdi-cog">
        <template #title> Options </template>

        <v-divider></v-divider>

        <v-list>
          <v-list-item class="ma-0 ml-3 pa-0">
            <v-checkbox
              v-model="archived"
              color="primary"
              class="ma-0 pa-0"
              label="include archived"
              hide-details
              :disabled="loading"
              @change="updateArchived"
            ></v-checkbox>
          </v-list-item>

          <v-list-item class="ma-0 ml-3 pa-0">
            <v-checkbox
              v-model="unshared"
              name="unshared"
              color="primary"
              label="include unshared"
              hide-details
              :disabled="loading"
              @change="updateUnshared"
            ></v-checkbox>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { useTaskStore } from "@/stores/TaskStore.js";
import { toRaw } from "vue";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const taskStore = useTaskStore(),
      { loading, extraParams } = storeToRefs(taskStore);

    return {
      taskStore,
      loading,
      extraParams,
    };
  },
  data: () => ({
    menu: false,
    archived: false,
    unshared: false,
  }),
  methods: {
    updateArchived() {
      this.taskStore.setExtraParams(
        Object.assign({}, toRaw(this.extraParams), {
          // eslint-disable-next-line camelcase
          include_archived: this.archived,
        })
      );
      this.taskStore.fetch();
    },
    updateUnshared() {
      this.taskStore.setExtraParams(
        Object.assign({}, toRaw(this.extraParams), {
          // eslint-disable-next-line camelcase
          include_unshared: this.unshared,
        })
      );
      this.taskStore.fetch();
    },
  },
};
</script>
