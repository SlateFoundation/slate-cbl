<template>
  {{ displayItem }}
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    displayItem() {
      const creator = this.item.raw.Creator;

      return `${creator.FirstName} ${creator.LastName}`;
    },
  },
};
</script>
