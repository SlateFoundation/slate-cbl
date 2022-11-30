<template>
  <div
    :class="`level-panel -new mb-2 cbl-level-${Level}`"
  >
    <b-container class="bg-cbl-level-25">
      <b-row class="py-2 align-items-center">
        <b-col>
          <h3 class="h6 m-0 text-muted">
            Year {{ Level }}
          </h3>
        </b-col>
        <b-col cols="4">
          <button
            class="btn btn-primary btn-sm float-right"
            @click="createLevel"
          >
            Enroll
          </button>
        </b-col>
      </b-row>
    </b-container>
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
