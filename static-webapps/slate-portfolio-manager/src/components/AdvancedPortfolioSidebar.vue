<template>
  <div class="advanced-portfolio-sidebar-contents bg-white">
    <!-- TODO: break all this up -->

    <header class="p-3">
      <b-row class="mb-2">
        <b-col>
          <h1 class="h4 my-1">
            {{ student || 'Select a student' }}
          </h1>
          <h2 class="h6 text-muted m-0">
            {{ skill || 'Select a skill' }}
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

    <div class="bg-light mt-n2 mb-3 px-3 py-2">
      <b-form-checkbox switch>
        Show hidden items
      </b-form-checkbox>
    </div>

    <ol class="list-unstyled">
      <li>
        <level-panel level-color="ff9800" />
        <level-panel level-color="d33976" />
      </li>
    </ol>
  </div>
</template>

<script>
import LevelPanel from './sidebar/LevelPanel.vue';

export default {
  components: {
    LevelPanel,
  },

  props: {
    skill: {
      type: String,
      default: 'Select a skill',
    },

    student: {
      type: String,
      default: 'Select a student',
    },
  },
};
</script>
