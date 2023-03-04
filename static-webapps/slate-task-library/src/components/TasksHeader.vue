<template>
  <v-col cols="12" sm="8">
    <h1>Task Library</h1>
  </v-col>
  <v-col cols="12" sm="2">
    <v-btn icon="mdi-plus" color="primary" @click="send('ADD')" />
    <v-btn
      :disabled="task === null"
      icon="mdi-pencil"
      color="primary"
      @click="send('EDIT', task)"
    />
    <DeleteConfirmation :task="task" />
  </v-col>
</template>

<script>
import DeleteConfirmation from "./DeleteConfirmation.vue";
// import { useTaskUIStore } from "@/stores/TaskUIStore.js";
import { useTasksMachine } from "@/machines/TasksMachine.js";
// import { storeToRefs } from "pinia";

export default {
  components: { DeleteConfirmation },
  setup() {
    // const taskUIStore = useTaskUIStore(),
    const { state, send } = useTasksMachine();
    // { selected } = storeToRefs(taskUIStore);

    return {
      state,
      send,
    };
  },
  computed: {
    task() {
      const selected = this.state.context.selected;

      return selected && selected.length > 0 ? selected[0].value : null;
    },
  },
  // methods: {
  //   createTask() {
  //     this.send({ type: "CREATE" });
  //     // const taskUIStore = useTaskUIStore();

  //     // taskUIStore.selected = [];
  //     // taskUIStore.editFormVisible = true;
  //   },
  //   editTask() {
  //     this.send({ type: "EDIT" });
  //     // const taskUIStore = useTaskUIStore();

  //     // taskUIStore.editFormVisible = true;
  //   },
  // },
};
</script>
