<template>
  <v-data-table-server
    v-model="selected"
    v-model:items-per-page="itemsPerPage"
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="data"
    item-key="ID"
    :items-length="total"
    :loading="loading"
    loading-text="Loading... Please wait"
    density="compact"
    class="elevation-1"
    :footer-props="{ 'items-per-page-options': [15, 30] }"
    @update:sort-by="updateSortBy"
    @update:page="updatePage"
    @update:itemsPerPage="updateItemsPerPage"
  >
    <!-- Parent Task column header template -->
    <template #column.ParentTask="{ column }">
      <ParentTaskColumnTemplate :column="column" />
    </template>

    <!-- Item (row) templates -->
    <template #item="{ item }">
      <RowTemplate
        :item="item"
        :selected="isSelected(item)"
        @rowclick="onRowClick"
      />
    </template>
  </v-data-table-server>
</template>

<script>
import ParentTaskColumnTemplate from "@/components/templates/ParentTaskColumnTemplate";
import RowTemplate from "@/components/templates/RowTemplate.vue";
import { useTaskStore } from "@/stores/TaskStore.js";
import { useTaskUIStore } from "@/stores/TaskUIStore.js";
import { storeToRefs } from "pinia";

export default {
  components: {
    ParentTaskColumnTemplate,
    RowTemplate,
  },
  setup() {
    const taskStore = useTaskStore(),
      taskUIStore = useTaskUIStore(),
      { data, loading, total } = storeToRefs(taskStore),
      { selected } = storeToRefs(taskUIStore);

    taskStore.fetch();

    return { taskStore, data, taskUIStore, loading, total, selected };
  },
  data() {
    return {
      itemsPerPage: 20,
      selectedItem: null,
      sortBy: [],
      headers: [
        { title: "Title", align: "start", key: "Title" },
        { title: "Subtask of", align: "start", key: "ParentTask" },
        { title: "Type of Exp.", align: "center", key: "ExperienceType" },
        { title: "Skills", align: "center", key: "Skills" },
        { title: "Created by", align: "start", key: "Creator" },
        { title: "Created", align: "end", key: "Created" },
      ],
      tasks: [],
    };
  },
  methods: {
    isSelected(row) {
      const taskUIStore = useTaskUIStore();

      return taskUIStore.selected.indexOf(row) > -1;
    },
    onRowClick(row) {
      const taskUIStore = useTaskUIStore();

      taskUIStore.selected =
        taskUIStore.selected.indexOf(row) > -1 ? [] : [row];
    },
    updateSortBy(sortBy) {
      const taskStore = useTaskStore();

      taskStore.setSortBy(sortBy[0] || null);
      taskStore.fetch();

      this.sortBy = sortBy;
    },
    updatePage(page) {
      const taskStore = useTaskStore();

      taskStore.setOffset((page - 1) * this.itemsPerPage);
      taskStore.fetch();
    },
    updateItemsPerPage(limit) {
      const taskStore = useTaskStore();

      taskStore.setLimit(limit);
      taskStore.fetch();
    },
  },
};
</script>

<style>
tr:nth-child(even):not(.selected) td {
  filter: brightness(95%);
}
</style>
