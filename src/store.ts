import Vue from "vue";
import Vuex from "vuex";
import bombs from './store/modules/bombs'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    bombs
  }
});