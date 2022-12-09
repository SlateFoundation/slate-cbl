import { createRouter, createWebHashHistory } from 'vue-router';

import views from '@/views';

const { AdvancedPortfolioManager } = views;

const routes = [
  { path: '/', component: AdvancedPortfolioManager },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
