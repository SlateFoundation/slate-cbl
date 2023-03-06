<template>
  <v-select
    v-model="inputVal"
    :items="data"
    label="Type of Experience"
    item-title="Title"
    item-value="Title"
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
      { data } = storeToRefs(experienceTypeStore);

    experienceTypeStore.fetch();

    return {
      data,
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
