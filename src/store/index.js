import { createStore } from "vuex";

export default createStore({
  state: {
    // general program
    repoPath: "",
    editorPath: "",
    isVsCode: false,
    // graph
    nodes: [],
    edges: [],
    // filters
    nodeFilters: [],
    edgeFilters: [],
  },
  getters: {
    // general program
    getRepoPath: (state) => {
      return state.repoPath;
    },
    getEditorPath: (state) => {
      return state.editorPath;
    },
    getIsVsCode: (state) => {
      return state.isVsCode;
    },
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
      return state.nodeFilters || [];
    },
    getEdgeFilters: (state) => {
      return state.edgeFilters || [];
    },
    getFilters: (state) => {
      return [].concat(state.nodeFilters).concat(state.edgeFilters);
    },
  },
  mutations: {
    // general program
    mutateSetRepoPath(state, payload) {
      state.repoPath = payload;
    },
    mutateSetEditorPath(state, payload) {
      state.editorPath = payload;
    },
    mutateSetIsVsCode(state, payload) {
      state.isVsCode = payload;
    },
    // graph
    mutateNodes(state, payload) {
      state.nodes = payload.nodes;
    },
    mutateEdges(state, payload) {
      state.edges = payload.edges;
    },
    // filters
    mutateAddNodeFilter(state, payload) {
      state.nodeFilters.push(payload);
    },
    mutateAddEdgeFilter(state, payload) {
      state.edgeFilters.push(payload);
    },
    mutateResetFilters(state) {
      state.nodeFilters = [];
      state.edgeFilters = [];
    },
  },
  actions: {
    // general program
    setRepoPath({ commit }, payload) {
      commit("mutateSetRepoPath", payload);
    },
    setEditorPath({ commit }, payload) {
      commit("mutateSetEditorPath", payload);
    },
    setIsVsCode({ commit }, payload) {
      commit("mutateSetIsVsCode", payload);
    },
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
    resetFilters({ commit }) {
      commit("mutateResetFilters");
    },
  },
  modules: {},
});
