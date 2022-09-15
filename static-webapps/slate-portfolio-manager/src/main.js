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

import App from './App.vue';

import { PiniaVuePlugin, createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import router from './router';
import './assets/app.scss';

library.add(
  faCheckSquare,
  faChevronCircleUp, faChevronCircleDown,
  faInfoCircle,
  faTimes,
  farSquare,
);

Vue.component('FontAwesomeIcon', FontAwesomeIcon);

Vue.use(PiniaVuePlugin)
Vue.use(BootstrapVue);

window.Vue = Vue;

new Vue({
  render: (h) => h(App),
  router,
  pinia: createPinia(),
}).$mount('#app');
