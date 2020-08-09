import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    flags: 0,
    bombsAmount: 10,
    timeElapsed: 0
  },
  mutations: {
    updateFlags(state, payload) {
      state.flags = payload;
    },
    updateBombs(state, payload) {
      state.bombsAmount = payload;
    },
    updateTime(state, payload) {
      state.timeElapsed = payload;
    }
  },
  actions: {
    updateFlags(context, payload) {
      context.commit("updateFlags", payload);
    },
    updateBombs(context, payload) {
      context.commit("updateBombs", payload);
    },
    updateTime(context, payload) {
      context.commit("updateTime", payload);
    }
  }
});
