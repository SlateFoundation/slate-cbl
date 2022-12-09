<template>
  <div v-if="authStore.user" id="app">
    <main>
      <competency-dropdown />
      <enrollments-grid
        :selected="selected"
        @select="handleSelect"
        />
    </main>
    <advanced-portfolio-sidebar
      :selected="selected"
      @hide="visible=null"
      />
  </div>
</template>

<script>
import { isEqual } from 'lodash';
import { mapStores } from 'pinia';

import AdvancedPortfolioSidebar from './AdvancedPortfolioSidebar';
import CompetencyDropdown from '@/components/CompetencyDropdown.vue';
import EnrollmentsGrid from '@/components/EnrollmentsGrid.vue';
import useConfig from '@/store/useConfig';
import useAuth from '@/store/useAuth';

export default {
  name: 'AdvancedPortfolioManager',
  components: {
    AdvancedPortfolioSidebar,
    CompetencyDropdown,
    EnrollmentsGrid,
  },

  computed: {
    ...mapStores(useAuth, useConfig),
    selected() {
      return this.configStore.$state.enrollmentGridSelection;
    },
  },

  async mounted() {
    await this.authStore.required();
  },

  methods: {
    handleSelect(target) {
      if (isEqual(target, this.selected)) {
        // user clicked same student
        this.configStore.set('enrollmentGridSelection', null);
      } else {
        this.configStore.set('enrollmentGridSelection', target);
      }
    },
  },
};
</script>
