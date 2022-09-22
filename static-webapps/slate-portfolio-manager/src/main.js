import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckSquare,
  faChevronCircleUp, faChevronCircleDown,
  faInfoCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  faSquare as farSquare,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { PiniaVuePlugin, createPinia } from 'pinia';
import App from './App.vue';

import router from './router';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import './assets/app.scss';

library.add(
  faCheckSquare,
  faChevronCircleUp, faChevronCircleDown,
  faInfoCircle,
  faTimes,
  farSquare,
);

Vue.component('FontAwesomeIcon', FontAwesomeIcon);

Vue.use(BootstrapVue);

window.Vue = Vue;

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

const app = new Vue({
  render: (h) => h(App),
  pinia,
  router,
}).$mount('#app');
