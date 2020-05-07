import Vue from 'vue'
import Vuex from 'vuex'
import profile from './modules/profile';
import images from './modules/images';

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  namespaced: true,
  modules: {
    profile,
    images
  },
  mutations: {
    bindNamespace(_, { module, namespace }) {
      Vue.set(module.state, '_namespace', namespace);
    },
  },
  actions: {
    bindNamespaces({ commit }, { _modulesNamespaceMap }) {
      Object.entries(_modulesNamespaceMap).forEach(([namespace, module]) => {
        commit('bindNamespace', { module, namespace });
      });
    }
  }
})
