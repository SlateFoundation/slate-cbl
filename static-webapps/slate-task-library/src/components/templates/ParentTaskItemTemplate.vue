<template>
{{ displayItem }}
</template>

<script>
export default {
  props: ["item"],
  computed: {
    displayItem() {
      const parentTask = this.item.raw.ParentTask
      return parentTask ? parentTask.Title : '';
    },
  },
};
</script>
