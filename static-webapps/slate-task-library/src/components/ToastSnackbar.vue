<template>
  <div class="text-center">
    <v-snackbar
      v-model="isVisible"
      :timeout="state.context.toastTimeout"
      :color="state.context.toastColor"
      rounded="pill"
      variant="elevated"
      close-on-content-click
    >
      <span class="message">{{ state.context.toastMessage }}</span>
    </v-snackbar>
  </div>
</template>

<script>
import { useTasksMachine } from "@/machines/TasksMachine.js";
import { ref } from "vue";

export default {
  setup() {
    const { state, send } = useTasksMachine(),
      toastVisible = ref(false);

    return {
      state,
      send,
      toastVisible,
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.state.context.toastIsVisible;
      },
      set(val) {
        this.send({ type: "UNTOAST" });
        this.toastIsVisible = val ? val : this.state.context.toastIsVisible;
      },
    },
  },
};
</script>

<style>
span.message {
  display: inline-block;
  width: 100%;
  text-align: center;
}
</style>
