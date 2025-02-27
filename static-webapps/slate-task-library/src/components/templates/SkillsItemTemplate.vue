<template v-slot:item.Skills="{ item }">
  {{ displayItem }}
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    displayItem() {
      const skills = this.item.raw.Skills;

      return Array.isArray(skills)
        ? skills.map((skill) => skill.Code).join(",")
        : "";
    },
  },
};
</script>
