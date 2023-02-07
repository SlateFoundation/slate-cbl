<template>
  <v-dialog v-model="dialog">
    <template #activator>
      <span
        class="baseline-link"
        @click="dialog=true"
      >
        {{ value }}
      </span>
    </template>

    <v-form @submit.prevent="submit">
      <v-card style="width: 248px; margin: auto;">
        <v-card-text>
          <v-text-field
            v-model="temporaryValue"
            style="width: 200px;"
            label="New Baseline"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            block
            @click="submit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import client from '@/store/client';
import emitter from '@/store/emitter';

export default {
  props: {
    value: {
      type: String,
      default: () => '',
    },
    portfolio: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return { dialog: false, temporaryValue: this.value };
  },
  methods: {
    submit() {
      const {
        StudentID, CompetencyID, ID, Class,
      } = this.portfolio;
      const data = [{ Class, ID, BaselineRating: this.temporaryValue }];
      const url = '/cbl/student-competencies/save';
      const refetch = () => emitter.emit('update-store', { StudentID, CompetencyID });
      client.post(url, { data }).then(refetch);
      this.dialog = false;
    },
  },
};
</script>

<style>
.baseline-link {
  cursor: pointer;
  text-decoration: underline dashed;
}
</style>
