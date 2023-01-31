<template>
  <div class="slate-appheader d-flex align-center pa-6">
    <div class="slate-appheader__title">
      Portfolio Manager
    </div>
    <div style="min-width: 300px">
      <v-select
        v-model="area"
        label="Competency Area"
        variant="solo"
        :items="areaOptions"
        hide-details="auto"
      />
    </div>
    <div style="min-width: 300px">
      <v-select
        v-model="students"
        label="Students"
        variant="solo"
        :items="studentOptions"
        hide-details="auto"
      />
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';

import useContentArea from '@/store/useContentArea';
import useStudentList from '@/store/useStudentList';

const routeParam = (key) => ({
  get() {
    return this.$route.query[key];
  },
  set(value) {
    const { path, query } = this.$route;
    this.$router.replace({
      path,
      query: { ...query, [key]: value },
    });
  },
});

export default {
  computed: {
    ...mapStores(useContentArea, useStudentList),
    area: routeParam('area'),
    students: routeParam('students'),
    areaOptions() {
      const response = this.contentAreaStore.get('?summary=true');
      return response && response.data.map(({ Code, Title }) => ({
        value: Code,
        title: Title,
      }));
    },
    studentOptions() {
      const response = this.studentListStore.get();
      return response && response.data.map(({ label, value }) => ({
        title: label,
        value,
      }));
    },
  },
};
</script>
