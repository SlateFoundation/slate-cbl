<template>
  <div
    class="level-panel mb-2"
    :style="getBackgroundStyle(.1)"
  >
    <b-container
      v-b-toggle="collapseId"
      :style="getBackgroundStyle(.15)"
    >
      <b-row
        class="py-2 align-items-center"
        :style="getBackgroundStyle(.25)"
      >
        <b-col>
          <button
            v-b-toggle.collapse-1
            class="btn-unstyled d-flex"
          >
            <h3 class="h6 m-0">
              Year 2
            </h3>
          </button>
        </b-col>
        <b-col cols="4">
          <skill-progress
            :value=".6"
            :color="levelColor"
          />
        </b-col>
      </b-row>
    </b-container>

    <b-collapse
      :id="collapseId"
      visible
    >
      <b-container :style="getBackgroundStyle(.15)">
        <b-row class="text-center py-2">
          <b-col>
            <stat-figure label="Baseline">
              9
            </stat-figure>
          </b-col>
          <b-col>
            <stat-figure label="Performance">
              7.2
            </stat-figure>
          </b-col>
          <b-col>
            <stat-figure label="Growth">
              -1.8
            </stat-figure>
          </b-col>
        </b-row>
      </b-container>

      <skill-demos
        code="ELA 2.3"
        title="Prepare the medium"
        :level-color="levelColor"
        :demos="[
          {
            id: '0',
            rating: '9',
            taskTitle: 'Lorem ipsum dolor sit amet',
            date: '2022-04-29T00:00:00.000Z',
          },
          {
            id: '1',
            rating: 'M',
            taskTitle: 'Data analysis task',
            date: '2022-04-30T00:00:00.000Z',
          },
          {
            id: '2',
            rating: '7',
            taskTitle: 'Some other task',
            date: '2022-05-15T00:00:00.000Z',
          },
        ]"
      />

      <skill-demos
        code="ELA 2.4"
        title="Finalize, practice, and/or prepare with a longer name"
        :level-color="levelColor"
        :demos="[
          {
            id: '3',
            rating: '9',
            taskTitle: 'Example task has an overflowing name probably',
            date: '2022-11-12T00:00:00.000Z',
          },
          {
            id: '4',
            rating: '8',
            taskTitle: 'Mathematical modeling',
            date: '2022-12-03T00:00:00.000Z',
          },
        ]"
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
    levelColor: {
      type: String,
      default: '999999',
    },
  },

  computed: {
    // TODO: use a better ID
    collapseId() {
      return `level-${this.levelColor}-collapse`;
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
