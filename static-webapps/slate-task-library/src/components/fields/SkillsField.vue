<template>
  <v-autocomplete
    v-model="inputVal"
    :items="data"
    label="Code"
    item-title="title"
    item-value="ID"
    return-object
    chips
    closable-chips
    multiple
    :loading="loading"
  >
    <template #chip="{ props, item }">
      <v-chip v-bind="props" :text="item.raw.Code"></v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
import { useSkillStore } from "@/stores/SkillStore.js";
import { storeToRefs } from "pinia";

export default {
  props: {
    modelValue: Array,
  },
  emits: ["update:modelValue"],
  setup() {
    const skillStore = useSkillStore(),
      { data, loading } = storeToRefs(skillStore);

    skillStore.load();

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
};
</script>
