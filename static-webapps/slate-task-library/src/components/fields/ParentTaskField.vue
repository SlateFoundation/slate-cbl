<template>
  <v-autocomplete
    v-model="inputVal"
    :items="data"
    item-title="Title"
    item-value="ID"
    label="Subtask of"
    no-data-text="type at least 3 characters to search tasks"
    clearable
    :loading="loading"
    :custom-filter="filter"
    @update:search="query"
  ></v-autocomplete>
</template>

<script>
import { useParentTaskStore } from "@/stores/ParentTaskStore.js";
import { storeToRefs } from "pinia";

export default {
  props: {
    modelValue: Number,
  },
  emits: ["update:modelValue"],
  setup() {
    const parentTaskStore = useParentTaskStore(),
      { data, loading } = storeToRefs(parentTaskStore);

    parentTaskStore.load();

    return {
      data,
      loading,
    };
  },
  computed: {
    inputVal: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
  methods: {
    query(query) {
      const parentTaskStore = useParentTaskStore();

      if (query && query.length > 2 && !this.loading) {
        parentTaskStore.extraParams = { q: query };
        parentTaskStore.load();
      }
    },
    // filter out subtasks. TODO: do this in the endpoint?
    filter(value, query, item) {
      return item.raw.ParentTaskID === null;
    },
  },
};
</script>
