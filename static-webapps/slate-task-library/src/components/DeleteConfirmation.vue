<template>
  <v-dialog v-model="dialog" persistent width="auto">
    <template #activator="{ props }">
      <v-btn
        :disabled="task === null"
        icon="mdi-trash-can-outline"
        color="primary"
        v-bind="props"
      />
    </template>
    <v-card>
      <v-card-title class="text-h5"> Delete Task </v-card-title>
      <v-card-text>{{ task.raw.Title }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="dialog = false">
          Delete
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click="dialog = false">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    task: Object,
  },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style>
button {
  margin-left: 1em;
}
</style>
