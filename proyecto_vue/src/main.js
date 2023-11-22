import { createApp } from "vue";

/**Pages */
import App from "./App.vue";

/**end pages */

// Crea la aplicación y úsala con el router y Pinia
const app = createApp(App);

// Monta la aplicación
app.mount("#app");
