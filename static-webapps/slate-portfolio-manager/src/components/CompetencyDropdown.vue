<template>
  <div>
    <div>
      Competency Area
      <select v-model="area">
        <option
          v-for="option in contentAreaStore.get('summary=true')"
          :key="option.Code"
          :value="option.Code"
        >
          {{ option.Title }}
        </option>
      </select>
    </div>
    <div>
      Students
      <select v-model="students">
        <option
          v-for="option in studentListStore.get()"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';

import useContentArea from '@/store/useContentArea';
import useStudentList from '@/store/useStudentList';

const routeParam = (key) => ({
  get() {
    return this.$route.query[key]
  },
  set(value) {
    const { path, query } = this.$route
    this.$router.replace({
      path,
      query: { ...query, [key]: value },
    })
  }
})

export default {
  computed: {
    ...mapStores(useContentArea, useStudentList),
    area: routeParam('area'),
    students: routeParam('students'),
  },
}
</script>
