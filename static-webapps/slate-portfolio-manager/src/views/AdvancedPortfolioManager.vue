<template>
  <div
    v-if="authStore.user"
    id="app"
  >
    <b-container
      fluid
      class="p-0"
    >
      <main>
        <competency-dropdown />
        <enrollments-grid
          :selected="selected"
          @select="handleSelect"
        />
      </main>
      <b-sidebar
        id="sidebar"
        v-model="visible"
        no-header
        right
        shadow
        width="375px"
      >
        <template #default="{ hide }">
          <advanced-portfolio-sidebar
            :selected="selected"
            @hide="hide"
          />
        </template>
      </b-sidebar>
    </b-container>
  </div>
</template>

<script>
import { isEqual } from 'lodash';
import { mapStores } from 'pinia';

import AdvancedPortfolioSidebar from '@/components/AdvancedPortfolioSidebar.vue';
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
    visible: {
      get() {
        return !!this.selected;
      },
      set(value) {
        if (!value) {
          this.configStore.set('enrollmentGridSelection', null);
        }
      },
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
