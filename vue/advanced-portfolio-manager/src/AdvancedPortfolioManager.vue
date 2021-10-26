<template>
  <div id="app">
    <b-container
      fluid
      class="p-0"
    >
      <main>
        <enrollments-grid @select="handleSelect" />

        <b-button
          ref="sidebarToggle"
          v-b-toggle.sidebar
        >
          Toggle Sidebar ({{ sidebarIsOpen ? 'is open' : 'is not open' }})
        </b-button>

        <img
          class="img-fluid"
          src="./assets/mockup-enrollments-bg.png"
        >
      </main>
      <b-sidebar
        id="sidebar"
        v-model="sidebarIsOpen"
        no-header
        right
        shadow
        width="375px"
      >
        <template #default="{ hide }">
          <advanced-portfolio-sidebar
            :skill="skill"
            :student="student"
            @hide="hide"
          />
        </template>
      </b-sidebar>
    </b-container>
  </div>
</template>

<script>
import AdvancedPortfolioSidebar from './components/AdvancedPortfolioSidebar.vue';
import EnrollmentsGrid from './components/EnrollmentsGrid.vue';

export default {
  name: 'AdvancedPortfolioManager',
  components: {
    AdvancedPortfolioSidebar,
    EnrollmentsGrid,
  },

  data() {
    return {
      sidebarIsOpen: false,
      skill: null,
      student: null,
    };
  },

  mounted() {
    // setTimeout(() => { this.$refs.sidebarToggle.click(); }, 0);
  },

  methods: {
    handleSelect(data) {
      if (data) {
        if (data.student) {
          this.student = data.student;
        }

        if (data.skill) {
          this.skill = data.skill;
        }
      }

      if (Boolean(data) !== this.sidebarIsOpen) {
        // if we have data and sidebar is closed, or vice-versa, then toggle it
        // use the toggle button with directive for accessibility
        // https://bootstrap-vue.org/docs/components/sidebar#visibility-control
        this.$refs.sidebarToggle.click();
      }
    },
  },
};
</script>
