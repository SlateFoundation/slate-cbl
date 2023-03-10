/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// Components
import { VDataTableServer, VDataTableFooter } from "vuetify/labs/VDataTable";

export default createVuetify({
  components: {
    VDataTableServer,
    VDataTableFooter,
  },
  theme: {
    // defaultTheme: "dark",
    themes: {
      light: {
        colors: {
          primary: "#1867C0",
          secondary: "#5CBBF6",
        },
      },
    },
  },
});
