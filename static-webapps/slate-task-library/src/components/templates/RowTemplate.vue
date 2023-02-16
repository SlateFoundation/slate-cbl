<template item="{ item }">
  <tr :class="selected ? 'selected' : ''" @click="onRowClick(item)">
    <td>{{ item.raw.Title }}</td>
    <td><ParentTaskItemTemplate :item="item" /></td>
    <td>{{ item.raw.ExperienceType }}</td>
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
import { isProxy, toRaw } from "vue";

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
    getItemId(row) {
      return row && isProxy(row.value) ? toRaw(row.value).ID : null;
    },
    onRowClick(row) {
      this.$emit("rowclick", this.getItemId(row));
    },
  },
};
</script>

<style>
.selected td {
  background-color: #1111 !important;
}
</style>
