<template>
  <div
    v-if="studentCompetencyDetails"
    :class="['advanced-portfolio-sidebar-contents bg-white', { 'block-loading': isLoading }]"
  >
    <!-- TODO: break all this up -->

    <header class="p-3">
      <b-row class="mb-2">
        <b-col>
          <h1 class="h4 my-1">
            {{ studentName }}
          </h1>
          <h2 class="h6 text-muted m-0">
            <b>{{ studentCompetencyDetails.Competency.Code }}:</b>
            {{ studentCompetencyDetails.Competency.Descriptor }}
          </h2>
        </b-col>
        <b-col sm="auto">
          <b-button
            class="mx-n2"
            variant="link"
            pill
            @click="$emit('hide')"
          >
            <font-awesome-icon
              icon="times"
              class="text-muted"
            />
          </b-button>
        </b-col>
      </b-row>
    </header>

    <div
      v-if="hasHiddenItems"
      class="bg-light mt-n2 mb-3 px-3 py-2"
    >
      <b-form-checkbox
        v-model="showHiddenItems"
        switch
      >
        Show hidden items
      </b-form-checkbox>
    </div>

    <ol class="list-unstyled">
      <li
        v-for="portfolio in studentCompetencyDetails.data"
        :key="portfolio.ID"
      >
        <level-panel
          :portfolio="portfolio"
          :demonstrations="demonstrations"
          :skills-by-i-d="skillsByID"
          :show-hidden-items="showHiddenItems"
          :visible-levels="visibleLevels"
        />
      </li>
    </ol>
  </div>
</template>

<script>
import { mapStores } from 'pinia';

import Student from '@/models/Student';
import emitter from '@/store/emitter';
import useCompetency from '@/store/useCompetency';
import useDemonstrationSkill from '@/store/useDemonstrationSkill';
import useStudentCompetency from '@/store/useStudentCompetency';
import useDemonstration from '@/store/useDemonstration';
import LevelPanel from './sidebar/LevelPanel.vue';

export default {
  components: {
    LevelPanel,
  },

  props: {
    selected: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return { showHiddenItems: true };
  },

  computed: {
    ...mapStores(useCompetency, useDemonstration, useStudentCompetency, useDemonstrationSkill),

    visibleLevels() {
      const details = this.studentCompetencyDetails;
      return details ? details.data.map((portfolio) => portfolio.Level) : [];
    },

    competencies() {
      const competencyArea = this.$route.query.area;
      const response = this.competencyStore.get(`?limit=0&content_area=${competencyArea}`);
      return response && response.data;
    },

    studentName() {
      return Student.getDisplayName(this.studentCompetencyDetails.Student);
    },

    hasHiddenItems() {
      // check if any portfolios have "ineffective demonstrations"
      return !!this.studentCompetencyDetails.data.find(
        (portfolio) => Object.keys(portfolio.ineffectiveDemonstrationsData).length > 0,
      );
    },

    isLoading() {
      return this.studentCompetencyStore.isLoading()
        || this.demonstrationStore.isLoading()
        || this.demonstrationSkillStore.isLoading();
    },

    studentCompetencyDetailsUrl() {
      const { student, competency } = this.selected || {};
      if (!(student && competency)) {
        return null;
      }
      return '?limit=0'
        + `&student=${student}`
        + `&competency=${competency}`
        + '&include[]=demonstrationsAverage'
        + '&include[]=growth'
        + '&include[]=progress'
        + '&include[]=Skills'
        + '&include[]=effectiveDemonstrationsData'
        + '&include[]=ineffectiveDemonstrationsData';
    },

    studentCompetencyDetails() {
      const url = this.studentCompetencyDetailsUrl;
      return url && this.studentCompetencyStore.get(url);
    },

    skillsByID() {
      const out = {};
      const { Skills } = this.studentCompetencyDetails.Competency;
      Skills.forEach((s) => { out[s.ID] = s; });
      return out;
    },

    demonstrations() {
      const { studentCompetencyDetails } = this;
      if (!studentCompetencyDetails) {
        return null;
      }
      const demonstrationIds = new Set();

      studentCompetencyDetails.data.forEach((studentCompetency) => {
        Object.values(studentCompetency.effectiveDemonstrationsData)
          .forEach((skillDemonstrations) => {
            skillDemonstrations.forEach((demonstrationData) => {
              demonstrationIds.add(demonstrationData.DemonstrationID);
            });
          });
        Object.values(studentCompetency.ineffectiveDemonstrationsData)
          .forEach((skillDemonstrations) => {
            skillDemonstrations.forEach((demonstrationData) => {
              demonstrationIds.add(demonstrationData.DemonstrationID);
            });
          });
      });
      const response = this.demonstrationStore.get(
        `?q=id:${Array.from(demonstrationIds.values()).sort().join(',')}`
          + '&include[]=Creator'
          + '&include[]=StudentTask.Task',
      );
      return response && response.data;
    },
  },

  mounted() {
    emitter.on('update-store', this.updateStore);
  },

  unmounted() {
    emitter.off('update-store', this.updateStore);
  },

  methods: {
    updateStore(options) {
      const { studentID, competencyID } = options;
      if (studentID === this.selected.student.ID || competencyID === this.selected.competency.ID) {
        this.studentCompetencyStore.refetch(this.studentCompetencyDetailsUrl);
      }
    },
  },
};
</script>
