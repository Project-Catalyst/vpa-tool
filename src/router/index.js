import Vue from "vue";
import VueRouter from "vue-router";

import store from "@/store";

import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import CFilter from "../views/CFilter.vue";
import Stats from "../views/Stats.vue";
import Conditions from "../views/Conditions.vue";
import Assessment from "../views/Assessment.vue";

Vue.use(VueRouter);

const guard = (to, from, next) => {
  if (!store.state.profile.localDb) {
    next('/profile')
  }
  next();
}

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
    beforeEnter: guard,
  },
  {
    path: "/assessments/:id",
    name: "assessment",
    component: Assessment,
    beforeEnter: guard,
  }
];

const router = new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes,
});

export default router;
