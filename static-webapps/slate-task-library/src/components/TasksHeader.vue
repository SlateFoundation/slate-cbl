<template>
  <v-row>
    <v-col cols="12" sm="8">
      <h1>Task Library</h1>
    </v-col>
    <v-col cols="12" sm="2" align="right">
      <v-btn icon="mdi-plus" color="primary" />
      <v-btn :disabled="task === null" icon="mdi-pencil" color="primary" />
      <v-btn
        :disabled="task === null"
        icon="mdi-trash-can-outline"
        color="primary"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    task: Object,
  },
};
</script>

<style>
button {
  margin-left: 1em;
}
</style>
