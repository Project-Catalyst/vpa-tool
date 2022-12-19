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
    path: "/assessments/:page",
    name: "search",
    component: Search,
  },
  {
    path: "/store",
    name: "store",
    component: Store,
  },
  {
    path: "/assessment/:id",
    name: "assessment",
    component: Assessment,
  }
]

export default function (history) {
  // ADD SCROLL BEHAVIOUR >> SEE AT MASTER CODE
  return createRouter({
    history,
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } 
      // else if ( document.getElementById(`ass-${from.params.id}`) ) {
      //   return {
      //     el: `#ass-${from.params.id}`,
      //   }
      // } else {
      //   return { top: 0 }
      // }
    }
  })
}