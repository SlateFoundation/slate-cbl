<template>{{ displayColumn }}&hellip;</template>

<script>
export default {
  props: {
    column: Object,
  },
  computed: {
    displayColumn() {
      return this.column.title;
    },
  },
};
</script>
