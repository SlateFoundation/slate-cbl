<template>
  <div class="skill-demos p-3 border-bottom">
    <h4 class="h6 skill-demos__heading">
      {{ code }}
      <span
        v-if="title"
        class="ml-1 text-black-50"
      >{{ title }}</span>
    </h4>

    <ol class="list-unstyled skill-demos__list">
      <skill-demo-card
        v-for="demo in demos"
        :key="demo.id"
        v-bind="demo"
        :level-color="levelColor"
      />

      <p
        v-if="demos.length < 1"
        class="text-black-50 font-italic m-0"
      >
        No demonstrations recorded
      </p>
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
    code: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: '',
    },

    demos: {
      type: Array,
      default: () => [],
    },

    levelColor: {
      type: String,
      default: '999999',
    },
  },
};
</script>

<style lang="scss" scoped>
  .skill-demo + .skill-demo {
    margin-top: .25rem;
  }
</style>
