import { createApp } from 'vue'
import { createPinia } from 'pinia';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, fa } from 'vuetify/iconsets/fa4'

import App from './App.vue';
import router from './router';
import './assets/app.scss';

const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    }
  },
})

createApp(App)
  .use(router)
  .use(pinia)
  .use(vuetify)
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
