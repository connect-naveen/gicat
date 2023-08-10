import { createStore } from "vuex";

export default createStore({
  state: {
    // graph
    nodes: [],
    edges: [],
    // filters
    nodeFilters: [],
    edgeFilters: [],
  },
  getters: {
    // graph
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
    // filters
    getNodeFilters: (state) => {
      return state.nodeFilters;
    },
    getEdgeFilters: (state) => {
      return state.edgeFilters;
    },
    getFilters: (getters) => {
      return [...getters.getNodeFilters, ...getters.getEdgeFilters];
    },
  },
  mutations: {
    // graph
    mutateNodes(state, payload) {
      state.nodes = payload.nodes;
    },
    mutateEdges(state, payload) {
      state.edges = payload.edges;
    },
    // filters
    mutateAddNodeFilter(state, payload) {
      state.nodeFilters.push(payload.nodeFilter);
    },
    mutateAddEdgeFilter(state, payload) {
      state.edgeFilters.push(payload.edgeFilter);
    },
  },
  actions: {
    // graph
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
    // filters
    addNodeFilter({ commit }, payload) {
      commit("mutateAddNodeFilter", payload);
    },
    addEdgeFilter({ commit }, payload) {
      commit("mutateAddEdgeFilter", payload);
    },
    addFilter({ commit }, payload) {
      console.log(commit);
      console.log("TODO!!! check what filter type and commit");
      console.log(payload.filter);
    },
  },
  modules: {},
});
