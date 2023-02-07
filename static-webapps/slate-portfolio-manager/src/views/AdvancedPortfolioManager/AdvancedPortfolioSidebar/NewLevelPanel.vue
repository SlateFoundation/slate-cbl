<template>
  <div
    :class="`level-panel -new mb-2 cbl-level-${Level}`"
  >
    <div class="bg-cbl-level-25 d-flex justify-space-between px-4 py-2 align-center">
      <h3 class="h6 mb-0 text-muted">
        Year {{ Level }}
      </h3>
      <v-btn
        size="small"
        class="text-white"
        color="var(--cbl-level-color)"
        @click="createLevel"
      >
        Enroll
      </v-btn>
    </div>
  </div>
</template>

<script>
import client from '@/store/client';
import emitter from '@/store/emitter';

export default {
  props: {
    Level: {
      type: Number,
      default: () => null,
    },
    StudentID: {
      type: Number,
      default: () => null,
    },
    CompetencyID: {
      type: Number,
      default: () => null,
    },
  },
  methods: {
    createLevel() {
      const { StudentID, CompetencyID, Level } = this;
      const data = [
        {
          StudentID,
          CompetencyID,
          Level,
          EnteredVia: 'enrollment',
          ID: -1,
          Class: 'Slate\\CBL\\StudentCompetency',
          BaselineRating: null,
        },
      ];
      const url = '/cbl/student-competencies/save';
      const refetch = () => emitter.emit('update-store', { StudentID, CompetencyID });
      client.post(url, { data }).then(refetch);
    },
  },
};
</script>
