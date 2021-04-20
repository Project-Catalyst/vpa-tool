import Vue from "vue";
import Buefy from "buefy";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import './plugins/axios'
import "./plugins/vue-papa-parse";
import "./plugins/v-tooltip";

import "buefy/dist/buefy.css";
import "./assets/sass/main.scss";

Vue.config.productionTip = false;
Vue.use(Buefy);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
