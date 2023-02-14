<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="data"
    :items-length="total"
    :loading="loading"
    loading-text="Loading... Please wait"
    density="compact"
    class="elevation-1"
  >
    <template v-slot:column.ParentTask="{ column }">
        <ParentTaskColumnTemplate :column="column" />
    </template>
    <template v-slot:item.ParentTask="{ item }">
        <ParentTaskItemTemplate :item="item" />
    </template>
    <template v-slot:item.Skills="{ item }">
        <SkillsItemTemplate :item="item" />
    </template>
    <template v-slot:item.Creator="{ item }">
        <CreatorItemTemplate :item="item" />
    </template>
    <template v-slot:item.Created="{ item }">
        <CreatedItemTemplate :item="item" />
    </template>
  </v-data-table-server>
</template>

<script>
import ParentTaskColumnTemplate from "@/components/templates/ParentTaskColumnTemplate";
import ParentTaskItemTemplate from "@/components/templates/ParentTaskItemTemplate";
import SkillsItemTemplate from "@/components/templates/SkillsItemTemplate.vue";
import CreatedItemTemplate from "@/components/templates/CreatedItemTemplate.vue";
import CreatorItemTemplate from "@/components/templates/CreatorItemTemplate.vue";
import { useTaskStore } from "@/stores/TaskStore.js";
import { storeToRefs } from 'pinia'

export default {
  components: {
    ParentTaskColumnTemplate,
    ParentTaskItemTemplate,
    SkillsItemTemplate,
    CreatorItemTemplate,
    CreatedItemTemplate,
  },
  setup() {
    const taskStore = useTaskStore()
    // fetch tasks

    const { data, loading, total } = storeToRefs(taskStore)

    taskStore.fetchTasks()

    return { taskStore, data, loading, total }
  },
  data() {
    return {
      itemsPerPage: 20,
      headers: [
        { title: "Title", align: "start", key: "Title" },
        { title: "Subtask of", align: "start", key: "ParentTask" },
        { title: "Type of Exp.", align: "center", key: "ExperienceType" },
        { title: "Skills", align: "end", key: "Skills" },
        { title: "Created by", align: "start", key: "Creator" },
        { title: "Created", align: "end", key: "Created" },
      ],
      tasks: [],
    };
  },
};
</script>
