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

  <TaskForm />
  <ToastSnackbar />
</template>

<script>
import { useTasksMachine } from "@/machines/TasksMachine.js";
import TasksDataTable from "@/components/TasksDataTable.vue";
import TasksHeader from "@/components/TasksHeader.vue";
import TaskDetails from "@/components/TaskDetails.vue";
import TaskForm from "@/components/TaskForm.vue";
import ToastSnackbar from "@/components/ToastSnackbar.vue";

export default {
  components: {
    TasksDataTable,
    TasksHeader,
    TaskDetails,
    TaskForm,
    ToastSnackbar,
  },
  setup() {
    const { state } = useTasksMachine();

    return {
      state,
    };
  },
  computed: {
    task() {
      const selected = this.state.context.selected;

      return selected && selected.length > 0 ? selected[0] : null;
    },
    tableCols() {
      return this.task ? 10 : 12;
    },
    detailsCols() {
      return this.task ? 2 : 0;
    },
  },
};
</script>
