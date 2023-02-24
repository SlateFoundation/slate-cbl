/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { slateApiPlugin } from "@/plugins/slateapi.js";

const pinia = createPinia();

pinia.use(slateApiPlugin);

// Plugins
import { registerPlugins } from "@/plugins";

const app = createApp(App);

registerPlugins(app);

app.use(pinia);
app.mount("#app");
