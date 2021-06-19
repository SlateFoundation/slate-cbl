<template>
  <div id="app">
    <b-container fluid>
      <div class="p-5">
        <h1>Table/selector here</h1>
        <b-button
          ref="sidebarToggle"
          v-b-toggle.sidebar
        >
          Toggle Sidebar
        </b-button>
      </div>
      <b-sidebar
        id="sidebar"
        no-header
        right
        shadow
        width="375px"
      >
        <template #default="{ hide }">
          <advanced-portfolio-sidebar @hide="hide" />
        </template>
      </b-sidebar>
    </b-container>
  </div>
</template>

<script>
import AdvancedPortfolioSidebar from './components/AdvancedPortfolioSidebar.vue';

export default {
  name: 'AdvancedPortfolioManager',
  components: {
    AdvancedPortfolioSidebar,
  },
  mounted() {
    setTimeout(() => { this.$refs.sidebarToggle.click(); }, 0);
  },
};
</script>

<style lang="scss" scoped>
  #app {
    background-image:
      linear-gradient(to bottom, #eee, rgba(#eee, .5)),
      url('assets/mockup-enrollments-bg.png');
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 100vh;
  }
</style>
