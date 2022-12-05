import { createApp } from 'vue'

import { createPinia } from 'pinia';
import App from './App.vue';

import router from './router';

import './assets/app.scss';

const pinia = createPinia()
createApp(App)
  .use(router)
  .use(pinia)
  .use({
    install(app) {
      app.config.globalProperties.$site = {
        // per-site configuration
        // TODO get this from back end
        minLevel: 9,
        maxLevel: 12,
      };
    }
  })
  .mount('#app')
