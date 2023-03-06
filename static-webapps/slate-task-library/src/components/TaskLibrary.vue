<template>
  <v-container fluid fill-height>
    <!-- Header: title and buttons -->
    <v-row>
      <TasksHeader />
    </v-row>

    <v-row>
      <!-- Data Table -->
      <v-col cols="12" sm="10">
        <TasksDataTable />
      </v-col>

      <!-- Task details card -->
      <v-col cols="12" sm="2">
        <TaskDetails />
      </v-col>
    </v-row>
  </v-container>

  <TaskForm />
  <ToastSnackbar />
</template>

<script setup>
import TasksDataTable from "@/components/TasksDataTable.vue";
import TasksHeader from "@/components/TasksHeader.vue";
import TaskDetails from "@/components/TaskDetails.vue";
import TaskForm from "@/components/TaskForm.vue";
import ToastSnackbar from "./ToastSnackbar.vue";
</script>
