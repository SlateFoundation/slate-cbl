import Vue from 'vue';
import VueRouter from 'vue-router';

import { useAuth } from '@/store/auth';
import AdvancedPortfolioManager from './views/AdvancedPortfolioManager.vue';

const routes = [
  { path: '/', component: AdvancedPortfolioManager },
];

Vue.use(VueRouter);

export default new VueRouter({ routes });
