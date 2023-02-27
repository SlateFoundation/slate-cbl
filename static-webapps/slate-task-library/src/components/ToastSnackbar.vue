<template>
  <div class="text-center">
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="primary"
      rounded="pill"
      variant="elevated"
      close-on-content-click
    >
      <span class="message">{{ snackbarMsg }}</span>
    </v-snackbar>
  </div>
</template>

<script>
import { useTaskUIStore } from "@/stores/TaskUIStore.js";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const taskUIStore = useTaskUIStore(),
      { snackbar, snackbarMsg } = storeToRefs(taskUIStore);

    return {
      snackbar,
      snackbarMsg,
    };
  },
  data: () => ({
    timeout: 2000,
  }),
};
</script>

<style>
span.message {
  display: inline-block;
  width: 100%;
  text-align: center;
}
</style>
