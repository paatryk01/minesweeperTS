import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

  state: {
    flags: 0
  },
  mutations: {
    updateFlags(state, payload) {
      state.flags = payload;
    }
  },
  actions: {
    updateFlags(context, payload) {
      context.commit('updateFlags', payload)
    }
  }

})