<template>
  <div class="text-center">
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="snackbarColor"
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
      { snackbar, snackbarMsg, snackbarColor } = storeToRefs(taskUIStore);

    return {
      snackbar,
      snackbarMsg,
      snackbarColor,
    };
  },
  data: () => ({
    timeout: 4000,
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
