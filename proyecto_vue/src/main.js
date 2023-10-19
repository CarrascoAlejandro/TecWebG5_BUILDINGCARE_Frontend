import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

/**Pages */
import App from "./App.vue";
import login from "./components/LoginSignUp.vue";
import BlogView from "./components/BlogView.vue";

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
  {
    name: "blog",
    path: "/blog",
    component: BlogView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);

// Monta la aplicación
app.mount("#app");
