<template>
  <div
    :class="wrapperClass"
    draggable="true"
    @drag="drag"
  >
    <div class="skill-demo__rating py-1 bg-cbl-level">
      <v-icon
        v-if="skillDemo.Override"
        icon="fa:fa fa-check"
        size="x-small"
      />
      <span v-else>{{ demonstratedLevel }}</span>
    </div>
    <div class="skill-demo__title">
      {{ title }}
      <div class="skill-demo__hover">
        <div
          v-if="targetLevels.length"
          class="skill-demo__controls"
        >
          <v-btn
            v-for="targetLevel in targetLevels"
            :key="targetLevel"
            variant="plain"
            :title="`Move to level ${targetLevel}`"
            class="btn-unstyled"
            @click="setTargetLevel(targetLevel)"
          >
            <v-icon
              :icon="`fa fa-chevron-circle-${targetLevel > level ? 'up' : 'down' }`"
              :class="`cbl-level-${targetLevel} text-cbl-level`"
            />
          </v-btn>

          <div class="skill-demo__grabber" />
        </div>
        <div
          v-else
          class="flex-grow"
        />

        <v-tooltip location="bottom">
          <template #activator="{ props }">
            <v-btn
              variant="plain"
              class="btn-unstyled"
              v-bind="props"
            >
              <v-icon
                icon="`fa:fa fa-info-circle"
                :class="`text-cbl-level cbl-level-${level}`"
              />
            </v-btn>
          </template>
          <div v-if="createdBy">
            Created By: {{ createdBy }}
          </div>
          <div>
            Demonstration ID: {{ demonstration.ID }}
          </div>
          <div>
            DemonstrationSkill ID: {{ skillDemo.ID }}
          </div>
          <div>
            Demonstration Date: {{ fullDate }}
          </div>
          <div>
            Experience Type: {{ demonstration.Context }}
          </div>
          <div>
            Performance Type: {{ demonstration.PerformanceType }}
          </div>
          <div v-if="demonstration.ArtifactURL">
            <!-- <a -->
            <!--   :href="demonstration.ArtifactURL" -->
            <!--   target="_blank" -->
            <!-- >Link</a> -->
            Artifact URL: {{ demonstration.ArtifactURL }}
          </div>
          <template v-else-if="demonstration.StudentTask">
            <div v-if="submittedDate">
              Submitted: {{ submittedDate }}
            </div>
            <div v-if="demonstration.StudentTask.Task.Title">
              Title: {{ demonstration.StudentTask.Task.Title }}
            </div>
          </template>
        </v-tooltip>
      </div>
    </div>
    <div class="skill-demo__date text-black-50 mr-2">
      {{ date }}
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { mapStores } from 'pinia';

import useDemonstrationSkill from '@/store/useDemonstrationSkill';
import useUi from '@/store/useUi';

const shortDate = (value) => {
  if (!value) {
    return '';
  }
  const date = new Date(1000 * value);
  if (date.getFullYear() !== new Date().getFullYear()) {
    return format(date, 'MMM d, yyyy');
  }
  return format(date, 'MMM d');
};

export default {
  props: {
    enrolledLevels: {
      type: Array,
      default: () => [],
    },
    skillDemo: {
      type: Object,
      default: () => ({}),
    },
    demonstration: {
      type: Object,
      default: () => ({}),
    },
    level: {
      type: Number,
      default: () => 0,
    },
    effective: {
      type: Boolean,
      default: () => true,
    },
  },

  computed: {
    ...mapStores(useDemonstrationSkill, useUi),
    demonstratedLevel() {
      const { DemonstratedLevel } = this.skillDemo;
      return DemonstratedLevel === 0 ? 'M' : DemonstratedLevel;
    },
    fullDate() {
      const { Modified, Created } = this.skillDemo;
      if (!Modified && !Created) {
        return '';
      }
      const date = new Date(1000 * (Modified || Created));
      return format(date, 'MMM d, yyyy, h:mm aaa');
    },
    date() {
      const { Modified, Created } = this.skillDemo;
      return shortDate(Modified || Created);
    },
    submittedDate() {
      return shortDate(this.demonstration.StudentTask.Created);
    },
    createdBy() {
      if (!this.demonstration.Created) {
        return null;
      }
      const { FirstName = '', LastName = '' } = this.demonstration.Creator;
      return `${FirstName} ${LastName}`;
    },
    targetLevels() {
      const enrolledLevels = this.enrolledLevels.slice();
      const higherLevels = enrolledLevels.filter((l) => l > this.level);
      const lowerLevels = enrolledLevels.filter((l) => l < this.level);
      const targetLevels = [];
      if (higherLevels.length) {
        targetLevels.push(Math.min(...higherLevels));
      }
      if (lowerLevels.length) {
        targetLevels.push(Math.max(...lowerLevels));
      }
      return targetLevels;
    },
    title() {
      const { Context, Override, StudentTask } = this.demonstration;
      if (Override) {
        return '[Overridden]';
      }
      const taskTitle = StudentTask && StudentTask.Task.Title;
      return taskTitle || Context;
    },
    wrapperClass() {
      return [
        'align-items-baseline bg-white d-flex rounded shadow-sm skill-demo',
        this.skillDemo.DemonstratedLevel === 0 && 'cbl-level-missing',
        'elevation-1',
        this.effective ? '-effective' : '-ineffective',
      ];
    },
  },

  methods: {
    setTargetLevel(TargetLevel) {
      if (TargetLevel === this.level) {
        // skill demo-card was dropped on current portfolio level
        return;
      }
      const { ID } = this.skillDemo;
      const data = [{ ID, TargetLevel }];
      const body = `Are you sure you want to move this to level ${TargetLevel}?`;
      const action = () => {
        this.demonstrationSkillStore.update({ data }).then(
          () => this.$emit('refetch'),
        );
      };
      this.uiStore.confirm(body, action);
    },
    drag() {
      const { ID } = this.skillDemo;
      const { level } = this;
      this.uiStore.startDragging({
        ID,
        Level: level,
        type: 'move-skill-demo',
        action: this.setTargetLevel,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  @use 'sass:math';

  .skill-demo {
    align-items: center;
    gap: .5rem;

    &.-ineffective {
      box-shadow: none !important;

      &:not(:hover) {
        opacity: 0.5;
      }
    }

    &__rating {
      border-bottom-left-radius: .25rem;
      border-top-left-radius: .25rem;
      color: white;
      font-weight: bold;
      text-align: center;
      text-shadow: 0 1px 0 black;
      width: 1.75rem;
    }

    &__title {
      flex: 1 1 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
    }

    &__hover {
      display: none;
      flex: 1 1 0;
      gap: .5rem;
      position: absolute;
      inset: 0;
    }

    .btn-unstyled {
      background: white;
    }

    &__controls {
      display: flex;
      background: white;
      flex-grow: 1;
    }

    &__grabber {
      align-self: center;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle fill="%23ddd" cx="50%" cy="50%" r="30%" shape-rendering="geometricPrecision" /></svg>');
      background-repeat: repeat;
      background-size: auto (math.div(1, 3) * 100%);
      cursor: grab;
      flex: 1 1 0;
      height: 18px;
    }

    &__date {
      font-size: .75em;
    }

    &:hover {
      .skill-demo__hover {
        display: flex;
      }
    }
    .flex-grow {
      flex-grow: 1;
    }
  }
</style>
