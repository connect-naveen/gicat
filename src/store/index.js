import { createStore } from "vuex";

export default createStore({
  state: {
    nodes: [],
    edges: [],
  },
  getters: {
    getNodes: (state) => {
      return state.nodes;
    },
    getEdges: (state) => {
      return state.edges;
    },
    getGraph: (getters) => {
      return {
        nodes: getters.getNodes,
        edges: getters.getEdges,
      };
    },
  },
  mutations: {
    mutateNodes(state, payload) {
      state.nodes = payload.nodes;
    },
    mutateEdges(state, payload) {
      state.edges = payload.edges;
    },
  },
  actions: {
    setNodes({ commit }, payload) {
      commit("mutateNodes", payload);
    },
    setEdges({ commit }, payload) {
      commit("mutateEdges", payload);
    },
    setGraph({ commit }, payload) {
      commit("mutateNodes", payload);
      commit("mutateEdges", payload);
    },
  },
  modules: {},
});
