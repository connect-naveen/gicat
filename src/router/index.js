import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import ExtractorView from "../views/ExtractorView.vue";
import FilterView from "../views/FilterView.vue";
import NetworkView from "../views/NetworkView.vue";
import GuideView from "../views/GuideView.vue";
import LicenseView from "../views/LicenseView.vue";

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
    component: AboutView,
  },
  {
    path: "/extractor",
    name: "extractor",
    component: ExtractorView,
    // TODO add network and extractor as subroutes
    // children: [
    //   {
    //     path: "network",
    //     name: "network",
    //     component: NetworkView,
    //   },
    // ],
  },
  {
    path: "/extractor/network",
    name: "network",
    component: NetworkView,
  },
  {
    path: "/filters",
    name: "filters",
    component: FilterView,
  },
  {
    path: "/guide",
    name: "guide",
    component: GuideView,
  },
  {
    path: "/license",
    name: "license",
    component: LicenseView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
