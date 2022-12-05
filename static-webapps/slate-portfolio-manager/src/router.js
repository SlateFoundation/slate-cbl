import { createRouter, createWebHashHistory} from 'vue-router';

import AdvancedPortfolioManager from './views/AdvancedPortfolioManager.vue';

const routes = [
  { path: '/', component: AdvancedPortfolioManager },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router