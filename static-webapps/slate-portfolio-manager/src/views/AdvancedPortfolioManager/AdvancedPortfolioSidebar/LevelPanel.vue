<template>
  <v-expansion-panels
    v-model="open"
    :class="wrapperClass"
    @drop="drop"
    @dragover.prevent
    @dragenter.prevent
  >
    <v-expansion-panel
      class="rounded-0"
      :elevation="4"
      value="only"
    >
      <v-expansion-panel-title class="bg-cbl-level-50 px-4 py-3">
        <v-row>
          <v-col class="align-center">
            <h3 class="h6 mb-0">
              Year {{ portfolio.Level }}
            </h3>
          </v-col>
          <v-col cols="4">
            <v-progress-linear
              :model-value="100 * portfolio.progress"
              height="16"
              bg-color="#e9ecef"
              class="bg-white rounded"
              color="var(--cbl-level-color)"
              style="box-shadow: 0 -1px 2px rgba(0, 0, 0, .1),
                inset 0 3px 6px rgba(0, 0, 0, .1);"
            />
          </v-col>
        </v-row>
        <template #actions />
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <div class="bg-cbl-level-25 justify-space-around pa-2 d-flex text-center">
          <stat-figure label="Baseline">
            <edit-baseline
              :value="stats.baseline"
              :portfolio="portfolio"
            />
          </stat-figure>
          <stat-figure label="Performance">
            {{ stats.performance }}
          </stat-figure>
          <stat-figure label="Growth">
            {{ stats.growth }}
          </stat-figure>
        </div>

        <skill-demos
          v-for="skillDemo in preppedSkillDemos"
          :key="skillDemo.SkillID"
          :demonstrations="demonstrations"
          v-bind="skillDemo"
          :show-hidden-items="showHiddenItems"
          :level="portfolio.Level"
          :enrolled-levels="enrolledLevels"
          @refetch="refetch"
        />
        <div
          v-if="canDelete"
          class="pa-3 text-center bg-cbl-level-10 level-panel__delete"
        >
          <v-btn
            color="error"
            size="small"
            @click="startDelete"
          >
            Delete Porfolio
          </v-btn>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mapStores } from 'pinia';

import emitter from '@/store/emitter';
import useStudentCompetency from '@/store/useStudentCompetency';
import useUi from '@/store/useUi';
import EditBaseline from './EditBaseline.vue';
import StatFigure from './StatFigure.vue';
import SkillDemos from './SkillDemos.vue';

export default {
  components: {
    EditBaseline,
    SkillDemos,
    StatFigure,
  },

  props: {
    enrolledLevels: {
      type: Array,
      default: () => [],
    },
    showHiddenItems: {
      type: Boolean,
      default: () => false,
    },
    portfolio: {
      type: Object,
      default: () => null,
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

  data() {
    return { open: 'only', editing_baseline: false };
  },

  computed: {
    ...mapStores(useStudentCompetency, useUi),

    wrapperClass() {
      const { Level } = this.portfolio;
      const { dragging } = this.uiStore;
      const isDroppable = dragging && dragging.type === 'move-skill-demo';
      return [
        `level-panel mb-2 cbl-level-${Level}`,
        isDroppable && [
          '-drop-zone',
          dragging.Level === Level ? '-drag-source' : '-drag-target',
        ],
      ];
    },

    stats() {
      const { BaselineRating, demonstrationsAverage, growth } = this.portfolio;
      const format = (value) => {
        if (Number.isNaN(value) || value === undefined || value === null) {
          return '—';
        }
        return value.toFixed(1);
      };
      return {
        baseline: format(BaselineRating),
        growth: format(growth),
        performance: format(demonstrationsAverage),
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

    canDelete() {
      const nextLevel = this.enrolledLevels.find((level) => level > this.portfolio.Level);
      return this.preppedSkillDemos.length === 0 && !nextLevel;
    },
  },

  methods: {
    getBackgroundStyle(alpha) {
      // take alpha as decimal, e.g., .5 for 50%
      // append it to the level color as a hex/255
      return `background-color: #${this.levelColor}${Math.round(alpha * 255).toString(16)}`;
    },
    refetch() {
      const { StudentID, CompetencyID } = this.portfolio;
      emitter.emit('update-store', { StudentID, CompetencyID });
    },
    startDelete() {
      let body = `Are you sure you want to delete Year ${this.portfolio.Level}?`;
      body += ' This cannot be undone.';
      const action = () => this.studentCompetencyStore
        .delete(this.portfolio.ID)
        .then(this.refetch)
        .catch((e) => {
          this.refetch();
          throw e;
        });
      this.uiStore.confirm(body, action);
    },
    drop() {
      const { type, action } = this.uiStore.$state.dragging || {};
      if (type === 'move-skill-demo') {
        action(this.portfolio.Level);
      }
    },
  },
};
</script>

<style scoped>
::v-deep .v-expansion-panel-text__wrapper {
  padding: 0;
}

::v-deep .v-expansion-panel-title {
    min-height: 0;
}

::v-deep .v-expansion-panel--active > .v-expansion-panel-title {
    min-height: 0;
}

.stat-figures {
  display: flex;
  justify-content: center;
}

.level-panel {
  --v-theme-overlay-multiplier: 0;
}
</style>
