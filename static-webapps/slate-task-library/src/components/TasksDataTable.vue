<template>
  <!-- Items per page prop does not yet seem to be implemented in Vue 3.
  For now, using <template #bottom>
  It should look like one of these two lines
    :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
    :footer-props="{ 'itemsPerPageOptions': [10, 20, 50, 100] }" -->
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
    <!-- This works with v-data-table but doesn't seem to be implemented in v-data-table yet in Vue 3 -->
    <!-- <template #column.ParentTask="{ column }">
      <ParentTaskColumnTemplate :column="column" />
    </template> -->

    <!-- Item (row) templates -->
    <template #item="{ item }">
      <RowTemplate
        :item="item"
        :selected="isSelected(item)"
        @rowclick="onRowClick"
        @dblclick="onRowDblClick"
      />
    </template>

    <template #footer.prepend>
      <SettingsMenu />
    </template>
    <template #bottom>
      <v-data-table-footer
        :items-per-page-options="[
          { value: 10, title: '10' },
          { value: 20, title: '20' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
        ]"
      />
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

    // Load the task store
    taskStore.fetch();

    // Initialize the UI state machine
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
  watch: {
    state(state) {
      if (state.changed && state.matches("ready") && state.context.updatedID) {
        this.selectByID(state.context.updatedID);
      }
    },
    loading(isLoading) {
      if (isLoading) {
        this.send({ type: "DESELECT" });
      }
    },
  },
  mounted() {
    // Add event listener on keyup
    document.addEventListener("keyup", this.addKeyPressHandlers, false);
  },
  unmounted() {
    // Add event listener on keyup
    document.removeEventListener("keyup", this.addKeyPressHandlers);
  },
  methods: {
    isSelected(row) {
      return this.selected.indexOf(row.value) > -1;
    },
    selectByID(id) {
      const row = this.data.find((item) => item.ID === id);

      this.send({ type: "SELECT", row });
    },
    selectByIndex(idx) {
      const row = this.data[idx];

      this.send({ type: "SELECT", row });
    },
    getSelectedIndex() {
      const row = this.selected[0];

      if (row) {
        return this.data.findIndex((item) => item.ID === row.ID);
      }
      return -1;
    },
    onRowClick(row) {
      if (!this.isSelected(row)) {
        this.send({ type: "SELECT", row: row.value });
      }
    },
    onRowDblClick() {
      this.send({ type: "OPENDETAILS" });
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
    addKeyPressHandlers(event) {
      const me = this,
        code = event.code;

      if (code === "ArrowUp" && me.selected) {
        me.arrowUp();
      }
      if (code === "ArrowDown" && me.selected) {
        me.arrowDown();
      }
    },
    arrowUp() {
      const current = this.getSelectedIndex();

      if (current > 0) {
        this.selectByIndex(current - 1);
      }
    },
    arrowDown() {
      const current = this.getSelectedIndex();

      if (current < this.itemsPerPage - 1) {
        this.selectByIndex(current + 1);
      }
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
