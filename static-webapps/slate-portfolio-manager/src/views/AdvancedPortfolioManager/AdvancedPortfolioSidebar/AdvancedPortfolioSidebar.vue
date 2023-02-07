<template>
  <div
    :class="[
      'advanced-portfolio-sidebar-contents',
      'pb-12',
    ]"
  >
    <template v-if="isLoading">
      <v-overlay
        scrim="white"
        contained
        :model-value="isLoading"
        class="align-center justify-center"
      >
        <v-sheet
          rounded="lg"
          :elevation="4"
          class="text-center pa-6"
        >
          <p class="mb-3">
            Loading competency&hellip;
          </p>

          <v-progress-circular indeterminate />
        </v-sheet>
      </v-overlay>
    </template>

    <template v-if="studentCompetencyDetails">
      <header class="px-4 py-3">
        <div class="d-flex align-start">
          <div class="flex-grow-1">
            <h1 class="h4 my-1">
              {{ studentName }}
            </h1>
            <h2 class="h6 text-muted m-0">
              <b>{{ studentCompetencyDetails.Competency.Code }}:</b>
              {{ studentCompetencyDetails.Competency.Descriptor }}
            </h2>
          </div>

          <v-btn
            variant="plain"
            class="mr-n3"
            size="small"
            icon
            @click="$emit('hide')"
          >
            <v-icon icon="fa:fa fa-times" />
          </v-btn>
        </div>
      </header>

      <template v-if="hasHiddenItems">
        <v-checkbox
          v-model="showHiddenItems"
          label="Show hidden items"
          hide-details="auto"
          class="pl-2"
        />
      </template>

      <ol class="list-unstyled">
        <li
          v-for="Level in availableLevels"
          :key="Level"
        >
          <new-level-panel
            :Level="Level"
            :StudentID="studentCompetencyDetails.Student.ID"
            :CompetencyID="studentCompetencyDetails.Competency.ID"
          />
        </li>
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
    </template>
    <template v-else>
      <div
        v-if="!isLoading"
        class="text-center pa-6"
      >
        No competency selected
      </div>
    </template>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { range } from 'lodash';

import Student from '@/models/Student';
import emitter from '@/store/emitter';
import useCompetency from '@/store/useCompetency';
import useDemonstrationSkill from '@/store/useDemonstrationSkill';
import useStudentCompetency from '@/store/useStudentCompetency';
import useDemonstration from '@/store/useDemonstration';
import LevelPanel from './LevelPanel.vue';
import NewLevelPanel from './NewLevelPanel.vue';

export default {
  name: 'AdvancedPortfolioSidebar',
  components: {
    NewLevelPanel,
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

    availableLevels() {
      const maxLevel = Math.max(this.$site.minLevel - 1, ...this.visibleLevels);
      return range(maxLevel + 1, this.$site.maxLevel + 1).reverse();
    },

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
