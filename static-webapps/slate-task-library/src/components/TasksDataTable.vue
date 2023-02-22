<template>
  <v-container :fluid="true">
    <TasksHeader :task="selectedItem" @delete-confirmed="deleteTask" />
    <v-row>
      <v-col cols="12" sm="10">
        <!-- Data Table -->
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
          @update:sort-by="updateSortBy"
          @update:page="updatePage"
          @update:itemsPerPage="updateItemsPerPage"
        >
          <template #column.ParentTask="{ column }">
            <ParentTaskColumnTemplate :column="column" />
          </template>
          <template #item="{ item }">
            <RowTemplate
              :item="item"
              :selected="isSelected(item)"
              @rowclick="onRowClick"
            />
          </template>
        </v-data-table-server>
      </v-col>

      <v-col cols="12" sm="2">
        <TaskDetails v-if="selectedItem" :item="selectedItem" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TasksHeader from "@/components/TasksHeader.vue";
import TaskDetails from "@/components/TaskDetails.vue";
import ParentTaskColumnTemplate from "@/components/templates/ParentTaskColumnTemplate";
import RowTemplate from "@/components/templates/RowTemplate.vue";
import { useTaskStore } from "@/stores/TaskStore.js";
import { storeToRefs } from "pinia";
import { isProxy, toRaw } from "vue";

export default {
  components: {
    TasksHeader,
    TaskDetails,
    ParentTaskColumnTemplate,
    RowTemplate,
  },
  setup() {
    const taskStore = useTaskStore(),
      // fetch tasks

      { data, loading, total } = storeToRefs(taskStore);

    taskStore.fetchTasks();

    return { taskStore, data, loading, total };
  },
  data() {
    return {
      itemsPerPage: 20,
      selected: [],
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
    getItemId(row) {
      return row && isProxy(row.value) ? toRaw(row.value).ID : null;
    },
    isSelected(row) {
      return this.selected.indexOf(this.getItemId(row)) > -1;
    },
    onRowClick(row) {
      const itemID = this.getItemId(row);

      this.selected = this.selected.indexOf(itemID) > -1 ? [] : [itemID];
      this.selectedItem = this.selected.length > 0 ? row : null;
    },
    updateSortBy(sortBy) {
      const taskStore = useTaskStore();

      taskStore.setSortBy(sortBy[0] || null);
      taskStore.fetchTasks();

      this.sortBy = sortBy;
    },
    updatePage(page) {
      const taskStore = useTaskStore();

      taskStore.setOffset((page - 1) * this.itemsPerPage);
      taskStore.fetchTasks();
    },
    updateItemsPerPage(limit) {
      const taskStore = useTaskStore();

      taskStore.setLimit(limit);
      taskStore.fetchTasks();
    },
    deleteTask(task) {
      const taskStore = useTaskStore();

      taskStore.destroy(this.getItemId(task));
    },
  },
};
</script>

<style>
tr:nth-child(even):not(.selected) td {
  background-color: #fafafa !important;
}
</style>
