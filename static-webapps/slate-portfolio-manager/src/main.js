import { createPinia } from 'pinia';
import { createApp } from 'vue';

import SlateSidebar from '@/components/SlateSidebar.vue';
import App from './App.vue';
import router from './router';
import siteConfig from './siteConfig';
import vuetify from './vuetify';
import './assets/app.scss';

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .use(vuetify)
  .component('SlateSidebar', SlateSidebar)
  .use(siteConfig)
  .mount('#app');
