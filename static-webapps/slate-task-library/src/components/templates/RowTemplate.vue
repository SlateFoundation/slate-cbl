<template item="{ item }">
  <tr :class="selected ? 'selected' : ''" @click="onRowClick(item)">
    <td>{{ item.raw.Title }}</td>
    <td><ParentTaskItemTemplate :item="item" /></td>
    <td align="center">{{ item.raw.ExperienceType }}</td>
    <td><SkillsItemTemplate :item="item" /></td>
    <td><CreatorItemTemplate :item="item" /></td>
    <td><CreatedItemTemplate :item="item" /></td>
  </tr>
</template>

<script>
import ParentTaskItemTemplate from "@/components/templates/ParentTaskItemTemplate";
import SkillsItemTemplate from "@/components/templates/SkillsItemTemplate.vue";
import CreatedItemTemplate from "@/components/templates/CreatedItemTemplate.vue";
import CreatorItemTemplate from "@/components/templates/CreatorItemTemplate.vue";

export default {
  components: {
    ParentTaskItemTemplate,
    SkillsItemTemplate,
    CreatorItemTemplate,
    CreatedItemTemplate,
  },
  props: {
    item: Object,
    selected: Boolean,
  },
  emits: ["rowclick"],
  methods: {
    onRowClick(row) {
      this.$emit("rowclick", row);
    },
  },
};
</script>

<style>
td {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.selected td {
  background-color: #1111 !important;
}
</style>
