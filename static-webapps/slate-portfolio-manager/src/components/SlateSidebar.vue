<template>
  <v-expand-x-transition>
    <v-sheet class="slate-sidebar" elevation="6">
      <slot />
    </v-sheet>
  </v-expand-x-transition>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue'],
}
</script>

<style>
.slate-sidebar {
  bottom: 0;
  position: fixed;
  right: 0;
  top: 0;
}
</style>