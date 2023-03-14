<template>
  <div class="text-center">
    <v-snackbar
      v-model="isVisible"
      :timeout="toasterContext.toastTimeout"
      :color="toasterContext.toastColor"
      rounded="pill"
      variant="elevated"
      close-on-content-click
    >
      <span class="message">{{ toasterContext.toastMessage }}</span>
    </v-snackbar>
  </div>
</template>

<script>
import { useToastMachine } from "@/machines/ToastMachine.js";

export default {
  setup() {
    const { state, send } = useToastMachine();

    return {
      state,
      send,
    };
  },
  computed: {
    toasterContext() {
      return this.state.context;
    },
    isVisible: {
      get() {
        return this.toasterContext.toastIsVisible;
      },
      set(val) {
        /**
         * The vuetify snackbar will hide itself automatically after the set timeout
         * so we need to notify the toast state machine that it has been hidden
         */
        this.send({ type: "UNTOAST" });
        this.toastIsVisible = val ? val : this.toasterContext.toastIsVisible;
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
