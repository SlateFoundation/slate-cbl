<template>
  <div
    v-if="ready"
    :class="`level-panel mb-2 cbl-level-${portfolio.Level}`"
  >
    <b-container
      v-b-toggle="collapseId"
      class="bg-cbl-level-50"
    >
      <b-row
        class="py-2 align-items-center"
      >
        <b-col>
          <button
            v-b-toggle.collapse-1
            class="btn-unstyled d-flex"
          >
            <h3 class="h6 m-0">
              Year {{ portfolio.Level }} <!-- TODO global property? -->
            </h3>
          </button>
        </b-col>
        <b-col cols="4">
          <skill-progress :value="portfolio.progress" />
        </b-col>
      </b-row>
    </b-container>

    <b-collapse
      :id="collapseId"
      visible
    >
      <b-container class="bg-cbl-level-25">
        <b-row class="text-center py-2">
          <b-col>
            <stat-figure label="Baseline">
              {{ stats.baseline }}
            </stat-figure>
          </b-col>
          <b-col>
            <stat-figure label="Performance">
              {{ stats.performance }}
            </stat-figure>
          </b-col>
          <b-col>
            <stat-figure label="Growth">
              {{ stats.growth }}
            </stat-figure>
          </b-col>
        </b-row>
      </b-container>

      <skill-demos
        v-for="skillDemo in preppedSkillDemos"
        :key="skillDemo.SkillID"
        :demonstrations="demonstrations"
        v-bind="skillDemo"
        :show-hidden-items="showHiddenItems"
        :level="portfolio.Level"
        :visible-levels="visibleLevels"
        @refetch="$emit('refetch')"
      />
    </b-collapse>
  </div>
</template>

<script>
import SkillDemos from './SkillDemos.vue';
import SkillProgress from './SkillProgress.vue';
import StatFigure from './StatFigure.vue';

export default {
  components: {
    SkillDemos,
    SkillProgress,
    StatFigure,
  },

  props: {
    visibleLevels: {
      type: Array,
      default: () => [],
    },
    showHiddenItems: {
      type: Boolean,
      default: () => false,
    },
    portfolio: {
      type: Object,
      default: () => ({}),
    },
    demonstrations: {
      type: Array,
      default: () => [],
    },
    skillsByID: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    ready() {
      return this.demonstrations.length !== 0;
    },

    stats() {
      const { BaselineRating, growth } = this.portfolio;
      const format = (value) => {
        if (Number.isNaN(value) || value === undefined || value === null) {
          return '—';
        }
        return value.toFixed(1);
      };
      return {
        baseline: format(BaselineRating),
        growth: format(growth),
        performance: format(BaselineRating + growth),
      };
    },

    collapseId() {
      return `level-${this.portfolio.ID}-collapse`;
    },

    demonstrationsById() {
      const out = {};
      this.demonstrations.forEach((d) => { out[d.ID] = d; });
      return out;
    },

    preppedSkillDemos() {
      const out = {};
      const { effectiveDemonstrationsData, ineffectiveDemonstrationsData } = this.portfolio;
      Object.entries(effectiveDemonstrationsData).forEach(([SkillID, demos]) => {
        out[SkillID] = {
          SkillID,
          skill: this.skillsByID[SkillID],
          effectiveDemonstrationsData: demos,
          ineffectiveDemonstrationsData: [],
        };
      });
      Object.entries(ineffectiveDemonstrationsData).forEach(([SkillID, demos]) => {
        if (!out[SkillID]) {
          out[SkillID] = {
            SkillID,
            skill: this.skillsByID[SkillID],
            effectiveDemonstrationsData: [],
          };
        }
        out[SkillID].ineffectiveDemonstrationsData = demos;
      });
      return Object.values(out);
    },
  },

  methods: {
    getBackgroundStyle(alpha) {
      // take alpha as decimal, e.g., .5 for 50%
      // append it to the level color as a hex/255
      return `background-color: #${this.levelColor}${Math.round(alpha * 255).toString(16)}`;
    },
  },
};
</script>
