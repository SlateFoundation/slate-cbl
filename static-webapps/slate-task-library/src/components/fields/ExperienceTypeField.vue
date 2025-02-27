<template>
  <v-select
    v-model="inputVal"
    :items="data"
    label="Type of Experience"
    item-title="Title"
    item-value="Title"
    :loading="loading"
  ></v-select>
</template>

<script>
import { useExperienceTypeStore } from "@/stores/ExperienceTypeStore.js";
import { storeToRefs } from "pinia";

export default {
  props: {
    modelValue: String,
  },
  emits: ["update:modelValue"],
  setup() {
    const experienceTypeStore = useExperienceTypeStore(),
      { data, loading } = storeToRefs(experienceTypeStore);

    experienceTypeStore.load();

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
