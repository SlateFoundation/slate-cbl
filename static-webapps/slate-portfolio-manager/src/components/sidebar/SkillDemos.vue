<template>
  <div class="skill-demos p-3 border-bottom bg-cbl-level-10">
    <h4 class="h6 skill-demos__heading">
      {{ skill.Code }}
      <span class="ml-1 text-black-50">
        {{ skill.Descriptor }}
      </span>
    </h4>

    <ol
      class="list-unstyled d-flex flex-column"
      style="gap: 0.25rem;"
    >
      <li
        v-if="skillDemos.length == 0"
        class="text-black-50 font-italic m-0"
      >
        No demonstrations recorded
      </li>
      <skill-demo-card
        v-for="demo in skillDemos"
        :key="demo.id"
        :demo="demo"
        :class="demo.class"
        :show-hidden-items="showHiddenItems"
        :level="level"
        :visible-levels="visibleLevels"
        @refetch="$emit('refetch')"
      />
    </ol>
  </div>
</template>

<script>
import { format } from 'date-fns';

import SkillDemoCard from './SkillDemoCard.vue';

export default {
  components: {
    SkillDemoCard,
  },

  props: {
    showHiddenItems: {
      type: Boolean,
      default: () => false,
    },
    skill: {
      type: Object,
      default: () => ({}),
    },
    level: {
      type: Number,
      default: () => 0,
    },
    effectiveDemonstrationsData: {
      type: Array,
      default: () => [],
    },
    ineffectiveDemonstrationsData: {
      type: Array,
      default: () => [],
    },
    demonstrations: {
      type: Array,
      default: () => [],
    },
    visibleLevels: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    skillDemos() {
      const out = [];
      const process = (demo, effective) => {
        if (!effective && !this.showHiddenItems) {
          return;
        }
        const {
          DemonstratedLevel, ID, DemonstrationID, DemonstrationDate, Override,
        } = demo;
        const demonstration = this.demonstrations.find((d) => d.ID === DemonstrationID);
        const { Comments } = demonstration;
        let { Context } = demonstration;
        if (demonstration.StudentTask) {
          Context = demonstration.StudentTask.Task.Title;
        }
        out.push({
          ID,
          DemonstratedLevel,
          Context,
          Comments,
          date: format(new Date(DemonstrationDate), 'MMM d'),
          effective,
          Override,
          class: ['demonstration-skill', effective ? '-effective' : '-ineffective'],
        });
      };
      this.effectiveDemonstrationsData.forEach((demo) => process(demo, true));
      this.ineffectiveDemonstrationsData.forEach((demo) => process(demo, false));
      return out;
    },
  },
};
</script>
