<template>
  <div
    :class="wrapperClass"
    draggable="true"
    @drag="drag"
  >
    <div class="skill-demo__rating py-1 bg-cbl-level">
      <v-icon
        v-if="demo.Override"
        icon="fa:fa fa-check"
        size="x-small"
      />
      <span v-else>{{ demo.DemonstratedLevel === 0 ? "M" : demo.DemonstratedLevel }}</span>
    </div>
    <div class="skill-demo__title">
      {{ title }}
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

        <v-btn
          variant="plain"
          class="btn-unstyled"
        >
          <v-icon
            icon="`fa:fa fa-info-circle"
            :class="`text-cbl-level cbl-level-${level}`"
          />
        </v-btn>
      </div>
    </div>
    <div class="skill-demo__date text-black-50 mr-2">
      {{ demo.date }}
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import useDemonstrationSkill from '@/store/useDemonstrationSkill';
import useUi from '@/store/useUi';

export default {
  props: {
    visibleLevels: {
      type: Array,
      default: () => [],
    },
    demo: {
      type: Object,
      default: () => ({}),
    },
    level: {
      type: Number,
      default: () => 0,
    },
  },

  computed: {
    ...mapStores(useDemonstrationSkill, useUi),
    targetLevels() {
      const visibleLevels = this.visibleLevels.slice();
      const higherLevels = visibleLevels.filter((l) => l > this.level);
      const lowerLevels = visibleLevels.filter((l) => l < this.level);
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
      const { Context, Override } = this.demo;
      return Override ? '[Overridden]' : Context;
    },
    wrapperClass() {
      return [
        'align-items-baseline bg-white d-flex rounded shadow-sm skill-demo',
        this.demo.DemonstratedLevel === 0 && 'cbl-level-missing',
      ];
    },
  },

  methods: {
    setTargetLevel(TargetLevel) {
      if (TargetLevel === this.level) {
        // skill demo-card was dropped on current portfolio level
        return;
      }
      const { ID } = this.demo;
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
      const { ID } = this.demo;
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

    &__controls {
      display: none;
      flex: 1 1 0;
      gap: .5rem;
      position: absolute;
      inset: 0;
      background: white;
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
      .skill-demo__controls {
        display: flex;
      }
    }
  }
</style>
