<template>
  <div class="skill-demos pa-4 border-bottom bg-cbl-level-10">
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
        v-if="skillDemos.length === 0"
        class="text-black-50 font-italic m-0"
      >
        No demonstrations recorded
      </li>
      <skill-demo-card
        v-for="demo in skillDemos"
        :key="demo.skillDemo.id"
        :skill-demo="demo.skillDemo"
        :demonstration="demo.demonstration"
        :effective="demo.effective"
        :show-hidden-items="showHiddenItems"
        :level="level"
        :enrolled-levels="enrolledLevels"
        @refetch="$emit('refetch')"
      />
    </ol>
  </div>
</template>

<script>
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
    enrolledLevels: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    skillDemos() {
      const out = [];
      const process = (skillDemo, effective) => {
        if (!effective && !this.showHiddenItems) {
          return;
        }
        const { DemonstrationID } = skillDemo;
        const demonstration = this.demonstrations.find((d) => d.ID === DemonstrationID);
        if (!demonstration) {
          return;
        }
        out.push({ skillDemo, demonstration, effective });
      };
      this.effectiveDemonstrationsData.forEach((demo) => process(demo, true));
      this.ineffectiveDemonstrationsData.forEach((demo) => process(demo, false));
      return out;
    },
  },
};
</script>
