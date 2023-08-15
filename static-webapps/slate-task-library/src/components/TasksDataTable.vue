<template>
  <!-- Items per page prop does not yet seem to be implemented in Vue 3.
  For now, using <template #bottom>
  It should look like one of these two lines
    :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
    :footer-props="{ 'itemsPerPageOptions': [10, 20, 50, 100] }" -->
  <v-data-table-server
    v-model="selected"
    v-model:items-per-page="context.itemsPerPage"
    v-model:page="context.page"
    v-model:sort-by="context.sortBy"
    fixed-header
    height="calc(100vh - 160px)"
    :headers="headers"
    :items="data"
    item-key="ID"
    :items-length="total"
    :loading="isLoading"
    loading-text="Loading... Please wait"
    density="compact"
    class="elevation-1"
    :disable-pagination="true"
    @update:page="(page) => send({ type: 'configure.page', page })"
    @update:sort-by="(sort) => send({ type: 'configure.sort.by', sort })"
    @update:items-per-page="(limit) => send({ type: 'configure.limit', limit })"
  >
    <!-- Item (row) templates -->
    <template #item="{ item, index }">
      <RowTemplate
        :item="item"
        :selected="selected.indexOf(index) > -1"
        @rowclick="() => send({ type: 'select.row', index })"
        @dblclick="() => send({ type: 'open.details', index })"
      />
    </template>

    <template #bottom>
      <v-data-table-footer
        :items-per-page-options="[
          { value: 10, title: '10' },
          { value: 20, title: '20' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
        ]"
      >
        <template #prepend>
          <SettingsMenu />
          <v-btn
            class="mr-4"
            icon="mdi-reload"
            color="grey-darken-1"
            variant="text"
            rounded
            @click="send({ type: 'store.load' })"
          />
        </template>
      </v-data-table-footer>
    </template>
  </v-data-table-server>
</template>

<script>
// import ParentTaskColumnTemplate from "@/components/templates/ParentTaskColumnTemplate";
import RowTemplate from "@/components/templates/RowTemplate.vue";
import SettingsMenu from "@/components/SettingsMenu.vue";
import { useTaskStore } from "@/stores/TaskStore.js";
import { useDataTableMachine } from "@/machines/DataTableMachine.js";
import { storeToRefs } from "pinia";

export default {
  components: {
    // ParentTaskColumnTemplate,
    RowTemplate,
    SettingsMenu,
  },
  setup() {
    const taskStore = useTaskStore(),
      { data, total } = storeToRefs(taskStore),
      { state, send } = useDataTableMachine();

    send({ type: "initialize", store: taskStore });

    return {
      data,
      total,
      state,
      send,
    };
  },
  data() {
    return {
      headers: [
        { title: "Title", align: "start", key: "Title" },
        { title: "Subtask of", align: "start", key: "ParentTask" },
        { title: "Type of Exp.", align: "center", key: "ExperienceType" },
        { title: "Skills", align: "center", key: "Skills" },
        { title: "Created by", align: "center", key: "Creator" },
        { title: "Created", align: "center", key: "Created" },
      ],
    };
  },
  computed: {
    isLoading() {
      return this.state.matches("Loading");
    },
    context() {
      return this.state.context;
    },
    selected() {
      return this.state.context.selected;
    },
  },

  methods: {
    isSelected(index) {
      return this.selected.indexOf(index) > -1;
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
