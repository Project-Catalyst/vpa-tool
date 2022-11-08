import {createRouter} from 'vue-router';
import Home from '../pages/Home.vue';
import Profile from '../pages/Profile.vue';
import Login from '../pages/Login.vue'
import Search from '../pages/Search.vue';
import Store from '../pages/Store.vue';
import Assessment from '../pages/Assessment.vue';

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
    path: "/login",
    name: "login",
    component: Login,
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
  {
    path: "/assessments/:id",
    name: "assessment",
    component: Assessment,
  }
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
]

export default function (history) {
  // ADD SCROLL BEHAVIOUR >> SEE AT MASTER CODE
  return createRouter({
    history,
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else if ( document.getElementById(`ass-${from.params.id}`) ) {
        return {
          el: `#ass-${from.params.id-1}`,
        }
      } else {
        return { top: 0 }
      }
    }
  })
}