<template>
  <v-container fluid fill-height>
    <!-- Header: title and buttons -->
    <v-row>
      <TasksHeader />
    </v-row>

    <v-row>
      <!-- Data Table -->
      <v-col :cols="tableCols">
        <TasksDataTable />
      </v-col>

      <!-- Task details card -->
      <v-col v-if="task" :cols="detailsCols">
        <TaskDetails />
      </v-col>
    </v-row>
  </v-container>

  <TaskForm v-if="isFormVisible" />
  <Login v-if="isUnauthenticated" />
  <ToastSnackbar />
</template>

<script>
import { useDataTableMachine } from "@/machines/DataTableMachine.js";
import TasksDataTable from "@/components/TasksDataTable.vue";
import TasksHeader from "@/components/TasksHeader.vue";
import TaskDetails from "@/components/TaskDetails.vue";
import TaskForm from "@/components/TaskForm.vue";
import ToastSnackbar from "@/components/ToastSnackbar.vue";
import Login from "@/components/Login.vue";

export default {
  components: {
    TasksDataTable,
    TasksHeader,
    TaskDetails,
    TaskForm,
    ToastSnackbar,
    Login,
  },
  setup() {
    const { state } = useDataTableMachine();

    return {
      state,
    };
  },
  computed: {
    task() {
      const selected = this.state.context.selected,
        store = this.state.context.store;

      if (Array.isArray(selected) && selected.length > 0) {
        return store.data[selected[0]];
      }

      return null;
    },
    isFormVisible() {
      return this.state.children?.form;
    },
    isUnauthenticated() {
      return ["Unauthenticated", "Login"].some(this.state.matches);
    },
    tableCols() {
      return this.state.context.detailsIsVisible ? 10 : 12;
    },
    detailsCols() {
      return this.state.context.detailsIsVisible ? 2 : 0;
    },
  },
};
</script>
