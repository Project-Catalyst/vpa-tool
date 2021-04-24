import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import CFilter from "../views/CFilter.vue";
import Stats from "../views/Stats.vue";
import Conditions from "../views/Conditions.vue";
import Assessment from "../views/Assessment.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
  },
  {
    path: "/filter",
    name: "filter",
    component: CFilter,
  },
  {
    path: "/stats",
    name: "stats",
    component: Stats,
  },
  {
    path: "/assessments",
    name: "conditions",
    component: Conditions,
  },
  {
    path: "/assessments/:id",
    name: "assessment",
    component: Assessment,
  },
];

const router = new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
