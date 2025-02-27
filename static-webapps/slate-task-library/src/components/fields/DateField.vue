<template>
  <v-text-field v-model="inputVal" :label="label" type="date"></v-text-field>
</template>

<script>
export default {
  props: {
    modelValue: Number,
    label: String,
  },
  emits: ["update:modelValue"],
  computed: {
    inputVal: {
      get() {
        const val = this.modelValue;

        if (val !== null) {
          // convert date to ISO 8601 format for html date field
          return new Date(this.modelValue * 1000).toISOString().split("T")[0];
        }
        return null;
      },
      set(val) {
        // convert date to 10 digit Unix timestamp
        const timestamp = Math.floor(new Date(val).getTime() / 1000);

        this.$emit("update:modelValue", timestamp);
      },
    },
  },
};
</script>
