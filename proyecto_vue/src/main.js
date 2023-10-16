import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

/**Pages */
import App from "./App.vue";
import login from "./components/LoginSignUp.vue";

/**end pages */

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    name: "login",
    path: "/login",
    component: login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Crea la aplicación y úsala con el router y Pinia
const app = createApp(App);
app.use(router);

// Monta la aplicación
app.mount("#app");
