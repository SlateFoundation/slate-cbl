import Vue from 'vue';
import VueRouter from 'vue-router';

import AdvancedPortfolioManager from './AdvancedPortfolioManager.vue';

const routes = [
  { path: '/', component: AdvancedPortfolioManager },
];

Vue.use(VueRouter);

export default new VueRouter({ routes });
