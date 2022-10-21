import {createRouter} from 'vue-router';
import Home from '../pages/Home.vue';
import Profile from '../pages/Profile.vue';
import Search from '../pages/Search.vue';
import Store from '../pages/Store.vue';

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
    path: "/assessments",
    name: "search",
    component: Search,
    // beforeEnter: guard,
  },
  {
    path: "/store",
    name: "store",
    component: Store,
  },
  //==== FROM ORIGINAL PROJECT
  // {
  //   path: "/filter",
  //   name: "filter",
  //   component: CFilter,
  // },
  // {
  //   path: "/stats",
  //   name: "stats",
  //   component: Stats,
  // },
  // {
  //   path: "/assessments/:id",
  //   name: "assessment",
  //   component: Assessment,
  //   beforeEnter: guard,
  // }
]

export default function (history) {
  // ADD SCROLL BEHAVIOUR >> SEE AT MASTER CODE
  return createRouter({
    history,
    routes
  })
}