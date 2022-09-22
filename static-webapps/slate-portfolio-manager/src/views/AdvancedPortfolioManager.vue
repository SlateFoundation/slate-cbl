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
import useUi from '@/store/useUi';
import useAuth from '@/store/useAuth';

export default {
  name: 'AdvancedPortfolioManager',
  components: {
    AdvancedPortfolioSidebar,
    CompetencyDropdown,
    EnrollmentsGrid,
  },

  computed: {
    ...mapStores(useAuth, useUi),
    selected() {
      return this.uiStore.$state.enrollmentGridSelection;
    },
    visible: {
      get() {
        return !!this.selected;
      },
      set(value) {
        if (!value) {
          this.uiStore.set('enrollmentGridSelection', null);
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
        this.uiStore.set('enrollmentGridSelection', null);
      } else {
        this.uiStore.set('enrollmentGridSelection', target);
      }
    },
  },
};
</script>
