<template>
  <v-sheet class="d-flex ma-0 pa-0">
    <v-sheet class="ma-0 mt-2 mr-6 pa-0 self-align-center">
      <v-btn
        rounded
        color="primary"
        size="small"
        :disabled="disabled"
        @click="cloneSelectionIsActive = !cloneSelectionIsActive"
        >Clone</v-btn
      >
    </v-sheet>
    <v-sheet class="flex-grow-1 ma-0 pa-0">
      <v-autocomplete
        v-if="cloneSelectionIsActive"
        v-model="inputVal"
        :items="data"
        hide-details="true"
        item-title="Title"
        item-value="ID"
        label="Clone from"
        no-data-text="type at least 3 characters to search tasks"
        clearable
        :loading="loading"
        @click:clear="clear"
        @update:search="query"
        @update:model-value="cloneSelected"
      ></v-autocomplete>
    </v-sheet>
  </v-sheet>

  <v-dialog v-model="confirmationDialogIsVisible" persistent width="auto">
    <v-card>
      <v-card-title class="text-h5"> Clone Task </v-card-title>
      <v-card-text
        >Selecting a task to clone may overwrite what you have input already,
        proceed?</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" rounded @click="confirmClone">
          Confirm
        </v-btn>
        <v-btn color="primary" variant="elevated" rounded @click="cancelClone">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useCloneTaskStore } from "@/stores/CloneTaskStore.js";
import { storeToRefs } from "pinia";

export default {
  props: {
    disabled: Boolean,
  },
  emits: ["cloneRequest"],
  setup() {
    const cloneTaskStore = useCloneTaskStore(),
      { data, loading } = storeToRefs(cloneTaskStore);

    return {
      data,
      loading,
      cloneTaskStore,
    };
  },
  data: function () {
    return {
      inputVal: null,
      cloneSelectionIsActive: false,
      confirmationDialogIsVisible: false,
      confirm: false,
      cloneTargetId: null,
    };
  },
  methods: {
    query(query) {
      const me = this;

      if (query && query.length > 2 && !me.loading) {
        me.cloneTaskStore.extraParams = { q: query };
        me.cloneTaskStore.load();
      }
    },
    cloneSelected(id) {
      const me = this;

      if (id !== null) {
        me.cloneTargetId = id;
        me.confirmationDialogIsVisible = true;
      }
    },
    confirmClone() {
      const me = this,
        id = me.cloneTargetId,
        task = me.data.find((item) => item.ID === id);

      me.$emit("cloneRequest", task, id);
      me.cloneTargetId = null;
      me.confirmationDialogIsVisible = false;
    },
    cancelClone() {
      const me = this;

      me.confirmationDialogIsVisible = false;
      me.cloneSelectionIsActive = false;
      me.reset();
    },
    clear() {
      const me = this;

      me.cloneSelectionIsActive = false;
      me.reset();
    },
    reset() {
      const me = this;

      me.cloneTargetId = null;
      me.inputVal = null;
      me.cloneTaskStore.clearData();
    },
  },
};
</script>
