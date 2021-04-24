import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./plugins/axios";
import "./plugins/buefy";
import "./plugins/vue-papa-parse";
import "./plugins/v-tooltip";
import "./plugins/async-computed";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
