import Vue from "vue";
import App from "./App.vue";
import vSelect from "vue-select";
import Datepicker from "vuejs-datepicker";

Vue.component("v-select", vSelect);

Vue.component("datepicker", Datepicker);

Vue.config.productionTip = true;

new Vue({
  render: h => h(App)
}).$mount("#app");
