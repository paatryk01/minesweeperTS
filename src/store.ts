import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    flags: 0,
    bombsAmount: 10
  },
  mutations: {
    updateFlags(state, payload) {
      state.flags = payload;
    },
    updateBombs(state, payload) {
      state.bombsAmount = payload;
    }
  },
  actions: {
    updateFlags(context, payload) {
      context.commit("updateFlags", payload);
    },
    updateBombs(context, payload) {
      context.commit("updateBombs", payload);
    }
  }
});
