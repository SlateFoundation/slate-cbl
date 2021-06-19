import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleUp, faAngleDown,
  faCheckSquare,
  faInfo,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  faSquare as farSquare,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './AdvancedPortfolioManager.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import './assets/app.scss';

library.add(
  faAngleUp, faAngleDown,
  faCheckSquare,
  faInfo,
  faTimes,
  farSquare,
);

Vue.component('FontAwesomeIcon', FontAwesomeIcon);

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
