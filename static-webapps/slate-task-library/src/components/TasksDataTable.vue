<template>
  <!-- Items per page prop does not yet seem to be implemented in Vue 3.
  Probably not important enough to hack a solution rather than wait for it to be included
  It should look like one of these two lines
    :footer-props="{ 'items-per-page-options': [10, 20, 50] }"
    :footer-props="{ 'itemsPerPageOptions': [10, 20, 50] }" -->
  <v-data-table-server
    v-model="selected"
    v-model:items-per-page="itemsPerPage"
    v-model:sort-by="sortBy"
    fixed-header
    height="calc(100vh - 160px)"
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
    @update:items-per-page="updateItemsPerPage"
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

    <template #footer.prepend>
      <SettingsMenu />
    </template>
  </v-data-table-server>
</template>

<script>
import ParentTaskColumnTemplate from "@/components/templates/ParentTaskColumnTemplate";
import RowTemplate from "@/components/templates/RowTemplate.vue";
import SettingsMenu from "@/components/SettingsMenu.vue";
import { useTaskStore } from "@/stores/TaskStore.js";
import { useTasksMachine } from "@/machines/TasksMachine.js";
import { storeToRefs } from "pinia";

export default {
  components: {
    ParentTaskColumnTemplate,
    RowTemplate,
    SettingsMenu,
  },
  setup() {
    const taskStore = useTaskStore(),
      { data, loading, total } = storeToRefs(taskStore),
      { state, send } = useTasksMachine();

    taskStore.fetch();
    send("INIT");

    return {
      taskStore,
      data,
      loading,
      total,
      state,
      send,
    };
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
        { title: "Created by", align: "center", key: "Creator" },
        { title: "Created", align: "center", key: "Created" },
      ],
      tasks: [],
    };
  },
  computed: {
    selected() {
      return this.state.context.selected;
    },
  },
  methods: {
    isSelected(row) {
      return this.selected.indexOf(row.value) > -1;
    },
    onRowClick(row) {
      if (!this.isSelected(row)) {
        this.send({ type: "SELECT", row: row.value });
      }
    },
    // onRowDblClick(row) {
    //   const taskUIStore = useTaskUIStore();
    //   taskUIStore.selected =
    //     taskUIStore.selected.indexOf(row) > -1 ? [] : [row];
    //   taskUIStore.editFormVisible = true;
    // },
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
table {
  table-layout: fixed !important;
}
/* Experience Type column */
th:nth-child(3) {
  width: 150px;
}
/* Created by column */
th:nth-child(5) {
  width: 180px;
}
/* Created column */
th:nth-child(6) {
  width: 120px;
}
tr:nth-child(even):not(.selected) td {
  filter: brightness(95%);
}
</style>
