import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/extractor",
    name: "extractor",
    component: () =>
      import(/* webpackChunkName: "extractor" */ "../views/ExtractorView.vue"),
  },
  {
    path: "/filters",
    name: "filters",
    component: () =>
      import(/* webpackChunkName: "filters" */ "../views/FilterView.vue"),
  },
  {
    path: "/guide",
    name: "guide",
    component: () =>
      import(/* webpackChunkName: "guide" */ "../views/GuideView.vue"),
  },
  {
    path: "/license",
    name: "license",
    component: () =>
      import(/* webpackChunkName: "license" */ "../views/LicenseView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
