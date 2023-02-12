<template>
{{ displayColumn }}&hellip;
</template>

<script>
export default {
  props: ["column"],
  computed: {
    displayColumn() {
      return this.column.title;
    },
  },
};
</script>
