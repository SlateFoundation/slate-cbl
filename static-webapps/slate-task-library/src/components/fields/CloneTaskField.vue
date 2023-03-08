<template>
  <v-sheet class="d-flex ma-0 pa-0">
    <v-sheet class="ma-0 mt-2 mr-6 pa-0 self-align-center">
      <v-btn rounded color="primary" size="small" @click="active = !active"
        >Clone</v-btn
      >
    </v-sheet>
    <v-sheet class="flex-grow-1 ma-0 pa-0">
      <v-autocomplete
        v-if="active"
        v-model="inputVal"
        :items="data"
        hide-details="true"
        item-title="Title"
        item-value="ID"
        label="Clone from"
        no-data-text="type at least 3 characters to search tasks"
        clearable
        :loading="loading"
        @click:clear="clear"
        @update:search="query"
        @update:model-value="cloneSelected"
      ></v-autocomplete>
    </v-sheet>
  </v-sheet>
</template>

<script>
import { useCloneTaskStore } from "@/stores/CloneTaskStore.js";
import { storeToRefs } from "pinia";

export default {
  props: {
    modelValue: Number,
  },
  emits: ["cloneRequest"],
  setup() {
    const cloneTaskStore = useCloneTaskStore(),
      { data, loading } = storeToRefs(cloneTaskStore);

    return {
      data,
      loading,
      cloneTaskStore,
    };
  },
  data: function () {
    return {
      inputVal: null,
      active: false,
    };
  },
  methods: {
    query(query) {
      const me = this;

      if (query && query.length > 2 && !me.loading) {
        me.cloneTaskStore.extraParams = { q: query };
        me.cloneTaskStore.fetch();
      }
    },
    cloneSelected(id) {
      const me = this,
        task = me.data.find((item) => item.ID === id);

      me.$emit("cloneRequest", task, id);
    },
    clear() {
      this.active = false;
    },
  },
};
</script>
