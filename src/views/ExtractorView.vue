<template>
  <div class="extractor">
    <div>
      <!-- TODO add vuetify buttons -->
      <button color="primary" @click="openDir()">Open Repository</button>
      <br />
      <div>Current path:</div>
      <div>{{ repoPath }}</div>
      <br />
      <button color="primary" @click="loadFilters()">Load Filters</button>
      <button color="primary" @click="resetFiltersButton()">Reset</button>
      <br />
      <div>Current filters:</div>
      <ul>
        <li v-for="filter in filters" v-bind:key="filter.id">
          {{ filter.name }}
        </li>
      </ul>
      <button color="primary" @click="startVisualisation()">
        Start Visualisation
      </button>
      <br />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
const { dialog } = require("@electron/remote");
const ce = window.ce;

export default {
  data() {
    return {
      repoPath: null,
      filters: [],
      graph: null,
    };
  },
  name: "ExtractorView",
  components: {},
  methods: {
    // store
    ...mapActions([
      "setNodes",
      "setEdges",
      "setGraph",
      "addNodeFilter",
      "addEdgeFilter",
      "addFilter",
      "resetFilters",
    ]),

    // functions
    async openDir() {
      let repoPath = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      if (!repoPath.canceled && repoPath.filePaths[0]) {
        this.repoPath = repoPath.filePaths[0];
      }
      console.log("repo:");
      console.log(this.repoPath);
    },
    // TODO always load all available filters
    async loadFilters() {
      let arr = await dialog.showOpenDialog({
        properties: ["openFile", "multiSelections"],
      });
      if (!arr.canceled && arr.filePaths[0]) {
        for (const el of arr.filePaths) {
          let filter = ce.loadNodeFilter(el);
          // this.filters.push(filter);
          this.addNodeFilter(filter);
        }
      }
      console.log(this.getFilters);
    },
    resetFiltersButton() {
      this.resetFilters();
      this.filters = [];
    },
    startVisualisation() {
      if (this.repoPath) {
        console.log(`The Path of the repository is: ${this.repoPath}`);

        // let graph = ce.getGraph(this.repoPath)
        // console.log(graph)
        let graph;

        // ;(async () => {
        (async () => {
          // let graph = {}
          graph = await ce.getGraph(this.repoPath);
          console.log("creating nodes");
          console.log(this.filters);
          let nodeFilters = await this.filters.filter((e) => e.spec === "node");
          console.log(nodeFilters);
          // TODO fix filters
          nodeFilters.map((e) => {
            console.log(e);
            console.log(JSON.parse(JSON.stringify(e)));
            this.addNodeFilter(e);
          });
          let edgeFilters = await this.filters.filter((e) => e.spec === "edge");
          console.log(edgeFilters);
          edgeFilters.map((e) => this.addEdgeFilter(e));

          console.warn(this.$store.state.nodeFilters);
          console.warn(this.getFilters);

          // TODO WORK WITH PROMISES
          if (nodeFilters.length > 0) {
            for await (const res of nodeFilters.map((e) =>
              ce.filterNode(graph, e)
            )) {
              console.log("---------");
              console.log("nodeFilter");
              console.log(res);
              console.log("---------");
            }
          }
          if (edgeFilters.length > 0) {
            for await (const res of edgeFilters.map((e) =>
              ce.filterEdge(graph, e)
            )) {
              console.log("---------");
              console.log("edgeFilter");
              console.log(res);
              console.log("---------");
            }
          }
          await this.setGraph(graph);
        })();

        // TODO delete this
        return new Promise(() => {
          setTimeout(() => {
            this.$router.push({ path: "extractor/network/" });
          }, 2000);
        });
      } else {
        dialog.showMessageBox({
          title: "No valid entry",
          message: "You have to have at least a repo.",
        });
      }
    },
  },
  computed: {
    // store
    ...mapGetters([
      "getNodes",
      "getEdges",
      "getGraph",
      "getNodeFilters",
      "getEdgeFilters",
      "getFilters",
    ]),
  },
};
</script>
