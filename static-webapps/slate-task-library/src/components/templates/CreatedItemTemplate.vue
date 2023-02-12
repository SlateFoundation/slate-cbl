<template>
{{ displayItem }}
</template>

<script>
export default {
  props: ["item"],
  computed: {
    displayItem() {
      return new Date(this.item.raw.Created * 1000).toLocaleDateString()
    },
  },
};
</script>
