<template>
  <v-app
    v-if="authStore.user"
    id="app"
  >
    <v-navigation-drawer
      v-model="detailsSidebarIsOpen"
      :elevation="12"
      floating
      location="right"
      width="375"
    >
      <advanced-portfolio-sidebar
        :selected="selected"
        @hide="handleSelect(null)"
      />
    </v-navigation-drawer>

    <v-main
      class="d-flex flex-column flex-grow-1"
    >
      <competency-dropdown />
      <enrollments-grid
        style="flex: 1 1 0"
        :selected="selected"
        @select="handleSelect"
      />
    </v-main>
  </v-app>
</template>

<script>
import { isEqual } from 'lodash';
import { mapStores } from 'pinia';

import CompetencyDropdown from '@/components/CompetencyDropdown.vue';
import EnrollmentsGrid from '@/components/EnrollmentsGrid.vue';
import useConfig from '@/store/useConfig';
import useAuth from '@/store/useAuth';
import AdvancedPortfolioSidebar from './AdvancedPortfolioSidebar';

export default {
  name: 'AdvancedPortfolioManager',
  components: {
    AdvancedPortfolioSidebar,
    CompetencyDropdown,
    EnrollmentsGrid,
  },

  data() {
    return {
      detailsSidebarIsOpen: false,
    };
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
      // use null if user clicked same student
      const newSelection = isEqual(target, this.selected) ? null : target;

      this.configStore.set('enrollmentGridSelection', newSelection);
      this.detailsSidebarIsOpen = Boolean(newSelection);
    },
  },
};
</script>
